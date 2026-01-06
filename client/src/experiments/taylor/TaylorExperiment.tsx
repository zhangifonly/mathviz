import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { taylorNarration } from '../../narrations/scripts/taylor'

type FunctionType = 'sin' | 'cos' | 'exp' | 'ln1px' | '1/(1-x)'

const functionInfo: Record<FunctionType, { name: string; formula: string; taylorFormula: string }> = {
  sin: {
    name: 'sin(x)',
    formula: 'f(x) = \\sin(x)',
    taylorFormula: '\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\cdots',
  },
  cos: {
    name: 'cos(x)',
    formula: 'f(x) = \\cos(x)',
    taylorFormula: '\\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\frac{x^6}{6!} + \\cdots',
  },
  exp: {
    name: 'e^x',
    formula: 'f(x) = e^x',
    taylorFormula: 'e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\cdots',
  },
  ln1px: {
    name: 'ln(1+x)',
    formula: 'f(x) = \\ln(1+x)',
    taylorFormula: '\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\cdots',
  },
  '1/(1-x)': {
    name: '1/(1-x)',
    formula: 'f(x) = \\frac{1}{1-x}',
    taylorFormula: '\\frac{1}{1-x} = 1 + x + x^2 + x^3 + x^4 + \\cdots',
  },
}

