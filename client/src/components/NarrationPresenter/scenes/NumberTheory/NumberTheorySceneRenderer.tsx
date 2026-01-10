/**
 * 数论场景渲染器
 * 渲染素数分布、埃拉托斯特尼筛法、Collatz 猜想和 Ulam 螺旋
 */

import { useMemo, useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '数论可视化', subtitle: '探索数字的奥秘' },
    'summary-1': { title: '总结回顾', subtitle: '数论的核心思想' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '数论', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 质数筛法场景
function PrimeSieveScene({ maxNumber = 100, animationStep = 0 }: { maxNumber?: number; animationStep?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentStep, setCurrentStep] = useState(animationStep)

  // 埃拉托斯特尼筛法
  const sieveData = useMemo(() => {
    const isPrime = new Array(maxNumber + 1).fill(true)
    isPrime[0] = isPrime[1] = false

    const steps: { prime: number; multiples: number[] }[] = []

    for (let i = 2; i * i <= maxNumber; i++) {
      if (isPrime[i]) {
        const multiples: number[] = []
        for (let j = i * i; j <= maxNumber; j += i) {
          if (isPrime[j]) {
            isPrime[j] = false
            multiples.push(j)
          }
        }
        if (multiples.length > 0) {
          steps.push({ prime: i, multiples })
        }
      }
    }

    const primes = isPrime.map((p, i) => (p ? i : -1)).filter(x => x > 0)
    return { isPrime, steps, primes }
  }, [maxNumber])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cols = 10
    const rows = Math.ceil(maxNumber / cols)
    const cellSize = Math.min(width / cols, height / rows) * 0.9
    const offsetX = (width - cellSize * cols) / 2
    const offsetY = (height - cellSize * rows) / 2

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 确定哪些数字已被筛掉
    const eliminated = new Set<number>()
    for (let i = 0; i < currentStep && i < sieveData.steps.length; i++) {
      sieveData.steps[i].multiples.forEach(m => eliminated.add(m))
    }

    // 绘制数字网格
    for (let i = 1; i <= maxNumber; i++) {
      const row = Math.floor((i - 1) / cols)
      const col = (i - 1) % cols
      const x = offsetX + col * cellSize
      const y = offsetY + row * cellSize

      // 确定颜色
      let color = '#94a3b8' // 默认灰色
      if (i === 1) {
        color = '#64748b' // 1 是深灰色
      } else if (eliminated.has(i)) {
        color = '#ef4444' // 被筛掉的是红色
      } else if (sieveData.isPrime[i]) {
        color = '#22c55e' // 素数是绿色
      }

      // 绘制方块
      ctx.fillStyle = color
      ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4)

      // 绘制数字
      ctx.fillStyle = 'white'
      ctx.font = `${cellSize * 0.4}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(i.toString(), x + cellSize / 2, y + cellSize / 2)
    }

    // 显示当前筛选的素数
    if (currentStep > 0 && currentStep <= sieveData.steps.length) {
      const step = sieveData.steps[currentStep - 1]
      ctx.fillStyle = 'white'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`筛选素数 ${step.prime} 的倍数`, 10, 20)
    } else if (currentStep > sieveData.steps.length) {
      ctx.fillStyle = 'white'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(`找到 ${sieveData.primes.length} 个素数`, 10, 20)
    }
  }, [maxNumber, currentStep, sieveData])

  // 自动动画
  useEffect(() => {
    if (animationStep === 0) return

    const timer = setInterval(() => {
      setCurrentStep(s => {
        if (s >= sieveData.steps.length) return 0
        return s + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [animationStep, sieveData.steps.length])

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

// 素数分布场景
function PrimeDistributionScene({ maxNumber = 1000 }: { maxNumber?: number }) {
  const distributionData = useMemo(() => {
    // 计算素数
    const isPrime = new Array(maxNumber + 1).fill(true)
    isPrime[0] = isPrime[1] = false

    for (let i = 2; i * i <= maxNumber; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j <= maxNumber; j += i) {
          isPrime[j] = false
        }
      }
    }

    // 素数计数函数 π(x)
    const x: number[] = []
    const piX: number[] = []
    const approx: number[] = []
    let count = 0

    for (let i = 2; i <= maxNumber; i++) {
      if (isPrime[i]) count++
      if (i % 10 === 0 || i === maxNumber) {
        x.push(i)
        piX.push(count)
        // 素数定理近似: π(x) ≈ x / ln(x)
        approx.push(i / Math.log(i))
      }
    }

    return { x, piX, approx }
  }, [maxNumber])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={[
          {
            x: distributionData.x,
            y: distributionData.piX,
            type: 'scatter',
            mode: 'lines',
            name: 'π(x) - 素数计数',
            line: { color: '#3b82f6', width: 2 },
          },
          {
            x: distributionData.x,
            y: distributionData.approx,
            type: 'scatter',
            mode: 'lines',
            name: 'x/ln(x) - 近似',
            line: { color: '#ef4444', width: 2, dash: 'dash' },
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'x' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: '素数个数' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// Collatz 猜想场景
function CollatzScene({ startNumber = 27, animate = false }: { startNumber?: number; animate?: boolean }) {
  const sequence = useMemo(() => {
    const seq: number[] = [startNumber]
    let n = startNumber

    while (n !== 1 && seq.length < 1000) {
      if (n % 2 === 0) {
        n = n / 2
      } else {
        n = 3 * n + 1
      }
      seq.push(n)
    }

    return seq
  }, [startNumber])

  const initialIndex = useMemo(() => (animate ? 0 : sequence.length - 1), [animate, sequence.length])
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    if (!animate) {
      return
    }

    setCurrentIndex(0)
    const timer = setInterval(() => {
      setCurrentIndex(i => {
        if (i >= sequence.length - 1) {
          return 0
        }
        return i + 1
      })
    }, 200)

    return () => clearInterval(timer)
  }, [animate, sequence.length])

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const displaySequence = sequence.slice(0, currentIndex + 1)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
      <div className="text-white text-lg">
        起始值: <span className="text-blue-400 font-bold">{startNumber}</span>
        {' → '}
        步数: <span className="text-green-400 font-bold">{displaySequence.length - 1}</span>
      </div>

      <div className="w-full max-w-3xl">
        <Plot
          data={[
            {
              x: Array.from({ length: displaySequence.length }, (_, i) => i),
              y: displaySequence,
              type: 'scatter',
              mode: 'lines+markers',
              line: { color: '#8b5cf6', width: 2 },
              marker: { size: 6, color: '#8b5cf6' },
            },
          ]}
          layout={{
            autosize: true,
            height: 300,
            margin: { t: 20, r: 30, b: 50, l: 60 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'rgba(255,255,255,0.05)',
            xaxis: {
              title: { text: '步数' },
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            yaxis: {
              title: { text: '值' },
              type: 'log',
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            showlegend: false,
          }}
          config={{ responsive: true, displayModeBar: false, displaylogo: false }}
          className="w-full"
        />
      </div>

      <div className="text-white/60 text-sm max-w-2xl text-center">
        {currentIndex === sequence.length - 1 && sequence[sequence.length - 1] === 1
          ? `序列到达 1！共 ${sequence.length - 1} 步`
          : `当前值: ${displaySequence[displaySequence.length - 1]}`}
      </div>
    </div>
  )
}

// Ulam 螺旋场景
function UlamSpiralScene({ size = 41 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const spiralData = useMemo(() => {
    // 确保 size 是奇数
    const n = size % 2 === 0 ? size + 1 : size
    const center = Math.floor(n / 2)

    // 生成螺旋坐标
    const spiral: { x: number; y: number; value: number }[] = []
    let x = center
    let y = center
    let value = 1
    spiral.push({ x, y, value })

    let step = 1
    while (spiral.length < n * n) {
      // 向右
      for (let i = 0; i < step && spiral.length < n * n; i++) {
        x++
        value++
        spiral.push({ x, y, value })
      }
      // 向上
      for (let i = 0; i < step && spiral.length < n * n; i++) {
        y--
        value++
        spiral.push({ x, y, value })
      }
      step++
      // 向左
      for (let i = 0; i < step && spiral.length < n * n; i++) {
        x--
        value++
        spiral.push({ x, y, value })
      }
      // 向下
      for (let i = 0; i < step && spiral.length < n * n; i++) {
        y++
        value++
        spiral.push({ x, y, value })
      }
      step++
    }

    // 计算素数
    const maxVal = n * n
    const isPrime = new Array(maxVal + 1).fill(true)
    isPrime[0] = isPrime[1] = false

    for (let i = 2; i * i <= maxVal; i++) {
      if (isPrime[i]) {
        for (let j = i * i; j <= maxVal; j += i) {
          isPrime[j] = false
        }
      }
    }

    return { spiral, isPrime, size: n }
  }, [size])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cellSize = Math.min(width, height) / spiralData.size

    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制螺旋
    spiralData.spiral.forEach(({ x, y, value }) => {
      const px = x * cellSize
      const py = y * cellSize

      if (spiralData.isPrime[value]) {
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2)
      } else {
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2)
      }
    })
  }, [spiralData])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full border border-white/10 rounded"
      />
      <p className="text-white/60 text-sm">
        绿色表示素数，观察对角线规律
      </p>
    </div>
  )
}

// 因数分解场景
function FactorizationScene({ number = 60 }: { number?: number }) {
  const factors = useMemo(() => {
    const result: { prime: number; count: number }[] = []
    let n = number
    let d = 2

    while (d * d <= n) {
      let count = 0
      while (n % d === 0) {
        count++
        n /= d
      }
      if (count > 0) {
        result.push({ prime: d, count })
      }
      d++
    }

    if (n > 1) {
      result.push({ prime: n, count: 1 })
    }

    return result
  }, [number])

  const formulaText = useMemo(() => {
    if (factors.length === 0) return `${number} = 1`
    return `${number} = ${factors.map(f => f.count > 1 ? `${f.prime}^{${f.count}}` : `${f.prime}`).join(' \\\\times ')}`
  }, [number, factors])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="text-white text-2xl">
        因数分解: <span className="text-blue-400 font-bold">{number}</span>
      </div>

      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formulaText} className="text-2xl" />
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {factors.map((f, i) => (
          <div key={i} className="bg-purple-500/20 px-6 py-3 rounded-lg border border-purple-400/30">
            <div className="text-white text-lg">
              {f.prime}
              {f.count > 1 && <sup className="text-sm">{f.count}</sup>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 最大公约数场景
function GcdScene({ num1 = 48, num2 = 18 }: { num1?: number; num2?: number }) {
  const [steps, setSteps] = useState<{ a: number; b: number; remainder: number }[]>([])
  const [gcd, setGcd] = useState(0)

  useEffect(() => {
    const euclideanSteps: { a: number; b: number; remainder: number }[] = []
    let a = Math.max(num1, num2)
    let b = Math.min(num1, num2)

    while (b !== 0) {
      const remainder = a % b
      euclideanSteps.push({ a, b, remainder })
      a = b
      b = remainder
    }

    // Use a callback to update state after computing
    const updateSteps = () => {
      setSteps(euclideanSteps)
      setGcd(a)
    }
    updateSteps()
  }, [num1, num2])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-white text-2xl">
        最大公约数: gcd(<span className="text-blue-400">{num1}</span>, <span className="text-green-400">{num2}</span>)
      </div>

      <div className="bg-white/5 rounded-lg p-6 max-w-md">
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="text-white/80 font-mono text-sm">
              {step.a} = {step.b} × {Math.floor(step.a / step.b)} + {step.remainder}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl border border-white/20">
        <div className="text-white text-xl">
          gcd({num1}, {num2}) = <span className="text-yellow-400 font-bold text-2xl">{gcd}</span>
        </div>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'prime-definition': {
      formula: 'p \\\\text{ 是素数} \\\\iff \\\\forall a,b \\\\in \\\\mathbb{N}: p | ab \\\\implies p | a \\\\lor p | b',
      description: '素数的定义',
    },
    'fundamental-theorem': {
      formula: 'n = p_1^{a_1} \\\\times p_2^{a_2} \\\\times \\\\cdots \\\\times p_k^{a_k}',
      description: '算术基本定理：任何整数都可以唯一分解为素数的乘积',
    },
    'euclid-algorithm': {
      formula: '\\\\gcd(a, b) = \\\\gcd(b, a \\\\bmod b)',
      description: '欧几里得算法：求最大公约数',
    },
    'prime-number-theorem': {
      formula: '\\\\pi(x) \\\\sim \\\\frac{x}{\\\\ln x}',
      description: '素数定理：小于 x 的素数个数近似',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['prime-definition']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg max-w-2xl text-center">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'myst-1': {
      title: '数论的未解之谜',
      items: ['孪生素数猜想', '哥德巴赫猜想', '黎曼猜想', 'Collatz 猜想'],
      icon: '🔍',
    },
    'myst-2': {
      title: '孪生素数猜想',
      items: ['相差 2 的素数对', '如 (3,5), (11,13), (17,19)', '是否有无穷多对？'],
      icon: '👯',
    },
    'myst-3': {
      title: '哥德巴赫猜想',
      items: ['每个大于 2 的偶数', '都能写成两个素数之和', '如 8=3+5, 20=3+17'],
      icon: '➕',
    },
    'myst-4': {
      title: '黎曼猜想',
      items: ['素数分布的精确规律', '数学界最重要的未解问题', '与量子物理有神秘联系'],
      icon: '🌌',
    },
  }

  const app = apps[sceneId] || apps['myst-1']

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
export default function NumberTheorySceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene
  const lineState = scene.lineState

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
    return <FormulaScene formulaType={sceneConfig.id} />
  }

  // 从 lineState 获取参数
  const params = lineState?.params || {}
  const topic = (params.topic as string) || 'primes'

  // 根据 section 和 topic 决定显示什么
  switch (sectionId) {
    case 'intro':
      return <PrimeSieveScene maxNumber={50} animationStep={0} />

    case 'primes':
      if (topic === 'primes') {
        return <PrimeSieveScene maxNumber={100} animationStep={0} />
      }
      return <PrimeDistributionScene maxNumber={500} />

    case 'sieve':
      if (topic === 'sieve') {
        return <PrimeSieveScene maxNumber={100} animationStep={1} />
      }
      return <PrimeSieveScene maxNumber={100} animationStep={0} />

    case 'distribution':
      return <PrimeDistributionScene maxNumber={1000} />

    case 'collatz': {
      const startNum = (params.startNumber as number) || 27
      return <CollatzScene startNumber={startNum} animate={topic === 'collatz'} />
    }

    case 'ulam': {
      const size = (params.size as number) || 41
      return <UlamSpiralScene size={size} />
    }

    case 'parameters':
      // 交互场景，根据 topic 显示不同内容
      if (topic === 'collatz') {
        return <CollatzScene startNumber={(params.startNumber as number) || 27} animate={false} />
      } else if (topic === 'ulam') {
        return <UlamSpiralScene size={(params.size as number) || 41} />
      } else if (topic === 'factorization') {
        return <FactorizationScene number={(params.number as number) || 60} />
      } else if (topic === 'gcd') {
        return <GcdScene num1={(params.num1 as number) || 48} num2={(params.num2 as number) || 18} />
      }
      return <PrimeDistributionScene maxNumber={(params.maxNumber as number) || 1000} />

    case 'mysteries':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('primes')) {
        return <PrimeSieveScene maxNumber={100} animationStep={0} />
      } else if (sceneConfig.id.includes('sieve')) {
        return <PrimeSieveScene maxNumber={100} animationStep={1} />
      } else if (sceneConfig.id.includes('collatz')) {
        return <CollatzScene startNumber={27} animate={false} />
      } else if (sceneConfig.id.includes('ulam')) {
        return <UlamSpiralScene size={41} />
      }
      return <PrimeDistributionScene maxNumber={1000} />

    default:
      return <PrimeSieveScene maxNumber={100} animationStep={0} />
  }
}
