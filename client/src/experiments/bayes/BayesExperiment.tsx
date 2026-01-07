import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { bayesNarration } from '../../narrations/scripts/bayes'

type Scenario = {
  name: string
  description: string
  priorA: number
  likelihoodBgivenA: number
  likelihoodBgivenNotA: number
}

const scenarios: Scenario[] = [
  {
    name: '医学检测',
    description: '某疾病患病率1%，检测灵敏度99%，假阳性率5%。检测阳性时实际患病概率？',
    priorA: 0.01,
    likelihoodBgivenA: 0.99,
    likelihoodBgivenNotA: 0.05,
  },
  {
    name: '垃圾邮件',
    description: '20%邮件是垃圾邮件。垃圾邮件含"免费"概率80%，正常邮件含"免费"概率10%。',
    priorA: 0.2,
    likelihoodBgivenA: 0.8,
    likelihoodBgivenNotA: 0.1,
  },
  {
    name: '天气预报',
    description: '某地30%的日子下雨。下雨天预报准确率90%，晴天误报率20%。',
    priorA: 0.3,
    likelihoodBgivenA: 0.9,
    likelihoodBgivenNotA: 0.2,
  },
  {
    name: '产品质量',
    description: '工厂次品率2%。质检能检出95%的次品，但会误判3%的合格品。',
    priorA: 0.02,
    likelihoodBgivenA: 0.95,
    likelihoodBgivenNotA: 0.03,
  },
]

