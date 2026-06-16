/**
 * 二次函数场景渲染器
 * 渲染抛物线、顶点、对称轴、零点等二次函数可视化
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '二次函数', subtitle: '抛物线的奥秘' },
    'summary-intro': { title: '总结回顾', subtitle: '二次函数的核心知识' },
    'summary-end': { title: '感谢观看', subtitle: '探索函数之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '二次函数', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 抛物线图形场景
interface ParabolaSceneProps {
  a?: number
  b?: number
  c?: number
  showVertex?: boolean
  showAxis?: boolean
  showRoots?: boolean
  animate?: boolean
}

function ParabolaScene({
  a = 1,
  b = 0,
  c = 0,
  showVertex = false,
  showAxis = false,
  showRoots = false,
  animate = false,
}: ParabolaSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [params, setParams] = useState({ a, b, c })
  const animationRef = useRef<number>(0)

  // 计算顶点坐标
  const vertex = useMemo(() => ({
    x: -params.b / (2 * params.a),
    y: params.c - (params.b * params.b) / (4 * params.a),
  }), [params.a, params.b, params.c])

  // 计算判别式和零点
  const { roots, discriminant } = useMemo(() => {
    const disc = params.b * params.b - 4 * params.a * params.c
    const result: { x1?: number; x2?: number } = {}
    if (disc >= 0) {
      result.x1 = (-params.b + Math.sqrt(disc)) / (2 * params.a)
      result.x2 = (-params.b - Math.sqrt(disc)) / (2 * params.a)
    }
    return { roots: result, discriminant: disc }
  }, [params.a, params.b, params.c])

  // 参数动画
  useEffect(() => {
    if (!animate) return

    let time = 0
    const animateParams = () => {
      time += 0.02
      const newA = 0.5 + Math.sin(time) * 0.3
      const newB = Math.cos(time * 0.7) * 2
      const newC = Math.sin(time * 0.5) * 2
      setParams({ a: newA, b: newB, c: newC })
      animationRef.current = requestAnimationFrame(animateParams)
    }

    animationRef.current = requestAnimationFrame(animateParams)
    return () => cancelAnimationFrame(animationRef.current)
  }, [animate])

  // 绘制抛物线
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 坐标系设置
    const scale = 40 // 每单位的像素数
    const originX = width / 2
    const originY = height / 2

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1

    // x轴
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(width, originY)
    ctx.stroke()

    // y轴
    ctx.beginPath()
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, height)
    ctx.stroke()

    // 绘制网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    for (let i = -10; i <= 10; i++) {
      if (i === 0) continue
      // 垂直线
      ctx.beginPath()
      ctx.moveTo(originX + i * scale, 0)
      ctx.lineTo(originX + i * scale, height)
      ctx.stroke()
      // 水平线
      ctx.beginPath()
      ctx.moveTo(0, originY - i * scale)
      ctx.lineTo(width, originY - i * scale)
      ctx.stroke()
    }

    // 绘制对称轴
    if (showAxis) {
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.5)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      const axisX = originX + vertex.x * scale
      ctx.beginPath()
      ctx.moveTo(axisX, 0)
      ctx.lineTo(axisX, height)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // 绘制抛物线
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()

    let firstPoint = true
    for (let px = 0; px < width; px++) {
      const x = (px - originX) / scale
      const y = params.a * x * x + params.b * x + params.c
      const py = originY - y * scale

      if (py >= 0 && py <= height) {
        if (firstPoint) {
          ctx.moveTo(px, py)
          firstPoint = false
        } else {
          ctx.lineTo(px, py)
        }
      }
    }
    ctx.stroke()

    // 绘制顶点
    if (showVertex) {
      const vx = originX + vertex.x * scale
      const vy = originY - vertex.y * scale

      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(vx, vy, 6, 0, Math.PI * 2)
      ctx.fill()

      // 顶点标签
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText(
        `顶点 (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`,
        vx + 10,
        vy - 10
      )
    }

    // 绘制零点
    if (showRoots && discriminant >= 0) {
      ctx.fillStyle = '#10b981'

      if (roots.x1 !== undefined) {
        const rx1 = originX + roots.x1 * scale
        ctx.beginPath()
        ctx.arc(rx1, originY, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'white'
        ctx.font = '14px sans-serif'
        ctx.fillText(`x₁ = ${roots.x1.toFixed(2)}`, rx1 + 10, originY - 10)
      }

      if (roots.x2 !== undefined && Math.abs(roots.x1! - roots.x2) > 0.01) {
        ctx.fillStyle = '#10b981'
        const rx2 = originX + roots.x2 * scale
        ctx.beginPath()
        ctx.arc(rx2, originY, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = 'white'
        ctx.font = '14px sans-serif'
        ctx.fillText(`x₂ = ${roots.x2.toFixed(2)}`, rx2 + 10, originY + 20)
      }
    }

    // 显示函数表达式
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    const expr = `y = ${params.a.toFixed(2)}x² ${params.b >= 0 ? '+' : ''}${params.b.toFixed(2)}x ${params.c >= 0 ? '+' : ''}${params.c.toFixed(2)}`
    ctx.fillText(expr, 20, 30)
  }, [params, showVertex, showAxis, showRoots, vertex, roots, discriminant])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 顶点演示场景
function VertexScene({ showCalculation = false }: { showCalculation?: boolean }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (showCalculation) {
      const timer = setInterval(() => {
        setStep(s => (s + 1) % 3)
      }, 2000)
      return () => clearInterval(timer)
    }
  }, [showCalculation])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-3xl w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">顶点坐标计算</h3>

        <div className="bg-white/5 border border-white/20 rounded-lg p-6 space-y-4">
          <div className={`transition-opacity duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-30'}`}>
            <h4 className="font-semibold text-lg text-white mb-2">1. 标准形式</h4>
            <div className="p-4 bg-white/10 rounded">
              <MathFormula formula="y = ax^2 + bx + c" className="text-xl" />
            </div>
          </div>

          <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
            <h4 className="font-semibold text-lg text-white mb-2">2. 顶点横坐标</h4>
            <div className="p-4 bg-white/10 rounded">
              <MathFormula formula="x_v = -\\frac{b}{2a}" className="text-xl" />
            </div>
            <p className="text-white/70 mt-2">对称轴方程：x = -b/(2a)</p>
          </div>

          <div className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-30'}`}>
            <h4 className="font-semibold text-lg text-white mb-2">3. 顶点纵坐标</h4>
            <div className="p-4 bg-white/10 rounded">
              <MathFormula formula="y_v = c - \\frac{b^2}{4a}" className="text-xl" />
            </div>
            <p className="text-white/70 mt-2">或者代入 x_v 计算：y_v = f(x_v)</p>
          </div>
        </div>

        <div className="mt-6">
          <ParabolaScene a={1} b={-2} c={-3} showVertex showAxis />
        </div>
      </div>
    </div>
  )
}

// 零点演示场景
function RootsScene({ discriminantCase = 'positive' }: { discriminantCase?: 'positive' | 'zero' | 'negative' }) {
  const cases = {
    positive: { a: 1, b: 0, c: -4, desc: '两个不同的实根' },
    zero: { a: 1, b: -2, c: 1, desc: '两个相等的实根（重根）' },
    negative: { a: 1, b: 0, c: 4, desc: '无实根' },
  }

  const { a, b, c, desc } = cases[discriminantCase]
  const discriminant = b * b - 4 * a * c

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
      <div className="max-w-3xl w-full">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">零点与判别式</h3>

        <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg text-white mb-2">求根公式</h4>
              <div className="p-4 bg-white/10 rounded">
                <MathFormula formula="x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" className="text-xl" />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg text-white mb-2">判别式</h4>
              <div className="p-4 bg-white/10 rounded">
                <MathFormula formula="\\Delta = b^2 - 4ac" className="text-xl" />
              </div>
              <div className="mt-4 space-y-2 text-white/80">
                <p>• Δ &gt; 0：两个不同的实根</p>
                <p>• Δ = 0：两个相等的实根（重根）</p>
                <p>• Δ &lt; 0：无实根（有两个共轭复根）</p>
              </div>
            </div>

            <div className={`p-4 rounded ${
              discriminant > 0 ? 'bg-green-500/20 border border-green-500/50' :
              discriminant === 0 ? 'bg-yellow-500/20 border border-yellow-500/50' :
              'bg-red-500/20 border border-red-500/50'
            }`}>
              <p className="text-white font-semibold">当前情况：{desc}</p>
              <p className="text-white/70 mt-1">Δ = {discriminant.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <ParabolaScene a={a} b={b} c={c} showRoots showVertex />
      </div>
    </div>
  )
}

// 参数变化动画场景
function ParameterScene({ paramType = 'a' }: { paramType?: 'a' | 'b' | 'c' }) {
  const descriptions = {
    a: {
      title: '参数 a 的影响',
      points: [
        'a > 0：抛物线开口向上',
        'a < 0：抛物线开口向下',
        '|a| 越大，抛物线越"瘦"（开口越窄）',
        '|a| 越小，抛物线越"胖"（开口越宽）',
      ],
    },
    b: {
      title: '参数 b 的影响',
      points: [
        'b 影响对称轴的位置',
        'b 改变时，抛物线左右平移',
        '对称轴：x = -b/(2a)',
        'b 与 a 同号时，对称轴在 y 轴左侧',
      ],
    },
    c: {
      title: '参数 c 的影响',
      points: [
        'c 是抛物线与 y 轴的交点纵坐标',
        'c 改变时，抛物线上下平移',
        'c > 0：与 y 轴交于正半轴',
        'c < 0：与 y 轴交于负半轴',
      ],
    },
  }

  const { title, points } = descriptions[paramType]

  return (
    <div className="w-full h-full flex items-center justify-center gap-8 p-8">
      <div className="flex-1 max-w-md">
        <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
        <ul className="space-y-3 text-white/80 text-lg">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <ParabolaScene
          a={paramType === 'a' ? 1 : 1}
          b={paramType === 'b' ? 0 : 0}
          c={paramType === 'c' ? 0 : 0}
          animate
          showVertex
          showAxis
        />
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'standard': {
      formula: 'y = ax^2 + bx + c \\quad (a \\neq 0)',
      description: '二次函数的标准形式',
    },
    'vertex': {
      formula: 'y = a(x - h)^2 + k',
      description: '二次函数的顶点式，其中 (h, k) 是顶点坐标',
    },
    'factored': {
      formula: 'y = a(x - x_1)(x - x_2)',
      description: '二次函数的因式分解式，其中 x₁, x₂ 是零点',
    },
    'discriminant': {
      formula: '\\Delta = b^2 - 4ac',
      description: '判别式，用于判断零点的个数和性质',
    },
    'roots': {
      formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      description: '求根公式（韦达公式）',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['standard']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg text-center max-w-2xl">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '二次函数的应用',
      items: ['物理学', '工程学', '经济学', '日常生活'],
      icon: '🎯',
    },
    'app-physics': {
      title: '物理学应用',
      items: ['抛体运动轨迹', '自由落体', '弹簧振动', '光学反射'],
      icon: '🚀',
    },
    'app-engineering': {
      title: '工程学应用',
      items: ['桥梁拱形设计', '抛物面天线', '喷泉水柱', '建筑结构'],
      icon: '🏗️',
    },
    'app-economics': {
      title: '经济学应用',
      items: ['成本函数', '利润最大化', '供需平衡', '投资收益'],
      icon: '💰',
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
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function QuadraticSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig, lineState } = scene

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
    if (sceneConfig.id.includes('vertex')) {
      return <FormulaScene formulaType="vertex" />
    }
    if (sceneConfig.id.includes('factored')) {
      return <FormulaScene formulaType="factored" />
    }
    if (sceneConfig.id.includes('discriminant')) {
      return <FormulaScene formulaType="discriminant" />
    }
    if (sceneConfig.id.includes('roots')) {
      return <FormulaScene formulaType="roots" />
    }
    return <FormulaScene formulaType="standard" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('parabola')) {
        return <ParabolaScene a={1} b={0} c={0} />
      }
      if (sceneConfig.id.includes('trajectory')) {
        return <ParabolaScene a={-0.5} b={2} c={1} showVertex />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    case 'concept':
      if (sceneConfig.id.includes('standard')) {
        return <FormulaScene formulaType="standard" />
      }
      if (sceneConfig.id.includes('graph')) {
        return <ParabolaScene a={1} b={-2} c={-3} showVertex showAxis showRoots />
      }
      return <ParabolaScene a={1} b={0} c={0} />

    case 'parabola': {
      const a = (lineState?.params?.a as number) || 1
      const b = (lineState?.params?.b as number) || 0
      const c = (lineState?.params?.c as number) || 0
      return <ParabolaScene a={a} b={b} c={c} showVertex showAxis />
    }

    case 'vertex':
      if (sceneConfig.id.includes('calculation')) {
        return <VertexScene showCalculation />
      }
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="vertex" />
      }
      return <ParabolaScene a={1} b={-2} c={-3} showVertex showAxis />

    case 'roots':
      if (sceneConfig.id.includes('positive')) {
        return <RootsScene discriminantCase="positive" />
      }
      if (sceneConfig.id.includes('zero')) {
        return <RootsScene discriminantCase="zero" />
      }
      if (sceneConfig.id.includes('negative')) {
        return <RootsScene discriminantCase="negative" />
      }
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="roots" />
      }
      return <RootsScene />

    case 'parameter':
      if (sceneConfig.id.includes('param-a')) {
        return <ParameterScene paramType="a" />
      }
      if (sceneConfig.id.includes('param-b')) {
        return <ParameterScene paramType="b" />
      }
      if (sceneConfig.id.includes('param-c')) {
        return <ParameterScene paramType="c" />
      }
      return <ParabolaScene animate />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('forms')) {
        return <FormulaScene formulaType="standard" />
      }
      if (sceneConfig.id.includes('properties')) {
        return <ParabolaScene a={1} b={-2} c={-3} showVertex showAxis showRoots />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    default:
      return <ParabolaScene a={1} b={0} c={0} />
  }
}
