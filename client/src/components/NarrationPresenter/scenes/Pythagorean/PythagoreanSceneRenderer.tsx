/**
 * 勾股定理场景渲染器
 * 根据场景配置渲染直角三角形、正方形面积、勾股数等可视化
 */

import { useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '勾股定理', subtitle: '探索直角三角形中边长的关系' },
    'summary-1': { title: '总结回顾', subtitle: '勾股定理的核心思想' },
    'summary-5': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '勾股定理', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 直角三角形场景
interface TriangleSceneProps {
  a?: number
  b?: number
  showSquares?: boolean
  animate?: boolean
}

function TriangleScene({ a = 3, b = 4, showSquares = false, animate = false }: TriangleSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)

  useEffect(() => {
    if (animate) {
      const timer = setInterval(() => {
        setAnimationProgress(p => (p >= 1 ? 0 : p + 0.01))
      }, 30)
      return () => clearInterval(timer)
    } else {
      setAnimationProgress(1)
    }
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const scale = 40

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 计算斜边
    const c = Math.sqrt(a * a + b * b)

    // 三角形顶点位置
    const centerX = width / 2 - (a * scale) / 2
    const centerY = height / 2 + (b * scale) / 2

    const p1 = { x: centerX, y: centerY } // 直角顶点
    const p2 = { x: centerX + a * scale, y: centerY } // 底边右端点
    const p3 = { x: centerX, y: centerY - b * scale } // 左边上端点

    // 绘制三角形
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // 绘制直角标记
    const markSize = 15
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y - markSize)
    ctx.lineTo(p1.x + markSize, p1.y - markSize)
    ctx.lineTo(p1.x + markSize, p1.y)
    ctx.stroke()

    // 标注边长
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.fillText(`a = ${a.toFixed(1)}`, (p1.x + p2.x) / 2, p1.y + 25)
    ctx.fillText(`b = ${b.toFixed(1)}`, p1.x - 35, (p1.y + p3.y) / 2)
    ctx.fillText(`c = ${c.toFixed(2)}`, (p2.x + p3.x) / 2 + 15, (p2.y + p3.y) / 2 - 10)

    // 绘制正方形（如果启用）
    if (showSquares && animationProgress > 0) {
      const progress = animationProgress

      // 正方形 a² (红色)
      ctx.fillStyle = `rgba(239, 68, 68, ${0.3 * progress})`
      ctx.strokeStyle = `rgba(239, 68, 68, ${progress})`
      ctx.lineWidth = 2
      ctx.fillRect(p1.x, p1.y, a * scale * progress, a * scale * progress)
      ctx.strokeRect(p1.x, p1.y, a * scale * progress, a * scale * progress)
      if (progress > 0.8) {
        ctx.fillStyle = 'white'
        ctx.font = '14px sans-serif'
        ctx.fillText(`a² = ${(a * a).toFixed(1)}`, p1.x + (a * scale) / 2 - 30, p1.y + (a * scale) / 2)
      }

      // 正方形 b² (绿色)
      ctx.fillStyle = `rgba(34, 197, 94, ${0.3 * progress})`
      ctx.strokeStyle = `rgba(34, 197, 94, ${progress})`
      ctx.lineWidth = 2
      ctx.fillRect(p1.x - b * scale * progress, p1.y - b * scale * progress, b * scale * progress, b * scale * progress)
      ctx.strokeRect(p1.x - b * scale * progress, p1.y - b * scale * progress, b * scale * progress, b * scale * progress)
      if (progress > 0.8) {
        ctx.fillStyle = 'white'
        ctx.font = '14px sans-serif'
        ctx.fillText(`b² = ${(b * b).toFixed(1)}`, p1.x - (b * scale) / 2 - 30, p1.y - (b * scale) / 2)
      }

      // 正方形 c² (黄色) - 在斜边上
      const angle = Math.atan2(p3.y - p2.y, p3.x - p2.x)
      ctx.save()
      ctx.translate(p2.x, p2.y)
      ctx.rotate(angle)
      ctx.fillStyle = `rgba(234, 179, 8, ${0.3 * progress})`
      ctx.strokeStyle = `rgba(234, 179, 8, ${progress})`
      ctx.lineWidth = 2
      ctx.fillRect(0, 0, c * scale * progress, -c * scale * progress)
      ctx.strokeRect(0, 0, c * scale * progress, -c * scale * progress)
      if (progress > 0.8) {
        ctx.fillStyle = 'white'
        ctx.font = '14px sans-serif'
        ctx.fillText(`c² = ${(c * c).toFixed(1)}`, (c * scale) / 2 - 30, -(c * scale) / 2)
      }
      ctx.restore()
    }
  }, [a, b, showSquares, animationProgress])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 三个正方形面积场景
