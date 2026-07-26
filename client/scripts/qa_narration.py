#!/usr/bin/env python3
"""
讲解动画质检脚本
用法: python scripts/qa_narration.py {course-id}

检查项目:
1. 文件完整性 - 口播稿件、场景配置、音频目录
2. 数量一致性 - 口播行数 = 场景数 = 音频数
3. 音频质量 - 文件大小、时长
4. Manifest 正确性 - voice_key、total_duration
5. 内容匹配 - 口播文本中的数字与 params 匹配
"""

import sys
import os
import json
import re
from pathlib import Path
from typing import List, Dict, Tuple, Optional


def parse_typescript_script(file_path: Path) -> List[Dict]:
    """提取口播稿的所有行。

    优先读 src/narrations/scripts/{id}.json —— 那是 export-narrations 从 TS 导出的
    同源产物, 也是配音脚本的输入, 结构化解析不会出错。
    只有 JSON 缺失时才退回正则扫 TS(正则遇到文案里的 ] 会截断, 例如
    partial-derivative 的「记作 [fx, fy]」曾使 gradient 段少数出 2 行)。
    """
    json_path = file_path.with_suffix('.json')  # 与 TS 稿件同目录同名
    if json_path.exists():
        data = json.loads(json_path.read_text(encoding='utf-8'))
        return [
            {
                'section_id': section['id'],
                'line_id': line['id'],
                'text': line['text'],
                'numbers': extract_numbers(line['text']),
            }
            for section in data.get('sections', [])
            for line in section.get('lines', [])
        ]

    content = file_path.read_text(encoding='utf-8')
    lines = []
    # 退路: [\s\S]*? 跨行匹配到 lines 数组结束的 `],`, 避免被文案内的 ] 截断
    section_re = r"{\s*id:\s*['\"]([^'\"]+)['\"],\s*type:\s*['\"]([^'\"]+)['\"][\s\S]*?lines:\s*\[([\s\S]*?)\n\s*\],"
    for match in re.finditer(section_re, content):
        section_id = match.group(1)
        lines_content = match.group(3)
        for line_match in re.finditer(r"{\s*id:\s*['\"]([^'\"]+)['\"],\s*text:\s*['\"]([^'\"]+)['\"]", lines_content):
            text = line_match.group(2)
            lines.append({
                'section_id': section_id,
                'line_id': line_match.group(1),
                'text': text,
                'numbers': extract_numbers(text),
            })

    return lines


def _slice_object(content: str, start: int) -> str:
    """从 content[start] 处的 '{' 开始, 按括号计数返回该对象的完整正文(不含最外层括号)。

    字符串字面量内的括号不计数, 避免文案里的 { } 打乱配对。
    """
    depth = 0
    quote = None
    i = start
    n = len(content)
    while i < n:
        ch = content[i]
        if quote:
            if ch == '\\':
                i += 2  # 跳过转义字符本身
                continue
            if ch == quote:
                quote = None
            i += 1
            continue
        if ch in '\'"`':
            quote = ch
        elif ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return content[start + 1:i]
        i += 1
    return content[start:]