// 阶乘
function factorial(n: number): number {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

// 计算泰勒展开
function taylorApprox(func: FunctionType, x: number, terms: number): number {
  let sum = 0
  switch (func) {
    case 'sin':
      for (let n = 0; n < terms; n++) {
        sum += (Math.pow(-1, n) * Math.pow(x, 2 * n + 1)) / factorial(2 * n + 1)
      }
      break
    case 'cos':
      for (let n = 0; n < terms; n++) {
        sum += (Math.pow(-1, n) * Math.pow(x, 2 * n)) / factorial(2 * n)
      }
      break
    case 'exp':
      for (let n = 0; n < terms; n++) {
        sum += Math.pow(x, n) / factorial(n)
      }
      break
    case 'ln1px':
      for (let n = 1; n <= terms; n++) {
        sum += (Math.pow(-1, n + 1) * Math.pow(x, n)) / n
      }
      break
    case '1/(1-x)':
      for (let n = 0; n < terms; n++) {
        sum += Math.pow(x, n)
      }
      break
  }
  return sum
}

// 原函数值
function originalFunc(func: FunctionType, x: number): number {
  switch (func) {
    case 'sin': return Math.sin(x)
    case 'cos': return Math.cos(x)
    case 'exp': return Math.exp(x)
    case 'ln1px': return x > -1 ? Math.log(1 + x) : NaN
    case '1/(1-x)': return Math.abs(x) < 1 ? 1 / (1 - x) : NaN
  }
}

export default function TaylorExperiment() {
  const [params, setParams] = useState({
    terms: 5,
    xPoint: 1,
  })
  const [funcType, setFuncType] = useState<FunctionType>('sin')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(taylorNarration)
    }
  }, [narration])

  // 开始讲解 - 进入全屏 PPT 模式
  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  // 退出讲解
  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])

  // 动画效果：逐步增加展开项数
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setParams((prev) => {
        const nextTerms = prev.terms + 1
        if (nextTerms > 15) {
          setIsAnimating(false)
          return { ...prev, terms: 15 }
        }
        return { ...prev, terms: nextTerms }
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 500) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating])

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const { xValues, originalValues, taylorValues, errorValues, convergenceData } = useMemo(() => {
    const xMin = funcType === 'ln1px' ? -0.9 : funcType === '1/(1-x)' ? -0.95 : -5
    const xMax = funcType === 'ln1px' ? 2 : funcType === '1/(1-x)' ? 0.95 : 5
    const xVals: number[] = []
    const origVals: number[] = []
    const taylorVals: number[] = []
    const errVals: number[] = []

    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin)
      xVals.push(x)
      const orig = originalFunc(funcType, x)
      const taylor = taylorApprox(funcType, x, params.terms)
      origVals.push(orig)
      taylorVals.push(taylor)
      errVals.push(Math.abs(orig - taylor))
    }

    // 收敛性数据：不同项数的逼近
    const convData: { terms: number; values: number[] }[] = []
    for (let t = 1; t <= 10; t++) {
      const vals = xVals.map((x) => taylorApprox(funcType, x, t))
      convData.push({ terms: t, values: vals })
    }

    return {
      xValues: xVals,
      originalValues: origVals,
      taylorValues: taylorVals,
      errorValues: errVals,
      convergenceData: convData,
    }
  }, [funcType, params.terms])

  const pointOriginal = originalFunc(funcType, params.xPoint)
  const pointTaylor = taylorApprox(funcType, params.xPoint, params.terms)
  const pointError = Math.abs(pointOriginal - pointTaylor)

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">泰勒级数</h1>
            <p className="text-gray-600">用多项式逼近函数，观察收敛过程</p>
          </div>
          <button
            onClick={handleStartNarration}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
            <span>开始讲解</span>
          </button>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 函数逼近图 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">泰勒展开逼近 ({params.terms} 项)</h3>
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setParams((prev) => ({ ...prev, terms: 1 }))
                  }
                  setIsAnimating(!isAnimating)
                }}
                className={`px-4 py-1 rounded-lg text-sm font-medium ${
                  isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isAnimating ? '停止' : '播放动画'}
              </button>
            </div>
            <Plot
              data={[
                {
                  x: xValues,
                  y: originalValues,
                  type: 'scatter',
                  mode: 'lines',
                  name: `原函数 ${functionInfo[funcType].name}`,
                  line: { color: '#3b82f6', width: 3 },
                },
                {
                  x: xValues,
                  y: taylorValues,
                  type: 'scatter',
                  mode: 'lines',
                  name: `泰勒展开 (${params.terms}项)`,
                  line: { color: '#ef4444', width: 2, dash: 'dash' },
                },
                {
                  x: [params.xPoint],
                  y: [pointOriginal],
                  type: 'scatter',
                  mode: 'markers',
                  name: '采样点',
                  marker: { color: '#22c55e', size: 12 },
                },
              ]}
              layout={{
                autosize: true,
                height: 300,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x' },
                yaxis: { title: 'y', range: [-5, 5] },
                legend: { orientation: 'h', y: -0.2 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {/* 误差图 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">逼近误差</h3>
            <Plot
              data={[
                {
                  x: xValues,
                  y: errorValues,
                  type: 'scatter',
                  mode: 'lines',
                  name: '|f(x) - Tₙ(x)|',
                  line: { color: '#8b5cf6', width: 2 },
                  fill: 'tozeroy',
                  fillcolor: 'rgba(139, 92, 246, 0.2)',
                },
              ]}
              layout={{
                autosize: true,
                height: 200,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x' },
                yaxis: { title: '误差', type: 'log' },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {/* 收敛动画 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">收敛过程 (1-10项)</h3>
            <Plot
              data={[
                {
                  x: xValues,
                  y: originalValues,
                  type: 'scatter',
                  mode: 'lines',
                  name: '原函数',
                  line: { color: '#3b82f6', width: 3 },
                },
                ...convergenceData.slice(0, params.terms).map((d, i) => ({
                  x: xValues,
                  y: d.values,
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  name: `${d.terms}项`,
                  line: { color: `hsl(${i * 36}, 70%, 50%)`, width: 1 },
                  opacity: 0.6,
                })),
              ]}
              layout={{
                autosize: true,
                height: 250,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x' },
                yaxis: { title: 'y', range: [-5, 5] },
                showlegend: false,
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* 函数选择 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择函数</h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(functionInfo) as FunctionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFuncType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    funcType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {functionInfo[type].name}
                </button>
              ))}
            </div>
          </div>

          {/* 参数控制 */}
          <ParameterPanel
            title="参数控制"
            params={[
              { key: 'terms', label: '展开项数', value: params.terms, min: 1, max: 15, step: 1 },
              { key: 'xPoint', label: '采样点 x', value: params.xPoint, min: -3, max: 3, step: 0.1 },
            ]}
            onChange={handleParamChange}
          />

          {/* 采样点信息 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">x = {params.xPoint.toFixed(2)} 处</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 rounded">
                <span className="text-blue-700">原函数值: {pointOriginal.toFixed(6)}</span>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <span className="text-red-700">泰勒逼近: {pointTaylor.toFixed(6)}</span>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <span className="text-purple-700">误差: {pointError.toExponential(3)}</span>
              </div>
            </div>
          </div>

          {/* 公式 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">泰勒展开式</h3>
            <div className="space-y-3">
              <MathFormula formula={functionInfo[funcType].taylorFormula} />
              <div className="text-xs text-gray-500 mt-2">
                通用形式:
              </div>
              <MathFormula formula="f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(0)}{n!} x^n" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
