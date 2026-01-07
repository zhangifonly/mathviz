/**
 * 集合论场景渲染器
 * 渲染韦恩图、集合运算等可视化
 */

import { useEffect, useRef, useState } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 集合运算类型
type SetOperation = 'none' | 'union' | 'intersection' | 'difference' | 'symmetric'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '集合论', subtitle: '通过韦恩图理解集合运算' },
    'summary-1': { title: '总结回顾', subtitle: '集合运算的核心概念' },
    'summary-6': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '集合论', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 韦恩图场景
function VennDiagramScene({
  operation = 'none',
  showElements = true,
  animate = false
}: {
  operation?: SetOperation
  showElements?: boolean
  animate?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  // 集合定义
  const setA = [1, 2, 3, 4, 5]
  const setB = [4, 5, 6, 7, 8]
  const intersection = setA.filter(x => setB.includes(x))
  const onlyA = setA.filter(x => !setB.includes(x))
  const onlyB = setB.filter(x => !setA.includes(x))

  useEffect(() => {
    if (animate) {
      const timer = setInterval(() => {
        setAnimationPhase(p => (p + 1) % 100)
      }, 50)
      return () => clearInterval(timer)
    }
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = 120
    const offset = 80

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 计算圆心位置
    const circleAX = centerX - offset
    const circleAY = centerY
    const circleBX = centerX + offset
    const circleBY = centerY

    // 绘制高亮区域（根据运算类型）
    ctx.save()

    if (operation === 'union') {
      // 并集：两个圆的并集
      ctx.fillStyle = 'rgba(147, 51, 234, 0.3)'
      ctx.beginPath()
      ctx.arc(circleAX, circleAY, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(circleBX, circleBY, radius, 0, 2 * Math.PI)
      ctx.fill()
    } else if (operation === 'intersection') {
      // 交集：两个圆的交集
      ctx.fillStyle = 'rgba(147, 51, 234, 0.3)'
      ctx.beginPath()
      ctx.arc(circleAX, circleAY, radius, 0, 2 * Math.PI)
      ctx.clip()
      ctx.beginPath()
      ctx.arc(circleBX, circleBY, radius, 0, 2 * Math.PI)
      ctx.fill()
    } else if (operation === 'difference') {
      // 差集：A - B
      ctx.fillStyle = 'rgba(147, 51, 234, 0.3)'
      ctx.beginPath()
      ctx.arc(circleAX, circleAY, radius, 0, 2 * Math.PI)
      ctx.fill()

      // 减去 B
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(circleBX, circleBY, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    } else if (operation === 'symmetric') {
      // 对称差：(A ∪ B) - (A ∩ B)
      ctx.fillStyle = 'rgba(147, 51, 234, 0.3)'
      ctx.beginPath()
      ctx.arc(circleAX, circleAY, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(circleBX, circleBY, radius, 0, 2 * Math.PI)
      ctx.fill()

      // 减去交集
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(circleAX, circleAY, radius, 0, 2 * Math.PI)
      ctx.clip()
      ctx.beginPath()
      ctx.arc(circleBX, circleBY, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    }

    ctx.restore()

    // 绘制圆圈边框
    // 圆 A
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(circleAX, circleAY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // 圆 B
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(circleBX, circleBY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // 绘制集合标签
    ctx.fillStyle = 'white'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('A', circleAX - radius - 30, centerY)
    ctx.fillText('B', circleBX + radius + 20, centerY)

    // 绘制元素
    if (showElements) {
      ctx.font = '16px sans-serif'
      ctx.fillStyle = 'white'

      // 只在 A 中的元素
      const onlyAY = centerY - 20
      onlyA.forEach((num, i) => {
        ctx.fillText(num.toString(), circleAX - 60, onlyAY + i * 25)
      })

      // 交集元素
      const intersectionY = centerY - 10
      intersection.forEach((num, i) => {
        ctx.fillText(num.toString(), centerX - 10, intersectionY + i * 25)
      })

      // 只在 B 中的元素
      const onlyBY = centerY - 20
      onlyB.forEach((num, i) => {
        ctx.fillText(num.toString(), circleBX + 40, onlyBY + i * 25)
      })
    }

    // 绘制集合定义
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.font = '14px sans-serif'
    ctx.fillText('A = {1, 2, 3, 4, 5}', 20, height - 40)
    ctx.fillText('B = {4, 5, 6, 7, 8}', 20, height - 20)

    // 绘制运算结果
    if (operation !== 'none') {
      let resultText = ''
      let resultSet: number[] = []

      switch (operation) {
        case 'union':
          resultSet = [...new Set([...setA, ...setB])].sort((a, b) => a - b)
          resultText = `A ∪ B = {${resultSet.join(', ')}}`
          break
        case 'intersection':
          resultSet = intersection
          resultText = `A ∩ B = {${resultSet.join(', ')}}`
          break
        case 'difference':
          resultSet = onlyA
          resultText = `A \\ B = {${resultSet.join(', ')}}`
          break
        case 'symmetric':
          resultSet = [...onlyA, ...onlyB].sort((a, b) => a - b)
          resultText = `A △ B = {${resultSet.join(', ')}}`
          break
      }

      ctx.fillStyle = 'rgba(147, 51, 234, 1)'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(resultText, width - 250, height - 30)
    }

  }, [operation, showElements, animationPhase])

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

// 集合概念场景
function ConceptScene({ sceneId: _sceneId }: { sceneId: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="max-w-2xl">
        <div className="bg-white/5 border border-white/20 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-6">集合的概念</h3>
          <div className="space-y-4 text-white/80 text-lg">
            <p>集合是把有共同特点的东西放在一起。</p>
            <div className="bg-blue-500/20 border border-blue-500/50 rounded p-4 my-4">
              <p className="font-mono">A = {'{1, 2, 3, 4, 5}'}</p>
              <p className="text-sm text-white/60 mt-2">集合 A 包含 1 到 5 的数字</p>
            </div>
            <div className="bg-green-500/20 border border-green-500/50 rounded p-4 my-4">
              <p className="font-mono">B = {'{4, 5, 6, 7, 8}'}</p>
              <p className="text-sm text-white/60 mt-2">集合 B 包含 4 到 8 的数字</p>
            </div>
            <p className="text-white/60 text-base mt-4">
              大括号里的数字叫做集合的"元素"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string; example?: string }> = {
    'union': {
      formula: 'A \\cup B',
      description: '并集：两个集合的所有元素',
      example: 'A ∪ B = {1, 2, 3, 4, 5, 6, 7, 8}',
    },
    'intersection': {
      formula: 'A \\cap B',
      description: '交集：两个集合共同的元素',
      example: 'A ∩ B = {4, 5}',
    },
    'difference': {
      formula: 'A \\setminus B',
      description: '差集：A 中有但 B 中没有的元素',
      example: 'A \\ B = {1, 2, 3}',
    },
    'symmetric': {
      formula: 'A \\triangle B',
      description: '对称差：两个集合各自独有的元素',
      example: 'A △ B = {1, 2, 3, 6, 7, 8}',
    },
    'subset': {
      formula: 'A \\subseteq B',
      description: '子集：A 的所有元素都在 B 中',
      example: '{1, 2} ⊆ {1, 2, 3, 4, 5}',
    },
  }

  const { formula, description, example } = formulas[formulaType] || formulas['union']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-3xl" />
      </div>
      <p className="text-white/70 text-xl">{description}</p>
      {example && (
        <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
          <p className="text-white font-mono text-lg">{example}</p>
        </div>
      )}
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-1': {
      title: '生活中的集合',
      items: ['分类整理玩具', '统计兴趣爱好', '搜索引擎查询', '数据库查询'],
      icon: '🎯',
    },
    'app-2': {
      title: '兴趣爱好统计',
      items: ['喜欢足球的同学', '喜欢篮球的同学', '两种都喜欢（交集）', '至少喜欢一种（并集）'],
      icon: '⚽',
    },
    'app-4': {
      title: '搜索引擎',
      items: ['AND 运算 = 交集', 'OR 运算 = 并集', 'NOT 运算 = 差集', '组合查询'],
      icon: '🔍',
    },
  }

  const app = apps[sceneId] || apps['app-1']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-3 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function SetTheorySceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('union')) {
      return <FormulaScene formulaType="union" />
    }
    if (sceneConfig.id.includes('intersection')) {
      return <FormulaScene formulaType="intersection" />
    }
    if (sceneConfig.id.includes('difference')) {
      return <FormulaScene formulaType="difference" />
    }
    if (sceneConfig.id.includes('symmetric')) {
      return <FormulaScene formulaType="symmetric" />
    }
    return <FormulaScene formulaType="union" />
  }

  // 根据 section 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id === 'intro-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      return <VennDiagramScene operation="none" showElements={false} />

    case 'concept':
      if (sceneConfig.id === 'concept-1' || sceneConfig.id === 'concept-2') {
        return <ConceptScene sceneId={sceneConfig.id} />
      }
      return <VennDiagramScene operation="none" showElements={true} />

    case 'venn':
      return <VennDiagramScene operation="none" showElements={true} />

    case 'union':
      return <VennDiagramScene operation="union" showElements={true} />

    case 'intersection':
      return <VennDiagramScene operation="intersection" showElements={true} />

    case 'difference':
      return <VennDiagramScene operation="difference" showElements={true} />

    case 'symmetric':
      return <VennDiagramScene operation="symmetric" showElements={true} />

    case 'parameters':
      return <VennDiagramScene operation="union" showElements={true} animate />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id === 'summary-1') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id === 'summary-6') {
        return <TitleScene sceneId={sceneConfig.id} />
      }
      if (sceneConfig.id === 'summary-3') {
        return <VennDiagramScene operation="none" showElements={true} />
      }
      if (sceneConfig.id === 'summary-4') {
        return <VennDiagramScene operation="union" showElements={true} />
      }
      return <VennDiagramScene operation="none" showElements={true} />

    default:
      return <VennDiagramScene operation="none" showElements={true} />
  }
}