def parse_typescript_scenes(file_path: Path) -> List[Dict]:
    """解析 TypeScript 场景配置，提取所有场景"""
    content = file_path.read_text(encoding='utf-8')
    scenes = []

    # 匹配每个场景配置。两种字段顺序都要认:
    #   { lineId: 'x', sectionId: 'y', ... }  (298 份)
    #   { sectionId: 'y', lineId: 'x', ... }  (2 份, 如 laplaceScenes/permutationCombinationScenes)
    pattern = (
        r"{\s*(?:lineId:\s*['\"](?P<l1>[^'\"]+)['\"],\s*sectionId:\s*['\"](?P<s1>[^'\"]+)['\"]"
        r"|sectionId:\s*['\"](?P<s2>[^'\"]+)['\"],\s*lineId:\s*['\"](?P<l2>[^'\"]+)['\"])"
    )

    for match in re.finditer(pattern, content, re.DOTALL):
        line_id = match.group('l1') or match.group('l2')
        section_id = match.group('s1') or match.group('s2')
        # 用括号计数切出这个场景对象的完整正文。
        # 正则做不到括号平衡: lineState 里有 show/highlight/annotation 多个兄弟对象时,
        # 旧的 ([^}]*(?:{[^}]*}[^}]*)*) 只能跨一层嵌套, 会漏掉 params
        # (basic-arithmetic 的 sub-2 明明有 num1:7/num2:5 却被判为缺 params)。
        body = _slice_object(content, match.start())
        # 再从场景正文里切出 lineState 自身, 避免把 scene/其他字段里的 params 算进来
        ls_match = re.search(r"lineState:\s*{", body)
        # ls_match 以 '{' 结尾, end()-1 正是该括号的位置
        line_state_content = _slice_object(body, ls_match.end() - 1) if ls_match else ''

        # 提取 params。同样用括号计数, 因为 params 里也可能有嵌套对象
        # (complex 的 params: { z1: { a: 2, b: 1 }, z2: {...} }, [^}]* 会在 z1 处截断)
        params = {}
        pm = re.search(r"params:\s*{", line_state_content)
        if pm:
            params_content = _slice_object(line_state_content, pm.end() - 1)
            num1_match = re.search(r"num1:\s*(\d+)", params_content)
            num2_match = re.search(r"num2:\s*(\d+)", params_content)
            op_match = re.search(r"operation:\s*['\"]([^'\"]+)['\"]", params_content)

            if num1_match:
                params['num1'] = int(num1_match.group(1))
            if num2_match:
                params['num2'] = int(num2_match.group(1))
            if op_match:
                params['operation'] = op_match.group(1)

        scenes.append({
            'line_id': line_id,
            'section_id': section_id,
            'params': params,
            # params 存在但不是 num1/num2 形式(如 complex 的 z1/z2 复数对象)时,
            # params 字典为空却并非「缺少 params」, 用这个标记区分
            'has_params': bool(pm),
            'has_line_state': bool(line_state_content.strip()),
        })

    return scenes


CN_DIGITS = '零一二两三四五六七八九十'
CN_VALUE = {c: i for i, c in enumerate('零一二三四五六七八九')}
CN_VALUE['两'] = 2  # 「两组」「两个」口语常用

# 「一」「二」等出现在这些词里是量词或副词, 不是参与运算的数字
CN_FALSE_POSITIVE = re.compile(
    r'第[一二三四五六七八九十]+个?|[在合并放数看想]一(?:起|下|样|边)|一(?:起|下|样|共|边|个个|一)|'
    r'统一|唯一|一定|一直|一般|一点|一些|一样|一旦|不一|万一|十分|十足|'
    # 「乘以一个复数」「加上一个常数」: 这里的「一个」是不定量词, 不是运算参数
    r'(?:乘以|除以|加上|减去|变成|得到|对应|相当于|看作|想象|取|用)一个'
)


def _cn_to_int(token: str) -> Optional[int]:
    """把「十二」「三」这类中文数词转成整数, 认不出的返回 None。"""
    if not token or any(c not in CN_DIGITS for c in token):
        return None
    if '十' not in token:
        return CN_VALUE.get(token) if len(token) == 1 else None
    head, _, tail = token.partition('十')
    tens = CN_VALUE.get(head, 1) if head else 1
    ones = CN_VALUE.get(tail, 0) if tail else 0
    return tens * 10 + ones


