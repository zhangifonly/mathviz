import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { chaosNarration } from '../../narrations/scripts/chaos'

type ChaosSystem = 'logistic' | 'lorenz' | 'henon'

export default function ChaosExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [system, setSystem] = useState<ChaosSystem>('logistic')
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(chaosNarration)
    }
  }, [narration])

  // 开始讲解
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
  const [logisticR, setLogisticR] = useState(3.5)
  const [lorenzSigma, setLorenzSigma] = useState(10)
  const [lorenzRho, setLorenzRho] = useState(28)
  const [lorenzBeta, setLorenzBeta] = useState(8 / 3)
  const [iterations, setIterations] = useState(100)
  const [isRunning, setIsRunning] = useState(false)
  const animationRef = useRef<number | null>(null)
  const [currentIter, setCurrentIter] = useState(0)

  // Logistic Map: x_{n+1} = r * x_n * (1 - x_n)
  // (logisticData used for potential future enhancements)

  // Logistic Map 分岔图
  const bifurcationData = useMemo(() => {
    const rValues: number[] = []
    const xValues: number[] = []

    for (let r = 2.5; r <= 4; r += 0.005) {
      let x = 0.5
      // 预迭代
      for (let i = 0; i < 200; i++) {
        x = r * x * (1 - x)
      }
      // 收集数据
      for (let i = 0; i < 100; i++) {
        x = r * x * (1 - x)
        rValues.push(r)
        xValues.push(x)
      }
    }

    return { r: rValues, x: xValues }
  }, [])

  // Lorenz 吸引子
  const lorenzData = useMemo(() => {
    const dt = 0.01
    const steps = 5000
    let x = 1, y = 1, z = 1
    const xs: number[] = [], ys: number[] = [], zs: number[] = []

    for (let i = 0; i < steps; i++) {
      xs.push(x)
      ys.push(y)
      zs.push(z)

      const dx = lorenzSigma * (y - x)
      const dy = x * (lorenzRho - z) - y
      const dz = x * y - lorenzBeta * z

      x += dx * dt
      y += dy * dt
      z += dz * dt
    }

    return { x: xs, y: ys, z: zs }
  }, [lorenzSigma, lorenzRho, lorenzBeta])

  // Henon Map
  const henonData = useMemo(() => {
    const a = 1.4, b = 0.3
    let x = 0, y = 0
    const xs: number[] = [], ys: number[] = []

    for (let i = 0; i < 10000; i++) {
      xs.push(x)
      ys.push(y)
      const newX = 1 - a * x * x + y
      const newY = b * x
      x = newX
      y = newY
    }

    return { x: xs, y: ys }
  }, [])

  // 动画
  useEffect(() => {
    if (isRunning && system === 'logistic' && currentIter < iterations - 1) {
      animationRef.current = window.setTimeout(() => {
        setCurrentIter((i) => i + 1)
      }, 50)
    } else if (currentIter >= iterations - 1) {
      setIsRunning(false)
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [isRunning, currentIter, iterations, system])

  // 绘制 Cobweb 图
  useEffect(() => {
    if (system !== 'logistic') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40

    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, width, height)

    const toCanvas = (x: number, y: number) => ({
      cx: padding + x * (width - 2 * padding),
      cy: height - padding - y * (height - 2 * padding),
    })

    // 绘制 y = x 线
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 1
    ctx.beginPath()
    const { cx: x1, cy: y1 } = toCanvas(0, 0)
    const { cx: x2, cy: y2 } = toCanvas(1, 1)
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    // 绘制抛物线 y = rx(1-x)
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let x = 0; x <= 1; x += 0.01) {
      const y = logisticR * x * (1 - x)
      const { cx, cy } = toCanvas(x, Math.min(y, 1))
      if (x === 0) ctx.moveTo(cx, cy)
      else ctx.lineTo(cx, cy)
    }
    ctx.stroke()

    // 绘制 Cobweb
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 1.5
    ctx.beginPath()

    let x = 0.5
    const { cx: startX, cy: startY } = toCanvas(x, 0)
    ctx.moveTo(startX, startY)

    for (let i = 0; i <= currentIter; i++) {
      const y = logisticR * x * (1 - x)
      const { cx: px, cy: py } = toCanvas(x, Math.min(y, 1))
      ctx.lineTo(px, py)

      const { cx: nx, cy: ny } = toCanvas(Math.min(y, 1), Math.min(y, 1))
      ctx.lineTo(nx, ny)

      x = y
      if (x > 1 || x < 0) break
    }
    ctx.stroke()

    // 坐标轴标签
    ctx.fillStyle = 'white'
    ctx.font = '12px sans-serif'
    ctx.fillText('0', padding - 15, height - padding + 15)
    ctx.fillText('1', width - padding, height - padding + 15)
    ctx.fillText('1', padding - 15, padding)
    ctx.fillText('xₙ', width / 2, height - 10)
    ctx.fillText('xₙ₊₁', 5, height / 2)

  }, [system, logisticR, currentIter])

  const startAnimation = () => {
    setCurrentIter(0)
    setIsRunning(true)
  }

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">混沌理论</h1>
          <p className="text-gray-600">探索确定性系统中的混沌行为</p>
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
          {system === 'logistic' && (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">Cobweb 图 (r = {logisticR.toFixed(2)})</h3>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="w-full max-w-md mx-auto border border-gray-300 rounded"
                />
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={startAnimation}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    开始动画
                  </button>
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    {isRunning ? '暂停' : '继续'}
                  </button>
                  <span className="text-sm text-gray-600">迭代: {currentIter}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">分岔图</h3>
                <Plot
                  data={[
                    {
                      x: bifurcationData.r,
                      y: bifurcationData.x,
                      type: 'scattergl',
                      mode: 'markers',
                      marker: { size: 0.5, color: '#8b5cf6' },
                    },
                    {
                      x: [logisticR, logisticR],
                      y: [0, 1],
                      type: 'scatter',
                      mode: 'lines',
                      line: { color: '#ef4444', width: 2 },
                      name: '当前 r',
                    },
                  ]}
                  layout={{
                    autosize: true,
                    height: 300,
                    margin: { t: 30, r: 30, b: 40, l: 50 },
                    xaxis: { title: 'r', range: [2.5, 4] },
                    yaxis: { title: 'x', range: [0, 1] },
                    showlegend: false,
                  }}
                  config={{ responsive: true }}
                  className="w-full"
                />
              </div>
            </>
          )}

          {system === 'lorenz' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">Lorenz 吸引子</h3>
              <Plot
                data={[
                  {
                    x: lorenzData.x,
                    y: lorenzData.y,
                    z: lorenzData.z,
                    type: 'scatter3d',
                    mode: 'lines',
                    line: { color: lorenzData.z, colorscale: 'Viridis', width: 1 },
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 500,
                  margin: { t: 30, r: 30, b: 30, l: 30 },
                  scene: {
                    xaxis: { title: 'X' },
                    yaxis: { title: 'Y' },
                    zaxis: { title: 'Z' },
                  },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          )}

          {system === 'henon' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">Hénon 吸引子</h3>
              <Plot
                data={[
                  {
                    x: henonData.x,
                    y: henonData.y,
                    type: 'scattergl',
                    mode: 'markers',
                    marker: { size: 1, color: '#8b5cf6' },
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 400,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: 'x' },
                  yaxis: { title: 'y', scaleanchor: 'x', scaleratio: 1 },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">混沌特征</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>敏感依赖性</strong>：蝴蝶效应</li>
                <li>• <strong>确定性</strong>：无随机性</li>
                <li>• <strong>非周期性</strong>：永不重复</li>
                <li>• <strong>有界性</strong>：在有限区域内</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">Logistic Map</h3>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MathFormula formula="x_{n+1} = rx_n(1-x_n)" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                r &lt; 3: 稳定点<br />
                r ≈ 3.57: 混沌开始<br />
                r = 4: 完全混沌
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择系统</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSystem('logistic')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  system === 'logistic' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Logistic Map
              </button>
              <button
                onClick={() => setSystem('lorenz')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  system === 'lorenz' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lorenz 吸引子
              </button>
              <button
                onClick={() => setSystem('henon')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  system === 'henon' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hénon 吸引子
              </button>
            </div>
          </div>

          {system === 'logistic' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数设置</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">参数 r: {logisticR.toFixed(2)}</label>
                  <input
                    type="range"
                    min="2.5"
                    max="4"
                    step="0.01"
                    value={logisticR}
                    onChange={(e) => {
                      setLogisticR(parseFloat(e.target.value))
                      setCurrentIter(0)
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">迭代次数: {iterations}</label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {system === 'lorenz' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Lorenz 参数</h3>
              <div className="p-3 bg-blue-50 rounded-lg mb-3">
                <MathFormula formula="\begin{cases} \dot{x} = \sigma(y-x) \\ \dot{y} = x(\rho-z)-y \\ \dot{z} = xy - \beta z \end{cases}" />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">σ: {lorenzSigma.toFixed(1)}</label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.5"
                    value={lorenzSigma}
                    onChange={(e) => setLorenzSigma(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">ρ: {lorenzRho.toFixed(1)}</label>
                  <input
                    type="range"
                    min="20"
                    max="35"
                    step="0.5"
                    value={lorenzRho}
                    onChange={(e) => setLorenzRho(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">β: {lorenzBeta.toFixed(2)}</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={lorenzBeta}
                    onChange={(e) => setLorenzBeta(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {system === 'henon' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Hénon Map</h3>
              <div className="p-3 bg-green-50 rounded-lg">
                <MathFormula formula="\begin{cases} x_{n+1} = 1 - ax_n^2 + y_n \\ y_{n+1} = bx_n \end{cases}" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                经典参数: a = 1.4, b = 0.3<br />
                产生著名的 Hénon 奇异吸引子
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">费根鲍姆常数</h3>
            <div className="p-3 bg-amber-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-700">δ ≈ 4.669...</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              分岔点之间的比值趋近于此普适常数，适用于所有单峰映射。
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
