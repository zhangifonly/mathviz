/**
 * 口播稿件索引
 * 导出所有实验的口播稿件
 */

// 入门级实验
export { basicArithmeticNarration } from './scripts/basic-arithmetic'
export { fractionsNarration } from './scripts/fractions'
export { geometryShapesNarration } from './scripts/geometry-shapes'
export { setTheoryNarration } from './scripts/set-theory'
export { goldenRatioNarration } from './scripts/golden-ratio'
export { numberTheoryNarration } from './scripts/number-theory'

// 初中级实验
export { linearFunctionNarration } from './scripts/linear-function'
export { quadraticFunctionNarration } from './scripts/quadratic-function'
export { pythagoreanNarration } from './scripts/pythagorean'
export { trigonometryNarration } from './scripts/trigonometry'
export { polarNarration } from './scripts/polar'
export { probabilityNarration } from './scripts/probability'
export { bezierNarration } from './scripts/bezier'
export { monteCarloNarration } from './scripts/monte-carlo'

// 高级实验（已有场景配置）
export { fourierNarration } from './scripts/fourier'
export { bayesNarration } from './scripts/bayes'
export { calculusNarration } from './scripts/calculus'
export { cltNarration } from './scripts/clt'
export { complexNarration } from './scripts/complex'
export { conicSectionsNarration } from './scripts/conic-sections'
export { parametricNarration } from './scripts/parametric'
export { regressionNarration } from './scripts/regression'
export { taylorNarration } from './scripts/taylor'

// 新增21个高级实验
export { chaosNarration } from './scripts/chaos'
export { fourierDrawingNarration } from './scripts/fourier-drawing'
export { fourierSeriesNarration } from './scripts/fourier-series'
export { fractalNarration } from './scripts/fractal'
export { gameTheoryNarration } from './scripts/game-theory'
export { gradientDescentNarration } from './scripts/gradient-descent'
export { graphTheoryNarration } from './scripts/graph-theory'
export { heatEquationNarration } from './scripts/heat-equation'
export { interpolationNarration } from './scripts/interpolation'
export { linearAlgebraNarration } from './scripts/linear-algebra'
export { markovChainNarration } from './scripts/markov-chain'
export { matrixDecompositionNarration } from './scripts/matrix-decomposition'
export { newtonMethodNarration } from './scripts/newton-method'
export { numericalIntegrationNarration } from './scripts/numerical-integration'
export { odeNarration } from './scripts/ode'
export { optimizationNarration } from './scripts/optimization'
export { pcaNarration } from './scripts/pca'
export { randomWalkNarration } from './scripts/random-walk'
export { signalProcessingNarration } from './scripts/signal-processing'
export { vectorFieldNarration } from './scripts/vector-field'
export { waveEquationNarration } from './scripts/wave-equation'

