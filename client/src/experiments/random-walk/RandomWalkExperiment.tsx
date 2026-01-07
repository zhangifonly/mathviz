import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { randomWalkNarration } from '../../narrations/scripts/random-walk'

type WalkType = '1d' | '2d' | 'biased' | 'levy'

export default function RandomWalkExperiment() {
  const [showPresenter, setShowPresenter] = useState(false)
  const narration = useNarrationOptional()

  const [walkType, setWalkType] = useState<WalkType>('2d')
  const [numWalkers, setNumWalkers] = useState(5)
  const [steps, setSteps] = useState(500)
  const [bias, setBias] = useState(0.1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const animationRef = useRef<number | null>(null)

  // 讲解系统
  useEffect(() => {
    if (narration) {
      narration.loadScript(randomWalkNarration)
    }
  }, [narration])

  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])

  // 生成随机游走路径
  const walks = useMemo(() => {
    const allWalks: { x: number[]; y: number[] }[] = []

    for (let w = 0; w < numWalkers; w++) {
      const x: number[] = [0]
      const y: number[] = [0]

      for (let i = 0; i < steps; i++) {
        let dx = 0, dy = 0

        switch (walkType) {
          case '1d':
            dx = Math.random() < 0.5 ? 1 : -1
            dy = 0
            break

          case '2d':
            const dir = Math.floor(Math.random() * 4)
            if (dir === 0) dx = 1
            else if (dir === 1) dx = -1
            else if (dir === 2) dy = 1
            else dy = -1
            break

          case 'biased':
            dx = Math.random() < (0.5 + bias) ? 1 : -1
            dy = Math.random() < 0.5 ? 1 : -1
            break

          case 'levy':
            // Levy flight: 偶尔有大跳跃
            const r = Math.random()
            const stepSize = r < 0.9 ? 1 : Math.floor(Math.random() * 10) + 5
            const angle = Math.random() * 2 * Math.PI
            dx = stepSize * Math.cos(angle)
            dy = stepSize * Math.sin(angle)
            break
        }

        x.push(x[x.length - 1] + dx)
        y.push(y[y.length - 1] + dy)
      }

      allWalks.push({ x, y })
    }

    return allWalks
  }, [walkType, numWalkers, steps, bias])

  // 动画
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setCurrentStep((s) => {
        if (s >= steps) {
          setIsAnimating(false)
          return s
        }
        return s + 2
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating, steps])

  // 统计分析
  const statistics = useMemo(() => {
    const finalPositions = walks.map((w) => ({
      x: w.x[currentStep] || w.x[w.x.length - 1],
      y: w.y[currentStep] || w.y[w.y.length - 1],
    }))

    const meanX = finalPositions.reduce((s, p) => s + p.x, 0) / numWalkers
    const meanY = finalPositions.reduce((s, p) => s + p.y, 0) / numWalkers

    const distances = finalPositions.map((p) => Math.sqrt(p.x * p.x + p.y * p.y))
    const meanDistance = distances.reduce((s, d) => s + d, 0) / numWalkers
    const rmsDistance = Math.sqrt(distances.reduce((s, d) => s + d * d, 0) / numWalkers)

    // 理论值 (对于简单随机游走)
    const theoreticalRMS = Math.sqrt(currentStep || 1)

    return {
      meanX,
      meanY,
      meanDistance,
      rmsDistance,
      theoreticalRMS,
      finalPositions,
    }
  }, [walks, currentStep, numWalkers])

  // MSD 随时间变化
  const msdOverTime = useMemo(() => {
    const times: number[] = []
    const msd: number[] = []

    for (let t = 1; t <= Math.min(currentStep, steps); t += 5) {
      times.push(t)

      let sumSqDist = 0
      for (const walk of walks) {
        const x = walk.x[t] || 0
        const y = walk.y[t] || 0
        sumSqDist += x * x + y * y
      }

      msd.push(sumSqDist / numWalkers)
    }

    return { times, msd }
  }, [walks, currentStep, steps, numWalkers])

  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">随机游走</h1>
            <p className="text-gray-600">探索布朗运动和扩散过程</p>
          </div>
          <button
            onClick={handleStartNarration}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
          >
            开始讲解
          </button>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">随机游走轨迹</h3>
            <Plot
              data={walks.map((walk, i) => ({
                x: walk.x.slice(0, currentStep + 1),
                y: walkType === '1d'
                  ? Array(currentStep + 1).fill(0).map((_, j) => j)
                  : walk.y.slice(0, currentStep + 1),
                type: 'scatter' as const,
                mode: 'lines' as const,
                line: { color: colors[i % colors.length], width: 1.5 },
                name: `Walker ${i + 1}`,
              } as const))}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: walkType === '1d' ? '位置' : 'X' } },
                yaxis: { title: { text: walkType === '1d' ? '时间步' : 'Y' } },
                showlegend: numWalkers <= 5,
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => {
                  setCurrentStep(0)
                  setIsAnimating(true)
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                开始
              </button>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-4 py-2 rounded-lg ${
                  isAnimating ? 'bg-red-500' : 'bg-blue-500'
                } text-white`}
              >
                {isAnimating ? '暂停' : '继续'}
              </button>
              <button
                onClick={() => setCurrentStep(steps)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                跳到结束
              </button>
              <span className="text-sm text-gray-600">
                步数: {currentStep} / {steps}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">均方位移 (MSD)</h3>
              <Plot
                data={[
                  {
                    x: msdOverTime.times,
                    y: msdOverTime.msd,
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#8b5cf6', width: 2 },
                    name: '实测 MSD',
                  } as const,
                  {
                    x: msdOverTime.times,
                    y: msdOverTime.times.map((t) => (walkType === '1d' ? t : 2 * t)),
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#94a3b8', width: 2, dash: 'dash' as const },
                    name: '理论值',
                  } as const,
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: '时间 t' } },
                  yaxis: { title: { text: '⟨r²⟩' } },
                  legend: { orientation: 'h', y: -0.2 },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">终点分布</h3>
              <Plot
                data={[
                  {
                    x: statistics.finalPositions.map((p) => p.x),
                    y: statistics.finalPositions.map((p) => p.y),
                    type: 'scatter' as const,
                    mode: 'markers' as const,
                    marker: { size: 8, color: '#3b82f6' },
                  } as const,
                  {
                    x: [0],
                    y: [0],
                    type: 'scatter' as const,
                    mode: 'markers' as const,
                    marker: { size: 12, color: '#ef4444', symbol: 'x' as const },
                    name: '起点',
                  } as const,
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: 'X' } },
                  yaxis: { title: { text: 'Y' }, scaleanchor: 'x', scaleratio: 1 },
                  showlegend: false,
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">统计信息</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {statistics.meanX.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">平均 X</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">
                  {statistics.meanY.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">平均 Y</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {statistics.rmsDistance.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">RMS 距离</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-700">
                  {statistics.theoreticalRMS.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">理论 √t</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">游走类型</h3>
            <div className="space-y-2">
              {[
                { type: '1d' as const, name: '一维随机游走' },
                { type: '2d' as const, name: '二维随机游走' },
                { type: 'biased' as const, name: '有偏随机游走' },
                { type: 'levy' as const, name: 'Lévy 飞行' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    setWalkType(item.type)
                    setCurrentStep(0)
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    walkType === item.type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">游走者数量: {numWalkers}</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={numWalkers}
                  onChange={(e) => {
                    setNumWalkers(parseInt(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">步数: {steps}</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={steps}
                  onChange={(e) => {
                    setSteps(parseInt(e.target.value))
                    setCurrentStep(0)
                  }}
                  className="w-full"
                />
              </div>
              {walkType === 'biased' && (
                <div>
                  <label className="text-sm text-gray-600">偏置: {bias.toFixed(2)}</label>
                  <input
                    type="range"
                    min="-0.3"
                    max="0.3"
                    step="0.01"
                    value={bias}
                    onChange={(e) => {
                      setBias(parseFloat(e.target.value))
                      setCurrentStep(0)
                    }}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">扩散定律</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MathFormula formula="\langle r^2 \rangle = 2Dt" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              均方位移与时间成正比，D 为扩散系数。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">中心极限定理</h3>
            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <MathFormula formula="P(x,t) \sim \frac{1}{\sqrt{4\pi Dt}} e^{-x^2/4Dt}" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              大量步数后，位置分布趋近高斯分布。
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
