import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { setTheoryNarration } from '../../narrations/scripts/set-theory'

type Operation = 'union' | 'intersection' | 'difference' | 'symmetric'

export default function SetTheoryExperiment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [setA, setSetA] = useState<number[]>([1, 2, 3, 4, 5])
  const [setB, setSetB] = useState<number[]>([4, 5, 6, 7, 8])
  const [operation, setOperation] = useState<Operation>('union')
  const [inputA, setInputA] = useState('1,2,3,4,5')
  const [inputB, setInputB] = useState('4,5,6,7,8')
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationOpIndex, setAnimationOpIndex] = useState(0)
  const [showPresenter, setShowPresenter] = useState(false)
  const animationRef = useRef<number | null>(null)

  const operations: Operation[] = ['union', 'intersection', 'difference', 'symmetric']

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(setTheoryNarration)
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

  // 动画效果：循环展示各种集合运算
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimationOpIndex((prev) => (prev + 1) % operations.length)
      setOperation(operations[(animationOpIndex + 1) % operations.length])
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 1000) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, animationOpIndex])

  // 集合运算
  const results = useMemo(() => {
    const a = new Set(setA)
    const b = new Set(setB)

    const union = [...new Set([...a, ...b])].sort((x, y) => x - y)
    const intersection = [...a].filter((x) => b.has(x)).sort((x, y) => x - y)
    const differenceAB = [...a].filter((x) => !b.has(x)).sort((x, y) => x - y)
    const differenceBA = [...b].filter((x) => !a.has(x)).sort((x, y) => x - y)
    const symmetric = [...differenceAB, ...differenceBA].sort((x, y) => x - y)

    return { union, intersection, differenceAB, differenceBA, symmetric }
  }, [setA, setB])

  const currentResult = useMemo(() => {
    switch (operation) {
      case 'union': return results.union
      case 'intersection': return results.intersection
      case 'difference': return results.differenceAB
      case 'symmetric': return results.symmetric
    }
  }, [operation, results])

  // 绘制韦恩图
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const cx = width / 2
    const cy = height / 2
    const r = 100

    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    // 集合 A 圆心
    const ax = cx - 50
    const ay = cy
    // 集合 B 圆心
    const bx = cx + 50
    const by = cy

    // 根据操作高亮不同区域
    const highlightColor = 'rgba(139, 92, 246, 0.4)'

    // 绘制高亮区域
    ctx.save()
    if (operation === 'union') {
      // 并集：两个圆都填充
      ctx.fillStyle = highlightColor
      ctx.beginPath()
      ctx.arc(ax, ay, r, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(bx, by, r, 0, 2 * Math.PI)
      ctx.fill()
    } else if (operation === 'intersection') {
      // 交集：使用裁剪
      ctx.beginPath()
      ctx.arc(ax, ay, r, 0, 2 * Math.PI)
      ctx.clip()
      ctx.fillStyle = highlightColor
      ctx.beginPath()
      ctx.arc(bx, by, r, 0, 2 * Math.PI)
      ctx.fill()
    } else if (operation === 'difference') {
      // A - B：A 减去交集
      ctx.beginPath()
      ctx.arc(ax, ay, r, 0, 2 * Math.PI)
      ctx.clip()
      ctx.fillStyle = highlightColor
      ctx.fillRect(0, 0, width, height)
      // 清除 B 的部分
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(bx, by, r, 0, 2 * Math.PI)
      ctx.fill()
    } else if (operation === 'symmetric') {
      // 对称差：两个圆减去交集
      ctx.fillStyle = highlightColor
      ctx.beginPath()
      ctx.arc(ax, ay, r, 0, 2 * Math.PI)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(bx, by, r, 0, 2 * Math.PI)
      ctx.fill()
      // 清除交集
      ctx.globalCompositeOperation = 'destination-out'
      ctx.save()
      ctx.beginPath()
      ctx.arc(ax, ay, r, 0, 2 * Math.PI)
      ctx.clip()
      ctx.beginPath()
      ctx.arc(bx, by, r, 0, 2 * Math.PI)
      ctx.fill()
      ctx.restore()
    }
    ctx.restore()

    // 绘制圆边框
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(ax, ay, r, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.strokeStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(bx, by, r, 0, 2 * Math.PI)
    ctx.stroke()

    // 标签
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText('A', ax - 70, ay)
    ctx.fillText('B', bx + 55, by)

    // 显示元素
    ctx.font = '12px sans-serif'

    // A 独有
    const onlyA = results.differenceAB
    if (onlyA.length > 0) {
      ctx.fillStyle = '#3b82f6'
      ctx.fillText(onlyA.join(','), ax - 80, ay + 5)
    }

    // B 独有
    const onlyB = results.differenceBA
    if (onlyB.length > 0) {
      ctx.fillStyle = '#22c55e'
      ctx.fillText(onlyB.join(','), bx + 40, by + 5)
    }

    // 交集
    if (results.intersection.length > 0) {
      ctx.fillStyle = '#8b5cf6'
      ctx.fillText(results.intersection.join(','), cx - 15, cy + 5)
    }

  }, [setA, setB, operation, results])

  const parseSet = (input: string): number[] => {
    return input
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n))
  }

  const updateSetA = () => {
    setSetA(parseSet(inputA))
  }

  const updateSetB = () => {
    setSetB(parseSet(inputB))
  }

  const operationInfo: Record<Operation, { name: string; symbol: string; formula: string }> = {
    union: { name: '并集', symbol: '∪', formula: 'A \\cup B' },
    intersection: { name: '交集', symbol: '∩', formula: 'A \\cap B' },
    difference: { name: '差集', symbol: '\\', formula: 'A \\setminus B' },
    symmetric: { name: '对称差', symbol: '△', formula: 'A \\triangle B' },
  }

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">集合论可视化</h1>
            <p className="text-gray-600">通过韦恩图理解集合运算</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStartNarration}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <span>开始讲解</span>
            </button>
            <button
              onClick={() => {
                if (!isAnimating) {
                  setAnimationOpIndex(0)
                }
                setIsAnimating(!isAnimating)
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {isAnimating ? '停止' : '播放动画'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">韦恩图</h3>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="w-full max-w-md mx-auto border border-gray-300 rounded"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">运算结果</h3>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MathFormula formula={operationInfo[operation].formula} />
                <span className="text-gray-600">=</span>
              </div>
              <div className="text-xl font-mono font-bold text-purple-700">
                {'{' + currentResult.join(', ') + '}'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                元素个数: {currentResult.length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(operationInfo) as Operation[]).map((op) => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  operation === op
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-2xl">{operationInfo[op].symbol}</div>
                <div className="text-sm">{operationInfo[op].name}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">集合运算定义</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-blue-50 rounded">
                  <MathFormula formula="A \cup B = \{x : x \in A \text{ 或 } x \in B\}" />
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <MathFormula formula="A \cap B = \{x : x \in A \text{ 且 } x \in B\}" />
                </div>
                <div className="p-2 bg-amber-50 rounded">
                  <MathFormula formula="A \setminus B = \{x : x \in A \text{ 且 } x \notin B\}" />
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <MathFormula formula="A \triangle B = (A \setminus B) \cup (B \setminus A)" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">德摩根定律</h3>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 rounded">
                  <MathFormula formula="\overline{A \cup B} = \overline{A} \cap \overline{B}" />
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <MathFormula formula="\overline{A \cap B} = \overline{A} \cup \overline{B}" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                并集的补等于补集的交，交集的补等于补集的并。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">定义集合</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-4 h-4 bg-blue-500 rounded"></span>
                  集合 A
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder="用逗号分隔"
                  />
                  <button
                    onClick={updateSetA}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
                  >
                    更新
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  A = {'{' + setA.join(', ') + '}'}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded"></span>
                  集合 B
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={inputB}
                    onChange={(e) => setInputB(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    placeholder="用逗号分隔"
                  />
                  <button
                    onClick={updateSetB}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm"
                  >
                    更新
                  </button>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  B = {'{' + setB.join(', ') + '}'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">所有运算结果</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 rounded flex justify-between">
                <span>A ∪ B</span>
                <span className="font-mono">{'{' + results.union.join(',') + '}'}</span>
              </div>
              <div className="p-2 bg-green-50 rounded flex justify-between">
                <span>A ∩ B</span>
                <span className="font-mono">{'{' + results.intersection.join(',') + '}'}</span>
              </div>
              <div className="p-2 bg-amber-50 rounded flex justify-between">
                <span>A \ B</span>
                <span className="font-mono">{'{' + results.differenceAB.join(',') + '}'}</span>
              </div>
              <div className="p-2 bg-red-50 rounded flex justify-between">
                <span>B \ A</span>
                <span className="font-mono">{'{' + results.differenceBA.join(',') + '}'}</span>
              </div>
              <div className="p-2 bg-purple-50 rounded flex justify-between">
                <span>A △ B</span>
                <span className="font-mono">{'{' + results.symmetric.join(',') + '}'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">集合基数</h3>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded flex justify-between">
                <span>|A|</span>
                <span className="font-mono font-bold">{setA.length}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded flex justify-between">
                <span>|B|</span>
                <span className="font-mono font-bold">{setB.length}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded flex justify-between">
                <span>|A ∪ B|</span>
                <span className="font-mono font-bold">{results.union.length}</span>
              </div>
              <div className="p-2 bg-gray-50 rounded flex justify-between">
                <span>|A ∩ B|</span>
                <span className="font-mono font-bold">{results.intersection.length}</span>
              </div>
            </div>
            <div className="mt-2 p-2 bg-purple-50 rounded text-sm">
              <MathFormula formula="|A \cup B| = |A| + |B| - |A \cap B|" />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
