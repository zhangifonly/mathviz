#!/usr/bin/env python3
"""
Edge TTS 音频生成脚本

使用微软 Edge TTS 服务为口播稿件生成高质量中文语音。

使用方法：
1. 安装依赖：pip install edge-tts
2. 运行脚本：python generate_audio.py [experiment_id] [--voice xiaoxiao|yunxi]
3. 不带参数则生成所有稿件的音频（使用稿件默认语音）

语音角色：
- zh-CN-XiaoxiaoNeural: 晓晓（女声，活泼亲切）
- zh-CN-YunxiNeural: 云希（男声，沉稳专业）
- zh-CN-YunyangNeural: 云扬（男声，新闻播报风格）

示例：
  python generate_audio.py fourier              # 使用默认语音生成傅里叶稿件
  python generate_audio.py fourier --voice xiaoxiao  # 使用晓晓女声生成
  python generate_audio.py --voice xiaoxiao     # 为所有稿件生成晓晓女声
"""

import argparse
import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Optional
import edge_tts

# 语音角色映射
VOICE_MAP = {
    'xiaoxiao': 'zh-CN-XiaoxiaoNeural',
    'yunxi': 'zh-CN-YunxiNeural',
    'yunyang': 'zh-CN-YunyangNeural',
}

# 项目路径
PROJECT_ROOT = Path(__file__).parent.parent
NARRATIONS_DIR = PROJECT_ROOT / 'src' / 'narrations' / 'scripts'
AUDIO_OUTPUT_DIR = PROJECT_ROOT / 'public' / 'audio' / 'narrations'

# 音频生成配置
AUDIO_CONFIG = {
    'rate': '+0%',      # 语速：-50% 到 +100%
    'volume': '+0%',    # 音量：-50% 到 +50%
    'pitch': '+0Hz',    # 音调：-50Hz 到 +50Hz
}


def load_narration_script(script_path: Path) -> Optional[dict]:
    """
    从 TypeScript 文件中提取稿件数据
    注意：这是一个简化的解析器，实际使用时建议将稿件导出为 JSON
    """
    # 为了简化，我们创建一个 JSON 版本的稿件
    json_path = script_path.with_suffix('.json')
    if json_path.exists():
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None


async def generate_audio_for_line(
    text: str,
    output_path: Path,
    voice: str = 'zh-CN-YunxiNeural',
    rate: str = '+0%',
    volume: str = '+0%',
    pitch: str = '+0Hz'
) -> dict:
    """
    为单条文本生成音频文件

    返回音频文件信息（包括时长）
    """
    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate=rate,
        volume=volume,
        pitch=pitch
    )

    # 确保输出目录存在
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # 生成音频
    await communicate.save(str(output_path))

    # 获取文件信息
    file_size = output_path.stat().st_size

    # 估算时长（实际应该用 mutagen 等库读取）
    # MP3 大约 16KB/秒（128kbps）
    estimated_duration = file_size / 16000

    return {
        'path': str(output_path),
        'size': file_size,
        'duration': round(estimated_duration, 2)
    }


