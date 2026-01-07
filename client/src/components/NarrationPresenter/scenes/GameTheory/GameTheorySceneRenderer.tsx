/**
 * 博弈论场景渲染器
 * 根据场景配置渲染囚徒困境、纳什均衡等博弈论可视化
 */

import { useState, useEffect } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '博弈论', subtitle: '策略互动的数学' },
    'summary-intro': { title: '总结回顾', subtitle: '博弈论的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '理性决策的艺术' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '博弈论', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 收益矩阵场景（囚徒困境）
interface PayoffMatrixSceneProps {
  highlightCell?: string
  animating?: boolean
}

function PayoffMatrixScene({ highlightCell, animating = false }: PayoffMatrixSceneProps) {
  const [currentHighlight, setCurrentHighlight] = useState<string | null>(null)

  useEffect(() => {
    if (animating) {
      const cells = ['cooperate-cooperate', 'cooperate-defect', 'defect-cooperate', 'defect-defect']
      let index = 0
      const timer = setInterval(() => {
        setCurrentHighlight(cells[index])
        index = (index + 1) % cells.length
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCurrentHighlight(highlightCell || null)
    }
  }, [highlightCell, animating])

  const getCellStyle = (cellId: string) => {
    const isHighlighted = currentHighlight === cellId
    const isNashEquilibrium = cellId === 'defect-defect'

    let bgColor = 'bg-white/5'
    if (isHighlighted) {
      bgColor = 'bg-blue-500/30'
    } else if (isNashEquilibrium && highlightCell === 'defect-defect') {
      bgColor = 'bg-red-500/30'
    }

    return `${bgColor} border border-white/20 p-4 transition-all duration-300 ${
      isHighlighted ? 'scale-105 shadow-lg' : ''
    }`
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">囚徒困境收益矩阵</h3>

        <div className="grid grid-cols-3 gap-2">
          {/* 空白角 */}
          <div className="flex items-center justify-center"></div>
          {/* 列标题 */}
          <div className="flex items-center justify-center text-white font-semibold">
            囚徒 B 合作
          </div>
          <div className="flex items-center justify-center text-white font-semibold">
            囚徒 B 背叛
          </div>

          {/* 行1: 囚徒 A 合作 */}
          <div className="flex items-center justify-center text-white font-semibold">
            囚徒 A 合作
          </div>
          <div className={getCellStyle('cooperate-cooperate')}>
            <div className="text-center">
              <div className="text-green-400 text-xl font-bold">-1, -1</div>
              <div className="text-white/60 text-sm mt-1">双方各判1年</div>
            </div>
          </div>
          <div className={getCellStyle('cooperate-defect')}>
            <div className="text-center">
              <div className="text-red-400 text-xl font-bold">-10, 0</div>
              <div className="text-white/60 text-sm mt-1">A判10年，B释放</div>
            </div>
          </div>

          {/* 行2: 囚徒 A 背叛 */}
          <div className="flex items-center justify-center text-white font-semibold">
            囚徒 A 背叛
          </div>
          <div className={getCellStyle('defect-cooperate')}>
            <div className="text-center">
              <div className="text-red-400 text-xl font-bold">0, -10</div>
              <div className="text-white/60 text-sm mt-1">A释放，B判10年</div>
            </div>
          </div>
          <div className={getCellStyle('defect-defect')}>
            <div className="text-center">
              <div className="text-yellow-400 text-xl font-bold">-5, -5</div>
              <div className="text-white/60 text-sm mt-1">双方各判5年</div>
              {highlightCell === 'defect-defect' && (
                <div className="text-red-400 text-xs mt-2 font-semibold">纳什均衡</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-white/70 text-sm text-center">
          <p>数字表示收益（负数表示刑期）</p>
          <p className="mt-2">格式：(囚徒A收益, 囚徒B收益)</p>
        </div>
      </div>
    </div>
  )
}

// 纳什均衡演示场景
function NashEquilibriumScene({ showAnalysis = false }: { showAnalysis?: boolean }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (showAnalysis) {
      const timer = setInterval(() => {
        setStep(s => (s + 1) % 4)
      }, 2000)
      return () => clearInterval(timer)
    }
  }, [showAnalysis])

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">纳什均衡分析</h3>

        <div className="bg-white/5 border border-white/20 rounded-lg p-6 mb-6">
          <div className="text-white/90 space-y-4">
            <div className={`transition-opacity duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-30'}`}>
              <h4 className="font-semibold text-lg mb-2">1. 囚徒A的最优策略</h4>
              <p className="text-white/70">
                如果B合作：A背叛得0年 &gt; A合作得-1年 → A选择背叛
              </p>
              <p className="text-white/70">
                如果B背叛：A背叛得-5年 &gt; A合作得-10年 → A选择背叛
              </p>
              <p className="text-green-400 mt-2">结论：无论B如何选择，A的最优策略都是背叛</p>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-30'}`}>
              <h4 className="font-semibold text-lg mb-2">2. 囚徒B的最优策略</h4>
              <p className="text-white/70">
                如果A合作：B背叛得0年 &gt; B合作得-1年 → B选择背叛
              </p>
              <p className="text-white/70">
                如果A背叛：B背叛得-5年 &gt; B合作得-10年 → B选择背叛
              </p>
              <p className="text-green-400 mt-2">结论：无论A如何选择，B的最优策略都是背叛</p>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-30'}`}>
              <h4 className="font-semibold text-lg mb-2">3. 纳什均衡</h4>
              <p className="text-white/70">
                双方都选择背叛，各判5年（-5, -5）
              </p>
              <p className="text-red-400 mt-2">
                这是纳什均衡：任何一方单独改变策略都会变得更糟
              </p>
            </div>

            <div className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-30'}`}>
              <h4 className="font-semibold text-lg mb-2">4. 悖论</h4>
              <p className="text-white/70">
                如果双方都合作，各判1年（-1, -1），比纳什均衡更好
              </p>
              <p className="text-yellow-400 mt-2">
                个体理性导致集体非理性！
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-red-400 font-bold text-lg mb-2">纳什均衡</div>
              <div className="text-white text-2xl">(-5, -5)</div>
              <div className="text-white/60 text-sm mt-2">双方背叛</div>
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg mb-2">帕累托最优</div>
              <div className="text-white text-2xl">(-1, -1)</div>
              <div className="text-white/60 text-sm mt-2">双方合作</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'nash': {
      formula: 's^* = (s_1^*, s_2^*, \\ldots, s_n^*)',
      description: '纳什均衡：没有参与者能通过单独改变策略而获益',
    },
    'nash-condition': {
      formula: 'u_i(s_i^*, s_{-i}^*) \\geq u_i(s_i, s_{-i}^*) \\quad \\forall s_i \\in S_i',
      description: '纳什均衡条件：每个参与者的策略都是对其他人策略的最优反应',
    },
    'nash-theorem': {
      formula: '\\text{每个有限博弈至少存在一个纳什均衡（可能是混合策略）}',
      description: '纳什定理（1950）- 约翰·纳什的诺贝尔奖成果',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['nash']

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
      title: '博弈论的应用',
      items: ['经济学', '政治学', '生物学', '计算机科学'],
      icon: '🎯',
    },
    'app-economics': {
      title: '经济学应用',
      items: ['市场竞争', '拍卖设计', '价格策略', '寡头垄断'],
      icon: '💰',
    },
    'app-politics': {
      title: '政治学应用',
      items: ['投票系统', '国际关系', '军备竞赛', '谈判策略'],
      icon: '🏛️',
    },
    'app-biology': {
      title: '生物学应用',
      items: ['进化稳定策略', '动物行为', '合作进化', '种群动态'],
      icon: '🦋',
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

// 策略选择动画场景
function StrategyAnimationScene({ scenario }: { scenario: string }) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % 100)
    }, 50)
    return () => clearInterval(timer)
  }, [])

  const scenarios: Record<string, { title: string; description: string }> = {
    'gas-station': {
      title: '加油站定价博弈',
      description: '两个相邻加油站的价格竞争',
    },
    'arms-race': {
      title: '军备竞赛',
      description: '两国之间的军备扩张困境',
    },
    'interaction': {
      title: '策略互动',
      description: '参与者之间的相互影响',
    },
  }

  const { title, description } = scenarios[scenario] || scenarios['interaction']

  // 简单的动画效果：两个圆圈代表两个参与者
  const player1X = 200 + Math.sin(frame * 0.1) * 50
  const player2X = 400 - Math.sin(frame * 0.1) * 50

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/70 mb-8">{description}</p>

      <svg width="600" height="300" className="max-w-full">
        {/* 参与者1 */}
        <circle
          cx={player1X}
          cy={150}
          r={40}
          fill="#3b82f6"
          opacity={0.7}
        />
        <text
          x={player1X}
          y={155}
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          参与者A
        </text>

        {/* 参与者2 */}
        <circle
          cx={player2X}
          cy={150}
          r={40}
          fill="#ef4444"
          opacity={0.7}
        />
        <text
          x={player2X}
          y={155}
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          参与者B
        </text>

        {/* 连接线 */}
        <line
          x1={player1X}
          y1={150}
          x2={player2X}
          y2={150}
          stroke="white"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity={0.3}
        />
      </svg>

      <div className="mt-8 text-white/60 text-center">
        <p>双方的决策相互影响</p>
      </div>
    </div>
  )
}

