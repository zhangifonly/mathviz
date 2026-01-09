/**
 * 偏微分方程场景渲染器
 * 渲染各类PDE的可视化动画
 */

import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '偏微分方程', subtitle: '多变量函数的微分方程' },
    'summary-intro': { title: '总结回顾', subtitle: 'PDE的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索PDE之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '偏微分方程', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 拉普拉斯方程场景
function LaplaceScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const n = 50
    const cellWidth = width / n
    const cellHeight = height / n

    // 初始化
    let u = Array(n).fill(0).map(() => Array(n).fill(0))

    // 边界条件：上边界为正弦函数
    for (let i = 0; i < n; i++) {
      u[0][i] = Math.sin((Math.PI * i) / n)
    }

    // 迭代求解拉普拉斯方程
    const solve = () => {
      const newU = u.map(row => [...row])
      for (let i = 1; i < n - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
          newU[i][j] = 0.25 * (u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1])
        }
      }
      u = newU
    }

    const draw = () => {
      // 求解多次以达到稳态
      for (let iter = 0; iter < 10; iter++) {
        solve()
      }

      // 绘制
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const value = u[i][j]
          const color = valueToColor(value)
          ctx.fillStyle = color
          ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)
        }
      }

      // 绘制网格
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= n; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * cellHeight)
        ctx.lineTo(width, i * cellHeight)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(i * cellWidth, 0)
        ctx.lineTo(i * cellWidth, height)
        ctx.stroke()
      }
    }

    draw()

    if (animate) {
      const interval = setInterval(draw, 100)
      return () => clearInterval(interval)
    }
  }, [animate])

  const valueToColor = (value: number): string => {
    const t = Math.max(-1, Math.min(1, value))
    const normalized = (t + 1) / 2

    if (normalized < 0.5) {
      const s = normalized * 2
      return `rgb(0, ${Math.floor(s * 255)}, ${255 - Math.floor(s * 255)})`
    } else {
      const s = (normalized - 0.5) * 2
      return `rgb(${Math.floor(s * 255)}, 255, ${255 - Math.floor(s * 255)})`
    }
  }

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

// 泊松方程场景
function PoissonScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const n = 50
    const cellWidth = width / n
    const cellHeight = height / n

    // 初始化
    let u = Array(n).fill(0).map(() => Array(n).fill(0))

    // 源项：中心有一个高斯源
    const source = Array(n).fill(0).map((_, i) =>
      Array(n).fill(0).map((_, j) => {
        const x = (i - n / 2) / (n / 10)
        const y = (j - n / 2) / (n / 10)
        return -Math.exp(-(x * x + y * y))
      })
    )

    // 迭代求解泊松方程
    const solve = () => {
      const newU = u.map(row => [...row])
      const h = 1 / n
      for (let i = 1; i < n - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
          newU[i][j] = 0.25 * (u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1] - h * h * source[i][j])
        }
      }
      u = newU
    }

    const draw = () => {
      // 求解多次
      for (let iter = 0; iter < 10; iter++) {
        solve()
      }

      // 绘制
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const value = u[i][j]
          const color = valueToColor(value)
          ctx.fillStyle = color
          ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)
        }
      }
    }

    draw()

    if (animate) {
      const interval = setInterval(draw, 100)
      return () => clearInterval(interval)
    }
  }, [animate])

  const valueToColor = (value: number): string => {
    const t = Math.max(-1, Math.min(1, value))
    const normalized = (t + 1) / 2

    const r = Math.floor(normalized * 255)
    const g = Math.floor((1 - Math.abs(normalized - 0.5) * 2) * 255)
    const b = Math.floor((1 - normalized) * 255)

    return `rgb(${r}, ${g}, ${b})`
  }

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

