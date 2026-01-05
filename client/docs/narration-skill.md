# 讲解动画制作 Skill 规范

## 概述

本 skill 用于为数学可视化实验创建配套的讲解动画系统。每个课程需要：
1. 口播稿件（narration script）
2. 场景配置（scene config）
3. 专属动画场景组件（scene components）
4. 音频文件（audio files）

## 目录结构

```
src/
├── narrations/
│   └── scripts/
│       ├── {course-id}.ts      # 口播稿件（TypeScript）
│       └── {course-id}.json    # 口播稿件（JSON，用于音频生成）
├── components/
│   └── NarrationPresenter/
│       ├── {courseId}Scenes.ts # 场景配置
│       └── scenes/
│           └── {CourseId}/     # 专属场景组件目录
│               ├── index.ts
│               ├── {SceneName}Scene.tsx
│               └── ...
public/
└── audio/
    └── narrations/
        └── {course-id}/
            ├── manifest.json          # xiaoxiao 清单
            ├── *.mp3                   # xiaoxiao 音频文件
            └── yunxi/
                ├── manifest.json       # yunxi 清单
                └── *.mp3               # yunxi 音频文件
```

---

## 标准化制作流程

### 第一步：编写口播稿件

文件：`src/narrations/scripts/{course-id}.ts`

```typescript
import type { NarrationScript } from '../types'

export const {courseId}Narration: NarrationScript = {
  id: '{course-id}',
  title: '课程标题',
  subtitle: '副标题',
  targetAge: '小学 6-12岁' | '初中 12-15岁' | '高中 15-18岁',
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  voice: 'xiaoxiao' | 'yunxi',  // xiaoxiao=女声(小学/初中), yunxi=男声(高中)

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        { id: 'intro-1', text: '第一句话...' },
        { id: 'intro-2', text: '第二句话...' },
      ]
    },
    // 更多段落...
  ]
}
```

### 第二步：设计场景配置（Khan Academy 风格）

文件：`src/components/NarrationPresenter/{courseId}Scenes.ts`

**核心原则：每一行口播必须有对应的 `lineState` 配置，确保动画与口播内容完全同步。**

```typescript
import type { NarrationLineScene, SceneState } from './types'

export const default{CourseId}State: SceneState = {
  // 课程专属状态
}

export const {courseId}Scenes: NarrationLineScene[] = [
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    // ⚠️ 必须配置 lineState
    lineState: {
      show: { group1: false, group2: false, formula: false },
    }
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-demo', type: 'animation' },
    lineState: {
      // ⚠️ params 必须与口播内容匹配
      params: { num1: 3, num2: 2, operation: 'addition' },
      show: { group1: 3, group2: 2, formula: false },
      annotation: { text: '3 + 2', position: 'bottom' },
    }
  },
]
```

#### lineState 配置说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `params` | `{ num1?, num2?, operation? }` | **必填** - 动画参数，必须与口播内容一致 |
| `show` | `{ group1?, group2?, formula?, result? }` | 控制显示哪些元素 |
| `highlight` | `string[]` | 高亮的元素列表 |
| `annotation` | `{ text, position }` | 屏幕标注文字 |
| `animate` | `{ type, duration }` | 动画效果 |

### 第三步：创建专属场景组件

目录：`src/components/NarrationPresenter/scenes/{CourseId}/`

每个课程需要创建自己的场景组件，复用实验页面的可视化逻辑：

```typescript
// scenes/{CourseId}/index.ts
export { default as {CourseId}TitleScene } from './{CourseId}TitleScene'
export { default as {CourseId}DemoScene } from './{CourseId}DemoScene'
// ...

// scenes/{CourseId}/{CourseId}DemoScene.tsx
interface Props {
  sceneId: string
  state: SceneState
  onStateChange: (updates: Partial<SceneState>) => void
  interactive?: boolean
}

export default function {CourseId}DemoScene({ sceneId, state, ... }: Props) {
  // 根据 sceneId 渲染不同的动画内容
  // 复用实验页面的可视化组件
}
```

### 第四步：注册场景渲染器

修改 `NarrationPresenter.tsx`，为课程添加专属渲染逻辑：

```typescript
// 在 sceneConfigMap 中添加课程配置
const sceneConfigMap: Record<string, {...}> = {
  // ...
  '{course-id}': { scenes: {courseId}Scenes, defaultState: default{CourseId}State },
}

// 在 renderScene 函数中添加课程判断
const renderScene = () => {
  const scriptId = script?.id

  // 根据课程 ID 使用不同的场景渲染器
  switch (scriptId) {
    case 'basic-arithmetic':
      return <BasicArithmeticSceneRenderer scene={currentScene} state={sceneState} />
    case 'fourier':
      return <FourierSceneRenderer scene={currentScene} state={sceneState} />
    // ...
  }
}
```

