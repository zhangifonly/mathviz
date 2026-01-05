import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import 'katex/dist/katex.min.css'
// @ts-expect-error react-katex types
import { InlineMath, BlockMath } from 'react-katex'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { geometryShapesNarration } from '../../narrations/scripts/geometry-shapes'

type ShapeType = 'triangle' | 'rectangle' | 'square' | 'circle' | 'parallelogram' | 'trapezoid'

interface Step {
  description: string
}

interface ShapeConfig {
  name: string
  icon: string
  color: string
  formula: {
    area: string
    perimeter: string
  }
}

const shapeConfigs: Record<ShapeType, ShapeConfig> = {
  triangle: {
    name: '三角形',
    icon: '△',
    color: '#3B82F6',
    formula: {
      area: 'S = \\frac{1}{2} \\times \\text{底} \\times \\text{高}',
      perimeter: 'C = a + b + c',
    },
  },
  rectangle: {
    name: '长方形',
    icon: '▭',
    color: '#10B981',
    formula: {
      area: 'S = \\text{长} \\times \\text{宽}',
      perimeter: 'C = 2 \\times (\\text{长} + \\text{宽})',
    },
  },
  square: {
    name: '正方形',
    icon: '□',
    color: '#8B5CF6',
    formula: {
      area: 'S = \\text{边长}^2',
      perimeter: 'C = 4 \\times \\text{边长}',
    },
  },
  circle: {
    name: '圆',
    icon: '○',
    color: '#EF4444',
    formula: {
      area: 'S = \\pi r^2',
      perimeter: 'C = 2\\pi r',
    },
  },
  parallelogram: {
    name: '平行四边形',
    icon: '▱',
    color: '#F59E0B',
    formula: {
      area: 'S = \\text{底} \\times \\text{高}',
      perimeter: 'C = 2 \\times (a + b)',
    },
  },
  trapezoid: {
    name: '梯形',
    icon: '⏢',
    color: '#EC4899',
    formula: {
      area: 'S = \\frac{1}{2} \\times (\\text{上底} + \\text{下底}) \\times \\text{高}',
      perimeter: 'C = a + b + c + d',
    },
  },
}

