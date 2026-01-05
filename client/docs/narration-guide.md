# 数学之美 - 讲解系统制作规范

## 一、系统架构概述

### 1.1 核心组件

```
讲解系统
├── NarrationContext          # 全局状态管理
├── NarrationPresenter        # 全屏 PPT 演示器
│   ├── scenes/               # 场景组件
│   │   ├── TitleScene        # 标题场景
│   │   ├── WaveformScene     # 波形/动画场景
│   │   ├── SpectrumScene     # 频谱场景
│   │   ├── FormulaScene      # 公式场景
│   │   ├── ComparisonScene   # 对比场景
│   │   └── ApplicationScene  # 应用场景
│   ├── types.ts              # 类型定义
│   └── [experiment]Scenes.ts # 实验场景配置
├── narrations/               # 讲解稿件
│   ├── types.ts              # 稿件类型定义
│   └── scripts/              # 各实验稿件
└── public/audio/narrations/  # 音频文件
```

### 1.2 工作流程

```
1. 编写讲解稿件 (scripts/[experiment].ts)
     ↓
2. 导出 JSON 格式 (pnpm run export-narrations)
     ↓
3. 生成语音音频 (pnpm run generate-audio)
     ↓
4. 创建场景配置 ([experiment]Scenes.ts)
     ↓
5. 创建/复用场景组件 (scenes/*.tsx)
     ↓
6. 集成到实验页面
     ↓
7. 质检测试
     ↓
8. 部署上线
```

---

## 二、讲解稿件编写规范

### 2.1 稿件结构

```typescript
// src/narrations/scripts/[experiment].ts

import type { NarrationScript } from '../types'

export const [experiment]Narration: NarrationScript = {
  id: '[experiment]',           // 唯一标识，用于音频路径
  title: '实验标题',
  sections: [
    {
      id: 'intro',              // 段落 ID
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',        // 行 ID，格式：段落ID-序号
          text: '讲解文本内容',
          animation: {          // 可选：动画配置
            action: 'reset',
            params: {},
            delay: 0
          }
        }
      ]
    }
  ]
}
```

### 2.2 段落结构规范

每个实验的讲解应包含以下标准段落：

| 段落 ID | 段落名称 | 内容要求 | 建议行数 |
|---------|----------|----------|----------|
| `intro` | 开场引入 | 欢迎语、实验简介、学习目标 | 3-5 行 |
| `concept` | 核心概念 | 数学原理、核心思想解释 | 3-5 行 |
| `formula` | 公式解读 | 数学公式、符号含义 | 3-4 行 |
| `parameters` | 参数说明 | 各参数的作用和影响 | 3-5 行 |
| `animation` | 动画演示 | 引导用户观察动画效果 | 4-6 行 |
| `application` | 实际应用 | 现实世界的应用场景 | 4-5 行 |
| `summary` | 总结回顾 | 知识点总结、鼓励探索 | 4-6 行 |

### 2.3 文本编写要求

1. **语言风格**
   - 使用口语化表达，避免书面语
   - 语气亲切自然，像老师在讲课
   - 适当使用"我们"、"你"等代词增加互动感

2. **句子长度**
   - 每句话控制在 15-40 字
   - 避免过长的复杂句
   - 一个概念一句话

3. **专业术语**
   - 首次出现时给出解释
   - 中英文术语并用（如：傅里叶变换 Fourier Transform）

4. **节奏控制**
   - 重要概念后适当停顿（通过分句实现）
   - 动画演示时给用户观察时间

### 2.4 动画配置

```typescript
animation: {
  action: 'setWaveType' | 'setParams' | 'startAnimation' |
          'stopAnimation' | 'highlight' | 'scrollTo' | 'reset',
  params: {
    waveType?: 'sine' | 'square' | 'sawtooth' | 'triangle',
    terms?: number,
    frequency?: number,
    amplitude?: number,
    selector?: string,  // CSS 选择器，用于 highlight/scrollTo
  },
  delay?: number  // 延迟执行（毫秒）
}
```