async def generate_audio_for_script(script: dict, output_dir: Path, override_voice: Optional[str] = None) -> dict:
    """
    为整个稿件生成所有音频文件

    Args:
        script: 稿件数据
        output_dir: 输出目录
        override_voice: 覆盖稿件默认语音（xiaoxiao/yunxi/yunyang）
    """
    script_id = script['id']

    # 确定使用的语音
    voice_key = override_voice or script.get('voice', 'yunxi')
    voice = VOICE_MAP.get(voice_key, 'zh-CN-YunxiNeural')

    results = {
        'script_id': script_id,
        'voice': voice,
        'voice_key': voice_key,
        'files': [],
        'total_duration': 0,
        'total_size': 0,
    }

    # 如果指定了语音，输出到子目录
    if override_voice:
        script_output_dir = output_dir / script_id / override_voice
    else:
        script_output_dir = output_dir / script_id

    print(f"\n📝 正在处理稿件: {script['title']} ({script_id})")
    print(f"   语音角色: {voice}")
    print(f"   输出目录: {script_output_dir}")

    for section in script.get('sections', []):
        section_id = section['id']
        print(f"\n   📂 段落: {section['title']} ({section_id})")

        for line in section.get('lines', []):
            line_id = line['id']
            text = line['text']

            # 生成文件名
            filename = f"{section_id}-{line_id}.mp3"
            output_path = script_output_dir / filename

            print(f"      🎙️  生成: {filename}")
            print(f"         文本: {text[:50]}{'...' if len(text) > 50 else ''}")

            try:
                info = await generate_audio_for_line(
                    text=text,
                    output_path=output_path,
                    voice=voice,
                    **AUDIO_CONFIG
                )

                file_info = {
                    'script_id': script_id,
                    'section_id': section_id,
                    'line_id': line_id,
                    'filename': filename,
                    'path': str(output_path.relative_to(PROJECT_ROOT / 'public')),
                    'duration': info['duration'],
                    'size': info['size'],
                    'text': text,
                }

                results['files'].append(file_info)
                results['total_duration'] += info['duration']
                results['total_size'] += info['size']

                print(f"         ✅ 完成 ({info['duration']:.1f}秒, {info['size']/1024:.1f}KB)")

            except Exception as e:
                print(f"         ❌ 失败: {e}")

    print(f"\n   📊 统计:")
    print(f"      总文件数: {len(results['files'])}")
    print(f"      总时长: {results['total_duration']:.1f}秒 ({results['total_duration']/60:.1f}分钟)")
    print(f"      总大小: {results['total_size']/1024/1024:.2f}MB")

    return results


def save_audio_manifest(results: dict, output_dir: Path, override_voice: Optional[str] = None):
    """
    保存音频清单文件（用于前端加载）
    """
    if override_voice:
        manifest_path = output_dir / results['script_id'] / override_voice / 'manifest.json'
    else:
        manifest_path = output_dir / results['script_id'] / 'manifest.json'

    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n   📄 清单已保存: {manifest_path}")


async def main():
    """主函数"""
    # 解析命令行参数
    parser = argparse.ArgumentParser(
        description='Edge TTS 音频生成工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例：
  python generate_audio.py fourier              # 使用默认语音生成傅里叶稿件
  python generate_audio.py fourier --voice xiaoxiao  # 使用晓晓女声生成
  python generate_audio.py --voice xiaoxiao     # 为所有稿件生成晓晓女声
        """
    )
    parser.add_argument('script_id', nargs='?', help='要生成的稿件 ID（可选，不指定则生成所有）')
    parser.add_argument('--voice', '-v', choices=['xiaoxiao', 'yunxi', 'yunyang'],
                        help='指定语音角色（覆盖稿件默认设置）')

    args = parser.parse_args()

    print("=" * 60)
    print("🎵 Edge TTS 音频生成工具")
    print("=" * 60)

    # 检查 edge-tts 是否安装
    try:
        import edge_tts
    except ImportError:
        print("\n❌ 错误: 请先安装 edge-tts")
        print("   运行: pip install edge-tts")
        sys.exit(1)

    # 确保输出目录存在
    AUDIO_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 查找 JSON 格式的稿件文件
    json_files = list(NARRATIONS_DIR.glob('*.json'))

    if not json_files:
        print(f"\n⚠️  未找到 JSON 稿件文件")
        print(f"   请先将稿件导出为 JSON 格式，放置在: {NARRATIONS_DIR}")
        print(f"\n   或者运行: npm run export-narrations")
        sys.exit(1)

    print(f"\n📁 找到 {len(json_files)} 个稿件文件")
    if args.voice:
        print(f"🎙️  使用指定语音: {args.voice} ({VOICE_MAP[args.voice]})")

    for json_file in json_files:
        script_id = json_file.stem

        # 如果指定了特定稿件，跳过其他的
        if args.script_id and script_id != args.script_id:
            continue

        # 加载稿件
        with open(json_file, 'r', encoding='utf-8') as f:
            script = json.load(f)

        # 生成音频
        results = await generate_audio_for_script(script, AUDIO_OUTPUT_DIR, args.voice)

        # 保存清单
        save_audio_manifest(results, AUDIO_OUTPUT_DIR, args.voice)

    print("\n" + "=" * 60)
    print("✅ 音频生成完成!")
    print("=" * 60)


if __name__ == '__main__':
    asyncio.run(main())
