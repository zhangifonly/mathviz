/**
 * 口播稿件索引
 * 导出所有实验的口播稿件
 */

// 入门级实验 (Batch 1)
export { basicArithmeticNarration } from './scripts/basic-arithmetic'
export { fractionsNarration } from './scripts/fractions'
export { geometryShapesNarration } from './scripts/geometry-shapes'
export { setTheoryNarration } from './scripts/set-theory'
export { goldenRatioNarration } from './scripts/golden-ratio'
export { numberTheoryNarration } from './scripts/number-theory'

// 初中级实验 (Batch 2)
export { linearFunctionNarration } from './scripts/linear-function'
export { quadraticFunctionNarration } from './scripts/quadratic-function'
export { pythagoreanNarration } from './scripts/pythagorean'
export { trigonometryNarration } from './scripts/trigonometry'
export { polarNarration } from './scripts/polar'
export { probabilityNarration } from './scripts/probability'
export { bezierNarration } from './scripts/bezier'
export { monteCarloNarration } from './scripts/monte-carlo'

// 高级实验
export { fourierNarration } from './scripts/fourier'

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
import type { NarrationScript } from './types'

export const narrationScripts: Record<string, NarrationScript> = {
  // Batch 1 - 入门级
  'basic-arithmetic': basicArithmeticNarration,
  'fractions': fractionsNarration,
  'geometry-shapes': geometryShapesNarration,
  'set-theory': setTheoryNarration,
  'golden-ratio': goldenRatioNarration,
  'number-theory': numberTheoryNarration,
  // Batch 2 - 初中级
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