export default function GeometryShapesExperiment() {
  const [shape, setShape] = useState<ShapeType>('triangle')
  const [param1, setParam1] = useState(100) // 底/长/边长/半径/底/下底
  const [param2, setParam2] = useState(80) // 高/宽/-/-/高/上底
  const [param3, setParam3] = useState(60) // -/-/-/-/-/高
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showGrid, setShowGrid] = useState(true)
  const [showMeasurements, setShowMeasurements] = useState(true)
  const [showPresenter, setShowPresenter] = useState(false)
  const animationRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(geometryShapesNarration)
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

  // 计算面积和周长
  const calculations = useMemo(() => {
    switch (shape) {
      case 'triangle':
        // 等腰三角形
        const triSide = Math.sqrt((param1 / 2) ** 2 + param2 ** 2)
        return {
          area: (param1 * param2) / 2,
          perimeter: param1 + 2 * triSide,
        }
      case 'rectangle':
        return {
          area: param1 * param2,
          perimeter: 2 * (param1 + param2),
        }
      case 'square':
        return {
          area: param1 * param1,
          perimeter: 4 * param1,
        }
      case 'circle':
        return {
          area: Math.PI * param1 * param1,
          perimeter: 2 * Math.PI * param1,
        }
      case 'parallelogram':
        return {
          area: param1 * param2,
          perimeter: 2 * (param1 + 80), // 假设斜边为80
        }
      case 'trapezoid':
        return {
          area: ((param1 + param2) * param3) / 2,
          perimeter: param1 + param2 + 2 * Math.sqrt(((param1 - param2) / 2) ** 2 + param3 ** 2),
        }
      default:
        return { area: 0, perimeter: 0 }
    }
  }, [shape, param1, param2, param3])

  // 生成演示步骤
  const steps: Step[] = useMemo(() => {
    switch (shape) {
      case 'triangle':
        return [
          { description: `这是一个三角形，底边长度为 ${param1}，高为 ${param2}` },
          { description: `三角形的面积公式：底 × 高 ÷ 2` },
          { description: `计算：${param1} × ${param2} ÷ 2 = ${calculations.area}` },
          { description: `面积为 ${calculations.area} 平方单位` },
        ]
      case 'rectangle':
        return [
          { description: `这是一个长方形，长为 ${param1}，宽为 ${param2}` },
          { description: `长方形的面积公式：长 × 宽` },
          { description: `计算：${param1} × ${param2} = ${calculations.area}` },
          { description: `周长公式：2 × (长 + 宽) = 2 × (${param1} + ${param2}) = ${calculations.perimeter}` },
        ]
      case 'square':
        return [
          { description: `这是一个正方形，边长为 ${param1}` },
          { description: `正方形的面积公式：边长 × 边长` },
          { description: `计算：${param1} × ${param1} = ${calculations.area}` },
          { description: `周长：4 × ${param1} = ${calculations.perimeter}` },
        ]
      case 'circle':
        return [
          { description: `这是一个圆，半径为 ${param1}` },
          { description: `圆的面积公式：π × 半径²` },
          { description: `计算：π × ${param1}² = ${calculations.area.toFixed(2)}` },
          { description: `周长（圆周）：2π × ${param1} = ${calculations.perimeter.toFixed(2)}` },
        ]
      case 'parallelogram':
        return [
          { description: `这是一个平行四边形，底为 ${param1}，高为 ${param2}` },
          { description: `平行四边形的面积公式：底 × 高` },
          { description: `计算：${param1} × ${param2} = ${calculations.area}` },
          { description: `面积为 ${calculations.area} 平方单位` },
        ]
      case 'trapezoid':
        return [
          { description: `这是一个梯形，下底为 ${param1}，上底为 ${param2}，高为 ${param3}` },
          { description: `梯形的面积公式：(上底 + 下底) × 高 ÷ 2` },
          { description: `计算：(${param2} + ${param1}) × ${param3} ÷ 2 = ${calculations.area}` },
          { description: `面积为 ${calculations.area} 平方单位` },
        ]
      default:
        return [{ description: `选择一个图形开始学习` }]
    }
  }, [shape, param1, param2, param3, calculations])

  // 动画效果
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 2000) as unknown as number
    }

    animationRef.current = window.setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate)
    }, 2000) as unknown as number

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, steps.length])

  // 绘制图形
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2

    ctx.clearRect(0, 0, width, height)

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = '#E5E7EB'
      ctx.lineWidth = 1
      const gridSize = 20
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    const config = shapeConfigs[shape]
    ctx.fillStyle = config.color + '40'
    ctx.strokeStyle = config.color
    ctx.lineWidth = 3

    const scale = 1.5

    switch (shape) {
      case 'triangle': {
        const base = param1 / scale
        const h = param2 / scale
        ctx.beginPath()
        ctx.moveTo(centerX - base / 2, centerY + h / 2)
        ctx.lineTo(centerX + base / 2, centerY + h / 2)
        ctx.lineTo(centerX, centerY - h / 2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        if (showMeasurements) {
          // 底边标注
          ctx.fillStyle = '#374151'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`底 = ${param1}`, centerX, centerY + h / 2 + 25)

          // 高度标注
          ctx.setLineDash([5, 5])
          ctx.strokeStyle = '#9CA3AF'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(centerX, centerY - h / 2)
          ctx.lineTo(centerX, centerY + h / 2)
          ctx.stroke()
          ctx.setLineDash([])
          ctx.fillText(`高 = ${param2}`, centerX + 40, centerY)
        }
        break
      }
      case 'rectangle': {
        const w = param1 / scale
        const h = param2 / scale
        ctx.beginPath()
        ctx.rect(centerX - w / 2, centerY - h / 2, w, h)
        ctx.fill()
        ctx.stroke()

        if (showMeasurements) {
          ctx.fillStyle = '#374151'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`长 = ${param1}`, centerX, centerY + h / 2 + 25)
          ctx.save()
          ctx.translate(centerX - w / 2 - 25, centerY)
          ctx.rotate(-Math.PI / 2)
          ctx.fillText(`宽 = ${param2}`, 0, 0)
          ctx.restore()
        }
        break
      }
      case 'square': {
        const side = param1 / scale
        ctx.beginPath()
        ctx.rect(centerX - side / 2, centerY - side / 2, side, side)
        ctx.fill()
        ctx.stroke()

        if (showMeasurements) {
          ctx.fillStyle = '#374151'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`边长 = ${param1}`, centerX, centerY + side / 2 + 25)
        }
        break
      }
      case 'circle': {
        const r = param1 / scale
        ctx.beginPath()
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        if (showMeasurements) {
          // 半径线
          ctx.setLineDash([5, 5])
          ctx.strokeStyle = '#9CA3AF'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.lineTo(centerX + r, centerY)
          ctx.stroke()
          ctx.setLineDash([])

          ctx.fillStyle = '#374151'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`r = ${param1}`, centerX + r / 2, centerY - 10)

          // 圆心
          ctx.fillStyle = config.color
          ctx.beginPath()
          ctx.arc(centerX, centerY, 4, 0, Math.PI * 2)
          ctx.fill()
        }
        break
      }
      case 'parallelogram': {
        const base = param1 / scale
        const h = param2 / scale
        const offset = 30
        ctx.beginPath()
        ctx.moveTo(centerX - base / 2 + offset, centerY - h / 2)
        ctx.lineTo(centerX + base / 2 + offset, centerY - h / 2)
        ctx.lineTo(centerX + base / 2 - offset, centerY + h / 2)
        ctx.lineTo(centerX - base / 2 - offset, centerY + h / 2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        if (showMeasurements) {
          ctx.fillStyle = '#374151'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`底 = ${param1}`, centerX, centerY + h / 2 + 25)

          // 高度标注
          ctx.setLineDash([5, 5])
          ctx.strokeStyle = '#9CA3AF'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(centerX, centerY - h / 2)
          ctx.lineTo(centerX, centerY + h / 2)
          ctx.stroke()
          ctx.setLineDash([])
          ctx.fillText(`高 = ${param2}`, centerX + 50, centerY)
        }
        break
      }
      case 'trapezoid': {
        const bottom = param1 / scale
        const top = param2 / scale
        const h = param3 / scale
        ctx.beginPath()
        ctx.moveTo(centerX - top / 2, centerY - h / 2)
        ctx.lineTo(centerX + top / 2, centerY - h / 2)
        ctx.lineTo(centerX + bottom / 2, centerY + h / 2)
        ctx.lineTo(centerX - bottom / 2, centerY + h / 2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        if (showMeasurements) {
          ctx.fillStyle = '#374151'
          ctx.font = '14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(`下底 = ${param1}`, centerX, centerY + h / 2 + 25)
          ctx.fillText(`上底 = ${param2}`, centerX, centerY - h / 2 - 10)

          // 高度标注
          ctx.setLineDash([5, 5])
          ctx.strokeStyle = '#9CA3AF'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(centerX - bottom / 2 + 20, centerY - h / 2)
          ctx.lineTo(centerX - bottom / 2 + 20, centerY + h / 2)
          ctx.stroke()
          ctx.setLineDash([])
          ctx.fillText(`高 = ${param3}`, centerX - bottom / 2 - 20, centerY)
        }
        break
      }
    }

    // 绘制面积填充动画效果
    if (currentStep >= 2) {
      ctx.fillStyle = config.color + '60'
      // 重新绘制填充
    }
  }, [shape, param1, param2, param3, showGrid, showMeasurements, currentStep])

  const config = shapeConfigs[shape]

  // 获取参数标签
  const getParamLabels = () => {
    switch (shape) {
      case 'triangle':
        return ['底边', '高', null]
      case 'rectangle':
        return ['长', '宽', null]
      case 'square':
        return ['边长', null, null]
      case 'circle':
        return ['半径', null, null]
      case 'parallelogram':
        return ['底边', '高', null]
      case 'trapezoid':
        return ['下底', '上底', '高']
      default:
        return ['参数1', '参数2', '参数3']
    }
  }

  const paramLabels = getParamLabels()

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">基础几何图形</h1>
            <p className="text-gray-600">学习常见几何图形的面积和周长计算</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStartNarration}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <span>开始讲解</span>
            </button>
            <button
              onClick={() => {
                if (!isAnimating) {
                  setCurrentStep(0)
                }
                setIsAnimating(!isAnimating)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {isAnimating ? '停止' : '播放动画'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 公式展示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">{config.name}的公式</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">面积公式</div>
                <BlockMath math={config.formula.area} />
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">周长公式</div>
                <BlockMath math={config.formula.perimeter} />
              </div>
            </div>
          </div>

          {/* 图形展示 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">图形演示</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">显示网格</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showMeasurements}
                    onChange={(e) => setShowMeasurements(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">显示标注</span>
                </label>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={500}
              height={350}
              className="w-full border border-gray-200 rounded bg-white"
            />
          </div>

          {/* 计算结果 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">计算结果</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">面积</div>
                <div className="text-2xl font-bold text-blue-700">
                  {shape === 'circle' ? calculations.area.toFixed(2) : calculations.area}
                </div>
                <div className="text-sm text-gray-500">平方单位</div>
              </div>
              <div className="p-4 bg-green-100 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">周长</div>
                <div className="text-2xl font-bold text-green-700">
                  {calculations.perimeter.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">单位</div>
              </div>
            </div>
          </div>

          {/* 步骤说明 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">演示步骤</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg transition-all ${
                    index === currentStep
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : index < currentStep
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        index === currentStep
                          ? 'bg-blue-500 text-white'
                          : index < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className={index === currentStep ? 'font-medium' : ''}>{step.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">选择图形</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(shapeConfigs) as ShapeType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setShape(s)
                    setCurrentStep(0)
                    setIsAnimating(false)
                  }}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    shape === s
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: shape === s ? shapeConfigs[s].color : undefined,
                  }}
                >
                  <span className="text-lg">{shapeConfigs[s].icon}</span>
                  {shapeConfigs[s].name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">调整参数</h3>
            <div className="space-y-4">
              {paramLabels[0] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {paramLabels[0]}: {param1}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={param1}
                    onChange={(e) => {
                      setParam1(parseInt(e.target.value))
                      setCurrentStep(0)
                    }}
                    className="w-full"
                  />
                </div>
              )}
              {paramLabels[1] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {paramLabels[1]}: {param2}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={param2}
                    onChange={(e) => {
                      setParam2(parseInt(e.target.value))
                      setCurrentStep(0)
                    }}
                    className="w-full"
                  />
                </div>
              )}
              {paramLabels[2] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {paramLabels[2]}: {param3}
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={param3}
                    onChange={(e) => {
                      setParam3(parseInt(e.target.value))
                      setCurrentStep(0)
                    }}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">步骤控制</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                上一步
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1}
                className="flex-1 px-3 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
              >
                下一步
              </button>
            </div>
            <button
              onClick={() => setCurrentStep(0)}
              className="w-full mt-2 px-3 py-2 bg-gray-100 rounded-lg"
            >
              重置
            </button>
          </div>

          {/* 知识点说明 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">知识点</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>面积</strong>是图形所占平面的大小，单位是平方单位。</p>
              <p><strong>周长</strong>是图形边界的总长度。</p>
              {shape === 'circle' && (
                <p><InlineMath math="\pi \approx 3.14159" /> 是圆周率，表示圆周长与直径的比值。</p>
              )}
              {shape === 'triangle' && (
                <p>三角形面积 = 底 × 高 ÷ 2，可以理解为长方形面积的一半。</p>
              )}
              {shape === 'trapezoid' && (
                <p>梯形可以看作两个三角形的组合，或者一个平行四边形的变形。</p>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
