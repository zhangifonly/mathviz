/**
 * 概率场景渲染器
 * 渲染骰子模拟、概率分布、大数定律等
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '概率论', subtitle: '随机事件的数学规律' },
    'summary-intro': { title: '总结回顾', subtitle: '概率论的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索随机之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '概率论', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 骰子模拟场景
function DiceScene() {
  const [rolls, setRolls] = useState<number[]>([])
  const [currentDice, setCurrentDice] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      if (rolls.length < 100) {
        const newRoll = Math.floor(Math.random() * 6) + 1
        setCurrentDice(newRoll)
        setRolls(prev => [...prev, newRoll])
      }
    }, 200)
    return () => clearInterval(interval)
  }, [rolls.length])

  const counts = useMemo(() => {
    const c = [0, 0, 0, 0, 0, 0]
    rolls.forEach(r => c[r - 1]++)
    return c
  }, [rolls])

  const maxCount = Math.max(...counts, 1)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
      {/* 当前骰子 */}
      <div className="text-8xl">{['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][currentDice - 1]}</div>
      <p className="text-white/70">投掷次数: {rolls.length}</p>

      {/* 频率分布 */}
      <div className="flex items-end gap-4 h-40">
        {counts.map((count, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div
              className="w-12 bg-blue-500 rounded-t transition-all"
              style={{ height: `${(count / maxCount) * 120}px` }}
            />
            <span className="text-white text-sm">{i + 1}</span>
            <span className="text-white/50 text-xs">{rolls.length > 0 ? ((count / rolls.length) * 100).toFixed(1) : 0}%</span>
          </div>
        ))}
      </div>
      <p className="text-white/50 text-sm">理论概率: 16.67%</p>
    </div>
  )
}

// 大数定律场景
function LawOfLargeNumbersScene() {
  const [data, setData] = useState<{ n: number; avg: number }[]>([])

  useEffect(() => {
    let sum = 0
    const newData: { n: number; avg: number }[] = []
    for (let i = 1; i <= 500; i++) {
      sum += Math.random()
      if (i % 5 === 0) {
        newData.push({ n: i, avg: sum / i })
      }
    }
    setData(newData)
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 50

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制期望值线 (0.5)
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    const y05 = height - padding - (0.5 - 0.3) / 0.4 * (height - 2 * padding)
    ctx.moveTo(padding, y05)
    ctx.lineTo(width - padding, y05)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制数据
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    data.forEach((d, i) => {
      const x = padding + (d.n / 500) * (width - 2 * padding)
      const y = height - padding - (d.avg - 0.3) / 0.4 * (height - 2 * padding)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('样本均值', 10, 20)
    ctx.fillText('n (样本量)', width / 2, height - 10)
    ctx.fillStyle = '#ef4444'
    ctx.fillText('E[X] = 0.5', width - 100, y05 - 10)
  }, [data])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <h3 className="text-white text-xl">大数定律演示</h3>
      <canvas ref={canvasRef} width={600} height={400} className="border border-white/10 rounded" />
      <p className="text-white/60 text-sm">随着样本量增加，样本均值趋近于期望值</p>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'basic': {
      formula: 'P(A) = \\frac{|A|}{|\\Omega|}',
      description: '古典概型：有利结果数 / 总结果数',
    },
    'conditional': {
      formula: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}',
      description: '条件概率公式',
    },
    'expectation': {
      formula: 'E[X] = \\sum_{i} x_i \\cdot P(X = x_i)',
      description: '期望值公式',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['basic']

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
      title: '概率论的应用',
      items: ['保险精算', '天气预报', '医学诊断', '金融风险'],
      icon: '🎲',
    },
    'app-insurance': {
      title: '保险精算',
      items: ['风险评估', '保费计算', '赔付预测'],
      icon: '📊',
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
export default function ProbabilitySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  if (sceneConfig.type === 'title') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  if (sceneConfig.type === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  if (sceneConfig.type === 'formula') {
    return <FormulaScene formulaType="basic" />
  }

  switch (sectionId) {
    case 'intro':
    case 'dice':
      return <DiceScene />
    case 'law':
    case 'convergence':
      return <LawOfLargeNumbersScene />
    case 'formula':
      return <FormulaScene formulaType="expectation" />
    default:
      return <DiceScene />
  }
}
