/**
 * 欧拉与哈密顿回路讲解场景配置
 * 每句口播对应图形下标 params.gi 与一笔画进度 params.progress
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultEulerHamiltonPathState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const eulerHamiltonPathScenes: NarrationLineScene[] = [
  // ===== intro (3) =====
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-welcome', type: 'title' }, lineState: { annotation: { text: '柯尼斯堡七桥', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-q', type: 'animation' }, lineState: { params: { gi: 0, progress: 0 }, annotation: { text: '走过每座桥一次？', position: 'top' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-graph', type: 'animation' }, lineState: { params: { gi: 0, progress: 0 }, annotation: { text: '陆地是点，桥是线', position: 'bottom' } } },

  // ===== euler (3) =====
  { lineId: 'def-1', sectionId: 'euler', scene: { id: 'def-degree', type: 'animation' }, lineState: { params: { gi: 2, progress: 0 }, annotation: { text: '度数=连出的边数', position: 'top' } } },
  { lineId: 'def-2', sectionId: 'euler', scene: { id: 'def-inout', type: 'animation' }, lineState: { params: { gi: 2, progress: 0.5 }, annotation: { text: '有进必有出', position: 'bottom' } } },
  { lineId: 'def-3', sectionId: 'euler', scene: { id: 'def-even', type: 'animation' }, lineState: { params: { gi: 2, progress: 1 }, annotation: { text: '全偶度=欧拉回路', position: 'bottom' } } },

  // ===== condition (3) =====
  { lineId: 'cond-1', sectionId: 'condition', scene: { id: 'cond-two', type: 'animation' }, lineState: { params: { gi: 1, progress: 0.4 }, annotation: { text: '两奇度=欧拉路径', position: 'top' } } },
  { lineId: 'cond-2', sectionId: 'condition', scene: { id: 'cond-bridges', type: 'animation' }, lineState: { params: { gi: 0, progress: 0 }, annotation: { text: '七桥四奇度，无解', position: 'bottom' } } },
  { lineId: 'cond-3', sectionId: 'condition', scene: { id: 'cond-hierholzer', type: 'animation' }, lineState: { params: { gi: 1, progress: 1 }, annotation: { text: 'Hierholzer 构造', position: 'bottom' } } },

  // ===== hamilton (3) =====
  { lineId: 'ham-1', sectionId: 'hamilton', scene: { id: 'ham-vertex', type: 'animation' }, lineState: { params: { gi: 2, progress: 0 }, annotation: { text: '走遍每个顶点一次', position: 'top' } } },
  { lineId: 'ham-2', sectionId: 'hamilton', scene: { id: 'ham-hard', type: 'animation' }, lineState: { params: { gi: 1, progress: 0 }, annotation: { text: '看似相似却更难', position: 'bottom' } } },
  { lineId: 'ham-3', sectionId: 'hamilton', scene: { id: 'ham-nphard', type: 'animation' }, lineState: { params: { gi: 1, progress: 0 }, annotation: { text: '暴力搜索小图', position: 'bottom' } } },

  // ===== interaction (2) =====
  { lineId: 'int-1', sectionId: 'interaction', scene: { id: 'int-pick', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { gi: 1, progress: 0 }, annotation: { text: '选图判类型', position: 'top' } } },
  { lineId: 'int-2', sectionId: 'interaction', scene: { id: 'int-trace', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { gi: 1, progress: 1 }, annotation: { text: '逐边点亮路线', position: 'bottom' } } },

  // ===== summary (3) =====
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-euler', type: 'summary' }, lineState: { annotation: { text: '全偶回路·两奇路径', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-hamilton', type: 'summary' }, lineState: { annotation: { text: '哈密顿难题', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-end', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