### 第五步：生成音频

**⚠️ 必须生成两套音频（xiaoxiao 女声 + yunxi 男声）**

```bash
# 生成女声音频（默认在根目录）
scripts/.venv/bin/python scripts/generate_audio.py {course-id} --voice xiaoxiao

# 生成男声音频（在 yunxi 子目录）
scripts/.venv/bin/python scripts/generate_audio.py {course-id} --voice yunxi
```

### 第六步：执行质检

**⚠️ 每次制作完成后必须执行质检，修复所有错误后才能提交！**

```bash
# 运行完整质检
python3 scripts/qa_narration.py {course-id}

# 质检通过标准：
# - 0 个错误 (❌)
# - 0 个警告 (⚠️) 或警告已确认为误报
```

质检脚本会检查：
1. **文件完整性** - 口播稿件、场景配置、音频目录是否存在
2. **数量一致性** - 口播行数 = 场景配置数 = 音频文件数
3. **内容匹配** - 口播文本中的数字是否与 `lineState.params` 匹配
4. **音频质量** - 文件大小 > 1KB，时长 > 0.3秒
5. **Manifest 正确性** - voice_key 是否正确

---

## 质检标准（QA Checklist）

### 自动化质检脚本

创建 `scripts/qa_narration.py` 执行以下检查：

```bash
scripts/.venv/bin/python scripts/qa_narration.py {course-id}
```

### 质检项目清单

#### 1. 文件完整性检查

| 检查项 | 命令/方法 | 通过标准 |
|--------|----------|----------|
| 口播稿件存在 | `ls src/narrations/scripts/{id}.ts` | 文件存在 |
| 场景配置存在 | `ls src/components/NarrationPresenter/{id}Scenes.ts` | 文件存在 |
| 女声音频目录 | `ls public/audio/narrations/{id}/` | 目录存在且有 mp3 文件 |
| 男声音频目录 | `ls public/audio/narrations/{id}/yunxi/` | 目录存在且有 mp3 文件 |
| 女声 manifest | `cat public/audio/narrations/{id}/manifest.json` | voice_key = "xiaoxiao" |
| 男声 manifest | `cat public/audio/narrations/{id}/yunxi/manifest.json` | voice_key = "yunxi" |

#### 2. 数量一致性检查

| 检查项 | 计算方法 | 通过标准 |
|--------|----------|----------|
| 口播行数 | 统计 script 中所有 lines | N 行 |
| 场景配置数 | 统计 scenes 数组长度 | = N |
| 女声音频数 | `ls *.mp3 \| wc -l` | = N |
| 男声音频数 | `ls yunxi/*.mp3 \| wc -l` | = N |
| 女声 manifest 条目 | `jq '.files \| length'` | = N |
| 男声 manifest 条目 | `jq '.files \| length'` | = N |

#### 3. 音频质量检查

| 检查项 | 命令 | 通过标准 |
|--------|------|----------|
| 文件大小 | `ls -la *.mp3` | 每个文件 > 10KB |
| 音频时长 | manifest.duration | 每条 > 0.5秒 |
| 总时长合理 | manifest.total_duration | 与预期相符 |

```bash
# 检查文件大小
find public/audio/narrations/{id} -name "*.mp3" -size -10k

# 检查 manifest 中时长过短的条目
jq '.files[] | select(.duration < 0.5) | .line_id' manifest.json
```

#### 4. 内容匹配检查

**这是最重要的检查，必须逐行验证！**

对于每一行口播，检查：

| 检查项 | 口播稿 | 场景配置 | 是否匹配 |
|--------|--------|----------|----------|
| lineId | `mul-2` | `lineId: 'mul-2'` | ✅ |
| sectionId | `multiplication` | `sectionId: 'multiplication'` | ✅ |
| 数字1 | "3乘以4" | `params.num1: 3` | ✅ |
| 数字2 | "3乘以4" | `params.num2: 4` | ✅ |
| 运算类型 | 乘法段落 | `params.operation: 'multiplication'` | ✅ |

**自动化检查脚本逻辑：**
```python
# 从口播文本中提取数字
numbers_in_text = re.findall(r'\d+', line.text)

# 与 params 中的数字对比
params_numbers = [params.num1, params.num2]

# 检查是否匹配
if set(numbers_in_text) != set(str(n) for n in params_numbers):
    print(f"警告: {line.id} 数字不匹配")
```

#### 5. 播放器功能检查（手动）

