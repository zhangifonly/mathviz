/**
 * 公式场景 - 显示数学公式
 */

import 'katex/dist/katex.min.css'
// @ts-expect-error react-katex types
import { BlockMath } from 'react-katex'

interface Props {
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division'
  num1: number
  num2: number
}

export default function FormulaScene({ operation, num1, num2 }: Props) {
  const getFormula = () => {
    switch (operation) {
      case 'addition':
        return `${num1} + ${num2} = ${num1 + num2}`
      case 'subtraction':
        return `${num1} - ${num2} = ${Math.max(0, num1 - num2)}`
      case 'multiplication':
        return `${num1} \\times ${num2} = ${num1 * num2}`
      case 'division':
        if (num2 === 0) return '\\text{除数不能为 0}'
        const q = Math.floor(num1 / num2)
        const r = num1 % num2
        return r > 0
          ? `${num1} \\div ${num2} = ${q} \\cdots ${r}`
          : `${num1} \\div ${num2} = ${q}`
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="text-4xl md:text-6xl text-white">
        <BlockMath math={getFormula()} />
      </div>
    </div>
  )
}
