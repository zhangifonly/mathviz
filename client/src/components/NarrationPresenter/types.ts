/**
 * 讲解演示器类型定义
 *
 * 每个讲解行对应一个场景，场景包含可视化内容和交互能力
 */

import type { ReactNode } from 'react'

// 场景类型
export type SceneType =
  | 'title'           // 标题场景
  | 'text'            // 纯文字说明
  | 'waveform'        // 波形图展示
  | 'spectrum'        // 频谱图展示
  | 'formula'         // 公式展示
  | 'comparison'      // 对比展示（如时域vs频域）
  | 'animation'       // 动画演示
  | 'interactive'     // 可交互场景
  | 'application'     // 应用场景（图片+文字）
  | 'illustration'    // 插图场景（形象化示例图片）
  | 'summary'         // 总结场景

// 插图配置
export interface IllustrationConfig {
  src: string                    // 图片路径
  alt: string                    // 无障碍描述
  caption?: string               // 图片说明
  style?: 'centered' | 'full' | 'side-by-side'  // 展示样式
  secondarySrc?: string          // 第二张图片（用于 side-by-side 模式）
  secondaryAlt?: string          // 第二张图片描述
  secondaryCaption?: string      // 第二张图片说明
}

// 波形类型
export type WaveType = 'sine' | 'square' | 'sawtooth' | 'triangle'

// 场景状态（可被用户交互修改）
export interface SceneState {
  waveType: WaveType
  frequency: number
  amplitude: number
  terms: number
  isAnimating: boolean
  highlightedElements: string[]
}

// 场景配置
export interface SceneConfig {
  id: string
  type: SceneType
  // 初始状态
  initialState?: Partial<SceneState>
  // 动画配置
  animation?: {
    autoPlay?: boolean        // 是否自动播放动画
    duration?: number         // 动画时长
    onComplete?: () => void   // 动画完成回调
  }
  // 可交互配置
  interactive?: {
    allowWaveTypeChange?: boolean
    allowParamChange?: boolean
    allowAnimation?: boolean
  }
  // 插图配置（用于 illustration 类型）
  illustration?: IllustrationConfig
  // 自定义渲染
  customRender?: (state: SceneState, setState: (s: Partial<SceneState>) => void) => ReactNode
}

/**
 * 逐句动画状态配置 - Khan Academy 风格
 * 每一行口播对应一个精确的动画状态
 */
export interface LineAnimationState {
  // 显示哪些元素
  show?: {
    group1?: boolean | number    // 显示第一组方块（true=全部，数字=显示几个）
    group2?: boolean | number    // 显示第二组方块
    result?: boolean             // 显示结果
    formula?: boolean            // 显示公式
    numberLine?: boolean         // 显示数轴
    arrow?: boolean              // 显示箭头动画
  }
  // 高亮哪些元素
  highlight?: string[]           // 高亮的元素 ID 列表
  // 动画效果
  animate?: {
    type: 'fadeIn' | 'slideIn' | 'merge' | 'remove' | 'split' | 'count'
    target?: string              // 动画目标
    duration?: number            // 动画时长 ms
  }
  // 数值参数（覆盖默认值）
  params?: {
    num1?: number
    num2?: number
    operation?: 'addition' | 'subtraction' | 'multiplication' | 'division'
  }
  // 文字标注
  annotation?: {
    text: string
    position: 'top' | 'bottom' | 'left' | 'right'
    target?: string
  }
}

// 讲解行与场景的映射
export interface NarrationLineScene {
  lineId: string              // 对应的讲解行 ID
  sectionId: string           // 对应的段落 ID
  scene: SceneConfig          // 场景配置
  // 逐句动画状态 - Khan Academy 风格
  lineState?: LineAnimationState
}

// 演示器状态
export interface PresenterState {
  isActive: boolean           // 是否激活演示模式
  isPaused: boolean           // 是否暂停
  currentSceneIndex: number   // 当前场景索引
  sceneState: SceneState      // 当前场景状态
}

// 演示器配置
export interface PresenterConfig {
  scenes: NarrationLineScene[]
  defaultState: SceneState
}
