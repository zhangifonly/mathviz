/**
 * 反应扩散讲解场景配置
 * 每句口播对应精确的动画状态（preset 选择图案类型）
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultReactionDiffusionState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const reactionDiffusionScenes: NarrationLineScene[] = [
  // ===== intro (4) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '动物花纹之谜', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-turing', type: 'title' }, lineState: { annotation: { text: '图灵 1952', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-selforg', type: 'animation' }, lineState: { params: { preset: 'coral' }, annotation: { text: '扩散 + 反应 → 自组织', position: 'top' } } },
  { lineId: 'intro-4', sectionId: 'intro', scene: { id: 'intro-grow', type: 'animation' }, lineState: { params: { preset: 'coral' }, annotation: { text: 'Gray-Scott 模型', position: 'bottom' } } },

  // ===== model (4) =====
  { lineId: 'model-1', sectionId: 'model', scene: { id: 'model-diffuse', type: 'formula' }, lineState: { annotation: { text: '两种化学物扩散', position: 'top' } } },
  { lineId: 'model-2', sectionId: 'model', scene: { id: 'model-react', type: 'formula' }, lineState: { annotation: { text: 'U + 2V → 3V', position: 'bottom' } } },
  { lineId: 'model-3', sectionId: 'model', scene: { id: 'model-feedkill', type: 'formula' }, lineState: { annotation: { text: 'feed 补给 · kill 移除', position: 'bottom' } } },
  { lineId: 'model-4', sectionId: 'model', scene: { id: 'model-eqs', type: 'formula' }, lineState: { annotation: { text: '两个偏微分方程', position: 'top' } } },

  // ===== patterns (4) =====
  { lineId: 'pat-1', sectionId: 'patterns', scene: { id: 'pat-spread', type: 'animation' }, lineState: { params: { preset: 'coral' }, annotation: { text: '扰动向外蔓延', position: 'top' } } },
  { lineId: 'pat-2', sectionId: 'patterns', scene: { id: 'pat-coral', type: 'animation' }, lineState: { params: { preset: 'coral' }, annotation: { text: '珊瑚状枝结构', position: 'bottom' } } },
  { lineId: 'pat-3', sectionId: 'patterns', scene: { id: 'pat-tune', type: 'animation' }, lineState: { params: { preset: 'spots' }, annotation: { text: '微调 f/k → 新图案', position: 'top' } } },
  { lineId: 'pat-4', sectionId: 'patterns', scene: { id: 'pat-variety', type: 'animation' }, lineState: { params: { preset: 'stripes' }, annotation: { text: '斑点·条纹·迷宫', position: 'bottom' } } },

  // ===== interaction (3) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-switch', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { preset: 'maze' }, annotation: { text: '切换图案类型', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-regrow', type: 'interactive', interactive: { allowAnimation: true } }, lineState: { params: { preset: 'bubbles' }, annotation: { text: '重新生长', position: 'bottom' } } },
  { lineId: 'int-3', sectionId: 'interaction', scene: { id: 'int-unique', type: 'animation' }, lineState: { params: { preset: 'spots' }, annotation: { text: '没有两只相同的斑马', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-order', type: 'summary' }, lineState: { annotation: { text: '扩散+反应 → 秩序', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-turing', type: 'summary' }, lineState: { annotation: { text: '跨数学·化学·生物', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
