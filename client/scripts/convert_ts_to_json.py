#!/usr/bin/env python3
"""
将 TypeScript 讲解稿件转换为 JSON 格式
"""

import re
import json
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent.parent / 'src' / 'narrations' / 'scripts'

def parse_ts_to_json(ts_content: str) -> dict:
    """从 TypeScript 内容中提取稿件数据"""

    # 提取 id
    id_match = re.search(r"id:\s*['\"]([^'\"]+)['\"]", ts_content)
    script_id = id_match.group(1) if id_match else ""

    # 提取 title
    title_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", ts_content)
    title = title_match.group(1) if title_match else ""

    # 提取 subtitle
    subtitle_match = re.search(r"subtitle:\s*['\"]([^'\"]+)['\"]", ts_content)
    subtitle = subtitle_match.group(1) if subtitle_match else ""

    # 提取 difficulty
    diff_match = re.search(r"difficulty:\s*['\"]([^'\"]+)['\"]", ts_content)
    difficulty = diff_match.group(1) if diff_match else "intermediate"

    # 提取 targetAge
    age_match = re.search(r"targetAge:\s*['\"]([^'\"]+)['\"]", ts_content)
    target_age = age_match.group(1) if age_match else ""

    # 提取 voice
    voice_match = re.search(r"voice:\s*['\"]([^'\"]+)['\"]", ts_content)
    voice = voice_match.group(1) if voice_match else "yunxi"

    # 提取 sections
    sections = []

    # 匹配每个 section 块
    section_pattern = r"\{\s*id:\s*['\"]([^'\"]+)['\"],\s*type:\s*['\"]([^'\"]+)['\"],\s*title:\s*['\"]([^'\"]+)['\"]"
    section_matches = list(re.finditer(section_pattern, ts_content))

    # 找到所有 lines 数组
    lines_pattern = r"lines:\s*\[\s*((?:\{[^}]+\},?\s*)+)\]"

    for i, section_match in enumerate(section_matches):
        section_id = section_match.group(1)
        section_type = section_match.group(2)
        section_title = section_match.group(3)

        # 找到这个 section 对应的 lines
        start_pos = section_match.end()
        end_pos = section_matches[i + 1].start() if i + 1 < len(section_matches) else len(ts_content)
        section_content = ts_content[start_pos:end_pos]

        lines = []
        # 匹配每个 line
        line_pattern = r"\{\s*id:\s*['\"]([^'\"]+)['\"],\s*text:\s*['\"]([^'\"]+)['\"]"
        for line_match in re.finditer(line_pattern, section_content):
            lines.append({
                "id": line_match.group(1),
                "text": line_match.group(2)
            })

        sections.append({
            "id": section_id,
            "type": section_type,
            "title": section_title,
            "trigger": {"type": "auto"},
            "lines": lines
        })

    return {
        "id": script_id,
        "title": title,
        "subtitle": subtitle,
        "difficulty": difficulty,
        "targetAge": target_age,
        "voice": voice,
        "sections": sections
    }

def main():
    # 找到所有没有对应 JSON 的 TS 文件
    ts_files = list(SCRIPTS_DIR.glob('*.ts'))

    for ts_file in ts_files:
        json_file = ts_file.with_suffix('.json')
        if not json_file.exists():
            print(f"转换: {ts_file.name} -> {json_file.name}")

            with open(ts_file, 'r', encoding='utf-8') as f:
                ts_content = f.read()

            try:
                data = parse_ts_to_json(ts_content)
                if data['id'] and data['sections']:
                    with open(json_file, 'w', encoding='utf-8') as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                    print(f"  ✓ 成功生成 {len(data['sections'])} 个段落")
                else:
                    print(f"  ✗ 解析失败")
            except Exception as e:
                print(f"  ✗ 错误: {e}")

if __name__ == '__main__':
    main()