function SquaresScene({ a = 3, b = 4 }: { a?: number; b?: number }) {
  const c = Math.sqrt(a * a + b * b)

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">面积关系</h3>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* 正方形 a² */}
          <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-6">
            <div className="text-center">
              <div className="text-red-400 font-bold text-lg mb-2">正方形 a²</div>
              <div className="text-white text-3xl mb-2">{(a * a).toFixed(1)}</div>
              <div className="text-white/60 text-sm">边长 a = {a.toFixed(1)}</div>
            </div>
          </div>

          {/* 正方形 b² */}
          <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-6">
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg mb-2">正方形 b²</div>
              <div className="text-white text-3xl mb-2">{(b * b).toFixed(1)}</div>
              <div className="text-white/60 text-sm">边长 b = {b.toFixed(1)}</div>
            </div>
          </div>

          {/* 正方形 c² */}
          <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-6">
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg mb-2">正方形 c²</div>
              <div className="text-white text-3xl mb-2">{(c * c).toFixed(1)}</div>
              <div className="text-white/60 text-sm">边长 c = {c.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-6 text-center">
          <div className="text-white text-xl mb-4">
            <span className="text-red-400">{(a * a).toFixed(1)}</span>
            {' + '}
            <span className="text-green-400">{(b * b).toFixed(1)}</span>
            {' = '}
            <span className="text-yellow-400">{(c * c).toFixed(1)}</span>
          </div>
          <div className="text-white/70">
            两个小正方形的面积之和等于大正方形的面积
          </div>
        </div>
      </div>
    </div>
  )
}

