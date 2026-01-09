import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { numberTheoryNarration } from '../../narrations/scripts/number-theory'

type Topic = 'primes' | 'sieve' | 'collatz' | 'ulam'

export default function NumberTheoryExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [topic, setTopic] = useState<Topic>('primes')
  const [maxN, setMaxN] = useState(1000)
  const [collatzStart, setCollatzStart] = useState(27)
  const [ulamSize, setUlamSize] = useState(101)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedCollatzStep, setAnimatedCollatzStep] = useState(0)
  const [showPresenter, setShowPresenter] = useState(false)
  const animationRef = useRef<number | null>(null)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(numberTheoryNarration)
    }
  }, [narration])

  // 开始讲解 - 进入全屏 PPT 模式
  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  // 退出讲解
  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])

  // 动画效果：逐步展示 Collatz 序列
  useEffect(() => {
    if (!isAnimating || topic !== 'collatz') return

    const animate = () => {
      setAnimatedCollatzStep((prev) => {
        if (prev >= collatzSequence.length - 1) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 100) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, topic])

  // 判断素数
  const isPrime = (n: number): boolean => {
    if (n < 2) return false
    if (n === 2) return true
    if (n % 2 === 0) return false
    for (let i = 3; i * i <= n; i += 2) {
      if (n % i === 0) return false
    }
    return true
  }

  // 素数列表
  const primes = useMemo(() => {
    const result: number[] = []
    for (let i = 2; i <= maxN; i++) {
      if (isPrime(i)) result.push(i)
    }
    return result
  }, [maxN])

  // 素数计数函数 π(x)
  const primeCountingData = useMemo(() => {
    const x: number[] = []
    const piX: number[] = []
    const approx: number[] = []
    let count = 0

    for (let n = 2; n <= maxN; n++) {
      if (isPrime(n)) count++
      x.push(n)
      piX.push(count)
      approx.push(n / Math.log(n))
    }

    return { x, piX, approx }
  }, [maxN])

  // 素数间隔
  const primeGaps = useMemo(() => {
    const gaps: { n: number; gap: number }[] = []
    for (let i = 1; i < primes.length; i++) {
      gaps.push({ n: primes[i], gap: primes[i] - primes[i - 1] })
    }
    return gaps
  }, [primes])

  // Collatz 序列
  const collatzSequence = useMemo(() => {
    const seq: number[] = [collatzStart]
    let n = collatzStart
    while (n !== 1 && seq.length < 500) {
      if (n % 2 === 0) {
        n = n / 2
      } else {
        n = 3 * n + 1
      }
      seq.push(n)
    }
    return seq
  }, [collatzStart])

  // Ulam 螺旋
  useEffect(() => {
    if (topic !== 'ulam') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = ulamSize
    const cellSize = Math.floor(canvas.width / size)
    const offset = Math.floor(size / 2)

    ctx.fillStyle = '#1e293b'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 生成螺旋坐标
    const getCoord = (n: number): { x: number; y: number } => {
      if (n === 1) return { x: 0, y: 0 }

      let x = 0, y = 0
      let dx = 1, dy = 0
      let segmentLength = 1
      let segmentPassed = 0
      let turnsMade = 0

      for (let i = 1; i < n; i++) {
        x += dx
        y += dy
        segmentPassed++

        if (segmentPassed === segmentLength) {
          segmentPassed = 0
          // 转向
          const temp = dx
          dx = -dy
          dy = temp
          turnsMade++
          if (turnsMade % 2 === 0) {
            segmentLength++
          }
        }
      }

      return { x, y }
    }

    // 绘制
    const maxNum = size * size
    for (let n = 1; n <= maxNum; n++) {
      const { x, y } = getCoord(n)
      const px = (offset + x) * cellSize
      const py = (offset - y) * cellSize

      if (px >= 0 && px < canvas.width && py >= 0 && py < canvas.height) {
        if (isPrime(n)) {
          ctx.fillStyle = '#22c55e'
          ctx.fillRect(px, py, cellSize - 1, cellSize - 1)
        }
      }
    }

  }, [topic, ulamSize])

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">数论可视化</h1>
            <p className="text-gray-600">探索素数分布、Collatz 猜想和 Ulam 螺旋</p>
          </div>
          <button
            onClick={handleStartNarration}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {topic === 'primes' && (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">素数计数函数 π(x)</h3>
                <Plot
                  data={[
                    {
                      x: primeCountingData.x,
                      y: primeCountingData.piX,
                      type: 'scatter' as const,
                      mode: 'lines' as const,
                      line: { color: '#3b82f6', width: 2 },
                      name: 'π(x)',
                    },
                    {
                      x: primeCountingData.x,
                      y: primeCountingData.approx,
                      type: 'scatter' as const,
                      mode: 'lines' as const,
                      line: { color: '#ef4444', width: 2, dash: 'dash' as const },
                      name: 'x/ln(x)',
                    },
                  ] as any}
                  layout={{
                    autosize: true,
                    height: 350,
                    margin: { t: 30, r: 30, b: 40, l: 50 },
                    xaxis: { title: { text: 'x' } },
                    yaxis: { title: { text: 'π(x)' } },
                    legend: { orientation: 'h' as const, y: -0.15 },
                  }}
                  config={{ responsive: true, displaylogo: false }}
                  className="w-full"
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">素数间隔</h3>
                <Plot
                  data={[
                    {
                      x: primeGaps.map((g) => g.n),
                      y: primeGaps.map((g) => g.gap),
                      type: 'scatter' as const,
                      mode: 'markers' as const,
                      marker: { size: 3, color: '#8b5cf6' },
                    },
                  ] as any}
                  layout={{
                    autosize: true,
                    height: 250,
                    margin: { t: 30, r: 30, b: 40, l: 50 },
                    xaxis: { title: { text: '素数 p' } },
                    yaxis: { title: { text: '间隔 (p - 前一个素数)' } },
                  }}
                  config={{ responsive: true, displaylogo: false }}
                  className="w-full"
                />
              </div>
            </>
          )}

          {topic === 'sieve' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">埃拉托斯特尼筛法</h3>
              <div className="grid grid-cols-10 gap-1 max-w-lg mx-auto">
                {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
                  <div
                    key={n}
                    className={`w-8 h-8 flex items-center justify-center text-xs rounded ${
                      n === 1
                        ? 'bg-gray-300 text-gray-500'
                        : isPrime(n)
                        ? 'bg-green-500 text-white font-bold'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 justify-center">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded"></span>
                  <span className="text-sm text-gray-600">素数</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-gray-100 rounded"></span>
                  <span className="text-sm text-gray-600">合数</span>
                </div>
              </div>
            </div>
          )}

          {topic === 'collatz' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Collatz 序列 (起始: {collatzStart})</h3>
                <button
                  onClick={() => {
                    if (!isAnimating) {
                      setAnimatedCollatzStep(0)
                    }
                    setIsAnimating(!isAnimating)
                  }}
                  className={`px-4 py-1 rounded-lg text-sm font-medium ${
                    isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {isAnimating ? '停止' : '播放动画'}
                </button>
              </div>
              <Plot
                data={[
                  {
                    x: collatzSequence.slice(0, isAnimating ? animatedCollatzStep + 1 : collatzSequence.length).map((_, i) => i),
                    y: collatzSequence.slice(0, isAnimating ? animatedCollatzStep + 1 : collatzSequence.length),
                    type: 'scatter' as const,
                    mode: 'lines+markers' as const,
                    line: { color: '#8b5cf6', width: 2 },
                    marker: { size: 4 },
                  },
                ] as any}
                layout={{
                  autosize: true,
                  height: 350,
                  margin: { t: 30, r: 30, b: 40, l: 60 },
                  xaxis: { title: { text: '步数' } },
                  yaxis: { title: { text: '值' }, type: 'log' as const },
                }}
                config={{ responsive: true, displaylogo: false }}
                className="w-full"
              />
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <span className="text-gray-600">序列长度: </span>
                <span className="font-mono font-bold">{collatzSequence.length}</span>
                <span className="text-gray-600 ml-4">最大值: </span>
                <span className="font-mono font-bold">{Math.max(...collatzSequence)}</span>
              </div>
            </div>
          )}

          {topic === 'ulam' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">Ulam 螺旋</h3>
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full max-w-md mx-auto border border-gray-300 rounded"
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                从中心开始螺旋排列自然数，绿色点表示素数。注意对角线上的素数聚集现象。
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">素数定理</h3>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MathFormula formula="\pi(x) \sim \frac{x}{\ln x}" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                小于 x 的素数个数约为 x/ln(x)
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">Collatz 猜想</h3>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MathFormula formula="f(n) = \begin{cases} n/2 & n \text{ 偶数} \\ 3n+1 & n \text{ 奇数} \end{cases}" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                猜想：任何正整数最终都会到达 1
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择主题</h3>
            <div className="space-y-2">
              <button
                onClick={() => setTopic('primes')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  topic === 'primes' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                素数分布
              </button>
              <button
                onClick={() => setTopic('sieve')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  topic === 'sieve' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                埃氏筛法
              </button>
              <button
                onClick={() => setTopic('collatz')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  topic === 'collatz' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Collatz 猜想
              </button>
              <button
                onClick={() => setTopic('ulam')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                  topic === 'ulam' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Ulam 螺旋
              </button>
            </div>
          </div>

          {(topic === 'primes' || topic === 'sieve') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">参数设置</h3>
              <div>
                <label className="text-sm text-gray-600">最大值 N: {maxN}</label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={maxN}
                  onChange={(e) => setMaxN(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {topic === 'collatz' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">起始值</h3>
              <input
                type="number"
                min="1"
                max="10000"
                value={collatzStart}
                onChange={(e) => setCollatzStart(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {[27, 97, 871, 6171].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCollatzStart(n)}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {topic === 'ulam' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">螺旋大小</h3>
              <div>
                <label className="text-sm text-gray-600">边长: {ulamSize}</label>
                <input
                  type="range"
                  min="51"
                  max="201"
                  step="10"
                  value={ulamSize}
                  onChange={(e) => setUlamSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">统计信息</h3>
            <div className="space-y-2">
              <div className="p-2 bg-green-50 rounded flex justify-between">
                <span className="text-green-600">素数个数</span>
                <span className="font-mono font-bold">{primes.length}</span>
              </div>
              <div className="p-2 bg-blue-50 rounded flex justify-between">
                <span className="text-blue-600">素数密度</span>
                <span className="font-mono font-bold">
                  {((primes.length / maxN) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="p-2 bg-purple-50 rounded flex justify-between">
                <span className="text-purple-600">最大素数</span>
                <span className="font-mono font-bold">{primes[primes.length - 1]}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">未解之谜</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 黎曼猜想</li>
              <li>• 孪生素数猜想</li>
              <li>• 哥德巴赫猜想</li>
              <li>• Collatz 猜想</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
