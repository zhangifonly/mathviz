import { useState, useMemo, useEffect, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { laplaceNarration } from '../../narrations/scripts/laplace'

type FunctionType = 'step' | 'exponential' | 'sine' | 'cosine' | 'ramp' | 'impulse'

interface TransformPair {
  name: string
  timeDomain: string
  sDomain: string
  timeFunc: (t: number, params: { a: number; omega: number }) => number
  sFunc: (s: number, params: { a: number; omega: number }) => { real: number; imag: number }
}

const transformPairs: Record<FunctionType, TransformPair> = {
  step: {
    name: '单位阶跃函数',
    timeDomain: 'u(t) = 1, \\quad t \\geq 0',
    sDomain: '\\mathcal{L}\\{u(t)\\} = \\frac{1}{s}',
    timeFunc: (t) => (t >= 0 ? 1 : 0),
    sFunc: (s) => ({ real: s / (s * s + 0.0001), imag: 0 }),
  },
  ramp: {
    name: '斜坡函数',
    timeDomain: 'f(t) = t, \\quad t \\geq 0',
    sDomain: '\\mathcal{L}\\{t\\} = \\frac{1}{s^2}',
    timeFunc: (t) => (t >= 0 ? t : 0),
    sFunc: (s) => ({ real: 1 / (s * s + 0.0001), imag: 0 }),
  },
  exponential: {
    name: '指数函数',
    timeDomain: 'f(t) = e^{at}, \\quad t \\geq 0',
    sDomain: '\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s-a}',
    timeFunc: (t, { a }) => (t >= 0 ? Math.exp(a * t) : 0),
    sFunc: (s, { a }) => ({ real: (s - a) / ((s - a) * (s - a) + 0.0001), imag: 0 }),
  },
  sine: {
    name: '正弦函数',
    timeDomain: 'f(t) = \\sin(\\omega t), \\quad t \\geq 0',
    sDomain: '\\mathcal{L}\\{\\sin(\\omega t)\\} = \\frac{\\omega}{s^2 + \\omega^2}',
    timeFunc: (t, { omega }) => (t >= 0 ? Math.sin(omega * t) : 0),
    sFunc: (s, { omega }) => ({
      real: 0,
      imag: omega / (s * s + omega * omega + 0.0001),
    }),
  },
  cosine: {
    name: '余弦函数',
    timeDomain: 'f(t) = \\cos(\\omega t), \\quad t \\geq 0',
    sDomain: '\\mathcal{L}\\{\\cos(\\omega t)\\} = \\frac{s}{s^2 + \\omega^2}',
    timeFunc: (t, { omega }) => (t >= 0 ? Math.cos(omega * t) : 0),
    sFunc: (s, { omega }) => ({
      real: s / (s * s + omega * omega + 0.0001),
      imag: 0,
    }),
  },
  impulse: {
    name: '单位冲激函数',
    timeDomain: '\\delta(t)',
    sDomain: '\\mathcal{L}\\{\\delta(t)\\} = 1',
    timeFunc: (t) => (Math.abs(t) < 0.05 ? 10 : 0),
    sFunc: () => ({ real: 1, imag: 0 }),
  },
}

export default function LaplaceExperiment() {
  const [funcType, setFuncType] = useState<FunctionType>('step')
  const [params, setParams] = useState({ a: -1, omega: 2 })
  const [systemOrder, setSystemOrder] = useState<1 | 2>(1)
  const [systemParams, setSystemParams] = useState({ tau: 1, zeta: 0.5, wn: 2 })
  const [showPresenter, setShowPresenter] = useState(false)

  const narration = useNarrationOptional()

  useEffect(() => {
    if (narration) {
      narration.loadScript(laplaceNarration)
    }
  }, [narration])

  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])

  // 时域信号数据
  const timeDomainData = useMemo(() => {
    const t: number[] = []
    const y: number[] = []
    const pair = transformPairs[funcType]

    for (let i = -1; i <= 5; i += 0.01) {
      t.push(i)
      const val = pair.timeFunc(i, params)
      y.push(Math.min(Math.max(val, -10), 10)) // 限制范围
    }
    return { t, y }
  }, [funcType, params])

  // S域幅度响应
  const sDomainData = useMemo(() => {
    const sigma: number[] = []
    const magnitude: number[] = []
    const pair = transformPairs[funcType]

    for (let s = 0.1; s <= 10; s += 0.1) {
      sigma.push(s)
      const result = pair.sFunc(s, params)
      const mag = Math.sqrt(result.real * result.real + result.imag * result.imag)
      magnitude.push(Math.min(mag, 10))
    }
    return { sigma, magnitude }
  }, [funcType, params])

  // 系统阶跃响应
  const stepResponse = useMemo(() => {
    const t: number[] = []
    const y: number[] = []

    for (let i = 0; i <= 10; i += 0.05) {
      t.push(i)
      if (systemOrder === 1) {
        // 一阶系统: H(s) = 1/(τs + 1)
        y.push(1 - Math.exp(-i / systemParams.tau))
      } else {
        // 二阶系统: H(s) = ωn²/(s² + 2ζωns + ωn²)
        const { zeta, wn } = systemParams
        if (zeta < 1) {
          // 欠阻尼
          const wd = wn * Math.sqrt(1 - zeta * zeta)
          const envelope = Math.exp(-zeta * wn * i)
          y.push(1 - envelope * (Math.cos(wd * i) + (zeta * wn / wd) * Math.sin(wd * i)))
        } else if (zeta === 1) {
          // 临界阻尼
          y.push(1 - (1 + wn * i) * Math.exp(-wn * i))
        } else {
          // 过阻尼
          const s1 = -zeta * wn + wn * Math.sqrt(zeta * zeta - 1)
          const s2 = -zeta * wn - wn * Math.sqrt(zeta * zeta - 1)
          y.push(1 + (s1 * Math.exp(s2 * i) - s2 * Math.exp(s1 * i)) / (s2 - s1))
        }
      }
    }
    return { t, y }
  }, [systemOrder, systemParams])

  // 极点位置
  const poles = useMemo(() => {
    if (systemOrder === 1) {
      return [{ real: -1 / systemParams.tau, imag: 0 }]
    } else {
      const { zeta, wn } = systemParams
      if (zeta < 1) {
        const realPart = -zeta * wn
        const imagPart = wn * Math.sqrt(1 - zeta * zeta)
        return [
          { real: realPart, imag: imagPart },
          { real: realPart, imag: -imagPart },
        ]
      } else {
        return [
          { real: -zeta * wn + wn * Math.sqrt(zeta * zeta - 1), imag: 0 },
          { real: -zeta * wn - wn * Math.sqrt(zeta * zeta - 1), imag: 0 },
        ]
      }
    }
  }, [systemOrder, systemParams])

  const currentPair = transformPairs[funcType]

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExitPresenter} />}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">拉普拉斯变换</h1>
            <p className="text-gray-600">探索时域与复频域之间的桥梁</p>
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

        {/* 拉普拉斯变换定义 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-3">拉普拉斯变换定义</h3>
          <div className="p-4 bg-indigo-50 rounded-lg text-center">
            <MathFormula formula="F(s) = \mathcal{L}\{f(t)\} = \int_0^{\infty} f(t) e^{-st} dt" />
          </div>
          <p className="text-sm text-gray-600 mt-3">
            其中 s = σ + jω 是复频率变量。拉普拉斯变换将时域信号转换到复频域，便于分析线性时不变系统。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 函数选择和时域/S域对比 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {(Object.keys(transformPairs) as FunctionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFuncType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      funcType === type
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {transformPairs[type].name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 时域 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">时域 f(t)</h4>
                  <div className="p-2 bg-blue-50 rounded mb-2 text-center">
                    <MathFormula formula={currentPair.timeDomain} />
                  </div>
                  <Plot
                    data={[
                      {
                        x: timeDomainData.t,
                        y: timeDomainData.y,
                        type: 'scatter' as const,
                        mode: 'lines' as const,
                        line: { color: '#3b82f6', width: 2 },
                        name: 'f(t)',
                      },
                    ]}
                    layout={{
                      autosize: true,
                      height: 200,
                      margin: { t: 20, r: 20, b: 40, l: 50 },
                      xaxis: { title: { text: 't' }, zeroline: true },
                      yaxis: { title: { text: 'f(t)' }, zeroline: true },
                      showlegend: false,
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                </div>

                {/* S域 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">S域 F(s)</h4>
                  <div className="p-2 bg-purple-50 rounded mb-2 text-center">
                    <MathFormula formula={currentPair.sDomain} />
                  </div>
                  <Plot
                    data={[
                      {
                        x: sDomainData.sigma,
                        y: sDomainData.magnitude,
                        type: 'scatter' as const,
                        mode: 'lines' as const,
                        line: { color: '#8b5cf6', width: 2 },
                        name: '|F(s)|',
                      },
                    ]}
                    layout={{
                      autosize: true,
                      height: 200,
                      margin: { t: 20, r: 20, b: 40, l: 50 },
                      xaxis: { title: { text: 'σ (实部)' }, zeroline: true },
                      yaxis: { title: { text: '|F(s)|' }, zeroline: true },
                      showlegend: false,
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* 系统响应 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">系统阶跃响应</h3>

              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setSystemOrder(1)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    systemOrder === 1
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  一阶系统
                </button>
                <button
                  onClick={() => setSystemOrder(2)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    systemOrder === 2
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  二阶系统
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="p-2 bg-green-50 rounded mb-2 text-center">
                    {systemOrder === 1 ? (
                      <MathFormula formula="H(s) = \frac{1}{\tau s + 1}" />
                    ) : (
                      <MathFormula formula="H(s) = \frac{\omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}" />
                    )}
                  </div>
                  <Plot
                    data={[
                      {
                        x: stepResponse.t,
                        y: stepResponse.y,
                        type: 'scatter' as const,
                        mode: 'lines' as const,
                        line: { color: '#10b981', width: 2 },
                        name: 'y(t)',
                      },
                      {
                        x: [0, 10],
                        y: [1, 1],
                        type: 'scatter' as const,
                        mode: 'lines' as const,
                        line: { color: '#ef4444', width: 1, dash: 'dash' as const },
                        name: '稳态值',
                      },
                    ]}
                    layout={{
                      autosize: true,
                      height: 250,
                      margin: { t: 20, r: 20, b: 40, l: 50 },
                      xaxis: { title: { text: 't' } },
                      yaxis: { title: { text: 'y(t)' }, range: [-0.2, 1.8] },
                      legend: { orientation: 'h', y: -0.2 },
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                </div>

                {/* 极点零点图 */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">S平面极点图</h4>
                  <Plot
                    data={[
                      {
                        x: poles.map((p) => p.real),
                        y: poles.map((p) => p.imag),
                        type: 'scatter' as const,
                        mode: 'markers' as const,
                        marker: {
                          symbol: 'x',
                          size: 15,
                          color: '#ef4444',
                          line: { width: 3 },
                        },
                        name: '极点',
                      },
                      {
                        x: [0],
                        y: [0],
                        type: 'scatter' as const,
                        mode: 'markers' as const,
                        marker: {
                          symbol: 'circle-open',
                          size: 12,
                          color: '#3b82f6',
                          line: { width: 2 },
                        },
                        name: '零点',
                      },
                    ]}
                    layout={{
                      autosize: true,
                      height: 250,
                      margin: { t: 20, r: 20, b: 40, l: 50 },
                      xaxis: {
                        title: { text: 'σ (实部)' },
                        zeroline: true,
                        zerolinecolor: '#ccc',
                        range: [-5, 1],
                      },
                      yaxis: {
                        title: { text: 'jω (虚部)' },
                        zeroline: true,
                        zerolinecolor: '#ccc',
                        scaleanchor: 'x',
                        scaleratio: 1,
                      },
                      shapes: [
                        {
                          type: 'line',
                          x0: 0,
                          y0: -5,
                          x1: 0,
                          y1: 5,
                          line: { color: '#999', width: 1, dash: 'dot' },
                        },
                      ],
                      legend: { orientation: 'h', y: -0.2 },
                    }}
                    config={{ responsive: true, displaylogo: false }}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    极点在左半平面 → 系统稳定
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧参数面板 */}
          <div className="space-y-6">
            {/* 函数参数 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">函数参数</h3>
              <div className="space-y-4">
                {(funcType === 'exponential') && (
                  <div>
                    <label className="text-sm text-gray-600">
                      衰减系数 a: {params.a.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="-3"
                      max="1"
                      step="0.1"
                      value={params.a}
                      onChange={(e) => setParams({ ...params, a: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">a &lt; 0 时信号衰减，a &gt; 0 时信号增长</p>
                  </div>
                )}
                {(funcType === 'sine' || funcType === 'cosine') && (
                  <div>
                    <label className="text-sm text-gray-600">
                      角频率 ω: {params.omega.toFixed(2)} rad/s
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={params.omega}
                      onChange={(e) => setParams({ ...params, omega: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 系统参数 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">系统参数</h3>
              <div className="space-y-4">
                {systemOrder === 1 ? (
                  <div>
                    <label className="text-sm text-gray-600">
                      时间常数 τ: {systemParams.tau.toFixed(2)} s
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={systemParams.tau}
                      onChange={(e) =>
                        setSystemParams({ ...systemParams, tau: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm text-gray-600">
                        阻尼比 ζ: {systemParams.zeta.toFixed(2)}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.05"
                        value={systemParams.zeta}
                        onChange={(e) =>
                          setSystemParams({ ...systemParams, zeta: parseFloat(e.target.value) })
                        }
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        {systemParams.zeta < 1
                          ? '欠阻尼（振荡）'
                          : systemParams.zeta === 1
                          ? '临界阻尼'
                          : '过阻尼'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">
                        自然频率 ωn: {systemParams.wn.toFixed(2)} rad/s
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={systemParams.wn}
                        onChange={(e) =>
                          setSystemParams({ ...systemParams, wn: parseFloat(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 常用变换对照表 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">常用变换对</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>1</span>
                  <span>→</span>
                  <span>1/s</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>t</span>
                  <span>→</span>
                  <span>1/s²</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>e^(at)</span>
                  <span>→</span>
                  <span>1/(s-a)</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>sin(ωt)</span>
                  <span>→</span>
                  <span>ω/(s²+ω²)</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>cos(ωt)</span>
                  <span>→</span>
                  <span>s/(s²+ω²)</span>
                </div>
              </div>
            </div>

            {/* 应用领域 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用领域</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 电路分析</li>
                <li>• 控制系统设计</li>
                <li>• 信号处理</li>
                <li>• 机械振动分析</li>
                <li>• 热传导问题</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
