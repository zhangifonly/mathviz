import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { probabilityNarration } from '../../narrations/scripts/probability'

type DistType = 'normal' | 'uniform' | 'exponential' | 'poisson' | 'binomial'

const distInfo: Record<DistType, { name: string; formula: string; description: string }> = {
  normal: {
    name: '正态分布',
    formula: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
    description: '最重要的连续分布，自然界中大量现象服从正态分布',
  },
  uniform: {
    name: '均匀分布',
    formula: 'f(x) = \\frac{1}{b-a}, \\quad a \\leq x \\leq b',
    description: '在区间[a,b]上等概率分布',
  },
  exponential: {
    name: '指数分布',
    formula: 'f(x) = \\lambda e^{-\\lambda x}, \\quad x \\geq 0',
    description: '描述独立随机事件发生的时间间隔',
  },
  poisson: {
    name: '泊松分布',
    formula: 'P(X=k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}',
    description: '描述单位时间内随机事件发生次数的分布',
  },
  binomial: {
    name: '二项分布',
    formula: 'P(X=k) = C_n^k p^k (1-p)^{n-k}',
    description: 'n次独立伯努利试验中成功次数的分布',
  },
}

// 阶乘
function factorial(n: number): number {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

// 组合数
function combination(n: number, k: number): number {
  if (k > n) return 0
  return factorial(n) / (factorial(k) * factorial(n - k))
}

export default function ProbabilityExperiment() {
  const [params, setParams] = useState({
    mu: 0,
    sigma: 1,
    a: 0,
    b: 1,
    lambda: 1,
    n: 20,
    p: 0.5,
  })
  const [distType, setDistType] = useState<DistType>('normal')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const animationDirection = useRef(1)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(probabilityNarration)
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

  // 动画效果：参数变化
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setParams((prev) => {
        if (distType === 'normal') {
          let newSigma = prev.sigma + 0.02 * animationDirection.current
          if (newSigma > 3) animationDirection.current = -1
          if (newSigma < 0.3) animationDirection.current = 1
          return { ...prev, sigma: newSigma }
        } else if (distType === 'exponential' || distType === 'poisson') {
          let newLambda = prev.lambda + 0.05 * animationDirection.current
          if (newLambda > 5) animationDirection.current = -1
          if (newLambda < 0.3) animationDirection.current = 1
          return { ...prev, lambda: newLambda }
        } else if (distType === 'binomial') {
          let newP = prev.p + 0.01 * animationDirection.current
          if (newP > 0.9) animationDirection.current = -1
          if (newP < 0.1) animationDirection.current = 1
          return { ...prev, p: newP }
        }
        return prev
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, distType])

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const { xValues, yValues, mean, variance, xDiscrete, yDiscrete } = useMemo(() => {
    const xVals: number[] = []
    const yVals: number[] = []
    let meanVal = 0
    let varVal = 0
    const xDisc: number[] = []
    const yDisc: number[] = []

    switch (distType) {
      case 'normal':
        meanVal = params.mu
        varVal = params.sigma * params.sigma
        for (let i = 0; i <= 200; i++) {
          const x = params.mu - 4 * params.sigma + (i / 200) * 8 * params.sigma
          xVals.push(x)
          const y = (1 / (params.sigma * Math.sqrt(2 * Math.PI))) *
            Math.exp(-Math.pow(x - params.mu, 2) / (2 * params.sigma * params.sigma))
          yVals.push(y)
        }
        break

      case 'uniform':
        meanVal = (params.a + params.b) / 2
        varVal = Math.pow(params.b - params.a, 2) / 12
        const range = params.b - params.a
        for (let i = 0; i <= 200; i++) {
          const x = params.a - range * 0.2 + (i / 200) * range * 1.4
          xVals.push(x)
          yVals.push(x >= params.a && x <= params.b ? 1 / range : 0)
        }
        break

      case 'exponential':
        meanVal = 1 / params.lambda
        varVal = 1 / (params.lambda * params.lambda)
        for (let i = 0; i <= 200; i++) {
          const x = (i / 200) * 5 / params.lambda
          xVals.push(x)
          yVals.push(params.lambda * Math.exp(-params.lambda * x))
        }
        break

      case 'poisson':
        meanVal = params.lambda
        varVal = params.lambda
        for (let k = 0; k <= Math.min(20, params.lambda * 3); k++) {
          xDisc.push(k)
          yDisc.push((Math.pow(params.lambda, k) * Math.exp(-params.lambda)) / factorial(k))
        }
        break

      case 'binomial':
        meanVal = params.n * params.p
        varVal = params.n * params.p * (1 - params.p)
        for (let k = 0; k <= params.n; k++) {
          xDisc.push(k)
          yDisc.push(combination(params.n, k) * Math.pow(params.p, k) * Math.pow(1 - params.p, params.n - k))
        }
        break
    }

    return { xValues: xVals, yValues: yVals, mean: meanVal, variance: varVal, xDiscrete: xDisc, yDiscrete: yDisc }
  }, [distType, params])

  const isDiscrete = distType === 'poisson' || distType === 'binomial'

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">概率分布</h1>
            <p className="text-gray-600">探索常见概率分布的形态与参数影响</p>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{distInfo[distType].name}</h3>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-4 py-1 rounded-lg text-sm font-medium ${
                  isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isAnimating ? '停止' : '播放动画'}
              </button>
            </div>
            <Plot
              data={isDiscrete ? [
                {
                  x: xDiscrete,
                  y: yDiscrete,
                  type: 'bar',
                  marker: { color: '#8b5cf6' },
                  name: 'P(X=k)',
                },
              ] : [
                {
                  x: xValues,
                  y: yValues,
                  type: 'scatter',
                  mode: 'lines',
                  fill: 'tozeroy',
                  fillcolor: 'rgba(139, 92, 246, 0.3)',
                  line: { color: '#8b5cf6', width: 2 },
                  name: 'f(x)',
                },
              ]}
              layout={{
                autosize: true,
                height: 350,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: isDiscrete ? 'k' : 'x' },
                yaxis: { title: isDiscrete ? 'P(X=k)' : 'f(x)' },
                showlegend: false,
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">概率密度/质量函数</h3>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MathFormula formula={distInfo[distType].formula} />
              </div>
              <p className="text-gray-600 text-sm mt-3">{distInfo[distType].description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">数字特征</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg flex justify-between">
                  <span className="text-blue-600">期望 E(X)</span>
                  <span className="font-mono font-bold text-blue-700">{mean.toFixed(4)}</span>
                </div>
                <div className="p-3 bg-green-50 rounded-lg flex justify-between">
                  <span className="text-green-600">方差 Var(X)</span>
                  <span className="font-mono font-bold text-green-700">{variance.toFixed(4)}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg flex justify-between">
                  <span className="text-amber-600">标准差 σ</span>
                  <span className="font-mono font-bold text-amber-700">{Math.sqrt(variance).toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择分布</h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(distInfo) as DistType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setDistType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    distType === type ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {distInfo[type].name}
                </button>
              ))}
            </div>
          </div>

          {distType === 'normal' && (
            <ParameterPanel
              title="正态分布参数"
              params={[
                { key: 'mu', label: '均值 μ', value: params.mu, min: -5, max: 5, step: 0.5 },
                { key: 'sigma', label: '标准差 σ', value: params.sigma, min: 0.5, max: 3, step: 0.25 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {distType === 'uniform' && (
            <ParameterPanel
              title="均匀分布参数"
              params={[
                { key: 'a', label: '下界 a', value: params.a, min: -5, max: 4, step: 0.5 },
                { key: 'b', label: '上界 b', value: params.b, min: -4, max: 5, step: 0.5 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {distType === 'exponential' && (
            <ParameterPanel
              title="指数分布参数"
              params={[
                { key: 'lambda', label: '率参数 λ', value: params.lambda, min: 0.5, max: 3, step: 0.25 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {distType === 'poisson' && (
            <ParameterPanel
              title="泊松分布参数"
              params={[
                { key: 'lambda', label: '期望 λ', value: params.lambda, min: 1, max: 15, step: 1 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {distType === 'binomial' && (
            <ParameterPanel
              title="二项分布参数"
              params={[
                { key: 'n', label: '试验次数 n', value: params.n, min: 5, max: 50, step: 5 },
                { key: 'p', label: '成功概率 p', value: params.p, min: 0.1, max: 0.9, step: 0.1 },
              ]}
              onChange={handleParamChange}
            />
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">期望与方差公式</h3>
            <div className="space-y-2 text-sm">
              <MathFormula formula="E(X) = \int_{-\infty}^{\infty} x f(x) dx" />
              <MathFormula formula="Var(X) = E(X^2) - [E(X)]^2" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
