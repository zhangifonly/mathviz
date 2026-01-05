/**
 * 公式场景组件
 *
 * 显示傅里叶级数公式
 */

import MathFormula from '../../../components/MathFormula/MathFormula'
import type { WaveType } from '../types'

interface FormulaSceneProps {
  waveType: WaveType
  terms: number
}

export function FormulaScene({ waveType, terms }: FormulaSceneProps) {
  const formulas: Record<WaveType, { main: string; expanded: string; description: string }> = {
    sine: {
      main: 'f(t) = A \\sin(\\omega t)',
      expanded: 'f(t) = A \\sin(\\omega t)',
      description: '正弦波是最简单的周期信号，只有单一频率成分',
    },
    square: {
      main: 'f(t) = \\frac{4A}{\\pi} \\sum_{n=1,3,5,...}^{\\infty} \\frac{1}{n} \\sin(n\\omega t)',
      expanded: `f(t) = \\frac{4A}{\\pi} \\left( \\sin(\\omega t) + \\frac{1}{3}\\sin(3\\omega t) + \\frac{1}{5}\\sin(5\\omega t) + ... \\right)`,
      description: '方波只包含奇数次谐波，振幅按 1/n 递减',
    },
    sawtooth: {
      main: 'f(t) = \\frac{2A}{\\pi} \\sum_{n=1}^{\\infty} \\frac{(-1)^{n+1}}{n} \\sin(n\\omega t)',
      expanded: `f(t) = \\frac{2A}{\\pi} \\left( \\sin(\\omega t) - \\frac{1}{2}\\sin(2\\omega t) + \\frac{1}{3}\\sin(3\\omega t) - ... \\right)`,
      description: '锯齿波包含所有整数次谐波，振幅按 1/n 递减',
    },
    triangle: {
      main: 'f(t) = \\frac{8A}{\\pi^2} \\sum_{n=1,3,5,...}^{\\infty} \\frac{(-1)^{(n-1)/2}}{n^2} \\sin(n\\omega t)',
      expanded: `f(t) = \\frac{8A}{\\pi^2} \\left( \\sin(\\omega t) - \\frac{1}{9}\\sin(3\\omega t) + \\frac{1}{25}\\sin(5\\omega t) - ... \\right)`,
      description: '三角波只包含奇数次谐波，振幅按 1/n² 递减（衰减更快）',
    },
  }

  const waveTypeNames = {
    sine: '正弦波',
    square: '方波',
    sawtooth: '锯齿波',
    triangle: '三角波',
  }

  const formula = formulas[waveType]

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {/* 标题 */}
      <h2 className="text-white text-2xl font-bold mb-8">
        {waveTypeNames[waveType]}的傅里叶级数
      </h2>

      {/* 主公式 */}
      <div className="bg-white rounded-2xl p-8 shadow-xl mb-6 max-w-4xl">
        <MathFormula formula={formula.main} className="text-2xl" />
      </div>

      {/* 展开形式 */}
      <div className="bg-white/10 rounded-xl p-6 mb-6 max-w-4xl">
        <p className="text-white/70 text-sm mb-3">展开形式：</p>
        <MathFormula formula={formula.expanded} className="text-lg text-white" />
      </div>

      {/* 说明 */}
      <p className="text-white/70 text-lg text-center max-w-2xl">
        {formula.description}
      </p>

      {/* 当前项数 */}
      <div className="mt-8 bg-indigo-500/20 rounded-xl px-6 py-3">
        <p className="text-indigo-300 text-sm">
          当前使用 <span className="text-white font-bold text-lg">{terms}</span> 项进行逼近
        </p>
      </div>
    </div>
  )
}