---

## 三、场景配置规范

### 3.1 场景类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `title` | 标题场景 | 开场、章节标题 |
| `waveform` | 波形显示 | 展示时域信号 |
| `spectrum` | 频谱显示 | 展示频域信息 |
| `formula` | 公式展示 | 数学公式讲解 |
| `comparison` | 对比展示 | 并排对比两种视图 |
| `animation` | 动画场景 | 自动播放动画 |
| `interactive` | 交互场景 | 允许用户操作 |
| `application` | 应用场景 | 展示实际应用 |
| `illustration` | 插图场景 | 形象化示例图片 |
| `text` | 纯文本 | 概念解释 |
| `summary` | 总结场景 | 知识点回顾 |

### 3.2 场景配置文件

```typescript
// src/components/NarrationPresenter/[experiment]Scenes.ts

import type { NarrationLineScene, SceneState } from './types'

// 默认状态
export const default[Experiment]State: SceneState = {
  waveType: 'square',
  frequency: 2,
  amplitude: 1,
  terms: 5,
  isAnimating: false,
  highlightedElements: [],
}

// 场景配置
export const [experiment]Scenes: NarrationLineScene[] = [
  {
    lineId: 'intro-1',      // 对应稿件中的行 ID
    sectionId: 'intro',     // 对应稿件中的段落 ID
    scene: {
      id: 'title-intro',
      type: 'title',
      initialState: { /* 可选：覆盖默认状态 */ },
      animation: { /* 可选：自动动画配置 */ },
      interactive: { /* 可选：交互配置 */ },
    },
  },
  // ... 更多场景
]
```

### 3.3 交互配置

```typescript
interactive: {
  allowWaveTypeChange: boolean,  // 允许切换波形
  allowParamChange: boolean,     // 允许调整参数
  allowAnimation: boolean,       // 允许播放动画
}
```

### 3.4 插图场景配置

插图场景用于展示形象化的示例图片，帮助用户更直观地理解抽象概念。

```typescript
// 场景配置
{
  lineId: 'concept-2',
  sectionId: 'concept',
  scene: {
    id: 'illustration-sound-wave',
    type: 'illustration',
    illustration: {
      src: '/images/narrations/fourier/sound-wave.svg',  // 图片路径
      alt: '声波的传播示意图',                            // 无障碍描述
      caption: '声音是空气分子的振动',                    // 图片说明
      style: 'centered',  // 'centered' | 'full' | 'side-by-side'
    },
  },
}
```

#### 插图使用场景

| 场景 | 示例 | 说明 |
|------|------|------|
| 现实类比 | 水波纹、弹簧振动 | 用生活中的例子解释抽象概念 |
| 历史人物 | 傅里叶、牛顿肖像 | 介绍数学家时展示 |
| 应用场景 | MRI 机器、音乐均衡器 | 展示实际应用 |
| 概念图解 | 时域→频域转换示意 | 图解抽象过程 |
| 趣味元素 | 卡通角色、表情包 | 增加趣味性（入门级适用） |

#### 插图制作要求

1. **格式要求**
   - 优先使用 SVG（矢量图，缩放不失真）
   - 照片类使用 WebP 或 PNG
   - 尺寸：建议 800x600 或 1200x800

2. **风格要求**
   - 简洁清晰，避免过于复杂
   - 配色与整体 UI 协调（使用 Tailwind 调色板）
   - 入门级可使用卡通风格，高级保持专业

3. **文件组织**
   ```
   public/images/narrations/
   └── [experiment]/
       ├── concept-wave.svg
       ├── application-mri.webp
       └── illustration-spring.svg
   ```

4. **来源要求**
   - 自制插图（推荐）
   - 开源素材（需注明来源）
   - AI 生成（标注 AI Generated）
   - 禁止使用有版权争议的图片

---

