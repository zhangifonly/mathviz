/**
 * 三角函数讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultTrigonometryState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const trigonometryScenes: NarrationLineScene[] = [
  // ========== intro 段落 (3行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { unitCircle: false, wave: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-concept', type: 'animation' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, wave: false },
      annotation: { text: '三角函数描述角度与比值', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-examples', type: 'illustration' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, wave: true },
      annotation: { text: '声波、交流电、振动', position: 'bottom' },
    },
  },

  // ========== unit-circle 段落 (4行) ==========
  {
    lineId: 'unit-circle-1',
    sectionId: 'unit-circle',
    scene: { id: 'uc-intro', type: 'animation' },
    lineState: {
      params: { angle: 0 },
      show: { unitCircle: true, radius: true },
      annotation: { text: '单位圆：半径=1', position: 'top' },
    },
  },
  {
    lineId: 'unit-circle-2',
    sectionId: 'unit-circle',
    scene: { id: 'uc-ray', type: 'animation' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, radius: true, angle: true },
      annotation: { text: '射线与x轴形成角度θ', position: 'bottom' },
    },
  },
  {
    lineId: 'unit-circle-3',
    sectionId: 'unit-circle',
    scene: { id: 'uc-coords', type: 'formula' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, radius: true, sinLine: true, cosLine: true },
      annotation: { text: 'cos θ=横坐标，sin θ=纵坐标', position: 'bottom' },
    },
  },
  {
    lineId: 'unit-circle-4',
    sectionId: 'unit-circle',
    scene: { id: 'uc-colors', type: 'animation' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, radius: true, sinLine: true, cosLine: true },
      highlight: ['radius', 'sinLine', 'cosLine'],
      annotation: { text: '蓝=半径，红=sin，绿=cos', position: 'bottom' },
    },
  },

  // ========== sine-cosine 段落 (5行) ==========
  {
    lineId: 'sine-cosine-1',
    sectionId: 'sine-cosine',
    scene: { id: 'sc-sin', type: 'formula' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, sinLine: true, values: true },
      highlight: ['sinLine'],
      annotation: { text: 'sin θ=纵坐标，范围[-1,1]', position: 'top' },
    },
  },
  {
    lineId: 'sine-cosine-2',
    sectionId: 'sine-cosine',
    scene: { id: 'sc-cos', type: 'formula' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, cosLine: true, values: true },
      highlight: ['cosLine'],
      annotation: { text: 'cos θ=横坐标，范围[-1,1]', position: 'bottom' },
    },
  },
  {
    lineId: 'sine-cosine-3',
    sectionId: 'sine-cosine',
    scene: { id: 'sc-zero', type: 'animation' },
    lineState: {
      params: { angle: 0 },
      show: { unitCircle: true, sinLine: true, cosLine: true, values: true },
      annotation: { text: 'θ=0°: sin=0, cos=1', position: 'bottom' },
    },
  },
  {
    lineId: 'sine-cosine-4',
    sectionId: 'sine-cosine',
    scene: { id: 'sc-ninety', type: 'animation' },
    lineState: {
      params: { angle: 90 },
      show: { unitCircle: true, sinLine: true, cosLine: true, values: true },
      annotation: { text: 'θ=90°: sin=1, cos=0', position: 'bottom' },
    },
  },
  {
    lineId: 'sine-cosine-5',
    sectionId: 'sine-cosine',
    scene: { id: 'sc-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, sinLine: true, cosLine: true, values: true },
      annotation: { text: '调整角度观察变化', position: 'bottom' },
    },
  },

  // ========== tangent 段落 (4行) ==========
  {
    lineId: 'tangent-1',
    sectionId: 'tangent',
    scene: { id: 'tan-def', type: 'formula' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, tanLine: true, values: true },
      annotation: { text: 'tan θ = sin θ / cos θ', position: 'top' },
    },
  },
  {
    lineId: 'tangent-2',
    sectionId: 'tangent',
    scene: { id: 'tan-slope', type: 'animation' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, radius: true, tanLine: true },
      annotation: { text: 'tan θ=射线斜率', position: 'bottom' },
    },
  },
  {
    lineId: 'tangent-3',
    sectionId: 'tangent',
    scene: { id: 'tan-45', type: 'animation' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, sinLine: true, cosLine: true, values: true },
      annotation: { text: 'θ=45°: tan=1', position: 'bottom' },
    },
  },
  {
    lineId: 'tangent-4',
    sectionId: 'tangent',
    scene: { id: 'tan-90', type: 'animation' },
    lineState: {
      params: { angle: 85 },
      show: { unitCircle: true, tanLine: true, values: true },
      annotation: { text: 'θ→90°: tan→∞', position: 'bottom' },
    },
  },

  // ========== identity 段落 (4行) ==========
  {
    lineId: 'identity-1',
    sectionId: 'identity',
    scene: { id: 'id-formula', type: 'formula' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, sinLine: true, cosLine: true, formula: true },
      annotation: { text: 'sin²θ + cos²θ = 1', position: 'top' },
    },
  },
  {
    lineId: 'identity-2',
    sectionId: 'identity',
    scene: { id: 'id-proof', type: 'animation' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, radius: true, sinLine: true, cosLine: true },
      annotation: { text: '勾股定理：r²=x²+y²', position: 'bottom' },
    },
  },
  {
    lineId: 'identity-3',
    sectionId: 'identity',
    scene: { id: 'id-always', type: 'animation' },
    lineState: {
      params: { angle: 120 },
      show: { unitCircle: true, sinLine: true, cosLine: true, values: true },
      annotation: { text: '任意角度都成立', position: 'bottom' },
    },
  },
  {
    lineId: 'identity-4',
    sectionId: 'identity',
    scene: { id: 'id-verify', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, sinLine: true, cosLine: true, values: true, formula: true },
      annotation: { text: '验证恒等式', position: 'bottom' },
    },
  },

  // ========== wave 段落 (4行) ==========
  {
    lineId: 'wave-1',
    sectionId: 'wave',
    scene: { id: 'wave-intro', type: 'animation' },
    lineState: {
      params: { amplitude: 1, frequency: 1, phase: 0 },
      show: { wave: true, sinWave: true, cosWave: true },
      annotation: { text: '正弦波和余弦波', position: 'top' },
    },
  },
  {
    lineId: 'wave-2',
    sectionId: 'wave',
    scene: { id: 'wave-colors', type: 'animation' },
    lineState: {
      params: { amplitude: 1, frequency: 1, phase: 0 },
      show: { wave: true, sinWave: true, cosWave: true },
      highlight: ['sinWave', 'cosWave'],
      annotation: { text: '红=sin(x)，绿=cos(x)', position: 'bottom' },
    },
  },
  {
    lineId: 'wave-3',
    sectionId: 'wave',
    scene: { id: 'wave-phase', type: 'animation' },
    lineState: {
      params: { amplitude: 1, frequency: 1, phase: 90 },
      show: { wave: true, sinWave: true, cosWave: true },
      annotation: { text: 'cos比sin提前90°', position: 'bottom' },
    },
  },
  {
    lineId: 'wave-4',
    sectionId: 'wave',
    scene: { id: 'wave-try', type: 'interactive', interactive: { allowParamChange: true } },
    lineState: {
      params: { amplitude: 1, frequency: 1, phase: 0 },
      show: { wave: true, sinWave: true, cosWave: true },
      annotation: { text: '调整振幅、频率、相位', position: 'bottom' },
    },
  },

  // ========== animation 段落 (3行) ==========
  {
    lineId: 'animation-1',
    sectionId: 'animation',
    scene: { id: 'anim-button', type: 'animation' },
    lineState: {
      params: { angle: 0, isAnimating: false },
      show: { unitCircle: true, radius: true },
      annotation: { text: '点击开始动画', position: 'top' },
    },
  },
  {
    lineId: 'animation-2',
    sectionId: 'animation',
    scene: { id: 'anim-circle', type: 'animation' },
    lineState: {
      params: { angle: 0, isAnimating: true },
      show: { unitCircle: true, radius: true, sinLine: true, cosLine: true, values: true },
      annotation: { text: '点绕圆周运动', position: 'bottom' },
    },
  },
  {
    lineId: 'animation-3',
    sectionId: 'animation',
    scene: { id: 'anim-period', type: 'animation' },
    lineState: {
      params: { angle: 0, isAnimating: true },
      show: { unitCircle: true, wave: true, sinWave: true },
      annotation: { text: '周期性：每圈重复', position: 'bottom' },
    },
  },

  // ========== application 段落 (4行) ==========
  {
    lineId: 'application-1',
    sectionId: 'application',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { wave: true, sinWave: true },
      annotation: { text: '三角函数的应用', position: 'top' },
    },
  },
  {
    lineId: 'application-2',
    sectionId: 'application',
    scene: { id: 'app-sound', type: 'application' },
    lineState: {
      params: { frequency: 2 },
      show: { wave: true, sinWave: true },
      annotation: { text: '声波=正弦波', position: 'bottom' },
    },
  },
  {
    lineId: 'application-3',
    sectionId: 'application',
    scene: { id: 'app-ac', type: 'application' },
    lineState: {
      params: { frequency: 1 },
      show: { wave: true, sinWave: true },
      annotation: { text: '交流电=正弦变化', position: 'bottom' },
    },
  },
  {
    lineId: 'application-4',
    sectionId: 'application',
    scene: { id: 'app-nav', type: 'application' },
    lineState: {
      params: { angle: 30 },
      show: { unitCircle: true, radius: true },
      annotation: { text: '测量和导航', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { unitCircle: false, wave: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-def', type: 'animation' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, sinLine: true, cosLine: true, values: true },
      annotation: { text: 'cos=横坐标，sin=纵坐标，tan=比值', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-identity', type: 'formula' },
    lineState: {
      params: { angle: 45 },
      show: { unitCircle: true, formula: true },
      annotation: { text: 'sin²θ + cos²θ = 1', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-period', type: 'animation' },
    lineState: {
      show: { wave: true, sinWave: true, cosWave: true },
      annotation: { text: '周期函数，描述振动波动', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { unitCircle: false, wave: false },
      annotation: { text: '继续探索数学的乐趣！', position: 'bottom' },
    },
  },
]
