import { useState, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { monteCarloNarration } from '../../narrations/scripts/monte-carlo'

export default function MonteCarloExperiment() {
  const [points, setPoints] = useState<{ x: number; y: number; inside: boolean }[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(10)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(monteCarloNarration)
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

  const piEstimate = points.length > 0
    ? (4 * points.filter((p) => p.inside).length) / points.length
    : 0

  const addPoints = useCallback(() => {
    const newPoints: { x: number; y: number; inside: boolean }[] = []
    for (let i = 0; i < speed; i++) {
      const x = Math.random() * 2 - 1
      const y = Math.random() * 2 - 1
      const inside = x * x + y * y <= 1
      newPoints.push({ x, y, inside })
    }
    setPoints((prev) => [...prev, ...newPoints])
  }, [speed])

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        addPoints()
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isRunning, addPoints])

  const reset = () => {
    setIsRunning(false)
    setPoints([])
  }

  const insidePoints = points.filter((p) => p.inside)
  const outsidePoints = points.filter((p) => !p.inside)

  // 圆的边界
  const circleTheta = Array.from({ length: 100 }, (_, i) => (i / 99) * 2 * Math.PI)
  const circleX = circleTheta.map(Math.cos)
  const circleY = circleTheta.map(Math.sin)

  // 误差历史
  const errorHistory = points.length > 0
    ? Array.from({ length: Math.min(100, Math.floor(points.length / 10)) }, (_, i) => {
        const n = (i + 1) * Math.floor(points.length / 100) || (i + 1) * 10
        const inside = points.slice(0, n).filter((p) => p.inside).length
        return { n, pi: (4 * inside) / n, error: Math.abs((4 * inside) / n - Math.PI) }
      })
    : []

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">蒙特卡洛方法</h1>
            <p className="text-gray-600">用随机点估算圆周率 π</p>
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
            <h3 className="text-lg font-semibold mb-2">随机投点</h3>
            <Plot
              data={[
                {
                  x: circleX,
                  y: circleY,
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#3b82f6', width: 2 },
                  name: '单位圆',
                },
                {
                  x: insidePoints.slice(-2000).map((p) => p.x),
                  y: insidePoints.slice(-2000).map((p) => p.y),
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { color: '#22c55e', size: 3 },
                  name: '圆内',
                },
                {
                  x: outsidePoints.slice(-2000).map((p) => p.x),
                  y: outsidePoints.slice(-2000).map((p) => p.y),
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { color: '#ef4444', size: 3 },
                  name: '圆外',
                },
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 30, l: 30 },
                xaxis: { range: [-1.1, 1.1], scaleanchor: 'y', scaleratio: 1 },
                yaxis: { range: [-1.1, 1.1] },
                showlegend: false,
                shapes: [{
                  type: 'rect',
                  x0: -1, y0: -1, x1: 1, y1: 1,
                  line: { color: '#94a3b8', width: 1 },
                }],
              }}
              config={{ responsive: true, displaylogo: false }}
              className="w-full"
            />
          </div>

          {errorHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">收敛过程</h3>
              <Plot
                data={[
                  {
                    x: errorHistory.map((e) => e.n),
                    y: errorHistory.map((e) => e.pi),
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#8b5cf6', width: 2 },
                    name: 'π 估计值',
                  },
                  {
                    x: [0, errorHistory[errorHistory.length - 1]?.n || 1000],
                    y: [Math.PI, Math.PI],
                    type: 'scatter' as const,
                    mode: 'lines' as const,
                    line: { color: '#ef4444', width: 2, dash: 'dash' },
                    name: 'π 真值',
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 200,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: '点数' } },
                  yaxis: { title: { text: 'π 估计值' }, range: [2.5, 4] },
                  legend: { orientation: 'h', y: -0.25 },
                }}
                config={{ responsive: true, displaylogo: false }}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">控制面板</h3>
            <div className="space-y-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isRunning ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isRunning ? '暂停' : '开始'}
              </button>
              <button
                onClick={reset}
                className="w-full py-2 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                重置
              </button>
              <div>
                <label className="text-sm text-gray-600">速度 (每帧点数)</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
                <div className="text-right text-sm text-gray-500">{speed}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">估算结果</h3>
            <div className="space-y-3">
              <div className="p-3 bg-purple-100 rounded-lg text-center">
                <div className="text-sm text-purple-600">π 估计值</div>
                <div className="text-3xl font-bold text-purple-700">{piEstimate.toFixed(6)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded flex justify-between">
                <span className="text-gray-600">总点数</span>
                <span className="font-mono font-bold">{points.length.toLocaleString()}</span>
              </div>
              <div className="p-2 bg-green-50 rounded flex justify-between">
                <span className="text-green-600">圆内点数</span>
                <span className="font-mono font-bold">{insidePoints.length.toLocaleString()}</span>
              </div>
              <div className="p-2 bg-blue-50 rounded flex justify-between">
                <span className="text-blue-600">误差</span>
                <span className="font-mono font-bold">{Math.abs(piEstimate - Math.PI).toFixed(6)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">原理</h3>
            <div className="space-y-2">
              <MathFormula formula="\frac{\text{圆内点数}}{\text{总点数}} \approx \frac{\pi r^2}{(2r)^2} = \frac{\pi}{4}" />
              <MathFormula formula="\pi \approx 4 \times \frac{\text{圆内点数}}{\text{总点数}}" />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              在正方形内随机投点，落入内切圆的概率等于面积比 π/4。
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