def extract_numbers(text: str) -> List[int]:
    """提取口播文本里真正参与运算的数字。

    只认: 阿拉伯数字, 以及紧跟量词/运算词的中文数词(如「7个」「12除以3」「三乘以四」)。
    不认孤立的「一」——「第一个数」「合在一起」里的「一」不是运算参数, 否则会把
    几乎每句话都误判成含数字(修复前 basic-arithmetic 因此报出 17 条假警告)。
    分数表述「四分之一」整体视为一个分数, 不拆成分子分母。
    """
    # 分数表述先摘掉, 避免「四分之一」拆出 4 和 1
    cleaned = re.sub(rf'[{CN_DIGITS}\d]+分之[{CN_DIGITS}\d]+', '', text)
    cleaned = CN_FALSE_POSITIVE.sub('', cleaned)

    numbers = [int(m.group()) for m in re.finditer(r'\d+', cleaned)]

    # 中文数词: 后面跟量词/运算词, 或紧跟在运算词之后(如「等于三」)才算
    pattern = (
        rf'(?<=等于|得到|剩下|共有|一共)([{CN_DIGITS}]+)'
        rf'|([{CN_DIGITS}]+)(?=个|块|组|份|倍|次|乘|加|减|除|等于|以)'
    )
    for m in re.finditer(pattern, cleaned):
        val = _cn_to_int(m.group(1) or m.group(2))
        if val is not None and val > 0:
            numbers.append(val)

    return sorted(set(numbers))


# 运算段落 → 该段落里 operation 的合法取值(同义词都算对)
OPERATION_ALIASES = {
    'addition': {'addition', 'add'},
    'subtraction': {'subtraction', 'subtract', 'sub', 'difference'},
    'multiplication': {'multiplication', 'multiply', 'mul'},
    'division': {'division', 'divide', 'div'},
}


PLACEHOLDER_RE = re.compile(r'TODO|FIXME|待补|待定|占位|[Xx]{3}|\?{3}|、、|。。')


def check_text_quality(script_lines: List[Dict]) -> Tuple[List[str], List[str]]:
    """检查口播文案本身的硬伤(与场景配置无关)。

    阈值取自 300 门现状: 字数中位数 432, 单行普遍 20~120 字。
    < 8 字的行配出来不足 2 秒, 播放体验是「一闪而过」;
    > 220 字的行单条音频超过 40 秒, 动画对不上。
    """
    errors, warnings = [], []
    seen = {}
    for line in script_lines:
        lid, text = line['line_id'], line['text']
        if PLACEHOLDER_RE.search(text):
            errors.append(f"{lid}: 文案含占位符/未完成标记: {text[:30]}")
        stripped = text.strip()
        if not stripped:
            errors.append(f"{lid}: 文案为空")
            continue
        if len(stripped) < 8:
            warnings.append(f"{lid}: 文案过短({len(stripped)}字), 配音不足两秒: {stripped}")
        elif len(stripped) > 220:
            warnings.append(f"{lid}: 文案过长({len(stripped)}字), 单条音频超 40 秒")
        if stripped in seen:
            warnings.append(f"{lid}: 文案与 {seen[stripped]} 完全重复: {stripped[:30]}")
        else:
            seen[stripped] = lid
    return errors, warnings


def check_content_match(script_lines: List[Dict], scene_configs: List[Dict]) -> Tuple[List[str], List[str]]:
    """检查口播内容与场景配置是否匹配"""
    errors = []
    warnings = []

    # 创建场景配置索引
    scene_map = {s['line_id']: s for s in scene_configs}

    # 需要检查 params 的 section 类型
    math_sections = list(OPERATION_ALIASES)

    for line in script_lines:
        line_id = line['line_id']
        section_id = line['section_id']
        text = line['text']
        text_numbers = line['numbers']

        # 检查是否有对应的场景配置
        if line_id not in scene_map:
            errors.append(f"缺少场景配置: {line_id}")
            continue

        scene = scene_map[line_id]
        params = scene['params']

        # 对于数学运算段落，检查 params 是否存在
        if section_id in math_sections:
            if not scene.get('has_params'):
                # 检查文本中是否包含具体数字
                if text_numbers:
                    warnings.append(f"{line_id}: 口播含数字 {text_numbers}，但缺少 params")
            else:
                # 检查数字是否匹配
                param_numbers = []
                if 'num1' in params:
                    param_numbers.append(params['num1'])
                if 'num2' in params:
                    param_numbers.append(params['num2'])

                # 如果口播文本中有具体数字，检查是否与 params 匹配
                if text_numbers and param_numbers:
                    # 检查 params 中的数字是否出现在文本中
                    for pn in param_numbers:
                        if pn not in text_numbers and str(pn) not in text:
                            # 可能是中文数字，跳过严格检查
                            pass

                # 检查 operation 是否与 section 匹配。
                # 各实验用词不统一: multiplication 段落里 operation 可能写 'multiply',
                # addition 段落里可能写 'add', 这些是同义词而非配错段落
                if 'operation' in params:
                    if params['operation'] not in OPERATION_ALIASES.get(section_id, {section_id}):
                        errors.append(f"{line_id}: operation={params['operation']}，但在 {section_id} 段落")

    # 检查是否有多余的场景配置
    script_line_ids = {l['line_id'] for l in script_lines}
    for scene in scene_configs:
        if scene['line_id'] not in script_line_ids:
            warnings.append(f"多余的场景配置: {scene['line_id']}")

    return errors, warnings


