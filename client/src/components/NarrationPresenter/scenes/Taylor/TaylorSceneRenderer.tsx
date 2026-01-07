/**
 * 泰勒级数场景渲染器
 * 根据场景配置渲染泰勒级数展开、函数逼近等可视化
 */

import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '泰勒级数', subtitle: '用多项式逼近任意函数' },
    'summary-intro': { title: '总结回顾', subtitle: '泰勒级数的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '更直观理解泰勒级数' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '泰勒级数', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 泰勒逼近动画场景
function TaylorApproximationScene({
  functionType = 'sin',
  terms = 5,
  showOriginal = true,
  showPolynomial = true,
  showError = false,
}: {
  functionType?: 'sin' | 'cos' | 'exp' | 'geometric'
  terms?: number
  showOriginal?: boolean
  showPolynomial?: boolean
  showError?: boolean
}) {
  const [currentTerms, setCurrentTerms] = useState(1)

  useEffect(() => {
    if (terms > 1) {
      const timer = setInterval(() => {
        setCurrentTerms(t => (t < terms ? t + 1 : terms))
      }, 500)
      return () => clearInterval(timer)
    } else {
      setCurrentTerms(terms)
    }
  }, [terms])

  const data = useMemo(() => {
    const xValues: number[] = []
    const originalValues: number[] = []
    const polynomialValues: number[] = []
    const errorValues: number[] = []

    const xMin = functionType === 'geometric' ? -0.9 : -2 * Math.PI
    const xMax = functionType === 'geometric' ? 0.9 : 2 * Math.PI
    const step = (xMax - xMin) / 200

    for (let x = xMin; x <= xMax; x += step) {
      xValues.push(x)

      // 计算原函数值
      let originalValue = 0
      switch (functionType) {
        case 'sin':
          originalValue = Math.sin(x)
          break
        case 'cos':
          originalValue = Math.cos(x)
          break
        case 'exp':
          originalValue = Math.exp(x)
          break
        case 'geometric':
          originalValue = 1 / (1 - x)
          break
      }
      originalValues.push(originalValue)

      // 计算泰勒多项式值
      let polynomialValue = 0
      switch (functionType) {
        case 'sin':
          // sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ...
          for (let n = 0; n < currentTerms; n++) {
            const power = 2 * n + 1
            const sign = n % 2 === 0 ? 1 : -1
            const factorial = Array.from({ length: power }, (_, i) => i + 1).reduce((a, b) => a * b, 1)
            polynomialValue += sign * Math.pow(x, power) / factorial
          }
          break
        case 'cos':
          // cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ...
          for (let n = 0; n < currentTerms; n++) {
            const power = 2 * n
            const sign = n % 2 === 0 ? 1 : -1
            const factorial = power === 0 ? 1 : Array.from({ length: power }, (_, i) => i + 1).reduce((a, b) => a * b, 1)
            polynomialValue += sign * Math.pow(x, power) / factorial
          }
          break
        case 'exp':
          // e^x = 1 + x + x²/2! + x³/3! + ...
          for (let n = 0; n < currentTerms; n++) {
            const factorial = n === 0 ? 1 : Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a * b, 1)
            polynomialValue += Math.pow(x, n) / factorial
          }
          break
        case 'geometric':
          // 1/(1-x) = 1 + x + x² + x³ + ...
          for (let n = 0; n < currentTerms; n++) {
            polynomialValue += Math.pow(x, n)
          }
          break
      }
      polynomialValues.push(polynomialValue)
      errorValues.push(Math.abs(originalValue - polynomialValue))
    }

    return { x: xValues, original: originalValues, polynomial: polynomialValues, error: errorValues }
  }, [functionType, currentTerms])

  const traces: Data[] = []

  if (showOriginal) {
    traces.push({
      x: data.x,
      y: data.original,
      type: 'scatter',
      mode: 'lines',
      name: '原函数',
      line: { color: '#3b82f6', width: 3 },
    })
  }

  if (showPolynomial) {
    traces.push({
      x: data.x,
      y: data.polynomial,
      type: 'scatter',
      mode: 'lines',
      name: `泰勒多项式 (n=${currentTerms})`,
      line: { color: '#ef4444', width: 2, dash: 'dash' },
    })
  }

  if (showError) {
    traces.push({
      x: data.x,
      y: data.error,
      type: 'scatter',
      mode: 'lines',
      name: '误差',
      line: { color: '#22c55e', width: 2 },
      yaxis: 'y2',
    })
  }

  const yMax = functionType === 'exp' ? Math.max(...data.original.filter(v => v < 10)) : undefined

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 60, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'y' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
            range: yMax ? [-2, yMax] : undefined,
          },
          ...(showError && {
            yaxis2: {
              title: { text: '误差' },
              overlaying: 'y',
              side: 'right',
              color: '#22c55e',
            },
          }),
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
            x: 0.02,
            y: 0.98,
          },
          showlegend: true,
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
      {terms > 1 && (
        <div className="text-white/70 text-sm">
          当前展开项数: {currentTerms} / {terms}
        </div>
      )}
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'taylor-general': {
      formula: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n',
      description: '泰勒级数通用公式',
    },
    'maclaurin': {
      formula: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!}x^n',
      description: '麦克劳林级数 (a=0)',
    },
    'exp': {
      formula: 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}',
      description: '指数函数的泰勒展开',
    },
    'sin': {
      formula: '\\sin x = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n+1}}{(2n+1)!}',
      description: '正弦函数的泰勒展开',
    },
    'cos': {
      formula: '\\cos x = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\cdots = \\sum_{n=0}^{\\infty} \\frac{(-1)^n x^{2n}}{(2n)!}',
      description: '余弦函数的泰勒展开',
    },
    'geometric': {
      formula: '\\frac{1}{1-x} = 1 + x + x^2 + x^3 + \\cdots = \\sum_{n=0}^{\\infty} x^n \\quad (|x| < 1)',
      description: '几何级数',
    },
    'convergence': {
      formula: '\\lim_{n \\to \\infty} R_n(x) = 0 \\quad \\text{当} \\quad |x-a| < R',
      description: '收敛条件 (R为收敛半径)',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['taylor-general']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur max-w-4xl">
        <MathFormula formula={formula} className="text-xl md:text-2xl" />
      </div>
      <p className="text-white/70 text-lg">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '泰勒级数的应用',
      items: ['科学计算', '数值分析', '物理近似', '工程计算'],
      icon: '🔬',
    },
    'app-calc': {
      title: '计算器与计算机',
      items: ['三角函数计算', '指数对数计算', '浮点运算优化', '数学函数库'],
      icon: '🖩',
    },
    'app-physics': {
      title: '物理学应用',
      items: ['小角度近似 sin θ ≈ θ', '简谐振动分析', '相对论修正', '量子力学微扰'],
      icon: '⚛️',
    },
    'app-num': {
      title: '数值分析',
      items: ['数值微分', '数值积分', '常微分方程求解', '误差分析'],
      icon: '📊',
    },
  }

  const app = apps[sceneId] || apps['app-intro']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 收敛域可视化场景
