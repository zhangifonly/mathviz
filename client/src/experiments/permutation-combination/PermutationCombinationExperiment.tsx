import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { permutationCombinationNarration } from '../../narrations/scripts/permutation-combination'

type VisualizationType = 'permutation' | 'combination' | 'pascal' | 'application'

// 阶乘函数
function factorial(n: number): number {
  if (n <= 1) return 1
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

// 排列数 P(n,r)
function permutation(n: number, r: number): number {
  if (r > n || r < 0) return 0
  return factorial(n) / factorial(n - r)
}

// 组合数 C(n,r)
function combination(n: number, r: number): number {
  if (r > n || r < 0) return 0
  return factorial(n) / (factorial(r) * factorial(n - r))
}

// 生成帕斯卡三角形
function generatePascalTriangle(rows: number): number[][] {
  const triangle: number[][] = []
  for (let i = 0; i < rows; i++) {
    triangle[i] = []
    for (let j = 0; j <= i; j++) {
      if (j === 0 || j === i) {
        triangle[i][j] = 1
      } else {
        triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j]
      }
    }
  }
  return triangle
}

export default function PermutationCombinationExperiment() {
  const [params, setParams] = useState({
    n: 5,
    r: 3,
    pascalRows: 8,
    lotteryTotal: 49,
    lotteryPick: 6,
  })
  const [vizType, setVizType] = useState<VisualizationType>('permutation')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const animationStep = useRef(0)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(permutationCombinationNarration)
    }
  }, [narration])

  // 开始讲解
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

  // 动画效果
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      animationStep.current += 1
      const step = animationStep.current

      if (vizType === 'permutation' || vizType === 'combination') {
        // 循环改变 n 和 r
        const newN = 4 + ((step % 60) < 30 ? Math.floor(step / 10) % 4 : 3 - Math.floor(step / 10) % 4)
        const newR = Math.min(newN, 2 + Math.floor(step / 15) % 3)
        setParams(prev => ({ ...prev, n: newN, r: newR }))
      } else if (vizType === 'pascal') {
        // 循环改变帕斯卡三角形行数
        const newRows = 6 + (step % 40 < 20 ? Math.floor(step / 10) % 5 : 4 - Math.floor(step / 10) % 5)
        setParams(prev => ({ ...prev, pascalRows: newRows }))
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, vizType])

  const handleParamChange = (key: string, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  // 排列可视化数据
  const permutationViz = useMemo(() => {
    const { n, r } = params
    const result = permutation(n, r)

    // 创建方块矩阵展示排列
    const colors: string[] = []
    const labels: string[] = []
    const x: number[] = []
    const y: number[] = []

    // 显示前几个排列示例（最多显示20个）
    const maxDisplay = Math.min(20, result)
    for (let i = 0; i < maxDisplay; i++) {
      const row = Math.floor(i / 5)
      const col = i % 5
      x.push(col)
      y.push(-row)
      colors.push(`hsl(${(i * 360) / maxDisplay}, 70%, 60%)`)
      labels.push(`排列${i + 1}`)
    }

    return { x, y, colors, labels, result }
  }, [params])

  // 组合可视化数据
  const combinationViz = useMemo(() => {
    const { n, r } = params
    const result = combination(n, r)

    const colors: string[] = []
    const labels: string[] = []
    const x: number[] = []
    const y: number[] = []

    // 显示前几个组合示例（最多显示20个）
    const maxDisplay = Math.min(20, result)
    for (let i = 0; i < maxDisplay; i++) {
      const row = Math.floor(i / 5)
      const col = i % 5
      x.push(col)
      y.push(-row)
      colors.push(`hsl(${(i * 360) / maxDisplay}, 70%, 60%)`)
      labels.push(`组合${i + 1}`)
    }

    return { x, y, colors, labels, result }
  }, [params])

  // 帕斯卡三角形数据
  const pascalViz = useMemo(() => {
    const triangle = generatePascalTriangle(params.pascalRows)
    const x: number[] = []
    const y: number[] = []
    const text: string[] = []
    const colors: number[] = []

    for (let i = 0; i < triangle.length; i++) {
      for (let j = 0; j <= i; j++) {
        x.push(j - i / 2)
        y.push(-i)
        text.push(triangle[i][j].toString())
        colors.push(Math.log10(triangle[i][j] + 1))
      }
    }

    return { x, y, text, colors }
  }, [params.pascalRows])

  // 应用示例：彩票概率
  const lotteryViz = useMemo(() => {
    const { lotteryTotal, lotteryPick } = params
    const totalCombinations = combination(lotteryTotal, lotteryPick)
    const probability = 1 / totalCombinations
    const percentProbability = probability * 100

    return {
      totalCombinations,
      probability,
      percentProbability,
      odds: `1 : ${totalCombinations.toLocaleString()}`,
    }
  }, [params])

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">排列组合</h1>
            <p className="text-gray-600">探索排列、组合与帕斯卡三角形的奥秘</p>
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
            {/* 可视化类型选择 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {vizType === 'permutation' && '排列 P(n,r)'}
                  {vizType === 'combination' && '组合 C(n,r)'}
                  {vizType === 'pascal' && '帕斯卡三角形'}
                  {vizType === 'application' && '实际应用'}
                </h3>
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`px-4 py-1 rounded-lg text-sm font-medium ${
                    isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {isAnimating ? '停止' : '播放动画'}
                </button>
              </div>

              {/* 排列可视化 */}
              {vizType === 'permutation' && (
                <div>
                  <Plot
                    data={[
                      {
                        x: permutationViz.x,
                        y: permutationViz.y,
                        mode: 'markers',
                        type: 'scatter',
                        marker: {
                          size: 40,
                          color: permutationViz.colors,
                          symbol: 'square',
                        },
                        text: permutationViz.labels,
                        textposition: 'middle center',
                        textfont: { size: 10, color: 'white' },
                        hoverinfo: 'text',
                      } as const,
                    ]}
                    layout={{
                      autosize: true,
                      height: 350,
                      margin: { t: 30, r: 30, b: 40, l: 50 },
                      xaxis: { visible: false, range: [-1, 5] },
                      yaxis: { visible: false, range: [-4, 1] },
                      showlegend: false,
                      paper_bgcolor: '#f9fafb',
                      plot_bgcolor: '#f9fafb',
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <p className="text-center text-lg">
                      从 <span className="font-bold text-purple-600">{params.n}</span> 个元素中选
                      <span className="font-bold text-purple-600"> {params.r}</span> 个的排列数：
                      <span className="font-bold text-purple-700 text-xl ml-2">
                        {permutationViz.result.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* 组合可视化 */}
              {vizType === 'combination' && (
                <div>
                  <Plot
                    data={[
                      {
                        x: combinationViz.x,
                        y: combinationViz.y,
                        mode: 'markers',
                        type: 'scatter',
                        marker: {
                          size: 40,
                          color: combinationViz.colors,
                          symbol: 'circle',
                        },
                        text: combinationViz.labels,
                        textposition: 'middle center',
                        textfont: { size: 10, color: 'white' },
                        hoverinfo: 'text',
                      } as const,
                    ]}
                    layout={{
                      autosize: true,
                      height: 350,
                      margin: { t: 30, r: 30, b: 40, l: 50 },
                      xaxis: { visible: false, range: [-1, 5] },
                      yaxis: { visible: false, range: [-4, 1] },
                      showlegend: false,
                      paper_bgcolor: '#f9fafb',
                      plot_bgcolor: '#f9fafb',
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-center text-lg">
                      从 <span className="font-bold text-blue-600">{params.n}</span> 个元素中选
                      <span className="font-bold text-blue-600"> {params.r}</span> 个的组合数：
                      <span className="font-bold text-blue-700 text-xl ml-2">
                        {combinationViz.result.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* 帕斯卡三角形 */}
              {vizType === 'pascal' && (
                <div>
                  <Plot
                    data={[
                      {
                        x: pascalViz.x,
                        y: pascalViz.y,
                        mode: 'markers' as const,
                        type: 'scatter' as const,
                        marker: {
                          size: 35,
                          color: pascalViz.colors,
                          colorscale: 'Viridis',
                          showscale: false,
                        },
                        hoverinfo: 'text' as const,
                        hovertext: pascalViz.text,
                        showlegend: false,
                      },
                      {
                        x: pascalViz.x,
                        y: pascalViz.y,
                        mode: 'text' as const,
                        type: 'scatter' as const,
                        text: pascalViz.text,
                        textfont: { size: 11, color: 'white', family: 'monospace' },
                        hoverinfo: 'skip' as const,
                        showlegend: false,
                      },
                    ]}
                    layout={{
                      autosize: true,
                      height: 400,
                      margin: { t: 30, r: 30, b: 40, l: 50 },
                      xaxis: { visible: false },
                      yaxis: { visible: false },
                      showlegend: false,
                      paper_bgcolor: '#f9fafb',
                      plot_bgcolor: '#f9fafb',
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-center text-sm text-gray-700">
                      帕斯卡三角形（杨辉三角）：每个数等于上方两个数之和
                    </p>
                  </div>
                </div>
              )}

              {/* 实际应用：彩票 */}
              {vizType === 'application' && (
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                    <h4 className="text-xl font-bold text-amber-800 mb-4 text-center">
                      彩票中奖概率计算
                    </h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-700">
                          从 <span className="font-bold text-amber-600">{params.lotteryTotal}</span> 个号码中
                          选 <span className="font-bold text-amber-600">{params.lotteryPick}</span> 个
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-700">
                          总组合数：
                          <span className="font-bold text-amber-700 text-lg ml-2">
                            {lotteryViz.totalCombinations.toLocaleString()}
                          </span>
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-700">
                          中奖概率：
                          <span className="font-bold text-red-600 text-lg ml-2">
                            {lotteryViz.percentProbability.toExponential(4)}%
                          </span>
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-gray-700">
                          中奖赔率：
                          <span className="font-bold text-red-700 text-lg ml-2">
                            {lotteryViz.odds}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">其他应用示例：</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• 密码组合：4位数字密码有 10^4 = 10,000 种可能</li>
                      <li>• 扑克牌：从52张牌中抽5张有 C(52,5) = 2,598,960 种组合</li>
                      <li>• 排队问题：5个人排队有 P(5,5) = 120 种排列方式</li>
                      <li>• 团队选择：从10人中选3人组队有 C(10,3) = 120 种方式</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 公式说明 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">排列公式</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <MathFormula formula="P(n,r) = \frac{n!}{(n-r)!}" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    排列考虑顺序，从n个元素中选r个进行排列
                  </p>
                  <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                    例：从5个字母中选3个排列，ABC和BAC是不同的排列
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">组合公式</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <MathFormula formula="C(n,r) = \frac{n!}{r!(n-r)!}" />
                  </div>
                  <p className="text-gray-600 text-sm">
                    组合不考虑顺序，从n个元素中选r个进行组合
                  </p>
                  <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                    例：从5个字母中选3个组合，ABC和BAC是相同的组合
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧控制面板 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择可视化</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { type: 'permutation' as const, name: '排列 P(n,r)', icon: '🔢' },
                  { type: 'combination' as const, name: '组合 C(n,r)', icon: '🎯' },
                  { type: 'pascal' as const, name: '帕斯卡三角形', icon: '🔺' },
                  { type: 'application' as const, name: '实际应用', icon: '🎲' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setVizType(item.type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left flex items-center gap-2 ${
                      vizType === item.type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {(vizType === 'permutation' || vizType === 'combination') && (
              <ParameterPanel
                title="参数设置"
                params={[
                  { key: 'n', label: '总数 n', value: params.n, min: 3, max: 10, step: 1 },
                  { key: 'r', label: '选取数 r', value: params.r, min: 1, max: params.n, step: 1 },
                ]}
                onChange={handleParamChange}
              />
            )}

            {vizType === 'pascal' && (
              <ParameterPanel
                title="帕斯卡三角形"
                params={[
                  { key: 'pascalRows', label: '行数', value: params.pascalRows, min: 4, max: 12, step: 1 },
                ]}
                onChange={handleParamChange}
              />
            )}

            {vizType === 'application' && (
              <ParameterPanel
                title="彩票参数"
                params={[
                  { key: 'lotteryTotal', label: '总号码数', value: params.lotteryTotal, min: 10, max: 60, step: 1 },
                  { key: 'lotteryPick', label: '选取数', value: params.lotteryPick, min: 3, max: 10, step: 1 },
                ]}
                onChange={handleParamChange}
              />
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关键概念</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-700 mb-1">排列 vs 组合</p>
                  <p className="text-gray-600">排列考虑顺序，组合不考虑顺序</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-700 mb-1">帕斯卡三角形</p>
                  <p className="text-gray-600">每个数是组合数 C(n,k)，满足递推关系</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-700 mb-1">实际应用</p>
                  <p className="text-gray-600">概率计算、密码学、统计学等领域</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">帕斯卡恒等式</h3>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg">
                  <MathFormula formula="C(n,k) = C(n-1,k-1) + C(n-1,k)" />
                </div>
                <p className="text-gray-600 text-xs">
                  这个恒等式是帕斯卡三角形的核心性质
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
