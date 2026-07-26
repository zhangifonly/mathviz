#!/usr/bin/env python3
"""
讲解音频补齐工具

扫描全部讲解稿, 找出「文件缺失 / 0 字节 / 未登记进 manifest」的行, 只重新生成这些行,
成功后把新条目合并回对应声音的 manifest.json, 并重建根目录 manifest(前端实际读取的那份)。

与 generate_audio.py 的区别:
- 幂等: 已有的有效音频不会被重复生成
- 合并而非覆盖 manifest, 不会因为个别行失败就丢掉整份清单
- 根 manifest 取两个声音的并集, 避免单声道失败导致该行彻底无音频

用法:
  python3 scripts/repair_audio.py --scan            # 只体检, 不生成
  python3 scripts/repair_audio.py                   # 补齐全部缺失
  python3 scripts/repair_audio.py fourier lissajous # 只补指定实验
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from generate_audio import (  # noqa: E402
    AUDIO_CONFIG,
    VOICE_MAP,
    generate_audio_for_line,
)

PROJECT_ROOT = Path(__file__).parent.parent
NARRATIONS_DIR = PROJECT_ROOT / 'src' / 'narrations' / 'scripts'
AUDIO_DIR = PROJECT_ROOT / 'public' / 'audio' / 'narrations'
VOICES = ['yunxi', 'xiaoxiao']


def load_manifest(path: Path) -> dict:
    """读取 manifest, 不存在或损坏时返回空壳"""
    if path.exists():
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            data.setdefault('files', [])
            return data
        except json.JSONDecodeError:
            print(f"   ⚠️  manifest 损坏, 将重建: {path}")
    return {'files': []}


def audit_script(script: dict) -> dict:
    """
    体检单个稿件, 把每个声音下有问题的行分成两类:
      regen  - 文件不存在或 0 字节, 必须重新调 TTS 生成
      adopt  - 文件已存在且非空, 只是 manifest 里没登记, 按磁盘实况补登记即可
    分开处理是为了不把已有的好音频重跑一遍(整份 manifest 丢失的实验很常见)。
    """
    script_id = script['id']
    lines = [
        (s['id'], ln['id'], ln['text'])
        for s in script.get('sections', [])
        for ln in s.get('lines', [])
    ]

    todo = {}
    for voice in VOICES:
        voice_dir = AUDIO_DIR / script_id / voice
        manifest = load_manifest(voice_dir / 'manifest.json')
        registered = {(f.get('section_id'), f.get('line_id')) for f in manifest['files']}

        regen, adopt = [], []
        for section_id, line_id, text in lines:
            filename = f'{section_id}-{line_id}.mp3'
            mp3 = voice_dir / filename
            has_audio = mp3.exists() and mp3.stat().st_size > 0
            item = (section_id, line_id, text, filename)
            if not has_audio:
                regen.append(item)
            elif (section_id, line_id) not in registered:
                adopt.append(item)
        todo[voice] = {'regen': regen, 'adopt': adopt}

    return {'script_id': script_id, 'total_lines': len(lines), 'todo': todo}


def make_entry(script_id: str, section_id: str, line_id: str, filename: str,
               text: str, out: Path) -> dict:
    """按磁盘上的真实文件生成一条 manifest 记录(时长沿用 16KB/s 估算口径)"""
    size = out.stat().st_size
    return {
        'script_id': script_id,
        'section_id': section_id,
        'line_id': line_id,
        'filename': filename,
        'path': str(out.relative_to(PROJECT_ROOT / 'public')),
        'duration': round(size / 16000, 2),
        'size': size,
        'text': text,
    }


async def repair_voice(script_id: str, voice: str, regen: list, adopt: list) -> tuple:
    """
    修好某个声音: adopt 的行直接按磁盘登记, regen 的行重新调 TTS。
    只有确认磁盘上存在非空文件的行才会写进 manifest。返回 (成功数, 失败数)。
    """
    voice_dir = AUDIO_DIR / script_id / voice
    manifest_path = voice_dir / 'manifest.json'
    manifest = load_manifest(manifest_path)
    manifest.setdefault('script_id', script_id)
    manifest.setdefault('voice', VOICE_MAP[voice])
    manifest.setdefault('voice_key', voice)
    index = {(f.get('section_id'), f.get('line_id')): f for f in manifest['files']}

    ok_count = 0
    # 1) 已有音频, 仅补登记
    for section_id, line_id, text, filename in adopt:
        out = voice_dir / filename
        if not (out.exists() and out.stat().st_size > 0):
            continue  # 双重保险: 不给不存在的文件写记录
        index[(section_id, line_id)] = make_entry(
            script_id, section_id, line_id, filename, text, out
        )
        ok_count += 1
    if adopt:
        print(f'      📄 {voice}: 按磁盘补登记 {ok_count} 条')

    # 2) 缺音频, 重新生成
    fail_count = 0
    for section_id, line_id, text, filename in regen:
        out = voice_dir / filename
        try:
            await generate_audio_for_line(
                text=text, output_path=out, voice=VOICE_MAP[voice], **AUDIO_CONFIG
            )
        except Exception as e:  # noqa: BLE001
            print(f'      ❌ {voice}/{filename}: {e}')
            fail_count += 1
            continue

        if not (out.exists() and out.stat().st_size > 0):
            print(f'      ❌ {voice}/{filename}: 生成后仍为空, 不登记')
            fail_count += 1
            continue

        entry = make_entry(script_id, section_id, line_id, filename, text, out)
        index[(section_id, line_id)] = entry
        ok_count += 1
        print(f'      ✅ {voice}/{filename} ({entry["duration"]:.1f}s)')

    # 清掉指向空文件/已删文件的旧记录, 保证 manifest 与磁盘一致
    for key, entry in list(index.items()):
        f = voice_dir / entry['filename']
        if not (f.exists() and f.stat().st_size > 0):
            del index[key]

    manifest['files'] = list(index.values())
    manifest['total_duration'] = round(sum(f['duration'] for f in manifest['files']), 2)
    manifest['total_size'] = sum(f['size'] for f in manifest['files'])
    manifest['failed'] = []
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    return ok_count, fail_count


def rebuild_root_manifest(script_id: str) -> dict:
    """
    重建根 manifest(NarrationContext 实际 fetch 的那份)。

    前端按 `/{id}/{voice}/{filename}` 拼路径, 所以根 manifest 只需给出行清单 +
    availableVoices; 条目取两声道并集, 单声道缺失时仍可靠另一声道播出(前端会回退)。
    """
    per_voice = {}
    for voice in VOICES:
        m = load_manifest(AUDIO_DIR / script_id / voice / 'manifest.json')
        per_voice[voice] = {(f.get('section_id'), f.get('line_id')): f for f in m['files']}

    available = [v for v in VOICES if per_voice[v]]
    # 以默认声音 yunxi 为主, 其缺失的行由 xiaoxiao 补上
    merged = {}
    for voice in reversed(available):  # 后写的覆盖前面 -> yunxi 优先
        merged.update(per_voice[voice])

    # path 指向该行实际所在的声音子目录(根目录副本已废弃);
    # 前端只用 filename 再拼 {voice}/ 路径, path 仅作记录用途。
    owner = {}
    for voice in available:
        for key in per_voice[voice]:
            owner.setdefault(key, voice)

    files = []
    for (section_id, line_id), src in merged.items():
        voice = owner.get((section_id, line_id), available[0] if available else 'yunxi')
        files.append({
            **src,
            'path': f'audio/narrations/{script_id}/{voice}/{src["filename"]}',
        })

    manifest = {
        'script_id': script_id,
        'voice': VOICE_MAP.get(available[0], '') if available else '',
        'voice_key': available[0] if available else 'yunxi',
        'availableVoices': available or ['yunxi'],
        'files': files,
        'total_duration': round(sum(f['duration'] for f in files), 2),
        'total_size': sum(f['size'] for f in files),
    }
    root_path = AUDIO_DIR / script_id / 'manifest.json'
    root_path.parent.mkdir(parents=True, exist_ok=True)
    with open(root_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    return manifest


async def main():
    parser = argparse.ArgumentParser(description='讲解音频补齐工具')
    parser.add_argument('ids', nargs='*', help='只处理指定实验 id, 留空处理全部')
    parser.add_argument('--scan', action='store_true', help='只体检并输出缺失清单, 不生成音频')
    parser.add_argument('--rebuild-manifests', action='store_true',
                        help='不生成音频, 只按磁盘实况重建全部根 manifest')
    args = parser.parse_args()

    json_files = sorted(NARRATIONS_DIR.glob('*.json'))
    if args.ids:
        json_files = [p for p in json_files if p.stem in set(args.ids)]
    if not json_files:
        print('❌ 未找到稿件 JSON, 先运行: npm run export-narrations')
        sys.exit(1)

    print(f'📁 待检查稿件: {len(json_files)} 份\n')

    if args.rebuild_manifests:
        total = 0
        for p in json_files:
            m = rebuild_root_manifest(p.stem)
            total += len(m['files'])
        print(f'✅ 已重建 {len(json_files)} 份根 manifest, 共 {total} 条记录')
        return

    audits = []
    for p in json_files:
        with open(p, 'r', encoding='utf-8') as f:
            audits.append(audit_script(json.load(f)))

    def n_regen(a):
        return sum(len(t['regen']) for t in a['todo'].values())

    def n_adopt(a):
        return sum(len(t['adopt']) for t in a['todo'].values())

    total_regen = sum(n_regen(a) for a in audits)
    total_adopt = sum(n_adopt(a) for a in audits)
    broken = [a for a in audits if n_regen(a) or n_adopt(a)]

    print(f'📊 体检结果: {len(broken)}/{len(audits)} 个实验待修')
    print(f'   需重新生成(文件缺失/0字节): {total_regen} 条')
    print(f'   仅需补 manifest 登记(音频已在): {total_adopt} 条')
    for a in sorted(broken, key=lambda x: -(n_regen(x) * 1000 + n_adopt(x)))[:20]:
        parts = []
        for v, t in a['todo'].items():
            if t['regen']:
                parts.append(f'{v}重生成:{len(t["regen"])}')
            if t['adopt']:
                parts.append(f'{v}补登记:{len(t["adopt"])}')
        print(f'   {a["script_id"]:<30} 共{a["total_lines"]}行  {" ".join(parts)}')
    if len(broken) > 20:
        print(f'   ... 其余 {len(broken) - 20} 个')

    if args.scan:
        return
    if not broken:
        print('\n✅ 无需补齐')
        return

    print(f'\n🔧 开始修复 {len(broken)} 个实验')
    fixed, still = 0, 0
    for i, a in enumerate(broken, 1):
        sid = a['script_id']
        print(f'\n[{i}/{len(broken)}] {sid}')
        for voice in VOICES:
            t = a['todo'][voice]
            if not t['regen'] and not t['adopt']:
                continue
            ok, fail = await repair_voice(sid, voice, t['regen'], t['adopt'])
            fixed += ok
            still += fail
        rebuild_root_manifest(sid)

    print(f'\n{"=" * 56}\n✅ 补齐完成: 成功 {fixed} 条, 仍失败 {still} 条')
    if still:
        print('   仍有失败可再跑一次本脚本(幂等, 只补剩下的)')


if __name__ == '__main__':
    asyncio.run(main())