// 稿件映射表（按实验 ID 索引）
import { basicArithmeticNarration } from './scripts/basic-arithmetic'
import { fractionsNarration } from './scripts/fractions'
import { geometryShapesNarration } from './scripts/geometry-shapes'
import { setTheoryNarration } from './scripts/set-theory'
import { goldenRatioNarration } from './scripts/golden-ratio'
import { numberTheoryNarration } from './scripts/number-theory'
import { linearFunctionNarration } from './scripts/linear-function'
import { quadraticFunctionNarration } from './scripts/quadratic-function'
import { pythagoreanNarration } from './scripts/pythagorean'
import { trigonometryNarration } from './scripts/trigonometry'
import { polarNarration } from './scripts/polar'
import { probabilityNarration } from './scripts/probability'
import { bezierNarration } from './scripts/bezier'
import { monteCarloNarration } from './scripts/monte-carlo'
import { fourierNarration } from './scripts/fourier'
import { bayesNarration } from './scripts/bayes'
import { calculusNarration } from './scripts/calculus'
import { cltNarration } from './scripts/clt'
import { complexNarration } from './scripts/complex'
import { conicSectionsNarration } from './scripts/conic-sections'
import { parametricNarration } from './scripts/parametric'
import { regressionNarration } from './scripts/regression'
import { taylorNarration } from './scripts/taylor'
// 新增21个高级实验
import { chaosNarration } from './scripts/chaos'
import { fourierDrawingNarration } from './scripts/fourier-drawing'
import { fourierSeriesNarration } from './scripts/fourier-series'
import { fractalNarration } from './scripts/fractal'
import { gameTheoryNarration } from './scripts/game-theory'
import { gradientDescentNarration } from './scripts/gradient-descent'
import { graphTheoryNarration } from './scripts/graph-theory'
import { heatEquationNarration } from './scripts/heat-equation'
import { interpolationNarration } from './scripts/interpolation'
import { linearAlgebraNarration } from './scripts/linear-algebra'
import { markovChainNarration } from './scripts/markov-chain'
import { matrixDecompositionNarration } from './scripts/matrix-decomposition'
import { newtonMethodNarration } from './scripts/newton-method'
import { numericalIntegrationNarration } from './scripts/numerical-integration'
import { odeNarration } from './scripts/ode'
import { optimizationNarration } from './scripts/optimization'
import { pcaNarration } from './scripts/pca'
import { randomWalkNarration } from './scripts/random-walk'
import { signalProcessingNarration } from './scripts/signal-processing'
import { vectorFieldNarration } from './scripts/vector-field'
import { waveEquationNarration } from './scripts/wave-equation'
import type { NarrationScript } from './types'

export const narrationScripts: Record<string, NarrationScript> = {
  // 入门级
  'basic-arithmetic': basicArithmeticNarration,
  'fractions': fractionsNarration,
  'geometry-shapes': geometryShapesNarration,
  'set-theory': setTheoryNarration,
  'golden-ratio': goldenRatioNarration,
  'number-theory': numberTheoryNarration,
  // 初中级
  'linear-function': linearFunctionNarration,
  'quadratic-function': quadraticFunctionNarration,
  'pythagorean': pythagoreanNarration,
  'trigonometry': trigonometryNarration,
  'polar': polarNarration,
  'probability': probabilityNarration,
  'bezier': bezierNarration,
  'monte-carlo': monteCarloNarration,
  // 高级
  'fourier': fourierNarration,
  'bayes': bayesNarration,
  'calculus': calculusNarration,
  'clt': cltNarration,
  'complex': complexNarration,
  'conic-sections': conicSectionsNarration,
  'parametric': parametricNarration,
  'regression': regressionNarration,
  'taylor': taylorNarration,
  // 新增21个高级实验
  'chaos': chaosNarration,
  'fourier-drawing': fourierDrawingNarration,
  'fourier-series': fourierSeriesNarration,
  'fractal': fractalNarration,
  'game-theory': gameTheoryNarration,
  'gradient-descent': gradientDescentNarration,
  'graph-theory': graphTheoryNarration,
  'heat-equation': heatEquationNarration,
  'interpolation': interpolationNarration,
  'linear-algebra': linearAlgebraNarration,
  'markov-chain': markovChainNarration,
  'matrix-decomposition': matrixDecompositionNarration,
  'newton-method': newtonMethodNarration,
  'numerical-integration': numericalIntegrationNarration,
  'ode': odeNarration,
  'optimization': optimizationNarration,
  'pca': pcaNarration,
  'random-walk': randomWalkNarration,
  'signal-processing': signalProcessingNarration,
  'vector-field': vectorFieldNarration,
  'wave-equation': waveEquationNarration,
}

// 获取稿件
export function getNarrationScript(experimentId: string): NarrationScript | null {
  return narrationScripts[experimentId] || null
}

// 获取所有稿件 ID
export function getAllNarrationIds(): string[] {
  return Object.keys(narrationScripts)
}

// 导出类型
export * from './types'
