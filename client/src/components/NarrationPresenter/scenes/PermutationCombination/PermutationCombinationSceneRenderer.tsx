/**
 * 排列组合场景渲染器
 * 渲染排列、组合、帕斯卡三角形等
 */

import { useState, useEffect, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 阶乘
function factorial(n: number): number {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

// 组合数
function combination(n: number, k: number): number {
  if (k > n || k < 0) return 0
  return factorial(n) / (factorial(k) * factorial(n - k))
}

// 排列数
function permutation(n: number, k: number): number {
  if (k > n || k < 0) return 0
  return factorial(n) / factorial(n - k)
}

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '排列组合', subtitle: '计数的艺术' },
    'summary-intro': { title: '总结回顾', subtitle: '排列组合的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索组合数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '排列组合', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 排列演示场景
function PermutationScene() {
  const [n] = useState(4)
  const [k, setK] = useState(2)
  const items = useMemo(() => ['🍎', '🍊', '🍋', '🍇', '🍓'], [])

  const arrangements = useMemo(() => {
    const result: string[][] = []
    const selected = items.slice(0, n)

    function generate(current: string[], remaining: string[]) {
      if (current.length === k) {
        result.push([...current])
        return
      }
      for (let i = 0; i < remaining.length && result.length < 12; i++) {
        current.push(remaining[i])
        generate(current, [...remaining.slice(0, i), ...remaining.slice(i + 1)])
        current.pop()
      }
    }

    generate([], selected)
    return result
  }, [n, k, items])

  useEffect(() => {
    const interval = setInterval(() => {
      setK(prev => prev >= n ? 1 : prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [n])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
      <h3 className="text-white text-2xl font-bold">排列 P({n}, {k})</h3>

      <div className="p-4 bg-white/10 rounded-xl">
        <MathFormula formula={`P(${n}, ${k}) = \\frac{${n}!}{(${n}-${k})!} = ${permutation(n, k)}`} />
      </div>

      <div className="text-4xl flex gap-2">
        {items.slice(0, n).map((item, i) => (
          <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
            {item}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-auto">
        {arrangements.map((arr, i) => (
          <div key={i} className="bg-white/10 px-3 py-1 rounded text-lg">
            {arr.join('')}
          </div>
        ))}
      </div>

      <p className="text-white/60 text-sm">
        从 {n} 个不同元素中取 {k} 个排列，共 {permutation(n, k)} 种
      </p>
    </div>
  )
}

// 组合演示场景
function CombinationScene() {
  const [n] = useState(5)
  const [k, setK] = useState(3)
  const items = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'F'], [])

  const combinations = useMemo(() => {
    const result: string[][] = []
    const selected = items.slice(0, n)

    function generate(start: number, current: string[]) {
      if (current.length === k) {
        result.push([...current])
        return
      }
      for (let i = start; i < selected.length && result.length < 20; i++) {
        current.push(selected[i])
        generate(i + 1, current)
        current.pop()
      }
    }

    generate(0, [])
    return result
  }, [n, k, items])

  useEffect(() => {
    const interval = setInterval(() => {
      setK(prev => prev >= n - 1 ? 1 : prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [n])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
      <h3 className="text-white text-2xl font-bold">组合 C({n}, {k})</h3>

      <div className="p-4 bg-white/10 rounded-xl">
        <MathFormula formula={`C(${n}, ${k}) = \\frac{${n}!}{${k}!(${n}-${k})!} = ${combination(n, k)}`} />
      </div>

      <div className="flex gap-4">
        {items.slice(0, n).map((item, i) => (
          <div key={i} className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {item}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-32 overflow-auto">
        {combinations.map((comb, i) => (
          <div key={i} className="bg-white/10 px-3 py-1 rounded text-sm">
            {'{' + comb.join(', ') + '}'}
          </div>
        ))}
      </div>

      <p className="text-white/60 text-sm">
        从 {n} 个元素中选 {k} 个组合，共 {combination(n, k)} 种（不考虑顺序）
      </p>
    </div>
  )
}

// 帕斯卡三角形场景
function PascalTriangleScene() {
  const [rows] = useState(8)
  const [highlightRow, setHighlightRow] = useState(4)

  const triangle = useMemo(() => {
    const result: number[][] = []
    for (let i = 0; i < rows; i++) {
      const row: number[] = []
      for (let j = 0; j <= i; j++) {
        row.push(combination(i, j))
      }
      result.push(row)
    }
    return result
  }, [rows])

  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightRow(prev => (prev + 1) % rows)
    }, 2000)
    return () => clearInterval(interval)
  }, [rows])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
      <h3 className="text-white text-2xl font-bold">帕斯卡三角形（杨辉三角）</h3>

      <div className="flex flex-col items-center gap-1">
        {triangle.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((num, j) => (
              <div
                key={j}
                className={`w-10 h-10 flex items-center justify-center rounded text-sm font-bold transition-all ${
                  i === highlightRow
                    ? 'bg-yellow-500 text-black scale-110'
                    : 'bg-white/20 text-white'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="p-3 bg-white/10 rounded-lg">
        <MathFormula formula={`\\text{第 ${highlightRow + 1} 行: } C(${highlightRow}, k) \\text{ 其中 } k = 0, 1, ..., ${highlightRow}`} />
      </div>

      <p className="text-white/60 text-sm">
        每个数等于它上方两个数之和：C(n,k) = C(n-1,k-1) + C(n-1,k)
      </p>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'permutation': {
      formula: 'P(n, k) = \\frac{n!}{(n-k)!} = n \\times (n-1) \\times ... \\times (n-k+1)',
      description: '排列公式：从 n 个不同元素中取 k 个排列',
    },
    'combination': {
      formula: 'C(n, k) = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}',
      description: '组合公式：从 n 个不同元素中选 k 个组合',
    },
    'relation': {
      formula: 'P(n, k) = k! \\times C(n, k)',
      description: '排列与组合的关系',
    },
    'binomial': {
      formula: '(a+b)^n = \\sum_{k=0}^{n} C(n,k) a^{n-k} b^k',
      description: '二项式定理',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['combination']

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
      title: '排列组合的应用',
      items: ['密码学', '概率计算', '数据分析', '算法设计'],
      icon: '🎯',
    },
    'app-lottery': {
      title: '彩票概率',
      items: ['双色球: C(33,6)×C(16,1)', '大乐透: C(35,5)×C(12,2)', '概率极低'],
      icon: '🎰',
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
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function PermutationCombinationSceneRenderer({ scene }: SceneRendererProps) {
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
    const formulaMap: Record<string, string> = {
      'permutation': 'permutation',
      'combination': 'combination',
      'pascal-triangle': 'binomial',
    }
    return <FormulaScene formulaType={formulaMap[sectionId] || 'combination'} />
  }

  switch (sectionId) {
    case 'intro':
    case 'permutation':
      return <PermutationScene />
    case 'combination':
      return <CombinationScene />
    case 'pascal-triangle':
      return <PascalTriangleScene />
    case 'applications':
      return <ApplicationScene sceneId="app-intro" />
    default:
      return <PermutationScene />
  }
}
