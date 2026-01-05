import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { bezierNarration } from '../../narrations/scripts/bezier'

interface Point {
  x: number
  y: number
}

export default function BezierExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [controlPoints, setControlPoints] = useState<Point[]>([
    { x: 100, y: 300 },
    { x: 200, y: 100 },
    { x: 400, y: 100 },
    { x: 500, y: 300 },
  ])
  const [t, setT] = useState(0.5)
  const [showConstruction, setShowConstruction] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(bezierNarration)
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

  // 计算贝塞尔曲线上的点
  const bezierPoint = (points: Point[], t: number): Point => {
    if (points.length === 1) return points[0]

    const newPoints: Point[] = []
    for (let i = 0; i < points.length - 1; i++) {
      newPoints.push({
        x: (1 - t) * points[i].x + t * points[i + 1].x,
        y: (1 - t) * points[i].y + t * points[i + 1].y,
      })
    }

    return bezierPoint(newPoints, t)
  }

  // 计算所有中间层的点（用于可视化构造过程）
  const constructionLayers = useMemo(() => {
    const layers: Point[][] = [controlPoints]
    let currentLayer = controlPoints

    while (currentLayer.length > 1) {
      const newLayer: Point[] = []
      for (let i = 0; i < currentLayer.length - 1; i++) {
        newLayer.push({
          x: (1 - t) * currentLayer[i].x + t * currentLayer[i + 1].x,
          y: (1 - t) * currentLayer[i].y + t * currentLayer[i + 1].y,
        })
      }
      layers.push(newLayer)
      currentLayer = newLayer
    }

    return layers
  }, [controlPoints, t])

  // 生成完整曲线
  const curvePoints = useMemo(() => {
    const points: Point[] = []
    for (let i = 0; i <= 100; i++) {
      points.push(bezierPoint(controlPoints, i / 100))
    }
    return points
  }, [controlPoints])

  // 动画
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setT((prev) => {
        const next = prev + 0.005
        if (next > 1) {
          setIsAnimating(false)
          return 0
        }
        return next
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 绘制控制多边形
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(controlPoints[0].x, controlPoints[0].y)
    for (let i = 1; i < controlPoints.length; i++) {
      ctx.lineTo(controlPoints[i].x, controlPoints[i].y)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制贝塞尔曲线
    ctx.strokeStyle = '#8b5cf6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(curvePoints[0].x, curvePoints[0].y)
    for (let i = 1; i < curvePoints.length; i++) {
      ctx.lineTo(curvePoints[i].x, curvePoints[i].y)
    }
    ctx.stroke()

    // 绘制构造过程
    if (showConstruction) {
      const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444']

      for (let layer = 1; layer < constructionLayers.length; layer++) {
        const points = constructionLayers[layer]
        const color = colors[(layer - 1) % colors.length]

        // 绘制连线
        if (points.length > 1) {
          ctx.strokeStyle = color
          ctx.lineWidth = 1.5
          ctx.globalAlpha = 0.5
          ctx.beginPath()
          ctx.moveTo(points[0].x, points[0].y)
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y)
          }
          ctx.stroke()
          ctx.globalAlpha = 1
        }

        // 绘制点
        for (const point of points) {
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
    }

    // 绘制控制点
    for (let i = 0; i < controlPoints.length; i++) {
      const point = controlPoints[i]

      ctx.fillStyle = '#1e293b'
      ctx.beginPath()
      ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI)
      ctx.fill()

      ctx.fillStyle = 'white'
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`P${i}`, point.x, point.y)
    }

    // 绘制当前点
    const currentPoint = bezierPoint(controlPoints, t)
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(currentPoint.x, currentPoint.y, 8, 0, 2 * Math.PI)
    ctx.fill()

  }, [controlPoints, curvePoints, constructionLayers, t, showConstruction])

  // 鼠标交互
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    for (let i = 0; i < controlPoints.length; i++) {
      const dx = x - controlPoints[i].x
      const dy = y - controlPoints[i].y
      if (dx * dx + dy * dy < 200) {
        setDraggingIndex(i)
        return
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingIndex === null) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (canvas.width / rect.width)
    const y = (e.clientY - rect.top) * (canvas.height / rect.height)

    const newPoints = [...controlPoints]
    newPoints[draggingIndex] = { x, y }
    setControlPoints(newPoints)
  }

  const handleMouseUp = () => {
    setDraggingIndex(null)
  }

  const addPoint = () => {
    const lastPoint = controlPoints[controlPoints.length - 1]
    setControlPoints([
      ...controlPoints,
      { x: lastPoint.x + 50, y: lastPoint.y - 50 },
    ])
  }

  const removePoint = () => {
    if (controlPoints.length > 2) {
      setControlPoints(controlPoints.slice(0, -1))
    }
  }

  // 伯恩斯坦多项式
  const bernsteinPolynomials = useMemo(() => {
    const n = controlPoints.length - 1

    const tValues: number[] = []
    for (let i = 0; i <= 100; i++) {
      tValues.push(i / 100)
    }

    const bValues: number[][] = []
    for (let i = 0; i <= n; i++) {
      const bi: number[] = []
      for (const tv of tValues) {
        const coeff = factorial(n) / (factorial(i) * factorial(n - i))
        bi.push(coeff * Math.pow(tv, i) * Math.pow(1 - tv, n - i))
      }
      bValues.push(bi)
    }

    return { t: tValues, b: bValues }
  }, [controlPoints.length])

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">贝塞尔曲线</h1>
            <p className="text-gray-600">交互式探索贝塞尔曲线的构造和性质</p>
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
            <h3 className="text-lg font-semibold mb-2">贝塞尔曲线编辑器</h3>
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full border border-gray-300 rounded cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => {
                  setT(0)
                  setIsAnimating(true)
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                动画
              </button>
              <button
                onClick={addPoint}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                添加点
              </button>
              <button
                onClick={removePoint}
                disabled={controlPoints.length <= 2}
                className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:opacity-50"
              >
                删除点
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showConstruction}
                  onChange={(e) => setShowConstruction(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">显示构造</span>
              </label>
            </div>
            <div className="mt-3">
              <label className="text-sm text-gray-600">参数 t: {t.toFixed(3)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={t}
                onChange={(e) => setT(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">伯恩斯坦基函数</h3>
            <div className="h-48 relative">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                {bernsteinPolynomials.b.map((bi, i) => {
                  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
                  const pathData = bi
                    .map((v, j) => `${j === 0 ? 'M' : 'L'} ${j} ${50 - v * 45}`)
                    .join(' ')

                  return (
                    <path
                      key={i}
                      d={pathData}
                      fill="none"
                      stroke={colors[i % colors.length]}
                      strokeWidth="0.5"
                    />
                  )
                })}
                {/* 当前 t 位置 */}
                <line
                  x1={t * 100}
                  y1="0"
                  x2={t * 100}
                  y2="50"
                  stroke="#94a3b8"
                  strokeWidth="0.3"
                  strokeDasharray="1,1"
                />
              </svg>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {controlPoints.map((_, i) => {
                const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
                return (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded text-white"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  >
                    B{i},{controlPoints.length - 1}(t)
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">控制点坐标</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {controlPoints.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-8 font-semibold">P{i}</span>
                  <span className="font-mono">
                    ({p.x.toFixed(0)}, {p.y.toFixed(0)})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">曲线信息</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-purple-50 rounded flex justify-between">
                <span>曲线阶数</span>
                <span className="font-mono">{controlPoints.length - 1}</span>
              </div>
              <div className="p-2 bg-blue-50 rounded flex justify-between">
                <span>控制点数</span>
                <span className="font-mono">{controlPoints.length}</span>
              </div>
              <div className="p-2 bg-green-50 rounded flex justify-between">
                <span>当前 t</span>
                <span className="font-mono">{t.toFixed(3)}</span>
              </div>
              <div className="p-2 bg-red-50 rounded flex justify-between">
                <span>曲线点</span>
                <span className="font-mono">
                  ({bezierPoint(controlPoints, t).x.toFixed(1)}, {bezierPoint(controlPoints, t).y.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">贝塞尔曲线公式</h3>
            <div className="p-3 bg-purple-50 rounded-lg text-sm">
              <MathFormula formula="B(t) = \sum_{i=0}^{n} \binom{n}{i} (1-t)^{n-i} t^i P_i" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">de Casteljau 算法</h3>
            <div className="p-3 bg-blue-50 rounded-lg text-sm">
              <MathFormula formula="P_i^{(r)} = (1-t)P_i^{(r-1)} + tP_{i+1}^{(r-1)}" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              递归地对相邻点进行线性插值，直到得到曲线上的点。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">性质</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 曲线经过首尾控制点</li>
              <li>• 曲线在端点处与控制多边形相切</li>
              <li>• 曲线完全位于控制点的凸包内</li>
              <li>• 仿射变换不变性</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

function factorial(n: number): number {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }
  return result
}