| 检查项 | 操作 | 预期结果 |
|--------|------|----------|
| 播放/暂停 | 点击播放按钮 | 音频播放/暂停 |
| 上一句/下一句 | 点击前进后退按钮 | 正确切换 |
| 进度条点击 | 点击进度条任意位置 | 跳转到对应位置 |
| 时间显示 | 观察进度条 | 显示 当前时间/总时长 |
| 声音切换 | 点击晓晓♀/云希♂ | 立即切换为对应声音 |
| 播放速度 | 切换 0.75x/1x/1.25x/1.5x | 速度正确变化 |
| 动画同步 | 播放时观察 | 动画与口播内容一致 |
| 字幕显示 | 播放时观察 | 字幕与音频同步 |

---

## 常见错误及规避方法

### 错误1：动画与口播内容不匹配

**症状**：口播说"3乘4"，动画显示"5乘3"

**原因**：`lineState.params` 缺失或参数错误

**规避方法**：
1. 每个 `lineState` 必须包含 `params`
2. `params` 中的数字必须与口播文本中的数字一致
3. `operation` 必须与当前讲解的运算类型一致

```typescript
// ❌ 错误：缺少 params
lineState: {
  show: { group1: true, group2: true },
}

// ✅ 正确：必须指定完整 params
lineState: {
  params: { num1: 3, num2: 4, operation: 'multiplication' },
  show: { group1: true, group2: true },
}
```

### 错误2：切换段落后动画类型错误

**症状**：讲减法时显示加法动画

**原因**：`params.operation` 缺失，使用了默认值

**规避方法**：每个场景配置都必须显式指定 `operation`

### 错误3：声音切换无效

**症状**：切换声音后还是同一个人的声音

**原因**：
1. 只生成了一套音频
2. 音频文件放错目录

**规避方法**：
```bash
# 必须执行两次音频生成
scripts/.venv/bin/python scripts/generate_audio.py {id} --voice xiaoxiao
scripts/.venv/bin/python scripts/generate_audio.py {id} --voice yunxi

# 验证目录结构
ls -la public/audio/narrations/{id}/
ls -la public/audio/narrations/{id}/yunxi/
```

### 错误4：音频文件缺失或损坏

**症状**：播放到某一行时没有声音

**原因**：音频文件未生成或大小为 0

**规避方法**：
```bash
# 检查空文件
find public/audio/narrations/{id} -name "*.mp3" -size 0

# 检查文件数量
echo "口播行数: $(grep -c "id:" src/narrations/scripts/{id}.ts)"
echo "女声音频: $(ls public/audio/narrations/{id}/*.mp3 | wc -l)"
echo "男声音频: $(ls public/audio/narrations/{id}/yunxi/*.mp3 | wc -l)"
```

### 错误5：进度条/时间显示异常

**症状**：时间显示为 0:00 或进度条不动

**原因**：manifest.json 中的 duration 数据缺失

**规避方法**：
```bash
# 检查 manifest 中的 total_duration
jq '.total_duration' public/audio/narrations/{id}/manifest.json
jq '.total_duration' public/audio/narrations/{id}/yunxi/manifest.json
```

---

## 质检脚本模板

创建 `scripts/qa_narration.py`：

