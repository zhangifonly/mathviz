/**
 * 四面体体积与三重积 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultTetrahedronVolumeState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const tetrahedronVolumeScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { presetId: 'unit' }, annotation: { text: '二阶行列式 = 平行四边形面积', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { presetId: 'unit', showBox: true }, annotation: { text: '三阶行列式 = 六面体体积', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { presetId: 'skew', showBox: true }, annotation: { text: '红绿蓝三棱 = 行列式三列', position: 'bottom' } } },
  { lineId: 'sx-1', sectionId: 'sixth', scene: { id: 'sx-1', type: 'animation' }, lineState: { params: { presetId: 'unit', showBox: true }, annotation: { text: '四面体 = |det| / 6', position: 'top' } } },
  { lineId: 'sx-2', sectionId: 'sixth', scene: { id: 'sx-2', type: 'animation' }, lineState: { params: { presetId: 'unit', showSix: true }, annotation: { text: '六面体切成 6 个四面体', position: 'bottom' } } },
  { lineId: 'sx-3', sectionId: 'sixth', scene: { id: 'sx-3', type: 'animation' }, lineState: { params: { presetId: 'skew', showSix: true }, annotation: { text: '拼起来正好填满', position: 'bottom' } } },
  { lineId: 'fc-1', sectionId: 'factorial', scene: { id: 'fc-1', type: 'animation' }, lineState: { params: { presetId: 'unit', showBox: true }, annotation: { text: 'n 维单纯形除 n!', position: 'top' } } },
  { lineId: 'fc-2', sectionId: 'factorial', scene: { id: 'fc-2', type: 'animation' }, lineState: { params: { presetId: 'unit', showSix: true }, annotation: { text: '二维除 2, 三维除 6', position: 'bottom' } } },
  { lineId: 'fc-3', sectionId: 'factorial', scene: { id: 'fc-3', type: 'animation' }, lineState: { params: { presetId: 'skew', showBox: true }, annotation: { text: '四维除 24, 五维除 120', position: 'bottom' } } },
  { lineId: 'sn-1', sectionId: 'sign', scene: { id: 'sn-1', type: 'animation' }, lineState: { params: { presetId: 'unit', showBox: true }, annotation: { text: '符号编码定向', position: 'top' } } },
  { lineId: 'sn-2', sectionId: 'sign', scene: { id: 'sn-2', type: 'animation' }, lineState: { params: { presetId: 'negative', showBox: true }, annotation: { text: '交换两棱: 带符号体积变负', position: 'bottom' } } },
  { lineId: 'sn-3', sectionId: 'sign', scene: { id: 'sn-3', type: 'animation' }, lineState: { params: { presetId: 'negative', showBox: true }, annotation: { text: '绝对值完全不变', position: 'bottom' } } },
  { lineId: 'cp-1', sectionId: 'coplanar', scene: { id: 'cp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'flat', showBox: true }, annotation: { text: '三棱共面则压成平板', position: 'top' } } },
  { lineId: 'cp-2', sectionId: 'coplanar', scene: { id: 'cp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'coplanar', showBox: true }, annotation: { text: '体积变为零', position: 'bottom' } } },
  { lineId: 'cp-3', sectionId: 'coplanar', scene: { id: 'cp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { presetId: 'skew', showBox: true }, annotation: { text: '两种算法残差为零', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '六面体体积 = |det|', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '四面体是它的 1/6 = 1/3!', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