## 四、音频生成规范

### 4.1 目录结构

```
public/audio/narrations/
└── [experiment]/
    ├── manifest.json           # 音频清单
    ├── [section]-[line].mp3    # 云希（男声）音频
    └── xiaoxiao/
        ├── manifest.json
        └── [section]-[line].mp3  # 晓晓（女声）音频
```

### 4.2 生成命令

```bash
# 导出稿件为 JSON
pnpm run export-narrations

# 生成云希（男声）音频
pnpm run generate-audio -- --script [experiment]

# 生成晓晓（女声）音频
pnpm run generate-audio -- --script [experiment] --voice xiaoxiao
```

### 4.3 音频要求

- 格式：MP3
- 采样率：24000 Hz
- 语速：适中（可通过 TTS 参数调整）
- 音量：标准化，避免忽大忽小

---

## 五、集成到实验页面

### 5.1 页面修改清单

```typescript
// src/experiments/[experiment]/[Experiment]Experiment.tsx

// 1. 导入组件
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { [experiment]Narration } from '../../narrations/scripts/[experiment]'

// 2. 添加状态
const [showPresenter, setShowPresenter] = useState(false)
const narration = useNarrationOptional()

// 3. 加载稿件
useEffect(() => {
  if (narration) {
    narration.loadScript([experiment]Narration)
  }
}, [narration])

// 4. 开始讲解
const handleStartNarration = useCallback(() => {
  if (narration) {
    narration.startNarration()
    narration.setPresenterMode(true)
    setShowPresenter(true)
  }
}, [narration])

// 5. 退出讲解
const handleExitPresenter = useCallback(() => {
  if (narration) {
    narration.setPresenterMode(false)
  }
  setShowPresenter(false)
}, [narration])

// 6. 渲染演示器
return (
  <>
    {showPresenter && (
      <NarrationPresenter onExit={handleExitPresenter} />
    )}
    {/* 原有页面内容 */}
    <button onClick={handleStartNarration}>开始讲解</button>
  </>
)
```

### 5.2 NarrationPresenter 修改

如果实验需要特殊场景组件，需要：

1. 在 `NarrationPresenter.tsx` 中导入场景配置
2. 在 `renderScene()` 中添加场景类型处理
3. 创建新的场景组件（如需要）

---

## 六、质检规范

### 6.1 稿件质检

| 检查项 | 标准 | 检查方法 |
|--------|------|----------|
| ID 唯一性 | 所有 lineId 不重复 | 代码检查 |
| ID 格式 | 符合 `段落ID-序号` 格式 | 代码检查 |
| 文本长度 | 每句 15-40 字 | 字数统计 |
| 段落完整 | 包含所有标准段落 | 人工检查 |
| 语言流畅 | 口语化、无错别字 | 人工审核 |
| 动画配置 | action 类型正确 | TypeScript 编译 |

### 6.2 场景质检

| 检查项 | 标准 | 检查方法 |
|--------|------|----------|
| 场景覆盖 | 每行都有对应场景 | 代码检查 |
| ID 匹配 | lineId/sectionId 与稿件一致 | 代码检查 |
| 类型正确 | scene.type 有效 | TypeScript 编译 |
| 初始状态 | initialState 参数合理 | 人工检查 |
| 交互配置 | 适当的行启用交互 | 人工检查 |

### 6.3 音频质检

| 检查项 | 标准 | 检查方法 |
|--------|------|----------|
| 文件完整 | 每行都有对应音频 | manifest.json 检查 |
| 双语音 | yunxi 和 xiaoxiao 都有 | 目录检查 |
| 音质正常 | 无杂音、无截断 | 人工试听 |
| 时长合理 | 与文本长度匹配 | manifest.json 检查 |

### 6.4 功能质检