export default function BayesExperiment() {
  const [selectedScenario, setSelectedScenario] = useState(0)
  const [priorA, setPriorA] = useState(scenarios[0].priorA)
  const [likelihoodBgivenA, setLikelihoodBgivenA] = useState(scenarios[0].likelihoodBgivenA)
  const [likelihoodBgivenNotA, setLikelihoodBgivenNotA] = useState(scenarios[0].likelihoodBgivenNotA)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentUpdateStep, setCurrentUpdateStep] = useState(0)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(bayesNarration)
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

  const selectScenario = (index: number) => {
    setSelectedScenario(index)
    setPriorA(scenarios[index].priorA)
    setLikelihoodBgivenA(scenarios[index].likelihoodBgivenA)
    setLikelihoodBgivenNotA(scenarios[index].likelihoodBgivenNotA)
  }

  const calculations = useMemo(() => {
    const priorNotA = 1 - priorA
    const pB = priorA * likelihoodBgivenA + priorNotA * likelihoodBgivenNotA
    const posteriorAgivenB = (priorA * likelihoodBgivenA) / pB
    const posteriorNotAgivenB = (priorNotA * likelihoodBgivenNotA) / pB

    // 贝叶斯更新序列
    const updates: { n: number; prior: number; posterior: number }[] = []
    let currentPrior = priorA
    for (let i = 0; i <= 10; i++) {
      const pBCurrent = currentPrior * likelihoodBgivenA + (1 - currentPrior) * likelihoodBgivenNotA
      const posterior = (currentPrior * likelihoodBgivenA) / pBCurrent
      updates.push({ n: i, prior: currentPrior, posterior })
      currentPrior = posterior
    }

    return {
      priorNotA,
      pB,
      posteriorAgivenB,
      posteriorNotAgivenB,
      updates,
    }
  }, [priorA, likelihoodBgivenA, likelihoodBgivenNotA])

  // 动画效果：逐步展示贝叶斯更新
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setCurrentUpdateStep((prev) => {
        if (prev >= 10) {
          setIsAnimating(false)
          return prev
        }
        return prev + 1
      })
      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate)
      }, 500) as unknown as number
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating])

  // 可视化数据
  const treeData = useMemo(() => {
    const total = 1000
    const countA = total * priorA
    const countNotA = total * (1 - priorA)
    const countBgivenA = countA * likelihoodBgivenA
    const countNotBgivenA = countA * (1 - likelihoodBgivenA)
    const countBgivenNotA = countNotA * likelihoodBgivenNotA
    const countNotBgivenNotA = countNotA * (1 - likelihoodBgivenNotA)

    return {
      countA,
      countNotA,
      countBgivenA,
      countNotBgivenA,
      countBgivenNotA,
      countNotBgivenNotA,
      totalB: countBgivenA + countBgivenNotA,
    }
  }, [priorA, likelihoodBgivenA, likelihoodBgivenNotA])

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">贝叶斯定理</h1>
            <p className="text-gray-600">理解条件概率和贝叶斯推断</p>
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">概率树形图 (基于1000个样本)</h3>
            <div className="flex justify-center">
              <svg viewBox="0 0 500 300" className="w-full max-w-lg">
                {/* 根节点 */}
                <circle cx="250" cy="30" r="20" fill="#8b5cf6" />
                <text x="250" y="35" textAnchor="middle" fill="white" fontSize="12">1000</text>

                {/* A 分支 */}
                <line x1="250" y1="50" x2="125" y2="100" stroke="#22c55e" strokeWidth="2" />
                <text x="170" y="70" fontSize="10" fill="#22c55e">P(A)={priorA.toFixed(2)}</text>
                <circle cx="125" cy="120" r="18" fill="#22c55e" />
                <text x="125" y="125" textAnchor="middle" fill="white" fontSize="10">
                  {treeData.countA.toFixed(0)}
                </text>
                <text x="125" y="150" textAnchor="middle" fontSize="10">A</text>

                {/* Not A 分支 */}
                <line x1="250" y1="50" x2="375" y2="100" stroke="#ef4444" strokeWidth="2" />
                <text x="330" y="70" fontSize="10" fill="#ef4444">P(¬A)={(1-priorA).toFixed(2)}</text>
                <circle cx="375" cy="120" r="18" fill="#ef4444" />
                <text x="375" y="125" textAnchor="middle" fill="white" fontSize="10">
                  {treeData.countNotA.toFixed(0)}
                </text>
                <text x="375" y="150" textAnchor="middle" fontSize="10">¬A</text>

                {/* B|A 分支 */}
                <line x1="125" y1="138" x2="60" y2="200" stroke="#3b82f6" strokeWidth="2" />
                <text x="70" y="175" fontSize="9" fill="#3b82f6">P(B|A)</text>
                <circle cx="60" cy="220" r="16" fill="#3b82f6" />
                <text x="60" y="225" textAnchor="middle" fill="white" fontSize="9">
                  {treeData.countBgivenA.toFixed(0)}
                </text>
                <text x="60" y="250" textAnchor="middle" fontSize="9">A∩B</text>

                {/* Not B|A 分支 */}
                <line x1="125" y1="138" x2="190" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="190" cy="220" r="16" fill="#94a3b8" />
                <text x="190" y="225" textAnchor="middle" fill="white" fontSize="9">
                  {treeData.countNotBgivenA.toFixed(0)}
                </text>
                <text x="190" y="250" textAnchor="middle" fontSize="9">A∩¬B</text>

                {/* B|Not A 分支 */}
                <line x1="375" y1="138" x2="310" y2="200" stroke="#f59e0b" strokeWidth="2" />
                <text x="320" y="175" fontSize="9" fill="#f59e0b">P(B|¬A)</text>
                <circle cx="310" cy="220" r="16" fill="#f59e0b" />
                <text x="310" y="225" textAnchor="middle" fill="white" fontSize="9">
                  {treeData.countBgivenNotA.toFixed(0)}
                </text>
                <text x="310" y="250" textAnchor="middle" fontSize="9">¬A∩B</text>

                {/* Not B|Not A 分支 */}
                <line x1="375" y1="138" x2="440" y2="200" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="440" cy="220" r="16" fill="#94a3b8" />
                <text x="440" y="225" textAnchor="middle" fill="white" fontSize="9">
                  {treeData.countNotBgivenNotA.toFixed(0)}
                </text>
                <text x="440" y="250" textAnchor="middle" fontSize="9">¬A∩¬B</text>

                {/* 总B */}
                <rect x="150" y="275" width="200" height="20" fill="#e0e7ff" rx="5" />
                <text x="250" y="290" textAnchor="middle" fontSize="10">
                  B发生总数: {treeData.totalB.toFixed(0)} (其中A: {treeData.countBgivenA.toFixed(0)})
                </text>
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">贝叶斯更新（连续观测B）</h3>
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setCurrentUpdateStep(0)
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
                  x: calculations.updates.slice(0, currentUpdateStep + 1).map((u) => u.n),
                  y: calculations.updates.slice(0, currentUpdateStep + 1).map((u) => u.posterior),
                  type: 'scatter' as const,
                  mode: 'lines+markers' as const,
                  line: { color: '#8b5cf6', width: 2 },
                  marker: { size: 8 },
                  name: 'P(A|B)',
                },
                {
                  x: [0, 10],
                  y: [1, 1],
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#94a3b8', dash: 'dot' },
                  name: '确定性',
                },
              ] as any}
              layout={{
                autosize: true,
                height: 250,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: '观测次数' } },
                yaxis: { title: { text: 'P(A|B)' }, range: [0, 1.05] },
                legend: { orientation: 'h', y: -0.2 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">
              每次观测到B后，后验概率成为下一次的先验概率，信念逐渐更新。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">贝叶斯定理</h3>
              <div className="p-3 bg-purple-50 rounded-lg">
                <MathFormula formula="P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}" />
              </div>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <MathFormula formula="P(B) = P(B|A)P(A) + P(B|\neg A)P(\neg A)" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">计算结果</h3>
              <div className="space-y-2">
                <div className="p-2 bg-green-50 rounded flex justify-between">
                  <span className="text-green-600">P(A|B) 后验概率</span>
                  <span className="font-mono font-bold text-green-700">
                    {(calculations.posteriorAgivenB * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-2 bg-blue-50 rounded flex justify-between">
                  <span className="text-blue-600">P(B) 边际概率</span>
                  <span className="font-mono font-bold">
                    {(calculations.pB * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-2 bg-amber-50 rounded flex justify-between">
                  <span className="text-amber-600">更新倍数</span>
                  <span className="font-mono font-bold">
                    {(calculations.posteriorAgivenB / priorA).toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择场景</h3>
            <div className="space-y-2">
              {scenarios.map((scenario, i) => (
                <button
                  key={scenario.name}
                  onClick={() => selectScenario(i)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    selectedScenario === i ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {scenarios[selectedScenario].description}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">
                  先验概率 P(A): {(priorA * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={priorA}
                  onChange={(e) => setPriorA(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  似然 P(B|A): {(likelihoodBgivenA * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={likelihoodBgivenA}
                  onChange={(e) => setLikelihoodBgivenA(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  假阳性 P(B|¬A): {(likelihoodBgivenNotA * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.99"
                  step="0.01"
                  value={likelihoodBgivenNotA}
                  onChange={(e) => setLikelihoodBgivenNotA(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">直觉陷阱</h3>
            <p className="text-sm text-gray-600">
              即使检测准确率很高（99%），当疾病本身很罕见时（1%），
              阳性结果的实际患病概率可能远低于预期。这就是"基础率谬误"。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">术语解释</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>先验</strong>: 观测前的信念</li>
              <li>• <strong>似然</strong>: 假设为真时观测到证据的概率</li>
              <li>• <strong>后验</strong>: 观测后更新的信念</li>
              <li>• <strong>边际</strong>: 证据出现的总概率</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
