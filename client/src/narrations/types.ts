/**
 * 口播稿件类型定义
 * 用于数学可视化实验的讲解音频系统
 */

// 难度等级
export type DifficultyLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'expert'

// 段落类型
export type SectionType =
  | 'intro'        // 开场引入
  | 'concept'      // 概念讲解
  | 'formula'      // 公式解读
  | 'animation'    // 动画解说
  | 'interaction'  // 参数互动
  | 'example'      // 举例说明
  | 'application'  // 实际应用
  | 'summary'      // 总结回顾

// 触发类型
export type TriggerType =
  | 'auto'         // 自动播放（进入页面或上一段结束后）
  | 'animation'    // 动画开始时触发
  | 'parameter'    // 参数变化时触发
  | 'manual'       // 手动点击触发

// 语音角色
export type VoiceRole =
  | 'xiaoxiao'     // 晓晓 - 女声，活泼亲切，适合入门级
  | 'yunxi'        // 云希 - 男声，沉稳专业，适合中高级
  | 'yunyang'      // 云扬 - 男声，新闻播报风格，适合专业级

// 动画动作类型
export type AnimationActionType =
  | 'setWaveType'      // 切换波形
  | 'setParams'        // 设置参数
  | 'startAnimation'   // 开始动画
  | 'stopAnimation'    // 停止动画
  | 'highlight'        // 高亮UI元素
  | 'scrollTo'         // 滚动到指定位置
  | 'reset'            // 重置状态

// 动画配置
export interface AnimationConfig {
  action: AnimationActionType
  params?: Record<string, unknown>
  delay?: number
}

// 单条讲解内容
export interface NarrationLine {
  id: string                    // 唯一标识，用于对应音频文件
  text: string                  // 口播文字内容
  duration?: number             // 音频时长（秒），生成后自动填充
  highlight?: string            // 需要高亮的 UI 元素选择器
  formula?: string              // 相关公式（LaTeX 格式）
  pause?: number                // 播放后暂停时间（秒）
  animation?: AnimationConfig   // 动画配置
}

// 讲解段落
export interface NarrationSection {
  id: string                    // 段落 ID
  type: SectionType             // 段落类型
  title: string                 // 段落标题（显示在 UI 上）
  trigger: {
    type: TriggerType           // 触发类型
    condition?: string          // 触发条件（如 "params.terms > 10"）
    delay?: number              // 延迟时间（毫秒）
  }
  lines: NarrationLine[]        // 讲解内容列表
}

// 完整的口播稿件
export interface NarrationScript {
  id: string                    // 实验 ID，如 "fourier"
  title: string                 // 实验标题
  subtitle?: string             // 副标题
  difficulty: DifficultyLevel   // 难度等级
  targetAge: string             // 目标年龄段
  voice: VoiceRole              // 默认语音角色

  // 元信息
  meta: {
    author?: string             // 稿件作者
    version: string             // 版本号
    createdAt: string           // 创建时间
    updatedAt: string           // 更新时间
    totalDuration?: number      // 总时长（秒），生成后自动计算
    audioGenerated?: boolean    // 音频是否已生成
  }

  // 学习目标
  objectives: string[]

  // 前置知识
  prerequisites?: string[]

  // 稿件段落
  sections: NarrationSection[]

  // 延伸阅读/学习建议
  furtherReading?: {
    title: string
    description: string
    link?: string
  }[]
}

// 音频文件信息
export interface AudioFileInfo {
  scriptId: string              // 稿件 ID
  sectionId: string             // 段落 ID
  lineId: string                // 行 ID
  filename: string              // 文件名
  path: string                  // 文件路径
  duration: number              // 时长（秒）
  size: number                  // 文件大小（字节）
  voice: VoiceRole              // 使用的语音
  generatedAt: string           // 生成时间
}

// 播放状态
export interface PlaybackState {
  isPlaying: boolean            // 是否正在播放
  currentSection: string | null // 当前段落 ID
  currentLine: string | null    // 当前行 ID
  progress: number              // 当前行播放进度 (0-1)
  mode: 'auto' | 'manual'       // 播放模式
}

// 播放器配置
export interface PlayerConfig {
  autoPlay: boolean             // 是否自动播放
  playbackRate: number          // 播放速度 (0.5-2.0)
  showSubtitle: boolean         // 是否显示字幕
  highlightUI: boolean          // 是否高亮 UI 元素
}