// 热传导方程场景
function HeatScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const n = 50
    const cellWidth = width / n
    const cellHeight = height / n

    // 初始化：中心高温
    let u = Array(n).fill(0).map((_, i) =>
      Array(n).fill(0).map((_, j) => {
        const x = (i - n / 2) / (n / 10)
        const y = (j - n / 2) / (n / 10)
        return Math.exp(-(x * x + y * y))
      })
    )

    // 热传导模拟
    const solve = () => {
      const newU = u.map(row => [...row])
      const alpha = 0.1
      const dt = 0.01
      const dx = 1 / n
      const r = alpha * dt / (dx * dx)

      for (let i = 1; i < n - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
          newU[i][j] = u[i][j] + r * (u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1] - 4 * u[i][j])
        }
      }

      // 边界条件：固定为0
      for (let i = 0; i < n; i++) {
        newU[0][i] = 0
        newU[n - 1][i] = 0
        newU[i][0] = 0
        newU[i][n - 1] = 0
      }

      u = newU
    }

    const draw = () => {
      solve()

      // 绘制
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const value = u[i][j]
          const color = heatColor(value)
          ctx.fillStyle = color
          ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)
        }
      }
    }

    draw()

    if (animate) {
      const interval = setInterval(draw, 50)
      return () => clearInterval(interval)
    }
  }, [animate])

  const heatColor = (value: number): string => {
    const t = Math.max(0, Math.min(1, value))

    if (t < 0.25) {
      const s = t / 0.25
      return `rgb(0, ${Math.floor(s * 255)}, 255)`
    } else if (t < 0.5) {
      const s = (t - 0.25) / 0.25
      return `rgb(0, 255, ${Math.floor((1 - s) * 255)})`
    } else if (t < 0.75) {
      const s = (t - 0.5) / 0.25
      return `rgb(${Math.floor(s * 255)}, 255, 0)`
    } else {
      const s = (t - 0.75) / 0.25
      return `rgb(255, ${Math.floor((1 - s) * 255)}, 0)`
    }
  }

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

