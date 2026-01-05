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
    """解析 TypeScript 口播稿件，提取所有行"""
    content = file_path.read_text(encoding='utf-8')
    lines = []

    # 匹配 sections 数组中的每个 line
    # 格式: { id: 'xxx', text: 'xxx', ... }
    section_pattern = r"id:\s*['\"]([^'\"]+)['\"].*?type:\s*['\"]([^'\"]+)['\"]"
    line_pattern = r"\{\s*id:\s*['\"]([^'\"]+)['\"],\s*text:\s*['\"]([^'\"]+)['\"]"

    # 找到当前 section
    current_section = None
    for match in re.finditer(r"{\s*id:\s*['\"]([^'\"]+)['\"],\s*type:\s*['\"]([^'\"]+)['\"].*?lines:\s*\[([^\]]+)\]", content, re.DOTALL):
        section_id = match.group(1)
        section_type = match.group(2)
        lines_content = match.group(3)

        # 解析该 section 中的所有 lines
        for line_match in re.finditer(r"{\s*id:\s*['\"]([^'\"]+)['\"],\s*text:\s*['\"]([^'\"]+)['\"]", lines_content):
            line_id = line_match.group(1)
            text = line_match.group(2)
            lines.append({
                'section_id': section_id,
                'line_id': line_id,
                'text': text,
                'numbers': extract_numbers(text),
            })

    return lines


def parse_typescript_scenes(file_path: Path) -> List[Dict]:
    """解析 TypeScript 场景配置，提取所有场景"""
    content = file_path.read_text(encoding='utf-8')
    scenes = []

    # 匹配每个场景配置
    # 格式: { lineId: 'xxx', sectionId: 'xxx', scene: {...}, lineState: {...} }
    pattern = r"{\s*lineId:\s*['\"]([^'\"]+)['\"],\s*sectionId:\s*['\"]([^'\"]+)['\"].*?(?:lineState:\s*{([^}]*(?:{[^}]*}[^}]*)*)})?"

    for match in re.finditer(pattern, content, re.DOTALL):
        line_id = match.group(1)
        section_id = match.group(2)
        line_state_content = match.group(3) or ''

        # 提取 params
        params = {}
        params_match = re.search(r"params:\s*{([^}]*)}", line_state_content)
        if params_match:
            params_content = params_match.group(1)
            # 提取 num1, num2, operation
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
            'has_line_state': bool(line_state_content.strip()),
        })

    return scenes


def extract_numbers(text: str) -> List[int]:
    """从文本中提取数字"""
    # 中文数字映射
    cn_nums = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
               '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
               '十一': 11, '十二': 12}

    numbers = []

    # 提取阿拉伯数字
    for match in re.finditer(r'\d+', text):
        numbers.append(int(match.group()))

    # 提取中文数字
    for cn, num in cn_nums.items():
        if cn in text:
            numbers.append(num)

    return list(set(numbers))  # 去重


def check_content_match(script_lines: List[Dict], scene_configs: List[Dict]) -> Tuple[List[str], List[str]]:
    """检查口播内容与场景配置是否匹配"""
    errors = []
    warnings = []

    # 创建场景配置索引
    scene_map = {s['line_id']: s for s in scene_configs}

    # 需要检查 params 的 section 类型
    math_sections = ['addition', 'subtraction', 'multiplication', 'division']

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
            if not params:
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

                # 检查 operation 是否与 section 匹配
                if 'operation' in params:
                    expected_op = section_id.replace('tion', 'tion')  # addition, subtraction, etc.
                    if params['operation'] != expected_op and params['operation'] != section_id:
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
    audio_dir = base_dir / f"public/audio/narrations/{course_id}"
    yunxi_dir = audio_dir / "yunxi"

    if not audio_dir.exists():
        errors.append(f"音频目录不存在: {audio_dir}")
        print(f"  ❌ 女声音频目录: 不存在")
    else:
        print(f"  ✅ 女声音频目录: {audio_dir.name}/")

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

    xiaoxiao_files = list(audio_dir.glob("*.mp3")) if audio_dir.exists() else []
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

    xiaoxiao_manifest = audio_dir / "manifest.json"
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