| 检查项 | 标准 | 检查方法 |
|--------|------|----------|
| 播放正常 | 点击播放能正常播放 | 手动测试 |
| 字幕同步 | 字幕与音频同步 | 手动测试 |
| 场景切换 | 场景随讲解切换 | 手动测试 |
| 语音切换 | 男女声切换正常 | 手动测试 |
| 速度调节 | 播放速度可调 | 手动测试 |
| 上下句 | 上一句/下一句正常 | 手动测试 |
| 暂停交互 | 暂停时可交互 | 手动测试 |
| 退出正常 | 退出后状态重置 | 手动测试 |

### 6.5 质检清单模板

```markdown
## [实验名称] 讲解质检报告

### 基本信息
- 实验 ID:
- 稿件行数:
- 音频总时长:
- 质检日期:
- 质检人:

### 稿件检查
- [ ] ID 唯一性通过
- [ ] ID 格式正确
- [ ] 文本长度合理
- [ ] 段落结构完整
- [ ] 语言表达流畅
- [ ] 动画配置正确

### 场景检查
- [ ] 场景覆盖完整
- [ ] ID 匹配正确
- [ ] 类型配置正确
- [ ] 初始状态合理
- [ ] 交互配置适当

### 音频检查
- [ ] 云希音频完整
- [ ] 晓晓音频完整
- [ ] 音质正常
- [ ] 时长合理

### 功能测试
- [ ] 播放功能正常
- [ ] 字幕同步正确
- [ ] 场景切换正常
- [ ] 语音切换正常
- [ ] 速度调节正常
- [ ] 导航功能正常
- [ ] 暂停交互正常
- [ ] 退出功能正常

### 问题记录
| 问题描述 | 严重程度 | 状态 |
|----------|----------|------|
| | | |

### 结论
- [ ] 通过
- [ ] 需修改后复检
```

---

## 七、现有实验清单

| 实验 | 路径 | 讲解状态 | 备注 |
|------|------|----------|------|
| 傅里叶变换 | /fourier | ✅ 已完成 | 参考实现 |
| 微积分可视化 | /calculus | ⏳ 待制作 | |
| 几何图形 | /geometry | ⏳ 待制作 | |
| 概率分布 | /probability | ⏳ 待制作 | |
| 线性代数 | /linear-algebra | ⏳ 待制作 | |
| 复数可视化 | /complex | ⏳ 待制作 | |

---

## 八、快速开始模板

### 8.1 创建新实验讲解

```bash
# 1. 复制模板
cp src/narrations/scripts/fourier.ts src/narrations/scripts/[experiment].ts
cp src/components/NarrationPresenter/fourierScenes.ts src/components/NarrationPresenter/[experiment]Scenes.ts

# 2. 修改稿件内容
# 编辑 src/narrations/scripts/[experiment].ts

# 3. 修改场景配置
# 编辑 src/components/NarrationPresenter/[experiment]Scenes.ts

# 4. 导出并生成音频
pnpm run export-narrations
pnpm run generate-audio -- --script [experiment]
pnpm run generate-audio -- --script [experiment] --voice xiaoxiao

# 5. 集成到页面
# 修改 src/experiments/[experiment]/[Experiment]Experiment.tsx

# 6. 测试
pnpm run dev

# 7. 构建部署
pnpm run build
rsync -avz --delete dist/ us-lax02:/var/www/mathviz/
```

---

## 九、常见问题

### Q1: 音频生成失败
- 检查 Azure TTS API 配置
- 检查网络连接
- 查看 scripts/generate_audio.py 日志

### Q2: 场景不切换
- 检查 lineId/sectionId 是否与稿件匹配
- 检查 NarrationPresenter 是否导入了场景配置

### Q3: 字幕不同步
- 检查音频文件是否完整
- 检查 manifest.json 中的 duration 是否正确

### Q4: 交互不生效
- 确认 scene.interactive 配置正确
- 确认播放已暂停（交互仅在暂停时生效）

---

## 十、版本历史

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| 1.0 | 2026-01-03 | 初始版本，基于傅里叶变换实验 |
