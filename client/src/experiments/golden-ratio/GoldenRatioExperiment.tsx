import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { goldenRatioNarration } from '../../narrations/scripts/golden-ratio'

export default function GoldenRatioExperiment() {
  const [fibCount, setFibCount] = useState(15)
  const [spiralTurns, setSpiralTurns] = useState(6)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedFibIndex, setAnimatedFibIndex] = useState(2)
  const [showPresenter, setShowPresenter] = useState(false)
  const animationRef = useRef<number | null>(null)

  const PHI = (1 + Math.sqrt(5)) / 2

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(goldenRatioNarration)
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

  // 动画效果：逐步展示斐波那契数列收敛
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimatedFibIndex((prev) => {
        if (prev >= fibCount - 1) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 400) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, fibCount])

  // 斐波那契数列
  const fibonacci = useMemo(() => {
    const fib = [1, 1]
    for (let i = 2; i < fibCount; i++) {
      fib.push(fib[i - 1] + fib[i - 2])
    }
    return fib
  }, [fibCount])

  // 斐波那契比值收敛
  const ratios = useMemo(() => {
    return fibonacci.slice(1).map((val, i) => ({
      n: i + 2,
      ratio: val / fibonacci[i],
    }))
  }, [fibonacci])

  // 黄金螺线
  const goldenSpiral = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    const points = 500
    for (let i = 0; i <= points; i++) {
      const theta = (i / points) * spiralTurns * 2 * Math.PI
      const r = Math.pow(PHI, (2 * theta) / Math.PI)
      x.push(r * Math.cos(theta))
      y.push(r * Math.sin(theta))
    }
    return { x, y }
  }, [spiralTurns, PHI])

  // 向日葵种子排列
  const sunflowerSeeds = useMemo(() => {
    const x: number[] = []
    const y: number[] = []
    const n = 500
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // 约137.5度

    for (let i = 1; i <= n; i++) {
      const theta = i * goldenAngle
      const r = Math.sqrt(i)
      x.push(r * Math.cos(theta))
      y.push(r * Math.sin(theta))
    }
    return { x, y }
  }, [])

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">黄金分割与斐波那契</h1>
            <p className="text-gray-600">探索自然界中最美的数学比例</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">斐波那契比值收敛</h3>
                <button
                  onClick={() => {
                    if (!isAnimating) {
                      setAnimatedFibIndex(2)
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
                    x: ratios.slice(0, isAnimating ? animatedFibIndex : ratios.length).map(r => r.n),
                    y: ratios.slice(0, isAnimating ? animatedFibIndex : ratios.length).map(r => r.ratio),
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: '#8b5cf6', width: 2 },
                    marker: { size: 6 },
                    name: 'F(n)/F(n-1)',
                  },
                  {
                    x: [2, fibCount],
                    y: [PHI, PHI],
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#ef4444', width: 2, dash: 'dash' },
                    name: 'φ',
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: 'n' },
                  yaxis: { title: 'F(n)/F(n-1)', range: [1, 2.2] },
                  legend: { orientation: 'h', y: -0.2 },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">黄金螺线</h3>
              <Plot
                data={[
                  {
                    x: goldenSpiral.x,
                    y: goldenSpiral.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#f59e0b', width: 2 },
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 30, l: 30 },
                  xaxis: { scaleanchor: 'y', scaleratio: 1, showgrid: false },
                  yaxis: { showgrid: false },
                  showlegend: false,
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">向日葵种子排列 (黄金角)</h3>
            <Plot
              data={[
                {
                  x: sunflowerSeeds.x,
                  y: sunflowerSeeds.y,
                  type: 'scatter',
                  mode: 'markers',
                  marker: {
                    size: 5,
                    color: sunflowerSeeds.x.map((_, i) => i),
                    colorscale: 'YlOrBr',
                  },
                },
              ]}
              layout={{
                autosize: true,
                height: 350,
                margin: { t: 30, r: 30, b: 30, l: 30 },
                xaxis: { scaleanchor: 'y', scaleratio: 1, showgrid: false, zeroline: false },
                yaxis: { showgrid: false, zeroline: false },
                showlegend: false,
              }}
              config={{ responsive: true }}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">
              每颗种子相对于前一颗旋转黄金角 (≈137.5°)，这种排列最大化了空间利用率。
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">黄金比例 φ</h3>
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-amber-700">{PHI.toFixed(10)}</div>
            </div>
            <div className="mt-3 space-y-2">
              <MathFormula formula="\varphi = \frac{1 + \sqrt{5}}{2}" />
              <MathFormula formula="\varphi^2 = \varphi + 1" />
              <MathFormula formula="\frac{1}{\varphi} = \varphi - 1" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">斐波那契项数: {fibCount}</label>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={fibCount}
                  onChange={(e) => setFibCount(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">螺线圈数: {spiralTurns}</label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={spiralTurns}
                  onChange={(e) => setSpiralTurns(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">斐波那契数列</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MathFormula formula="F_n = F_{n-1} + F_{n-2}" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {fibonacci.slice(0, 12).map((f, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                  {f}
                </span>
              ))}
              {fibCount > 12 && <span className="px-2 py-1 text-gray-400">...</span>}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">黄金角</h3>
            <div className="p-3 bg-green-50 rounded-lg">
              <MathFormula formula="\theta = \frac{2\pi}{\varphi^2} \approx 137.5°" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              黄金角是圆周被黄金比例分割后较小弧所对应的圆心角。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">自然中的黄金比例</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 鹦鹉螺壳的螺旋</li>
              <li>• 向日葵种子排列</li>
              <li>• 松果鳞片排列</li>
              <li>• 人体比例</li>
              <li>• 银河系旋臂</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
