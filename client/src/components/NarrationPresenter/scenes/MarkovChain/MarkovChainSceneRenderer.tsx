/**
 * 马尔可夫链场景渲染器
 * 渲染状态转移图、转移矩阵、状态演化动画等
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '马尔可夫链', subtitle: '探索随机过程与状态转移' },
    'summary-intro': { title: '总结回顾', subtitle: '马尔可夫链的核心思想' },
    'sum-4': { title: '感谢观看', subtitle: '探索随机过程的数学基础' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '马尔可夫链', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 状态转移图场景
function StateGraphScene({
  showTransitions = false,
  highlightState = null,
  animate = false
}: {
  showTransitions?: boolean
  highlightState?: 'sunny' | 'rainy' | null
  animate?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  // 动画效果
  useEffect(() => {
    if (!animate) return

    const timer = setInterval(() => {
      setAnimationPhase(p => (p + 1) % 4)
    }, 1000)
    return () => clearInterval(timer)
  }, [animate])

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

    // 状态节点位置
    const sunnyPos = { x: width * 0.3, y: height * 0.5 }
    const rainyPos = { x: width * 0.7, y: height * 0.5 }
    const radius = 50

    // 绘制转移箭头
    if (showTransitions) {
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      // 晴天自环
      ctx.beginPath()
      ctx.arc(sunnyPos.x, sunnyPos.y - radius - 30, 30, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText('0.7', sunnyPos.x - 10, sunnyPos.y - radius - 50)

      // 雨天自环
      ctx.beginPath()
      ctx.arc(rainyPos.x, rainyPos.y - radius - 30, 30, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillText('0.6', rainyPos.x - 10, rainyPos.y - radius - 50)

      // 晴天到雨天
      ctx.beginPath()
      ctx.moveTo(sunnyPos.x + radius, sunnyPos.y - 10)
      ctx.quadraticCurveTo(width * 0.5, sunnyPos.y - 60, rainyPos.x - radius, rainyPos.y - 10)
      ctx.stroke()
      // 箭头
      const angle1 = Math.atan2(-10, -radius)
      ctx.beginPath()
      ctx.moveTo(rainyPos.x - radius, rainyPos.y - 10)
      ctx.lineTo(rainyPos.x - radius + 10 * Math.cos(angle1 + 0.5), rainyPos.y - 10 + 10 * Math.sin(angle1 + 0.5))
      ctx.lineTo(rainyPos.x - radius + 10 * Math.cos(angle1 - 0.5), rainyPos.y - 10 + 10 * Math.sin(angle1 - 0.5))
      ctx.closePath()
      ctx.fillStyle = 'rgba(96, 165, 250, 0.6)'
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.fillText('0.3', width * 0.5 - 10, sunnyPos.y - 70)

      // 雨天到晴天
      ctx.beginPath()
      ctx.moveTo(rainyPos.x - radius, rainyPos.y + 10)
      ctx.quadraticCurveTo(width * 0.5, rainyPos.y + 60, sunnyPos.x + radius, sunnyPos.y + 10)
      ctx.stroke()
      // 箭头
      const angle2 = Math.atan2(10, radius)
      ctx.beginPath()
      ctx.moveTo(sunnyPos.x + radius, sunnyPos.y + 10)
      ctx.lineTo(sunnyPos.x + radius - 10 * Math.cos(angle2 + 0.5), sunnyPos.y + 10 - 10 * Math.sin(angle2 + 0.5))
      ctx.lineTo(sunnyPos.x + radius - 10 * Math.cos(angle2 - 0.5), sunnyPos.y + 10 - 10 * Math.sin(angle2 - 0.5))
      ctx.closePath()
      ctx.fillStyle = 'rgba(96, 165, 250, 0.6)'
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.fillText('0.4', width * 0.5 - 10, rainyPos.y + 80)

      ctx.setLineDash([])
    }

    // 绘制状态节点
    const drawState = (pos: { x: number; y: number }, label: string, emoji: string, isHighlight: boolean) => {
      // 高亮效果
      if (isHighlight || (animate && animationPhase % 2 === (label === '晴天' ? 0 : 1))) {
        ctx.shadowColor = '#60a5fa'
        ctx.shadowBlur = 20
      } else {
        ctx.shadowBlur = 0
      }

      // 节点圆圈
      ctx.fillStyle = isHighlight ? 'rgba(96, 165, 250, 0.3)' : 'rgba(51, 65, 85, 0.8)'
      ctx.strokeStyle = isHighlight ? '#60a5fa' : '#475569'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.shadowBlur = 0

      // 表情符号
      ctx.font = '32px sans-serif'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(emoji, pos.x, pos.y - 5)

      // 标签
      ctx.font = '16px sans-serif'
      ctx.fillText(label, pos.x, pos.y + 30)
    }

    drawState(sunnyPos, '晴天', '☀️', highlightState === 'sunny')
    drawState(rainyPos, '雨天', '🌧️', highlightState === 'rainy')

  }, [showTransitions, highlightState, animate, animationPhase])

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

// 转移矩阵场景
function TransitionMatrixScene({
  showValues = false,
  highlightRow = null,
  highlightCol = null
}: {
  showValues?: boolean
  highlightRow?: number | null
  highlightCol?: number | null
}) {
  const matrix = [
    [0.7, 0.3],
    [0.4, 0.6]
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="text-white/80 text-lg mb-4">
        <MathFormula formula="P = \begin{bmatrix} P_{晴\to晴} & P_{晴\to雨} \\ P_{雨\to晴} & P_{雨\to雨} \end{bmatrix}" />
      </div>

      {showValues && (
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {matrix.map((row, i) =>
              row.map((val, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`
                    w-24 h-24 flex items-center justify-center rounded-lg text-2xl font-bold
                    transition-all duration-300
                    ${highlightRow === i || highlightCol === j
                      ? 'bg-blue-500/30 border-2 border-blue-400 scale-110'
                      : 'bg-white/10 border border-white/20'}
                  `}
                >
                  <span className="text-white">{val}</span>
                </div>
              ))
            )}
          </div>

          {/* 行列标签 */}
          <div className="absolute -left-20 top-0 h-full flex flex-col justify-around text-white/60">
            <div>晴天</div>
            <div>雨天</div>
          </div>
          <div className="absolute -top-10 left-0 w-full flex justify-around text-white/60">
            <div>晴天</div>
            <div>雨天</div>
          </div>
        </div>
      )}

      <p className="text-white/60 text-sm max-w-md text-center">
        每一行的和为 1，表示从一个状态出发的所有转移概率之和
      </p>
    </div>
  )
}