// 波动方程场景
function WaveScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uPrevRef = useRef<number[][]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const n = 50
    const cellWidth = width / n
    const cellHeight = height / n

    // 初始化：中心有初始位移
    let u = Array(n).fill(0).map((_, i) =>
      Array(n).fill(0).map((_, j) => {
        const x = (i - n / 2) / (n / 10)
        const y = (j - n / 2) / (n / 10)
        return Math.exp(-(x * x + y * y))
      })
    )

    let uPrev = u.map(row => [...row])
    uPrevRef.current = uPrev

    // 波动方程模拟
    const solve = () => {
      const newU = u.map(row => [...row])
      const c = 1
      const dt = 0.02
      const dx = 1 / n
      const r = (c * dt / dx) ** 2

      for (let i = 1; i < n - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
          newU[i][j] = 2 * u[i][j] - uPrev[i][j] + r * (u[i + 1][j] + u[i - 1][j] + u[i][j + 1] + u[i][j - 1] - 4 * u[i][j])
        }
      }

      // 边界条件：固定为0
      for (let i = 0; i < n; i++) {
        newU[0][i] = 0
        newU[n - 1][i] = 0
        newU[i][0] = 0
        newU[i][n - 1] = 0
      }

      uPrev = u
      u = newU
      uPrevRef.current = uPrev
    }

    const draw = () => {
      solve()

      // 绘制
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const value = u[i][j]
          const color = waveColor(value)
          ctx.fillStyle = color
          ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight)
        }
      }
    }

    draw()

    if (animate) {
      const interval = setInterval(draw, 50)
      return () => clearInterval(interval)
    }
  }, [animate])

  const waveColor = (value: number): string => {
    const t = Math.max(-1, Math.min(1, value))
    const normalized = (t + 1) / 2

    if (normalized < 0.5) {
      const s = normalized * 2
      return `rgb(${Math.floor((1 - s) * 255)}, ${Math.floor((1 - s) * 255)}, 255)`
    } else {
      const s = (normalized - 0.5) * 2
      return `rgb(255, ${Math.floor((1 - s) * 255)}, ${Math.floor((1 - s) * 255)})`
    }
  }

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

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'laplace': {
      formula: '\\nabla^2 u = \\frac{\\partial^2 u}{\\partial x^2} + \\frac{\\partial^2 u}{\\partial y^2} = 0',
      description: '拉普拉斯方程 - 描述稳态场',
    },
    'poisson': {
      formula: '\\nabla^2 u = f(x,y)',
      description: '泊松方程 - 有源项的稳态场',
    },
    'heat': {
      formula: '\\frac{\\partial u}{\\partial t} = \\alpha \\nabla^2 u',
      description: '热传导方程 - 描述扩散过程',
    },
    'wave': {
      formula: '\\frac{\\partial^2 u}{\\partial t^2} = c^2 \\nabla^2 u',
      description: '波动方程 - 描述波的传播',
    },
    'boundary-dirichlet': {
      formula: 'u|_{\\partial \\Omega} = g(x,y)',
      description: 'Dirichlet边界条件 - 指定边界值',
    },
    'boundary-neumann': {
      formula: '\\frac{\\partial u}{\\partial n}\\bigg|_{\\partial \\Omega} = h(x,y)',
      description: 'Neumann边界条件 - 指定法向导数',
    },
    'numerical': {
      formula: 'u_{i,j}^{n+1} = u_{i,j}^n + r(u_{i+1,j}^n + u_{i-1,j}^n + u_{i,j+1}^n + u_{i,j-1}^n - 4u_{i,j}^n)',
      description: '五点差分格式 - 数值求解方法',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['laplace']

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
    'app-physics': {
      title: '物理学应用',
      items: ['电磁场理论', '量子力学', '流体力学', '弹性力学'],
      icon: '⚛️',
    },
    'app-engineering': {
      title: '工程应用',
      items: ['结构分析', '热传递', '声学设计', '电路设计'],
      icon: '⚙️',
    },
    'app-finance': {
      title: '金融数学',
      items: ['期权定价', '风险管理', '投资组合优化', '利率模型'],
      icon: '💰',
    },
    'app-image': {
      title: '图像处理',
      items: ['图像去噪', '边缘检测', '图像分割', '图像修复'],
      icon: '🖼️',
    },
  }

  const app = apps[sceneId] || apps['app-physics']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function PDESceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('laplace')) {
      return <FormulaScene formulaType="laplace" />
    }
    if (sceneConfig.id.includes('poisson')) {
      return <FormulaScene formulaType="poisson" />
    }
    if (sceneConfig.id.includes('heat')) {
      return <FormulaScene formulaType="heat" />
    }
    if (sceneConfig.id.includes('wave')) {
      return <FormulaScene formulaType="wave" />
    }
    if (sceneConfig.id.includes('dirichlet')) {
      return <FormulaScene formulaType="boundary-dirichlet" />
    }
    if (sceneConfig.id.includes('neumann')) {
      return <FormulaScene formulaType="boundary-neumann" />
    }
    if (sceneConfig.id.includes('numerical')) {
      return <FormulaScene formulaType="numerical" />
    }
    return <FormulaScene formulaType="laplace" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      return <LaplaceScene animate />

    case 'classification':
      if (sceneConfig.id.includes('elliptic')) {
        return <LaplaceScene animate />
      }
      if (sceneConfig.id.includes('parabolic')) {
        return <HeatScene animate />
      }
      if (sceneConfig.id.includes('hyperbolic')) {
        return <WaveScene animate />
      }
      return <LaplaceScene animate />

    case 'laplace':
      if (sceneConfig.id.includes('equation')) {
        return <FormulaScene formulaType="laplace" />
      }
      return <LaplaceScene animate />

    case 'poisson':
      if (sceneConfig.id.includes('equation')) {
        return <FormulaScene formulaType="poisson" />
      }
      return <PoissonScene animate />

    case 'heat':
      if (sceneConfig.id.includes('equation')) {
        return <FormulaScene formulaType="heat" />
      }
      return <HeatScene animate />

    case 'wave':
      if (sceneConfig.id.includes('equation')) {
        return <FormulaScene formulaType="wave" />
      }
      return <WaveScene animate />

    case 'boundary':
      if (sceneConfig.id.includes('dirichlet')) {
        return <FormulaScene formulaType="boundary-dirichlet" />
      }
      if (sceneConfig.id.includes('neumann')) {
        return <FormulaScene formulaType="boundary-neumann" />
      }
      return <LaplaceScene animate />

    case 'numerical':
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="numerical" />
      }
      return <HeatScene animate />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('laplace')) {
        return <LaplaceScene animate />
      }
      if (sceneConfig.id.includes('heat')) {
        return <HeatScene animate />
      }
      if (sceneConfig.id.includes('wave')) {
        return <WaveScene animate />
      }
      return <LaplaceScene animate />

    default:
      return <LaplaceScene animate />
  }
}
