/**
 * 热方程场景渲染器
 * 渲染热量扩散动画、温度分布曲线等可视化
 */

import { useEffect, useRef, useCallback } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '热方程', subtitle: '热量扩散的数学描述' },
    'summary-intro': { title: '总结回顾', subtitle: '热方程的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索热传导之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '热方程', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 热力图场景 - 1D 热扩散动画
function HeatMapScene({ animate = true, initialCondition = 'gaussian' }: { animate?: boolean; initialCondition?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 热扩散模拟（1D）
  const simulate = useCallback((u: number[], alpha: number, dt: number, dx: number): number[] => {
    const n = u.length
    const newU = new Array(n).fill(0)
    const r = alpha * dt / (dx * dx)

    // 边界条件：固定温度为 0
    newU[0] = 0
    newU[n - 1] = 0

    // 内部点使用显式差分格式
    for (let i = 1; i < n - 1; i++) {
      newU[i] = u[i] + r * (u[i + 1] - 2 * u[i] + u[i - 1])
    }

    return newU
  }, [])

  // 初始条件
  const getInitialCondition = useCallback((n: number, type: string): number[] => {
    const u = new Array(n).fill(0)
    const center = Math.floor(n / 2)

    switch (type) {
      case 'gaussian':
        // 高斯分布
        for (let i = 0; i < n; i++) {
          const x = (i - center) / (n / 10)
          u[i] = Math.exp(-x * x)
        }
        break
      case 'step':
        // 阶跃函数
        for (let i = Math.floor(n * 0.4); i < Math.floor(n * 0.6); i++) {
          u[i] = 1
        }
        break
      case 'spike':
        // 尖峰
        u[center] = 1
        break
      default:
        // 默认高斯分布
        for (let i = 0; i < n; i++) {
          const x = (i - center) / (n / 10)
          u[i] = Math.exp(-x * x)
        }
    }

    return u
  }, [])

  // 颜色映射（温度到颜色）
  const temperatureToColor = useCallback((temp: number): [number, number, number] => {
    // 使用热力图配色：蓝色(冷) -> 绿色 -> 黄色 -> 红色(热)
    const t = Math.max(0, Math.min(1, temp))

    if (t < 0.25) {
      // 蓝色到青色
      const s = t / 0.25
      return [0, Math.floor(s * 255), 255]
    } else if (t < 0.5) {
      // 青色到绿色
      const s = (t - 0.25) / 0.25
      return [0, 255, Math.floor((1 - s) * 255)]
    } else if (t < 0.75) {
      // 绿色到黄色
      const s = (t - 0.5) / 0.25
      return [Math.floor(s * 255), 255, 0]
    } else {
      // 黄色到红色
      const s = (t - 0.75) / 0.25
      return [255, Math.floor((1 - s) * 255), 0]
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const n = 200 // 空间网格点数
    const dx = 1.0 / n
    const alpha = 0.01 // 热扩散系数
    const dt = 0.5 * dx * dx / alpha // 时间步长（满足稳定性条件）

    let u = getInitialCondition(n, initialCondition)
    let currentTime = 0

    const draw = () => {
      // 清空画布
      ctx.fillStyle = 'rgba(30, 41, 59, 1)'
      ctx.fillRect(0, 0, width, height)

      // 绘制热力图（2D 可视化）
      const cellWidth = width / n
      const heatMapHeight = height * 0.6

      for (let i = 0; i < n; i++) {
        const [r, g, b] = temperatureToColor(u[i])
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
        ctx.fillRect(i * cellWidth, 0, cellWidth, heatMapHeight)
      }

      // 绘制温度曲线
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.beginPath()

      const curveY = heatMapHeight + 20
      const curveHeight = height - curveY - 40

      for (let i = 0; i < n; i++) {
        const x = (i / n) * width
        const y = curveY + curveHeight * (1 - u[i])
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      // 绘制坐标轴
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, curveY + curveHeight)
      ctx.lineTo(width, curveY + curveHeight)
      ctx.stroke()

      // 显示时间
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText(`时间: ${currentTime.toFixed(2)}`, 10, height - 10)

      // 模拟下一步
      if (animate) {
        u = simulate(u, alpha, dt, dx)
        currentTime += dt
      }
    }

    draw()

    if (animate) {
      const interval = setInterval(draw, 50)
      return () => clearInterval(interval)
    }
  }, [animate, initialCondition, simulate, getInitialCondition, temperatureToColor])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 2D 热扩散场景
function HeatMap2DScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const nx = 100 // x 方向网格数
    const ny = 100 // y 方向网格数
    const dx = 1.0 / nx
    const dy = 1.0 / ny
    const alpha = 0.01
    const dt = 0.25 * Math.min(dx * dx, dy * dy) / alpha

    // 初始化温度场（中心高温）
    let u = Array(ny).fill(0).map(() => Array(nx).fill(0))
    const centerX = Math.floor(nx / 2)
    const centerY = Math.floor(ny / 2)
    const radius = 10

    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const dist = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2)
        if (dist < radius) {
          u[j][i] = 1 - dist / radius
        }
      }
    }

    let currentTime = 0

    const simulate2D = (u: number[][]): number[][] => {
      const newU = Array(ny).fill(0).map(() => Array(nx).fill(0))
      const rx = alpha * dt / (dx * dx)
      const ry = alpha * dt / (dy * dy)

      for (let j = 1; j < ny - 1; j++) {
        for (let i = 1; i < nx - 1; i++) {
          newU[j][i] = u[j][i] +
            rx * (u[j][i + 1] - 2 * u[j][i] + u[j][i - 1]) +
            ry * (u[j + 1][i] - 2 * u[j][i] + u[j - 1][i])
        }
      }

      return newU
    }

    const temperatureToColor = (temp: number): [number, number, number] => {
      const t = Math.max(0, Math.min(1, temp))

      if (t < 0.25) {
        const s = t / 0.25
        return [0, Math.floor(s * 255), 255]
      } else if (t < 0.5) {
        const s = (t - 0.25) / 0.25
        return [0, 255, Math.floor((1 - s) * 255)]
      } else if (t < 0.75) {
        const s = (t - 0.5) / 0.25
        return [Math.floor(s * 255), 255, 0]
      } else {
        const s = (t - 0.75) / 0.25
        return [255, Math.floor((1 - s) * 255), 0]
      }
    }

    const draw = () => {
      const imageData = ctx.createImageData(width, height)
      const cellWidth = width / nx
      const cellHeight = height / ny

      for (let j = 0; j < ny; j++) {
        for (let i = 0; i < nx; i++) {
          const [r, g, b] = temperatureToColor(u[j][i])
          const px = Math.floor(i * cellWidth)
          const py = Math.floor(j * cellHeight)

          for (let dy = 0; dy < cellHeight && py + dy < height; dy++) {
            for (let dx = 0; dx < cellWidth && px + dx < width; dx++) {
              const idx = ((py + dy) * width + (px + dx)) * 4
              imageData.data[idx] = r
              imageData.data[idx + 1] = g
              imageData.data[idx + 2] = b
              imageData.data[idx + 3] = 255
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // 显示时间
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText(`时间: ${currentTime.toFixed(2)}`, 10, 20)

      if (animate) {
        u = simulate2D(u)
        currentTime += dt
      }
    }

    draw()

    if (animate) {
      const interval = setInterval(draw, 50)
      return () => clearInterval(interval)
    }
  }, [animate])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 温度分布曲线场景
function TemperatureProfileScene({ showMultiple = false }: { showMultiple?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 50

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(padding, padding)
    ctx.stroke()

    // 坐标轴标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('位置 x', width / 2, height - 10)
    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('温度 u(x,t)', 0, 0)
    ctx.restore()

    const n = 200
    const times = showMultiple ? [0, 0.01, 0.05, 0.1, 0.2] : [0.1]
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

    times.forEach((t, idx) => {
      ctx.strokeStyle = colors[idx]
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let i = 0; i <= n; i++) {
        const x = i / n
        const canvasX = padding + x * (width - 2 * padding)

        // 解析解：u(x,t) = sum of Fourier series
        let u = 0
        for (let k = 1; k <= 20; k++) {
          const coeff = (2 / (k * Math.PI)) * (1 - Math.cos(k * Math.PI))
          u += coeff * Math.sin(k * Math.PI * x) * Math.exp(-k * k * Math.PI * Math.PI * t)
        }

        const canvasY = height - padding - u * (height - 2 * padding)

        if (i === 0) {
          ctx.moveTo(canvasX, canvasY)
        } else {
          ctx.lineTo(canvasX, canvasY)
        }
      }
      ctx.stroke()

      // 图例
      if (showMultiple) {
        ctx.fillStyle = colors[idx]
        ctx.fillText(`t = ${t.toFixed(2)}`, width - padding - 80, padding + idx * 20)
      }
    })
  }, [showMultiple])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'heat-equation': {
      formula: '\\frac{\\partial u}{\\partial t} = \\alpha \\frac{\\partial^2 u}{\\partial x^2}',
      description: '一维热方程 - 描述热量扩散过程',
    },
    'heat-equation-2d': {
      formula: '\\frac{\\partial u}{\\partial t} = \\alpha \\left(\\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2}\\right)',
      description: '二维热方程 - 平面热扩散',
    },
    'fourier-solution': {
      formula: 'u(x,t) = \\sum_{n=1}^{\\infty} B_n \\sin(n\\pi x) e^{-\\alpha n^2 \\pi^2 t}',
      description: '傅里叶级数解 - 热方程的解析解',
    },
    'boundary-condition': {
      formula: 'u(0,t) = u(L,t) = 0, \\quad u(x,0) = f(x)',
      description: '边界条件和初始条件',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['heat-equation']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '热方程的应用',
      items: ['建筑保温设计', '电子器件散热', '气候模拟', '材料加工'],
      icon: '🔥',
    },
    'app-engineering': {
      title: '工程应用',
      items: ['热交换器设计', '冷却系统优化', '温度控制', '热应力分析'],
      icon: '⚙️',
    },
    'app-nature': {
      title: '自然现象',
      items: ['地球内部热传导', '海洋温度分布', '大气热对流', '冰川融化'],
      icon: '🌍',
    },
    'app-daily': {
      title: '日常生活',
      items: ['烹饪过程', '暖气系统', '保温杯设计', '冰箱制冷'],
      icon: '🏠',
    },
  }

  const app = apps[sceneId] || apps['app-intro']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function HeatEquationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 公式场景
  if (sceneConfig.type === 'formula') {
    if (sceneConfig.id.includes('2d')) {
      return <FormulaScene formulaType="heat-equation-2d" />
    }
    if (sceneConfig.id.includes('fourier')) {
      return <FormulaScene formulaType="fourier-solution" />
    }
    if (sceneConfig.id.includes('boundary')) {
      return <FormulaScene formulaType="boundary-condition" />
    }
    return <FormulaScene formulaType="heat-equation" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('diffusion') || sceneConfig.id.includes('heat')) {
        return <HeatMapScene animate initialCondition="gaussian" />
      }
      return <HeatMapScene animate initialCondition="gaussian" />

    case 'concept':
      if (sceneConfig.id.includes('equation')) {
        return <FormulaScene formulaType="heat-equation" />
      }
      if (sceneConfig.id.includes('diffusion')) {
        return <HeatMapScene animate initialCondition="step" />
      }
      return <HeatMapScene animate initialCondition="gaussian" />

    case 'visualization':
      if (sceneConfig.id.includes('1d')) {
        return <HeatMapScene animate initialCondition="gaussian" />
      }
      if (sceneConfig.id.includes('2d')) {
        return <HeatMap2DScene animate />
      }
      if (sceneConfig.id.includes('profile')) {
        return <TemperatureProfileScene showMultiple />
      }
      return <HeatMapScene animate initialCondition="gaussian" />

    case 'solution':
      if (sceneConfig.id.includes('fourier')) {
        return <FormulaScene formulaType="fourier-solution" />
      }
      if (sceneConfig.id.includes('profile')) {
        return <TemperatureProfileScene showMultiple />
      }
      return <TemperatureProfileScene showMultiple />

    case 'boundary':
      if (sceneConfig.id.includes('condition')) {
        return <FormulaScene formulaType="boundary-condition" />
      }
      if (sceneConfig.id.includes('fixed')) {
        return <HeatMapScene animate initialCondition="gaussian" />
      }
      return <HeatMapScene animate initialCondition="step" />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('2d')) {
        return <HeatMap2DScene animate />
      }
      if (sceneConfig.id.includes('equation')) {
        return <FormulaScene formulaType="heat-equation" />
      }
      return <HeatMapScene animate initialCondition="gaussian" />

    default:
      return <HeatMapScene animate initialCondition="gaussian" />
  }
}