function ConvergenceScene({ functionType = 'geometric' }: { functionType?: 'geometric' | 'all' }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <div className="text-white text-center">
        <h3 className="text-2xl font-bold mb-4">收敛半径</h3>
        <div className="space-y-4 text-lg">
          {functionType === 'all' ? (
            <>
              <div className="p-4 bg-green-500/20 rounded-lg">
                <MathFormula formula="e^x, \sin x, \cos x: R = \infty" displayMode={false} className="text-white" />
                <p className="text-sm text-white/70 mt-2">对所有 x 都收敛</p>
              </div>
              <div className="p-4 bg-yellow-500/20 rounded-lg">
                <MathFormula formula="\frac{1}{1-x}: R = 1" displayMode={false} className="text-white" />
                <p className="text-sm text-white/70 mt-2">仅在 |x| &lt; 1 时收敛</p>
              </div>
            </>
          ) : (
            <div className="p-4 bg-yellow-500/20 rounded-lg">
              <MathFormula formula="\frac{1}{1-x} = \sum_{n=0}^{\infty} x^n" displayMode={false} className="text-white" />
              <p className="text-sm text-white/70 mt-2">收敛域: |x| &lt; 1</p>
            </div>
          )}
        </div>
      </div>
      <TaylorApproximationScene
        functionType={functionType === 'geometric' ? 'geometric' : 'sin'}
        terms={8}
        showOriginal={true}
        showPolynomial={true}
      />
    </div>
  )
}

