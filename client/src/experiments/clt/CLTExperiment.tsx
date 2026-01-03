import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'

type ExperimentType = 'coin' | 'dice' | 'uniform'

export default function CLTExperiment() {
  const [params, setParams] = useState({
    sampleSize: 30,
    numSamples: 1000,
  })
  const [expType, setExpType] = useState<ExperimentType>('coin')
  const [samples, setSamples] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const runExperiment = useCallback(() => {
    const newSamples: number[] = []

    for (let i = 0; i < params.numSamples; i++) {
      let sum = 0
      for (let j = 0; j < params.sampleSize; j++) {
        switch (expType) {
          case 'coin':
            sum += Math.random() < 0.5 ? 0 : 1
            break
          case 'dice':
            sum += Math.floor(Math.random() * 6) + 1
            break
          case 'uniform':
            sum += Math.random()
            break
        }
      }
      newSamples.push(sum / params.sampleSize)
    }

    setSamples(newSamples)
  }, [params, expType])

  // 动画效果：逐步增加样本量
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setParams((prev) => {
        const nextSize = prev.sampleSize + 1
        if (nextSize > 100) {
          setIsAnimating(false)
          return prev
        }
        return { ...prev, sampleSize: nextSize }
      })
      // 每次参数变化后重新运行实验
      runExperiment()
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 100) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, runExperiment])

  const { histogram, normalCurve, stats } = useMemo(() => {
    if (samples.length === 0) {
      return { histogram: { x: [], counts: [] }, normalCurve: { x: [], y: [] }, stats: { mean: 0, std: 0 } }
    }

    // 计算统计量
    const mean = samples.reduce((a, b) => a + b, 0) / samples.length
    const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length
    const std = Math.sqrt(variance)

    // 理论值
    let theoreticalMean = 0
    let theoreticalStd = 0
    switch (expType) {
      case 'coin':
        theoreticalMean = 0.5
        theoreticalStd = Math.sqrt(0.25 / params.sampleSize)
        break
      case 'dice':
        theoreticalMean = 3.5
        theoreticalStd = Math.sqrt(35 / 12 / params.sampleSize)
        break
      case 'uniform':
        theoreticalMean = 0.5
        theoreticalStd = Math.sqrt(1 / 12 / params.sampleSize)
        break
    }

    // 正态曲线
    const xMin = mean - 4 * std
    const xMax = mean + 4 * std
    const normalX: number[] = []
    const normalY: number[] = []
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (i / 100) * (xMax - xMin)
      normalX.push(x)
      normalY.push(
        (1 / (theoreticalStd * Math.sqrt(2 * Math.PI))) *
        Math.exp(-Math.pow(x - theoreticalMean, 2) / (2 * theoreticalStd * theoreticalStd))
      )
    }

    return {
      histogram: { x: samples },
      normalCurve: { x: normalX, y: normalY },
      stats: { mean, std, theoreticalMean, theoreticalStd },
    }
  }, [samples, expType, params.sampleSize])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">中心极限定理</h1>
        <p className="text-gray-600">观察样本均值如何趋向正态分布</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">样本均值分布 (n={params.numSamples}次实验)</h3>
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setParams((prev) => ({ ...prev, sampleSize: 1 }))
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
            {samples.length > 0 ? (
              <Plot
                data={[
                  {
                    x: histogram.x,
                    type: 'histogram',
                    histnorm: 'probability density',
                    marker: { color: 'rgba(139, 92, 246, 0.6)' },
                    name: '样本均值直方图',
                  },
                  {
                    x: normalCurve.x,
                    y: normalCurve.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#ef4444', width: 3 },
                    name: '理论正态曲线',
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 350,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: '样本均值' },
                  yaxis: { title: '概率密度' },
                  legend: { orientation: 'h', y: -0.15 },
                  bargap: 0.05,
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            ) : (
              <div className="h-[350px] flex items-center justify-center text-gray-400">
                点击"运行实验"开始
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">实验统计</h3>
              {samples.length > 0 ? (
                <div className="space-y-2">
                  <div className="p-2 bg-purple-50 rounded flex justify-between">
                    <span className="text-purple-600">样本均值的均值</span>
                    <span className="font-mono font-bold">{stats.mean.toFixed(4)}</span>
                  </div>
                  <div className="p-2 bg-blue-50 rounded flex justify-between">
                    <span className="text-blue-600">样本均值的标准差</span>
                    <span className="font-mono font-bold">{stats.std.toFixed(4)}</span>
                  </div>
                  <div className="p-2 bg-green-50 rounded flex justify-between">
                    <span className="text-green-600">理论均值</span>
                    <span className="font-mono font-bold">{stats.theoreticalMean?.toFixed(4)}</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded flex justify-between">
                    <span className="text-amber-600">理论标准差</span>
                    <span className="font-mono font-bold">{stats.theoreticalStd?.toFixed(4)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4">等待实验数据</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">中心极限定理</h3>
              <div className="space-y-2">
                <MathFormula formula="\bar{X}_n \xrightarrow{d} N(\mu, \frac{\sigma^2}{n})" />
                <p className="text-sm text-gray-600 mt-2">
                  无论原始分布是什么，当样本量n足够大时，样本均值的分布趋近于正态分布。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择实验</h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setExpType('coin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  expType === 'coin' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                抛硬币 (0或1)
              </button>
              <button
                onClick={() => setExpType('dice')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  expType === 'dice' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                掷骰子 (1-6)
              </button>
              <button
                onClick={() => setExpType('uniform')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  expType === 'uniform' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                均匀分布 [0,1]
              </button>
            </div>
          </div>

          <ParameterPanel
            title="实验参数"
            params={[
              { key: 'sampleSize', label: '每次样本量', value: params.sampleSize, min: 5, max: 100, step: 5 },
              { key: 'numSamples', label: '实验次数', value: params.numSamples, min: 100, max: 5000, step: 100 },
            ]}
            onChange={handleParamChange}
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <button
              onClick={runExperiment}
              className="w-full py-3 px-4 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              运行实验
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">标准误差公式</h3>
            <MathFormula formula="SE = \frac{\sigma}{\sqrt{n}}" />
            <p className="text-sm text-gray-600 mt-2">
              样本量越大，样本均值的标准差越小，分布越集中。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
