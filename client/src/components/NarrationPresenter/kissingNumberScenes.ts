/**
 * 接吻数问题 讲解场景配置
 */
import type { NarrationLineScene, SceneState } from './types'

export const defaultKissingNumberState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const kissingNumberScenes: NarrationLineScene[] = [
  { lineId: 'intro-1', sectionId: 'intro', scene: { id: 'intro-1', type: 'title' }, lineState: { params: { arrId: 'icosahedral', showCaps: false }, annotation: { text: '一个球周围能贴几个？', position: 'top' } } },
  { lineId: 'intro-2', sectionId: 'intro', scene: { id: 'intro-2', type: 'animation' }, lineState: { params: { arrId: 'octahedral', showCaps: false }, annotation: { text: '二维答案是 6，恰好合拢', position: 'bottom' } } },
  { lineId: 'intro-3', sectionId: 'intro', scene: { id: 'intro-3', type: 'animation' }, lineState: { params: { arrId: 'icosahedral', showCaps: false }, annotation: { text: '三维是 12，争论了 250 年', position: 'bottom' } } },
  { lineId: 'cr-1', sectionId: 'criterion', scene: { id: 'cr-1', type: 'animation' }, lineState: { params: { arrId: 'icosahedral', showCaps: false }, annotation: { text: '球心到中心距离都是 2', position: 'top' } } },
  { lineId: 'cr-2', sectionId: 'criterion', scene: { id: 'cr-2', type: 'animation' }, lineState: { params: { arrId: 'cuboctahedral', showCaps: false }, annotation: { text: '互不重叠 ⟺ 夹角 ≥ 60°', position: 'bottom' } } },
  { lineId: 'cr-3', sectionId: 'criterion', scene: { id: 'cr-3', type: 'animation' }, lineState: { params: { arrId: 'cuboctahedral', showCaps: true }, annotation: { text: '球面放点，两两 ≥ 60°', position: 'bottom' } } },
  { lineId: 'dp-1', sectionId: 'dispute', scene: { id: 'dp-1', type: 'animation' }, lineState: { params: { arrId: 'icosahedral', showCaps: true }, annotation: { text: '1694 年的争论', position: 'top' } } },
  { lineId: 'dp-2', sectionId: 'dispute', scene: { id: 'dp-2', type: 'animation' }, lineState: { params: { arrId: 'icosahedral', showCaps: true }, annotation: { text: '角距 63.43°，余量 3.43°', position: 'bottom' } } },
  { lineId: 'dp-3', sectionId: 'dispute', scene: { id: 'dp-3', type: 'animation' }, lineState: { params: { arrId: 'icosahedral', showCaps: true }, annotation: { text: '球冠只盖 80%，剩两成空隙', position: 'bottom' } } },
  { lineId: 'bd-1', sectionId: 'bound', scene: { id: 'bd-1', type: 'animation' }, lineState: { params: { arrId: 'icosahedral', showCaps: true }, annotation: { text: '每球占半角 30° 的球冠', position: 'top' } } },
  { lineId: 'bd-2', sectionId: 'bound', scene: { id: 'bd-2', type: 'animation' }, lineState: { params: { arrId: 'cuboctahedral', showCaps: true }, annotation: { text: '4π / 0.8418 = 14.93', position: 'bottom' } } },
  { lineId: 'bd-3', sectionId: 'bound', scene: { id: 'bd-3', type: 'animation' }, lineState: { params: { arrId: 'icosahedral', showCaps: true }, annotation: { text: '挡得住 15，挡不住 13', position: 'bottom' } } },
  { lineId: 'gp-1', sectionId: 'gap', scene: { id: 'gp-1', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { arrId: 'icosahedral', showCaps: false, showGap: true }, annotation: { text: '搜索最大空位方向', position: 'top' } } },
  { lineId: 'gp-2', sectionId: 'gap', scene: { id: 'gp-2', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { arrId: 'icosahedral', showCaps: false, showGap: true }, annotation: { text: '只有 37°，远不到 60°', position: 'bottom' } } },
  { lineId: 'gp-3', sectionId: 'gap', scene: { id: 'gp-3', type: 'interactive', interactive: { allowParamChange: true } }, lineState: { params: { arrId: 'cuboctahedral', showCaps: false, showGap: true }, annotation: { text: '最密堆积：零余量也塞不下', position: 'bottom' } } },
  { lineId: 'lc-1', sectionId: 'local', scene: { id: 'lc-1', type: 'animation' }, lineState: { params: { arrId: 'octahedral', showCaps: true }, annotation: { text: '六球，角距 90°，看着很松', position: 'top' } } },
  { lineId: 'lc-2', sectionId: 'local', scene: { id: 'lc-2', type: 'animation' }, lineState: { params: { arrId: 'octahedral', showCaps: false, showGap: true }, annotation: { text: '最大空位 54.74° < 60°', position: 'bottom' } } },
  { lineId: 'lc-3', sectionId: 'local', scene: { id: 'lc-3', type: 'animation' }, lineState: { params: { arrId: 'icosahedral', showCaps: true }, annotation: { text: '要达 12 必须整体换摆法', position: 'bottom' } } },
  { lineId: 'sum-1', sectionId: 'summary', scene: { id: 'sum-1', type: 'summary' }, lineState: { annotation: { text: '两两夹角 ≥ 60°，答案是 12', position: 'top' } } },
  { lineId: 'sum-2', sectionId: 'summary', scene: { id: 'sum-2', type: 'summary' }, lineState: { annotation: { text: '球冠只盖 80%，空隙凑不齐', position: 'bottom' } } },
  { lineId: 'sum-3', sectionId: 'summary', scene: { id: 'sum-3', type: 'title' }, lineState: { annotation: { text: '继续探索数学之美！', position: 'bottom' } } },
]
