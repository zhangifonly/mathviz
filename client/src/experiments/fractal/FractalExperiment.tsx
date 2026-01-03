import { useState, useEffect, useRef, useCallback } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'

type FractalType = 'mandelbrot' | 'julia'

export default function FractalExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fractalType, setFractalType] = useState<FractalType>('mandelbrot')
  const [maxIter, setMaxIter] = useState(100)
  const [juliaC, setJuliaC] = useState({ re: -0.7, im: 0.27015 })
  const [view, setView] = useState({ xMin: -2.5, xMax: 1, yMin: -1.5, yMax: 1.5 })
  const [isRendering, setIsRendering] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const angleRef = useRef(0)

  const colorPalette = useCallback((iter: number, maxIter: number): [number, number, number] => {
    if (iter === maxIter) return [0, 0, 0]
    const t = iter / maxIter
    const r = Math.floor(9 * (1 - t) * t * t * t * 255)
    const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255)
    const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255)
    return [r, g, b]
  }, [])

  const mandelbrot = useCallback((cRe: number, cIm: number, maxIter: number): number => {
    let zRe = 0, zIm = 0
    let iter = 0
    while (zRe * zRe + zIm * zIm <= 4 && iter < maxIter) {
      const temp = zRe * zRe - zIm * zIm + cRe
      zIm = 2 * zRe * zIm + cIm
      zRe = temp
      iter++
    }
    return iter
  }, [])

  const julia = useCallback((zRe: number, zIm: number, cRe: number, cIm: number, maxIter: number): number => {
    let iter = 0
    while (zRe * zRe + zIm * zIm <= 4 && iter < maxIter) {
      const temp = zRe * zRe - zIm * zIm + cRe
      zIm = 2 * zRe * zIm + cIm
      zRe = temp
      iter++
    }
    return iter
  }, [])

  const renderFractal = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsRendering(true)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const imageData = ctx.createImageData(width, height)

    const xScale = (view.xMax - view.xMin) / width
    const yScale = (view.yMax - view.yMin) / height

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const x = view.xMin + px * xScale
        const y = view.yMin + py * yScale

        let iter: number
        if (fractalType === 'mandelbrot') {
          iter = mandelbrot(x, y, maxIter)
        } else {
          iter = julia(x, y, juliaC.re, juliaC.im, maxIter)
        }

        const [r, g, b] = colorPalette(iter, maxIter)
        const idx = (py * width + px) * 4
        imageData.data[idx] = r
        imageData.data[idx + 1] = g
        imageData.data[idx + 2] = b
        imageData.data[idx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    setIsRendering(false)
  }, [fractalType, maxIter, juliaC, view, mandelbrot, julia, colorPalette])

  useEffect(() => {
    renderFractal()
  }, [renderFractal])

  // Julia集参数动画
  useEffect(() => {
    if (!isAnimating || fractalType !== 'julia') return

    const animate = () => {
      angleRef.current += 0.02
      const radius = 0.7885
      setJuliaC({
        re: radius * Math.cos(angleRef.current),
        im: radius * Math.sin(angleRef.current),
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, fractalType])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    const xScale = (view.xMax - view.xMin) / canvas.width
    const yScale = (view.yMax - view.yMin) / canvas.height

    const clickX = view.xMin + px * xScale
    const clickY = view.yMin + py * yScale

    // Zoom in by 2x centered on click
    const newWidth = (view.xMax - view.xMin) / 2
    const newHeight = (view.yMax - view.yMin) / 2

    setView({
      xMin: clickX - newWidth / 2,
      xMax: clickX + newWidth / 2,
      yMin: clickY - newHeight / 2,
      yMax: clickY + newHeight / 2,
    })
  }

  const resetView = () => {
    if (fractalType === 'mandelbrot') {
      setView({ xMin: -2.5, xMax: 1, yMin: -1.5, yMax: 1.5 })
    } else {
      setView({ xMin: -2, xMax: 2, yMin: -1.5, yMax: 1.5 })
    }
  }

  const presetJulia = [
    { name: '经典', re: -0.7, im: 0.27015 },
    { name: '螺旋', re: -0.8, im: 0.156 },
    { name: '树枝', re: -0.4, im: 0.6 },
    { name: '闪电', re: 0.285, im: 0.01 },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">分形几何</h1>
        <p className="text-gray-600">探索 Mandelbrot 集和 Julia 集的无限细节</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                {fractalType === 'mandelbrot' ? 'Mandelbrot 集' : 'Julia 集'}
              </h3>
              <div className="flex items-center gap-2">
                {fractalType === 'julia' && (
                  <button
                    onClick={() => setIsAnimating(!isAnimating)}
                    className={`px-4 py-1 rounded-lg text-sm font-medium ${
                      isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}
                  >
                    {isAnimating ? '停止' : '播放动画'}
                  </button>
                )}
                {isRendering && <span className="text-sm text-blue-500">渲染中...</span>}
              </div>
            </div>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={600}
                height={450}
                onClick={handleCanvasClick}
                className="w-full border border-gray-300 rounded cursor-crosshair"
              />
              <p className="text-xs text-gray-500 mt-1">点击图像可放大该区域</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">Mandelbrot 集</h3>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MathFormula formula="z_{n+1} = z_n^2 + c" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                从 z₀ = 0 开始迭代，c 为复平面上的点。若序列有界，则 c 属于 Mandelbrot 集。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">Julia 集</h3>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MathFormula formula="z_{n+1} = z_n^2 + c" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                c 固定，z₀ 为复平面上的点。若序列有界，则 z₀ 属于该 c 对应的 Julia 集。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择分形</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setFractalType('mandelbrot')
                  setView({ xMin: -2.5, xMax: 1, yMin: -1.5, yMax: 1.5 })
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  fractalType === 'mandelbrot' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mandelbrot
              </button>
              <button
                onClick={() => {
                  setFractalType('julia')
                  setView({ xMin: -2, xMax: 2, yMin: -1.5, yMax: 1.5 })
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  fractalType === 'julia' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Julia
              </button>
            </div>
          </div>

          {fractalType === 'julia' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Julia 参数 c</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">实部 Re(c): {juliaC.re.toFixed(3)}</label>
                  <input
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.01"
                    value={juliaC.re}
                    onChange={(e) => setJuliaC((prev) => ({ ...prev, re: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">虚部 Im(c): {juliaC.im.toFixed(3)}</label>
                  <input
                    type="range"
                    min="-1.5"
                    max="1.5"
                    step="0.01"
                    value={juliaC.im}
                    onChange={(e) => setJuliaC((prev) => ({ ...prev, im: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                <div className="p-2 bg-gray-50 rounded text-center font-mono">
                  c = {juliaC.re.toFixed(3)} + {juliaC.im.toFixed(3)}i
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {presetJulia.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setJuliaC({ re: preset.re, im: preset.im })}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">渲染参数</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">最大迭代次数: {maxIter}</label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="50"
                  value={maxIter}
                  onChange={(e) => setMaxIter(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <button
                onClick={resetView}
                className="w-full py-2 px-4 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                重置视图
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">当前视图</h3>
            <div className="space-y-1 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-gray-600">X:</span>
                <span>[{view.xMin.toFixed(4)}, {view.xMax.toFixed(4)}]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Y:</span>
                <span>[{view.yMin.toFixed(4)}, {view.yMax.toFixed(4)}]</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">缩放:</span>
                <span>{((3.5 / (view.xMax - view.xMin))).toFixed(1)}x</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">分形特性</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 自相似性：局部与整体相似</li>
              <li>• 无限细节：可无限放大</li>
              <li>• 分数维度：介于整数维度之间</li>
              <li>• Mandelbrot 集边界维度 ≈ 2</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
