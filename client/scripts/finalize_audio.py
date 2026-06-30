#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""为新场景补根目录 manifest(默认 yunxi 音频 + availableVoices),与 mobius 结构一致。
用法: python3 finalize_audio.py <script_id> [default_voice=yunxi]"""
import json
import shutil
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / 'public/audio/narrations'


def finalize(script_id: str, default_voice: str = 'yunxi'):
    root = BASE / script_id
    vdir = root / default_voice
    if not vdir.exists():
        print(f'❌ {vdir} 不存在')
        sys.exit(1)
    # 1. 复制默认声音 mp3 到根目录
    for mp3 in vdir.glob('*.mp3'):
        shutil.copy(mp3, root / mp3.name)
    # 2. 根 manifest = 默认声音 manifest + availableVoices, path 去掉子目录
    d = json.load(open(vdir / 'manifest.json'))
    d['availableVoices'] = ['yunxi', 'xiaoxiao']
    for f in d['files']:
        f['path'] = f"audio/narrations/{script_id}/{f['filename']}"
    json.dump(d, open(root / 'manifest.json', 'w'), ensure_ascii=False, indent=2)
    n_mp3 = len(list(root.glob('*.mp3')))
    print(f'✅ {script_id}: 根 mp3={n_mp3}, availableVoices={d["availableVoices"]}, files={len(d["files"])}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('用法: python3 finalize_audio.py <script_id> [default_voice]')
        sys.exit(1)
    finalize(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'yunxi')