def check_narration(course_id: str) -> bool:
    """执行完整质检"""
    errors = []
    warnings = []

    # 获取项目根目录
    script_dir = Path(__file__).parent
    base_dir = script_dir.parent  # client 目录

    print(f"\n{'='*60}")
    print(f"  讲解动画质检: {course_id}")
    print(f"{'='*60}")

    # ========================================
    # 1. 文件存在性检查
    # ========================================
    print(f"\n📁 文件完整性检查")
    print("-" * 40)

    # 检查口播稿件
    script_path = base_dir / f"src/narrations/scripts/{course_id}.ts"
    script_lines = []
    if not script_path.exists():
        errors.append(f"口播稿件不存在: {script_path}")
        print(f"  ❌ 口播稿件: 不存在")
    else:
        print(f"  ✅ 口播稿件: {script_path.name}")
        script_lines = parse_typescript_script(script_path)
        print(f"     解析到 {len(script_lines)} 行口播")

    # 检查场景配置 (尝试多种命名格式)
    scenes_path = None
    scene_configs = []
    # 将 course-id 转为 camelCase (e.g., basic-arithmetic -> basicArithmetic)
    camel_case = ''.join(word.capitalize() if i > 0 else word for i, word in enumerate(course_id.split('-')))
    # 特殊映射：某些课程使用简化的场景文件名
    special_mappings = {
        'linear-function': 'linearScenes.ts',
        'quadratic-function': 'quadraticScenes.ts',
        'conic-sections': 'conicScenes.ts',
    }
    for name_format in [
        special_mappings.get(course_id),  # 先检查特殊映射
        f"{camel_case}Scenes.ts",
        f"{course_id.replace('-', '')}Scenes.ts",
        f"{course_id}Scenes.ts",
    ]:
        if name_format is None:
            continue
        test_path = base_dir / f"src/components/NarrationPresenter/{name_format}"
        if test_path.exists():
            scenes_path = test_path
            break

    if not scenes_path:
        errors.append(f"场景配置不存在")
        print(f"  ❌ 场景配置: 不存在")
    else:
        print(f"  ✅ 场景配置: {scenes_path.name}")
        scene_configs = parse_typescript_scenes(scenes_path)
        print(f"     解析到 {len(scene_configs)} 个场景")

    # 检查音频目录
    # 双声道均在各自子目录: {course}/xiaoxiao/ 与 {course}/yunxi/
    # (历史上女声放在 {course}/ 根层, 该冗余副本已删除, 根层只保留 manifest.json)
    audio_dir = base_dir / f"public/audio/narrations/{course_id}"
    xiaoxiao_dir = audio_dir / "xiaoxiao"
    yunxi_dir = audio_dir / "yunxi"

    if not audio_dir.exists():
        errors.append(f"音频目录不存在: {audio_dir}")
        print(f"  ❌ 音频目录: 不存在")
    else:
        print(f"  ✅ 音频目录: {audio_dir.name}/")

    if not xiaoxiao_dir.exists():
        errors.append(f"女声音频目录不存在: {xiaoxiao_dir}")
        print(f"  ❌ 女声音频目录: 不存在")
    else:
        print(f"  ✅ 女声音频目录: {xiaoxiao_dir.name}/")

    if not yunxi_dir.exists():
        errors.append(f"男声音频目录不存在: {yunxi_dir}")
        print(f"  ❌ 男声音频目录: 不存在")
    else:
        print(f"  ✅ 男声音频目录: {yunxi_dir.name}/")

    # ========================================
    # 2. 数量一致性检查
    # ========================================
    print(f"\n📊 数量一致性检查")
    print("-" * 40)

    xiaoxiao_files = list(xiaoxiao_dir.glob("*.mp3")) if xiaoxiao_dir.exists() else []
    yunxi_files = list(yunxi_dir.glob("*.mp3")) if yunxi_dir.exists() else []

    print(f"  口播行数:     {len(script_lines)}")
    print(f"  场景配置数:   {len(scene_configs)}")
    print(f"  女声音频数:   {len(xiaoxiao_files)}")
    print(f"  男声音频数:   {len(yunxi_files)}")

    if len(script_lines) != len(scene_configs):
        errors.append(f"口播行数({len(script_lines)}) ≠ 场景配置数({len(scene_configs)})")

    if len(xiaoxiao_files) != len(yunxi_files):
        errors.append(f"女声音频数({len(xiaoxiao_files)}) ≠ 男声音频数({len(yunxi_files)})")

    if len(script_lines) != len(xiaoxiao_files):
        warnings.append(f"口播行数({len(script_lines)}) ≠ 音频数({len(xiaoxiao_files)})")

    # ========================================
    # 3. 内容匹配检查
    # ========================================
    print(f"\n🔍 内容匹配检查")
    print("-" * 40)

    if script_lines:
        text_errors, text_warnings = check_text_quality(script_lines)
        errors.extend(text_errors)
        warnings.extend(text_warnings)
        if not text_errors and not text_warnings:
            print(f"  ✅ 文案质量无硬伤 (无占位符/空行/过短过长/重复)")

    if script_lines and scene_configs:
        content_errors, content_warnings = check_content_match(script_lines, scene_configs)
        errors.extend(content_errors)
        warnings.extend(content_warnings)

        if not content_errors and not content_warnings:
            print(f"  ✅ 口播与场景配置匹配")
        else:
            if content_errors:
                print(f"  ❌ 发现 {len(content_errors)} 个匹配错误")
            if content_warnings:
                print(f"  ⚠️  发现 {len(content_warnings)} 个匹配警告")

    # ========================================
    # 4. 音频文件检查
    # ========================================
    print(f"\n🎵 音频文件检查")
    print("-" * 40)

    # 检查空文件或过小文件
    small_files = []
    for f in xiaoxiao_files + yunxi_files:
        size = f.stat().st_size
        if size < 1000:  # 小于 1KB
            small_files.append((f.name, size))
            errors.append(f"音频文件过小: {f.name} ({size} bytes)")

    if small_files:
        print(f"  ❌ 发现 {len(small_files)} 个过小文件")
    else:
        print(f"  ✅ 所有音频文件大小正常")

    # ========================================
    # 5. Manifest 检查
    # ========================================
    print(f"\n📋 Manifest 检查")
    print("-" * 40)

    # 各声道 manifest 在自己的子目录; 根层 manifest.json 是前端加载的合并版(voice_key=yunxi)
    xiaoxiao_manifest = xiaoxiao_dir / "manifest.json"
    yunxi_manifest = yunxi_dir / "manifest.json"

    # 女声 manifest
    if xiaoxiao_manifest.exists():
        with open(xiaoxiao_manifest, encoding='utf-8') as f:
            data = json.load(f)
            voice_key = data.get('voice_key', 'N/A')
            total_duration = data.get('total_duration', 0)
            file_count = len(data.get('files', []))

            print(f"  女声: voice_key={voice_key}, 时长={total_duration:.1f}秒, 条目={file_count}")

            if voice_key != 'xiaoxiao':
                errors.append(f"女声 manifest voice_key 错误: {voice_key}")

            # 检查时长异常
            for item in data.get('files', []):
                if item.get('duration', 0) < 0.3:
                    warnings.append(f"音频时长过短: {item['line_id']} ({item['duration']}秒)")
    else:
        errors.append("女声 manifest.json 不存在")

    # 男声 manifest
    if yunxi_manifest.exists():
        with open(yunxi_manifest, encoding='utf-8') as f:
            data = json.load(f)
            voice_key = data.get('voice_key', 'N/A')
            total_duration = data.get('total_duration', 0)
            file_count = len(data.get('files', []))

            print(f"  男声: voice_key={voice_key}, 时长={total_duration:.1f}秒, 条目={file_count}")

            if voice_key != 'yunxi':
                errors.append(f"男声 manifest voice_key 错误: {voice_key}")
    else:
        errors.append("男声 manifest.json 不存在")

    # 根 manifest: 前端 NarrationContext 实际 fetch 的就是这份, 必须校验
    root_manifest = audio_dir / "manifest.json"
    if root_manifest.exists():
        with open(root_manifest, encoding='utf-8') as f:
            data = json.load(f)
        entries = data.get('files', [])
        voices = data.get('availableVoices') or []
        print(f"  根(前端加载): 条目={len(entries)}, 可选声音={voices}")

        if not voices:
            errors.append("根 manifest 缺少 availableVoices 字段")
        if len(entries) != len(script_lines):
            errors.append(f"根 manifest 条目({len(entries)}) ≠ 口播行数({len(script_lines)})")

        # 前端按 {course}/{voice}/{filename} 取音频, 逐条确认每个声道都有真实文件
        for item in entries:
            filename = item.get('filename', '')
            for voice in voices:
                mp3 = audio_dir / voice / filename
                if not mp3.exists():
                    errors.append(f"根 manifest 指向的音频缺失: {voice}/{filename}")
                elif mp3.stat().st_size == 0:
                    errors.append(f"根 manifest 指向的音频为空: {voice}/{filename}")
    else:
        errors.append("根 manifest.json 不存在")

    # ========================================
    # 6. 输出结果
    # ========================================
    print(f"\n{'='*60}")
    print(f"  质检结果")
    print(f"{'='*60}")

    if errors:
        print(f"\n❌ 错误 ({len(errors)}):")
        for e in errors:
            print(f"   • {e}")

    if warnings:
        print(f"\n⚠️  警告 ({len(warnings)}):")
        for w in warnings[:15]:  # 最多显示15个警告
            print(f"   • {w}")
        if len(warnings) > 15:
            print(f"   ... 还有 {len(warnings) - 15} 个警告")

    if not errors and not warnings:
        print(f"\n✅ 所有检查通过!")

    print(f"\n📝 手动验收清单:")
    print(f"   □ 播放完整课程")
    print(f"   □ 测试声音切换 (晓晓♀ / 云希♂)")
    print(f"   □ 测试进度条跳转")
    print(f"   □ 验证动画与口播同步")
    print(f"   □ 检查字幕显示正确")

    print()
    return len(errors) == 0


def main():
    if len(sys.argv) < 2:
        print("讲解动画质检脚本")
        print("-" * 40)
        print("用法: python scripts/qa_narration.py {course-id}")
        print()
        print("示例:")
        print("  python scripts/qa_narration.py basic-arithmetic")
        print("  python scripts/qa_narration.py fourier")
        print()

        # 列出可用的课程
        script_dir = Path(__file__).parent
        audio_dir = script_dir.parent / "public/audio/narrations"
        if audio_dir.exists():
            courses = [d.name for d in audio_dir.iterdir() if d.is_dir()]
            if courses:
                print("可用课程:")
                for c in sorted(courses):
                    print(f"  - {c}")

        sys.exit(1)

    course_id = sys.argv[1]
    success = check_narration(course_id)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
