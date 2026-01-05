/**
 * 极坐标图形讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultPolarState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const polarScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { polar: false, grid: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-polar', type: 'animation' },
    lineState: {
      show: { polar: true, grid: true },
      annotation: { text: '极坐标：距离+角度', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-curves', type: 'animation' },
    lineState: {
      params: { curveType: 'rose', n: 3 },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: '美丽的极坐标曲线', position: 'bottom' },
    },
  },

  // ========== polar-system 段落 (4行) ==========
  {
    lineId: 'polar-system-1',
    sectionId: 'polar-system',
    scene: { id: 'ps-coord', type: 'animation' },
    lineState: {
      params: { r: 2, theta: 45 },
      show: { polar: true, grid: true, point: true },
      annotation: { text: '(r, θ) 表示点', position: 'top' },
    },
  },
  {
    lineId: 'polar-system-2',
    sectionId: 'polar-system',
    scene: { id: 'ps-convert', type: 'formula' },
    lineState: {
      show: { polar: true, formula: true },
      annotation: { text: 'x=rcosθ, y=rsinθ', position: 'bottom' },
    },
  },
  {
    lineId: 'polar-system-3',
    sectionId: 'polar-system',
    scene: { id: 'ps-radius', type: 'animation' },
    lineState: {
      params: { r: 3, theta: 60 },
      show: { polar: true, grid: true, point: true, radius: true },
      highlight: ['radius'],
      annotation: { text: 'r=到原点距离', position: 'bottom' },
    },
  },
  {
    lineId: 'polar-system-4',
    sectionId: 'polar-system',
    scene: { id: 'ps-draw', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { r: 2, theta: 45 },
      show: { polar: true, grid: true, point: true },
      annotation: { text: '调整r和θ画点', position: 'bottom' },
    },
  },

  // ========== rose 段落 (4行) ==========
  {
    lineId: 'rose-1',
    sectionId: 'rose',
    scene: { id: 'rose-formula', type: 'formula' },
    lineState: {
      params: { curveType: 'rose', n: 3 },
      show: { polar: true, curve: true, formula: true },
      annotation: { text: 'r = a·cos(nθ)', position: 'top' },
    },
  },
  {
    lineId: 'rose-2',
    sectionId: 'rose',
    scene: { id: 'rose-petals', type: 'animation' },
    lineState: {
      params: { curveType: 'rose', n: 5 },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: 'n决定花瓣数', position: 'bottom' },
    },
  },
  {
    lineId: 'rose-3',
    sectionId: 'rose',
    scene: { id: 'rose-size', type: 'animation' },
    lineState: {
      params: { curveType: 'rose', n: 3, a: 2 },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: 'a决定大小', position: 'bottom' },
    },
  },
  {
    lineId: 'rose-4',
    sectionId: 'rose',
    scene: { id: 'rose-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { curveType: 'rose', n: 3 },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: '调整n观察变化', position: 'bottom' },
    },
  },

  // ========== cardioid 段落 (3行) ==========
  {
    lineId: 'cardioid-1',
    sectionId: 'cardioid',
    scene: { id: 'card-formula', type: 'formula' },
    lineState: {
      params: { curveType: 'cardioid' },
      show: { polar: true, curve: true, formula: true },
      annotation: { text: 'r = a(1+cosθ)', position: 'top' },
    },
  },
  {
    lineId: 'cardioid-2',
    sectionId: 'cardioid',
    scene: { id: 'card-special', type: 'animation' },
    lineState: {
      params: { curveType: 'cardioid' },
      show: { polar: true, grid: true, curve: true },
      highlight: ['curve'],
      annotation: { text: '心形线', position: 'bottom' },
    },
  },
  {
    lineId: 'cardioid-3',
    sectionId: 'cardioid',
    scene: { id: 'card-app', type: 'application' },
    lineState: {
      params: { curveType: 'cardioid' },
      show: { polar: true, curve: true },
      annotation: { text: '麦克风指向性', position: 'bottom' },
    },
  },

  // ========== spiral 段落 (4行) ==========
  {
    lineId: 'spiral-1',
    sectionId: 'spiral',
    scene: { id: 'spiral-formula', type: 'formula' },
    lineState: {
      params: { curveType: 'spiral' },
      show: { polar: true, curve: true, formula: true },
      annotation: { text: 'r = aθ', position: 'top' },
    },
  },
  {
    lineId: 'spiral-2',
    sectionId: 'spiral',
    scene: { id: 'spiral-grow', type: 'animation' },
    lineState: {
      params: { curveType: 'spiral', isAnimating: true },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: '等距螺旋', position: 'bottom' },
    },
  },
  {
    lineId: 'spiral-3',
    sectionId: 'spiral',
    scene: { id: 'spiral-nature', type: 'application' },
    lineState: {
      params: { curveType: 'spiral' },
      show: { polar: true, curve: true },
      annotation: { text: '蜗牛壳、唱片', position: 'bottom' },
    },
  },
  {
    lineId: 'spiral-4',
    sectionId: 'spiral',
    scene: { id: 'spiral-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { curveType: 'spiral' },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: '调整参数', position: 'bottom' },
    },
  },

  // ========== lemniscate 段落 (3行) ==========
  {
    lineId: 'lemniscate-1',
    sectionId: 'lemniscate',
    scene: { id: 'lem-formula', type: 'formula' },
    lineState: {
      params: { curveType: 'lemniscate' },
      show: { polar: true, curve: true, formula: true },
      annotation: { text: 'r² = a²cos(2θ)', position: 'top' },
    },
  },
  {
    lineId: 'lemniscate-2',
    sectionId: 'lemniscate',
    scene: { id: 'lem-shape', type: 'animation' },
    lineState: {
      params: { curveType: 'lemniscate' },
      show: { polar: true, grid: true, curve: true },
      highlight: ['curve'],
      annotation: { text: '∞形状', position: 'bottom' },
    },
  },
  {
    lineId: 'lemniscate-3',
    sectionId: 'lemniscate',
    scene: { id: 'lem-history', type: 'animation' },
    lineState: {
      params: { curveType: 'lemniscate' },
      show: { polar: true, curve: true },
      annotation: { text: '伯努利双纽线', position: 'bottom' },
    },
  },

  // ========== limacon 段落 (4行) ==========
  {
    lineId: 'limacon-1',
    sectionId: 'limacon',
    scene: { id: 'lima-formula', type: 'formula' },
    lineState: {
      params: { curveType: 'limacon', a: 1, b: 2 },
      show: { polar: true, curve: true, formula: true },
      annotation: { text: 'r = a + b·cosθ', position: 'top' },
    },
  },
  {
    lineId: 'limacon-2',
    sectionId: 'limacon',
    scene: { id: 'lima-types', type: 'animation' },
    lineState: {
      params: { curveType: 'limacon', a: 1, b: 2 },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: 'a<b有内环', position: 'bottom' },
    },
  },
  {
    lineId: 'limacon-3',
    sectionId: 'limacon',
    scene: { id: 'lima-inner', type: 'animation' },
    lineState: {
      params: { curveType: 'limacon', a: 2, b: 1 },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: 'a>b无内环', position: 'bottom' },
    },
  },
  {
    lineId: 'limacon-4',
    sectionId: 'limacon',
    scene: { id: 'lima-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { curveType: 'limacon', a: 1, b: 2 },
      show: { polar: true, grid: true, curve: true },
      annotation: { text: '调整a和b', position: 'bottom' },
    },
  },

  // ========== animation 段落 (3行) ==========
  {
    lineId: 'animation-1',
    sectionId: 'animation',
    scene: { id: 'anim-button', type: 'animation' },
    lineState: {
      params: { curveType: 'rose', n: 3, isAnimating: false },
      show: { polar: true, curve: true },
      annotation: { text: '点击播放动画', position: 'top' },
    },
  },
  {
    lineId: 'animation-2',
    sectionId: 'animation',
    scene: { id: 'anim-point', type: 'animation' },
    lineState: {
      params: { curveType: 'rose', n: 3, isAnimating: true },
      show: { polar: true, curve: true, point: true },
      annotation: { text: '点沿曲线运动', position: 'bottom' },
    },
  },
  {
    lineId: 'animation-3',
    sectionId: 'animation',
    scene: { id: 'anim-theta', type: 'animation' },
    lineState: {
      params: { curveType: 'rose', n: 3, isAnimating: true },
      show: { polar: true, curve: true, point: true },
      annotation: { text: 'θ从0增加', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { polar: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-coord', type: 'formula' },
    lineState: {
      show: { polar: true, formula: true },
      annotation: { text: '(r,θ)↔(x,y)', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-curves', type: 'animation' },
    lineState: {
      params: { curveType: 'rose', n: 5 },
      show: { polar: true, curve: true },
      annotation: { text: '玫瑰线、心形线、螺旋线...', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-app', type: 'animation' },
    lineState: {
      show: { polar: true, curve: true },
      annotation: { text: '科学工程应用', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { polar: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