// 状态演化动画场景
function EvolutionScene({
  steps = 10,
  autoPlay = false
}: {
  steps?: number
  autoPlay?: boolean
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 自动播放
  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentStep(s => (s < steps ? s + 1 : 0))
    }, 800)
    return () => clearInterval(timer)
  }, [autoPlay, steps])

  // 计算状态分布演化
  const evolution = useMemo(() => {
    const P = [[0.7, 0.3], [0.4, 0.6]]
    let state = [1, 0] // 初始状态：100% 晴天
    const history = [state]

    for (let i = 0; i < steps; i++) {
      const newState = [
        state[0] * P[0][0] + state[1] * P[1][0],
        state[0] * P[0][1] + state[1] * P[1][1]
      ]
      state = newState
      history.push([...state])
    }

    return history
  }, [steps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 60

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
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
    ctx.textAlign = 'center'
    ctx.fillText('时间步', width / 2, height - 20)
    ctx.save()
    ctx.translate(20, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('概率', 0, 0)
    ctx.restore()

    // 绘制网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const y = padding + (height - 2 * padding) * i / 10
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.textAlign = 'right'
        ctx.fillText((1 - i / 10).toFixed(1), padding - 10, y + 5)
      }
    }

    // 绘制数据点和线条
    const xScale = (width - 2 * padding) / steps
    const yScale = height - 2 * padding

    // 晴天概率曲线
    ctx.strokeStyle = '#fbbf24'
    ctx.fillStyle = '#fbbf24'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= currentStep; i++) {
      const x = padding + i * xScale
      const y = height - padding - evolution[i][0] * yScale
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 晴天数据点
    for (let i = 0; i <= currentStep; i++) {
      const x = padding + i * xScale
      const y = height - padding - evolution[i][0] * yScale
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    // 雨天概率曲线
    ctx.strokeStyle = '#60a5fa'
    ctx.fillStyle = '#60a5fa'
    ctx.beginPath()
    for (let i = 0; i <= currentStep; i++) {
      const x = padding + i * xScale
      const y = height - padding - evolution[i][1] * yScale
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // 雨天数据点
    for (let i = 0; i <= currentStep; i++) {
      const x = padding + i * xScale
      const y = height - padding - evolution[i][1] * yScale
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    // 稳态线（理论值）
    const steadyState = 4 / 7 // 晴天稳态概率
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(padding, height - padding - steadyState * yScale)
    ctx.lineTo(width - padding, height - padding - steadyState * yScale)
    ctx.stroke()
    ctx.setLineDash([])

    // 图例
    const legendX = width - padding - 120
    const legendY = padding + 20
    ctx.fillStyle = '#fbbf24'
    ctx.fillRect(legendX, legendY, 20, 3)
    ctx.fillStyle = 'white'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('晴天', legendX + 25, legendY + 5)

    ctx.fillStyle = '#60a5fa'
    ctx.fillRect(legendX, legendY + 20, 20, 3)
    ctx.fillStyle = 'white'
    ctx.fillText('雨天', legendX + 25, legendY + 25)

    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(legendX, legendY + 43)
    ctx.lineTo(legendX + 20, legendY + 43)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'white'
    ctx.fillText('稳态', legendX + 25, legendY + 45)

    // 当前步数显示
    ctx.fillStyle = 'white'
    ctx.font = '16px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`步数: ${currentStep}`, padding, padding - 10)

    // 当前概率值
    if (currentStep < evolution.length) {
      ctx.fillText(
        `晴天: ${(evolution[currentStep][0] * 100).toFixed(1)}%`,
        padding + 100,
        padding - 10
      )
      ctx.fillText(
        `雨天: ${(evolution[currentStep][1] * 100).toFixed(1)}%`,
        padding + 250,
        padding - 10
      )
    }

  }, [currentStep, evolution, steps])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        className="max-w-full border border-white/10 rounded"
      />
      <p className="text-white/60 text-sm">
        从初始状态（100% 晴天）开始，观察概率分布如何收敛到稳态
      </p>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'markov-property': {
      formula: 'P(X_{n+1} = j | X_n = i, X_{n-1}, ..., X_0) = P(X_{n+1} = j | X_n = i)',
      description: '马尔可夫性质：未来只依赖于现在',
    },
    'transition-matrix': {
      formula: 'P = \\begin{bmatrix} p_{11} & p_{12} & \\cdots \\\\ p_{21} & p_{22} & \\cdots \\\\ \\vdots & \\vdots & \\ddots \\end{bmatrix}',
      description: '转移矩阵：描述状态间的转移概率',
    },
    'steady-state': {
      formula: '\\pi P = \\pi, \\quad \\sum_i \\pi_i = 1',
      description: '稳态分布：满足转移矩阵的不动点',
    },
    'chapman-kolmogorov': {
      formula: 'P^{(n+m)} = P^{(n)} \\cdot P^{(m)}',
      description: 'Chapman-Kolmogorov 方程',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['markov-property']

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
  const apps: Record<string, { title: string; items: string[]; icon: string; description?: string }> = {
    'app-1': {
      title: '马尔可夫链的应用',
      items: ['网页排名算法', '语音识别', '金融建模', '天气预报'],
      icon: '🌐',
    },
    'app-2': {
      title: 'Google PageRank',
      items: ['网页作为状态', '链接作为转移', '稳态分布即排名', '互联网规模计算'],
      icon: '🔍',
      description: 'PageRank 将整个互联网建模为一个巨大的马尔可夫链',
    },
    'app-3': {
      title: '隐马尔可夫模型',
      items: ['语音识别', '自然语言处理', '生物信息学', '手写识别'],
      icon: '🗣️',
      description: 'HMM 在语音识别和 NLP 中扮演核心角色',
    },
    'app-4': {
      title: '金融应用',
      items: ['股票价格建模', '信用评级转移', '期权定价', '风险管理'],
      icon: '💰',
      description: '马尔可夫链用于建模金融市场的随机行为',
    },
  }

  const app = apps[sceneId] || apps['app-1']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      {app.description && (
        <p className="text-white/60 text-base max-w-lg text-center">{app.description}</p>
      )}
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
export default function MarkovChainSceneRenderer({ scene }: SceneRendererProps) {
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
    return <FormulaScene formulaType="markov-property" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('intro-2') || sceneConfig.id.includes('intro-3')) {
        return <StateGraphScene showTransitions={false} />
      }
      if (sceneConfig.id.includes('intro-4')) {
        return <StateGraphScene showTransitions={true} />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    case 'concept':
      if (sceneConfig.id.includes('concept-1')) {
        return <StateGraphScene showTransitions={false} animate />
      }
      if (sceneConfig.id.includes('concept-2')) {
        return <FormulaScene formulaType="markov-property" />
      }
      if (sceneConfig.id.includes('concept-3')) {
        return <TransitionMatrixScene showValues />
      }
      if (sceneConfig.id.includes('concept-4')) {
        return <StateGraphScene showTransitions={true} />
      }
      return <StateGraphScene />

    case 'transition':
      if (sceneConfig.id.includes('trans-1')) {
        return <StateGraphScene showTransitions={false} />
      }
      if (sceneConfig.id.includes('trans-2')) {
        return <StateGraphScene showTransitions={true} highlightState="sunny" />
      }
      if (sceneConfig.id.includes('trans-3')) {
        return <StateGraphScene showTransitions={true} highlightState="rainy" />
      }
      if (sceneConfig.id.includes('trans-4')) {
        return <TransitionMatrixScene showValues />
      }
      return <StateGraphScene showTransitions />

    case 'steady-state':
      if (sceneConfig.id.includes('steady-1') || sceneConfig.id.includes('steady-2')) {
        return <EvolutionScene steps={20} autoPlay />
      }
      if (sceneConfig.id.includes('steady-3')) {
        return <FormulaScene formulaType="steady-state" />
      }
      if (sceneConfig.id.includes('steady-4')) {
        return <EvolutionScene steps={30} autoPlay />
      }
      return <EvolutionScene steps={20} />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('sum-1')) {
        return <StateGraphScene showTransitions={true} animate />
      }
      if (sceneConfig.id.includes('sum-2')) {
        return <FormulaScene formulaType="markov-property" />
      }
      if (sceneConfig.id.includes('sum-3')) {
        return <EvolutionScene steps={20} autoPlay />
      }
      if (sceneConfig.id.includes('sum-4')) {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      return <StateGraphScene showTransitions />

    default:
      return <StateGraphScene showTransitions />
  }
}
