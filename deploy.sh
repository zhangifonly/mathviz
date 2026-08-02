#!/usr/bin/env bash
#
# 部署到 math.whaty.org（LAX02 的 /var/www/mathviz）
#
# 用法: ./deploy.sh
#
# 做四件事：构建 → 备份线上 → rsync 同步 → 重载 nginx。
# 备份**只保留最近 3 份**：此前手工部署时每轮建一份，累积到 12 份占了
# 6.3 GB，磁盘从 25G 掉到 19G。轮转逻辑放在脚本里才不会忘。

set -euo pipefail

HOST=us-lax02
REMOTE=/var/www/mathviz
KEEP=3
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> 构建"
cd "$ROOT/client"
npm run build 2>&1 | grep -E "✓ built|error" || {
  echo "构建失败，中止"; exit 1;
}

echo "==> 校验课程完整性"
npm run check-courses 2>&1 | grep -E "✅|❌" | head -5
if npm run check-courses 2>&1 | grep -q "❌"; then
  echo "课程校验未通过，中止部署"
  exit 1
fi

STAMP=$(date +%Y%m%d_%H%M%S)
echo "==> 备份线上到 ${REMOTE}.bak.${STAMP}"
ssh "$HOST" "cp -a ${REMOTE} ${REMOTE}.bak.${STAMP}"

echo "==> 轮转备份（保留最早一份 + 最近 ${KEEP} 份）"
# 时间戳格式保证字典序即时间序。
# ⚠️ 不用 `head -n -N`：BSD/macOS 的 head 不接受负数行数，只有 GNU 支持。
# 改用 awk 按行号区间挑：跳过第 1 行（最早的永久留档），
# 再去掉末尾 KEEP 行（最近的几份）。
ssh "$HOST" "
  ls -1d ${REMOTE}.bak.* 2>/dev/null | sort > /tmp/_baks.txt
  total=\$(wc -l < /tmp/_baks.txt)
  cutoff=\$((total - ${KEEP}))
  if [ \"\$cutoff\" -gt 1 ]; then
    awk -v c=\"\$cutoff\" 'NR>1 && NR<=c' /tmp/_baks.txt | xargs -r rm -rf
  fi
  rm -f /tmp/_baks.txt
  echo '剩余备份:'; ls -1d ${REMOTE}.bak.* | sed 's|^|  |'
"

echo "==> 同步"
rsync -az --delete --partial --timeout=180 dist/ "$HOST:${REMOTE}/"

echo "==> 重载 nginx"
ssh "$HOST" "nginx -t 2>&1 | tail -1 && systemctl reload nginx && echo 'nginx 已重载'"

echo "==> 线上状态"
ssh "$HOST" "echo -n '课程目录数: '; ls ${REMOTE}/audio/narrations | wc -l; df -h / | tail -1"
echo "完成: https://math.whaty.org/"