// 主渲染器
export default function GameTheorySceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('nash')) {
      return <FormulaScene formulaType="nash" />
    }
    if (sceneConfig.id.includes('theorem')) {
      return <FormulaScene formulaType="nash-theorem" />
    }
    return <FormulaScene formulaType="nash-condition" />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('gas-station')) {
        return <StrategyAnimationScene scenario="gas-station" />
      }
      if (sceneConfig.id.includes('arms-race')) {
        return <StrategyAnimationScene scenario="arms-race" />
      }
      if (sceneConfig.id.includes('tool')) {
        return <PayoffMatrixScene />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    case 'concept':
      if (sceneConfig.id.includes('interaction')) {
        return <StrategyAnimationScene scenario="interaction" />
      }
      if (sceneConfig.id.includes('maximize')) {
        return <PayoffMatrixScene animating />
      }
      if (sceneConfig.id.includes('nash')) {
        return <FormulaScene formulaType="nash" />
      }
      if (sceneConfig.id.includes('nobel')) {
        return <FormulaScene formulaType="nash-theorem" />
      }
      return <PayoffMatrixScene />

    case 'prisoner':
      if (sceneConfig.id.includes('payoff')) {
        return <PayoffMatrixScene />
      }
      if (sceneConfig.id.includes('result')) {
        return <PayoffMatrixScene highlightCell="defect-defect" />
      }
      return <PayoffMatrixScene />

    case 'nash':
      if (sceneConfig.id.includes('equilibrium')) {
        return <PayoffMatrixScene highlightCell="defect-defect" />
      }
      if (sceneConfig.id.includes('stable') || sceneConfig.id.includes('not-optimal')) {
        return <NashEquilibriumScene showAnalysis />
      }
      if (sceneConfig.id.includes('theorem')) {
        return <FormulaScene formulaType="nash-theorem" />
      }
      return <NashEquilibriumScene />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('decision')) {
        return <PayoffMatrixScene />
      }
      if (sceneConfig.id.includes('paradox')) {
        return <NashEquilibriumScene showAnalysis />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    default:
      return <PayoffMatrixScene />
  }
}