// 证明动画场景
function ProofScene({ step = 0 }: { step?: number }) {
  const [currentStep, setCurrentStep] = useState(step)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(s => (s + 1) % 4)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const steps = [
    { title: '步骤 1', description: '在直角边 a 上构建正方形，面积为 a²' },
    { title: '步骤 2', description: '在直角边 b 上构建正方形，面积为 b²' },
    { title: '步骤 3', description: '在斜边 c 上构建正方形，面积为 c²' },
    { title: '步骤 4', description: '通过几何变换证明：a² + b² = c²' },
  ]

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">几何证明</h3>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <TriangleScene a={3} b={4} showSquares={currentStep >= 0} animate={false} />

          <div className="flex flex-col justify-center space-y-4">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border transition-all duration-500 ${
                  i === currentStep
                    ? 'bg-blue-500/30 border-blue-500 scale-105'
                    : 'bg-white/5 border-white/20 opacity-50'
                }`}
              >
                <div className="text-white font-semibold mb-1">{s.title}</div>
                <div className="text-white/70 text-sm">{s.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-white/70">
            面积法是勾股定理最直观的证明方法之一
          </div>
        </div>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'theorem': {
      formula: 'a^2 + b^2 = c^2',
      description: '勾股定理：直角三角形两直角边的平方和等于斜边的平方',
    },
    'solve-c': {
      formula: 'c = \\sqrt{a^2 + b^2}',
      description: '已知两直角边，求斜边',
    },
    'solve-a': {
      formula: 'a = \\sqrt{c^2 - b^2}',
      description: '已知斜边和一直角边，求另一直角边',
    },
    'pythagorean-triple': {
      formula: '3^2 + 4^2 = 5^2 \\quad (9 + 16 = 25)',
      description: '最小的勾股数：3, 4, 5',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['theorem']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg text-center max-w-2xl">{description}</p>
    </div>
  )
}

// 勾股数场景
function PythagoreanTriplesScene({ highlightTriple }: { highlightTriple?: string }) {
  const triples = [
    { a: 3, b: 4, c: 5, name: '3-4-5' },
    { a: 5, b: 12, c: 13, name: '5-12-13' },
    { a: 8, b: 15, c: 17, name: '8-15-17' },
    { a: 7, b: 24, c: 25, name: '7-24-25' },
    { a: 6, b: 8, c: 10, name: '6-8-10 (3-4-5的倍数)' },
    { a: 9, b: 12, c: 15, name: '9-12-15 (3-4-5的倍数)' },
  ]

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">常见勾股数</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {triples.map((triple, i) => {
            const isHighlighted = highlightTriple === triple.name
            const verified = triple.a * triple.a + triple.b * triple.b === triple.c * triple.c

            return (
              <div
                key={i}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  isHighlighted
                    ? 'bg-blue-500/30 border-blue-500 scale-105'
                    : 'bg-white/5 border-white/20'
                }`}
              >
                <div className="text-white font-semibold mb-2">{triple.name}</div>
                <div className="text-white/80 text-sm mb-2">
                  {triple.a}² + {triple.b}² = {triple.c}²
                </div>
                <div className="text-white/60 text-xs">
                  {triple.a * triple.a} + {triple.b * triple.b} = {triple.c * triple.c}
                  {verified && <span className="text-green-400 ml-2">✓</span>}
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white/10 rounded-lg p-4 text-center">
          <div className="text-white/70 text-sm">
            勾股数是满足 a² + b² = c² 的正整数组合
          </div>
        </div>
      </div>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'application-1': {
      title: '勾股定理的应用',
      items: ['建筑测量', '导航定位', '工程设计', '日常生活'],
      icon: '📐',
    },
    'application-2': {
      title: '梯子靠墙问题',
      items: ['梯子长度是斜边', '墙高是一条直角边', '地面距离是另一条直角边', '用勾股定理求解'],
      icon: '🪜',
    },
    'application-3': {
      title: '建筑测量',
      items: ['测量建筑物高度', '计算对角线长度', '检验直角是否准确', '土地测量'],
      icon: '🏗️',
    },
    'application-4': {
      title: '导航定位',
      items: ['计算两点间直线距离', 'GPS定位', '地图导航', '航海航空'],
      icon: '🧭',
    },
  }

  const app = apps[sceneId] || apps['application-1']

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
export default function PythagoreanSceneRenderer({ scene }: SceneRendererProps) {
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

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id === 'intro-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id.includes('history')) {
        return <TriangleScene a={3} b={4} showSquares={false} />
      }
      return <TriangleScene a={3} b={4} showSquares={false} />

    case 'theorem':
      if (sceneConfig.id.includes('1') || sceneConfig.id.includes('2')) {
        return <FormulaScene formulaType="theorem" />
      }
      if (sceneConfig.id.includes('3')) {
        return <TriangleScene a={3} b={4} showSquares={false} />
      }
      return <FormulaScene formulaType="theorem" />

    case 'visualization':
      if (sceneConfig.id.includes('1')) {
        return <TriangleScene a={3} b={4} showSquares={false} />
      }
      if (sceneConfig.id.includes('2') || sceneConfig.id.includes('3')) {
        return <SquaresScene a={3} b={4} />
      }
      if (sceneConfig.id.includes('4')) {
        return <TriangleScene a={3} b={4} showSquares={true} animate={false} />
      }
      return <TriangleScene a={3} b={4} showSquares={true} />

    case 'proof':
      if (sceneConfig.id.includes('5')) {
        return <TriangleScene a={3} b={4} showSquares={true} animate={true} />
      }
      return <ProofScene />

    case 'pythagorean-triples':
      if (sceneConfig.id.includes('2')) {
        return <PythagoreanTriplesScene highlightTriple="3-4-5" />
      }
      if (sceneConfig.id.includes('3')) {
        return <PythagoreanTriplesScene highlightTriple="5-12-13" />
      }
      return <PythagoreanTriplesScene />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'parameters':
      return <TriangleScene a={3} b={4} showSquares={true} animate={false} />

    case 'summary':
      if (sceneConfig.id === 'summary-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id.includes('2')) {
        return <FormulaScene formulaType="theorem" />
      }
      if (sceneConfig.id.includes('3')) {
        return <ProofScene />
      }
      if (sceneConfig.id.includes('4')) {
        return <ApplicationScene sceneId="application-1" />
      }
      return <TitleScene sceneId="summary-5" />

    default:
      return <TriangleScene a={3} b={4} showSquares={false} />
  }
}