// 主渲染器
export default function TaylorSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 公式场景
  if (sceneConfig.type === 'formula') {
    if (sceneConfig.id.includes('taylor-formula-1') || sceneConfig.id.includes('tf-expand')) {
      return <FormulaScene formulaType="taylor-general" />
    }
    if (sceneConfig.id.includes('taylor-formula-2') || sceneConfig.id.includes('tf-series')) {
      return <FormulaScene formulaType="taylor-general" />
    }
    if (sceneConfig.id.includes('maclaurin') || sceneConfig.id.includes('tf-maclaurin')) {
      return <FormulaScene formulaType="maclaurin" />
    }
    if (sceneConfig.id.includes('exp-deriv')) {
      return <FormulaScene formulaType="exp" />
    }
    if (sceneConfig.id.includes('exp-expand')) {
      return <FormulaScene formulaType="exp" />
    }
    if (sceneConfig.id.includes('sin-expand')) {
      return <FormulaScene formulaType="sin" />
    }
    return <FormulaScene formulaType="taylor-general" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('calc')) {
        return <TaylorApproximationScene functionType="sin" terms={1} showOriginal={true} showPolynomial={false} />
      }
      if (sceneConfig.id.includes('answer')) {
        return <TaylorApproximationScene functionType="sin" terms={5} showOriginal={true} showPolynomial={true} />
      }
      return <TaylorApproximationScene functionType="sin" terms={3} showOriginal={true} showPolynomial={true} />

    case 'basic-idea':
      if (sceneConfig.id.includes('core')) {
        return <TaylorApproximationScene functionType="sin" terms={3} showOriginal={true} showPolynomial={true} />
      }
      if (sceneConfig.id.includes('poly')) {
        return <TaylorApproximationScene functionType="sin" terms={5} showOriginal={false} showPolynomial={true} />
      }
      if (sceneConfig.id.includes('hard')) {
        return <TaylorApproximationScene functionType="sin" terms={1} showOriginal={true} showPolynomial={false} />
      }
      if (sceneConfig.id.includes('bridge')) {
        return <TaylorApproximationScene functionType="sin" terms={7} showOriginal={true} showPolynomial={true} />
      }
      return <TaylorApproximationScene functionType="sin" terms={5} showOriginal={true} showPolynomial={true} />

    case 'exp-series':
      if (sceneConfig.id.includes('intro')) {
        return <TaylorApproximationScene functionType="exp" terms={1} showOriginal={true} showPolynomial={false} />
      }
      if (sceneConfig.id.includes('conv')) {
        return <TaylorApproximationScene functionType="exp" terms={10} showOriginal={true} showPolynomial={true} />
      }
      return <TaylorApproximationScene functionType="exp" terms={6} showOriginal={true} showPolynomial={true} />

    case 'sin-series':
      if (sceneConfig.id.includes('intro')) {
        return <TaylorApproximationScene functionType="sin" terms={1} showOriginal={true} showPolynomial={false} />
      }
      if (sceneConfig.id.includes('odd')) {
        return <TaylorApproximationScene functionType="sin" terms={5} showOriginal={true} showPolynomial={true} />
      }
      if (sceneConfig.id.includes('calc')) {
        return <TaylorApproximationScene functionType="sin" terms={7} showOriginal={true} showPolynomial={true} />
      }
      return <TaylorApproximationScene functionType="sin" terms={5} showOriginal={true} showPolynomial={true} />

    case 'approximation':
      if (sceneConfig.id.includes('show')) {
        return <TaylorApproximationScene functionType="sin" terms={3} showOriginal={true} showPolynomial={true} />
      }
      if (sceneConfig.id.includes('approx-n')) {
        return <TaylorApproximationScene functionType="sin" terms={8} showOriginal={true} showPolynomial={true} />
      }
      if (sceneConfig.id.includes('near')) {
        return <TaylorApproximationScene functionType="sin" terms={5} showOriginal={true} showPolynomial={true} />
      }
      if (sceneConfig.id.includes('far')) {
        return <TaylorApproximationScene functionType="sin" terms={10} showOriginal={true} showPolynomial={true} />
      }
      return <TaylorApproximationScene functionType="sin" terms={5} showOriginal={true} showPolynomial={true} />

    case 'convergence':
      if (sceneConfig.id.includes('radius')) {
        return <ConvergenceScene functionType="geometric" />
      }
      if (sceneConfig.id.includes('inf')) {
        return <ConvergenceScene functionType="all" />
      }
      if (sceneConfig.id.includes('geo')) {
        return <TaylorApproximationScene functionType="geometric" terms={8} showOriginal={true} showPolynomial={true} />
      }
      return <ConvergenceScene functionType="all" />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('poly')) {
        return <TaylorApproximationScene functionType="sin" terms={7} showOriginal={true} showPolynomial={true} />
      }
      if (sceneConfig.id.includes('deriv')) {
        return <FormulaScene formulaType="taylor-general" />
      }
      if (sceneConfig.id.includes('conv')) {
        return <ConvergenceScene functionType="all" />
      }
      return <TaylorApproximationScene functionType="sin" terms={7} showOriginal={true} showPolynomial={true} />

    default:
      return <TaylorApproximationScene functionType="sin" terms={5} showOriginal={true} showPolynomial={true} />
  }
}