```python
#!/usr/bin/env python3
"""
讲解动画质检脚本
用法: python scripts/qa_narration.py {course-id}
"""

import sys
import os
import json
import re
from pathlib import Path

def check_narration(course_id: str):
    """执行完整质检"""
    errors = []
    warnings = []

    base_dir = Path(__file__).parent.parent / "client"

    # 1. 文件存在性检查
    print(f"\n{'='*50}")
    print(f"质检课程: {course_id}")
    print(f"{'='*50}")

    # 检查口播稿件
    script_path = base_dir / f"src/narrations/scripts/{course_id}.ts"
    if not script_path.exists():
        errors.append(f"口播稿件不存在: {script_path}")
    else:
        print(f"✅ 口播稿件存在")

    # 检查场景配置
    scenes_path = base_dir / f"src/components/NarrationPresenter/{course_id.replace('-', '')}Scenes.ts"
    # 尝试多种命名格式
    if not scenes_path.exists():
        scenes_path = base_dir / f"src/components/NarrationPresenter/{course_id}Scenes.ts"
    if not scenes_path.exists():
        errors.append(f"场景配置不存在")
    else:
        print(f"✅ 场景配置存在")

    # 检查音频目录
    audio_dir = base_dir / f"public/audio/narrations/{course_id}"
    yunxi_dir = audio_dir / "yunxi"

    if not audio_dir.exists():
        errors.append(f"音频目录不存在: {audio_dir}")
    else:
        print(f"✅ 音频目录存在")

    if not yunxi_dir.exists():
        errors.append(f"男声音频目录不存在: {yunxi_dir}")
    else:
        print(f"✅ 男声音频目录存在")

    # 2. 音频文件检查
    print(f"\n--- 音频文件检查 ---")

    xiaoxiao_files = list(audio_dir.glob("*.mp3"))
    yunxi_files = list(yunxi_dir.glob("*.mp3")) if yunxi_dir.exists() else []

    print(f"女声音频数量: {len(xiaoxiao_files)}")
    print(f"男声音频数量: {len(yunxi_files)}")

    if len(xiaoxiao_files) != len(yunxi_files):
        errors.append(f"音频数量不一致: 女声 {len(xiaoxiao_files)}, 男声 {len(yunxi_files)}")

    # 检查空文件
    for f in xiaoxiao_files + yunxi_files:
        if f.stat().st_size < 1000:  # 小于 1KB
            errors.append(f"音频文件过小或为空: {f.name} ({f.stat().st_size} bytes)")

    # 3. Manifest 检查
    print(f"\n--- Manifest 检查 ---")

    xiaoxiao_manifest = audio_dir / "manifest.json"
    yunxi_manifest = yunxi_dir / "manifest.json"

    if xiaoxiao_manifest.exists():
        with open(xiaoxiao_manifest) as f:
            data = json.load(f)
            print(f"女声 voice_key: {data.get('voice_key', 'N/A')}")
            print(f"女声总时长: {data.get('total_duration', 0):.1f}秒")
            print(f"女声条目数: {len(data.get('files', []))}")

            if data.get('voice_key') != 'xiaoxiao':
                errors.append(f"女声 manifest voice_key 错误: {data.get('voice_key')}")

            # 检查时长异常
            for item in data.get('files', []):
                if item.get('duration', 0) < 0.5:
                    warnings.append(f"音频时长过短: {item['line_id']} ({item['duration']}秒)")
    else:
        errors.append("女声 manifest.json 不存在")

    if yunxi_manifest.exists():
        with open(yunxi_manifest) as f:
            data = json.load(f)
            print(f"男声 voice_key: {data.get('voice_key', 'N/A')}")
            print(f"男声总时长: {data.get('total_duration', 0):.1f}秒")
            print(f"男声条目数: {len(data.get('files', []))}")

            if data.get('voice_key') != 'yunxi':
                errors.append(f"男声 manifest voice_key 错误: {data.get('voice_key')}")
    else:
        errors.append("男声 manifest.json 不存在")

    # 4. 输出结果
    print(f"\n{'='*50}")
    print(f"质检结果")
    print(f"{'='*50}")

    if errors:
        print(f"\n❌ 错误 ({len(errors)}):")
        for e in errors:
            print(f"  - {e}")

    if warnings:
        print(f"\n⚠️ 警告 ({len(warnings)}):")
        for w in warnings:
            print(f"  - {w}")

    if not errors and not warnings:
        print(f"\n✅ 所有检查通过!")

    return len(errors) == 0

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python scripts/qa_narration.py {course-id}")
        sys.exit(1)

    course_id = sys.argv[1]
    success = check_narration(course_id)
    sys.exit(0 if success else 1)
```

---

## 完整制作流程总结

```
┌─────────────────────────────────────────────────────────────┐
│                    讲解动画制作流程                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 编写口播稿件                                             │
│     └── src/narrations/scripts/{course-id}.ts               │
│                                                             │
│  2. 设计场景配置（每行必须有 lineState.params）               │
│     └── src/components/NarrationPresenter/{id}Scenes.ts     │
│                                                             │
│  3. 创建场景组件                                             │
│     └── src/components/NarrationPresenter/scenes/{Id}/      │
│                                                             │
│  4. 注册到 NarrationPresenter.tsx                           │
│     ├── sceneConfigMap 添加配置                              │
│     └── renderScene 添加 case                               │
│                                                             │
│  5. 生成双声音音频                                           │
│     ├── generate_audio.py {id} --voice xiaoxiao             │
│     └── generate_audio.py {id} --voice yunxi                │
│                                                             │
│  6. 执行质检                                                 │
│     ├── python scripts/qa_narration.py {id}                 │
│     ├── npx tsc --noEmit                                    │
│     └── npm run dev (手动测试)                               │
│                                                             │
│  7. 手动验收                                                 │
│     ├── 播放完整课程                                         │
│     ├── 测试声音切换                                         │
│     ├── 测试进度条跳转                                       │
│     └── 验证动画与口播同步                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 场景类型说明

| 类型 | 说明 | 用途 |
|------|------|------|
| `title` | 标题场景 | 开场、总结 |
| `animation` | 动画演示 | 概念讲解配合动画 |
| `interactive` | 交互场景 | 暂停时可操作 |
| `formula` | 公式展示 | 数学公式讲解 |
| `illustration` | 插图场景 | 静态图片说明 |
| `application` | 应用场景 | 实际应用案例 |
