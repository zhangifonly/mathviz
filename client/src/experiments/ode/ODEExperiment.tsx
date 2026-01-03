import { useState, useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'

type ODEType = 'harmonic' | 'damped' | 'logistic' | 'predator-prey' | 'pendulum'

const odeInfo: Record<ODEType, { name: string; formula: string; description: string }> = {
  harmonic: {
    name: '简谐振动',
    formula: "\\frac{d^2x}{dt^2} = -\\omega^2 x",
    description: '弹簧振子的运动方程，解为正弦/余弦函数',
  },
  damped: {
    name: '阻尼振动',
    formula: "\\frac{d^2x}{dt^2} + 2\\gamma\\frac{dx}{dt} + \\omega^2 x = 0",
    description: '带阻尼的振动，振幅随时间衰减',
  },
  logistic: {
    name: 'Logistic增长',
    formula: "\\frac{dP}{dt} = rP(1 - \\frac{P}{K})",
    description: '人口增长模型，存在环境容纳量K',
  },
  'predator-prey': {
    name: '捕食者-猎物',
    formula: "\\frac{dx}{dt} = \\alpha x - \\beta xy, \\quad \\frac{dy}{dt} = \\delta xy - \\gamma y",
    description: 'Lotka-Volterra方程，描述生态系统中的捕食关系',
  },
  pendulum: {
    name: '单摆',
    formula: "\\frac{d^2\\theta}{dt^2} = -\\frac{g}{L}\\sin\\theta",
    description: '非线性单摆运动，大角度时不能简化为简谐振动',
  },
}

// 四阶龙格-库塔法
function rk4(f: (t: number, y: number[]) => number[], t: number, y: number[], dt: number): number[] {
  const k1 = f(t, y)
  const k2 = f(t + dt/2, y.map((yi, i) => yi + dt/2 * k1[i]))
  const k3 = f(t + dt/2, y.map((yi, i) => yi + dt/2 * k2[i]))
  const k4 = f(t + dt, y.map((yi, i) => yi + dt * k3[i]))
  return y.map((yi, i) => yi + dt/6 * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]))
}

export default function ODEExperiment() {
  const [params, setParams] = useState({
    omega: 2,
    gamma: 0.3,
    r: 0.5,
    K: 100,
    alpha: 1.1,
    beta: 0.4,
    delta: 0.1,
    gammaLV: 0.4,
    g: 9.8,
    L: 1,
    x0: 1,
    v0: 0,
  })
  const [odeType, setOdeType] = useState<ODEType>('harmonic')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const [animIndex, setAnimIndex] = useState(0)

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setAnimIndex((prev) => (prev + 1) % 500)
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating])

  const { tValues, solution, phaseX, phaseY } = useMemo(() => {
    const dt = 0.02
    const steps = 500
    const tVals: number[] = []
    const sol: number[][] = []
    const pX: number[] = []
    const pY: number[] = []

    let y: number[]
    let f: (t: number, y: number[]) => number[]

    switch (odeType) {
      case 'harmonic':
        y = [params.x0, params.v0]
        f = (_t, [x, v]) => [v, -params.omega * params.omega * x]
        break
      case 'damped':
        y = [params.x0, params.v0]
        f = (_t, [x, v]) => [v, -2 * params.gamma * v - params.omega * params.omega * x]
        break
      case 'logistic':
        y = [10]
        f = (_t, [P]) => [params.r * P * (1 - P / params.K)]
        break
      case 'predator-prey':
        y = [10, 5]
        f = (_t, [x, yy]) => [
          params.alpha * x - params.beta * x * yy,
          params.delta * x * yy - params.gammaLV * yy,
        ]
        break
      case 'pendulum':
        y = [params.x0, params.v0]
        f = (_t, [theta, omega]) => [omega, -(params.g / params.L) * Math.sin(theta)]
        break
      default:
        y = [0]
        f = () => [0]
    }

    for (let i = 0; i < steps; i++) {
      const t = i * dt
      tVals.push(t)
      sol.push([...y])

      if (odeType === 'predator-prey') {
        pX.push(y[0])
        pY.push(y[1])
      } else if (odeType !== 'logistic') {
        pX.push(y[0])
        pY.push(y[1])
      }

      y = rk4(f, t, y, dt)
    }

    return { tValues: tVals, solution: sol, phaseX: pX, phaseY: pY }
  }, [odeType, params])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">微分方程</h1>
        <p className="text-gray-600">可视化常微分方程的解和相图</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 时间序列图 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">时间演化</h3>
            <Plot
              data={[
                {
                  x: tValues,
                  y: solution.map(s => s[0]),
                  type: 'scatter',
                  mode: 'lines',
                  name: odeType === 'predator-prey' ? '猎物 x' : odeType === 'logistic' ? '种群 P' : '位移 x',
                  line: { color: '#3b82f6', width: 2 },
                },
                ...(solution[0].length > 1 && odeType !== 'logistic' ? [{
                  x: tValues,
                  y: solution.map(s => s[1]),
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  name: odeType === 'predator-prey' ? '捕食者 y' : '速度 v',
                  line: { color: '#ef4444', width: 2 },
                }] : []),
                {
                  x: [tValues[animIndex]],
                  y: [solution[animIndex][0]],
                  type: 'scatter',
                  mode: 'markers',
                  showlegend: false,
                  marker: { color: '#3b82f6', size: 10 },
                },
              ]}
              layout={{
                autosize: true,
                height: 280,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: '时间 t' },
                yaxis: { title: '值' },
                legend: { orientation: 'h', y: -0.2 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {/* 相图 */}
          {odeType !== 'logistic' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">相图</h3>
              <Plot
                data={[
                  {
                    x: phaseX,
                    y: phaseY,
                    type: 'scatter',
                    mode: 'lines',
                    name: '相轨迹',
                    line: { color: '#8b5cf6', width: 2 },
                  },
                  {
                    x: [phaseX[animIndex]],
                    y: [phaseY[animIndex]],
                    type: 'scatter',
                    mode: 'markers',
                    name: '当前状态',
                    marker: { color: '#ef4444', size: 12 },
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 300,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: odeType === 'predator-prey' ? '猎物 x' : '位移 x' },
                  yaxis: { title: odeType === 'predator-prey' ? '捕食者 y' : '速度 v' },
                  showlegend: false,
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          )}

          {/* 方程 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">微分方程</h3>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MathFormula formula={odeInfo[odeType].formula} />
            </div>
            <p className="text-gray-600 text-sm mt-3">{odeInfo[odeType].description}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 方程选择 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择方程</h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(odeInfo) as ODEType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setOdeType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    odeType === type ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {odeInfo[type].name}
                </button>
              ))}
            </div>
          </div>

          {/* 动画控制 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">动画控制</h3>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isAnimating ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {isAnimating ? '停止动画' : '开始动画'}
            </button>
          </div>

          {/* 参数控制 */}
          {(odeType === 'harmonic' || odeType === 'damped' || odeType === 'pendulum') && (
            <ParameterPanel
              title="参数"
              params={[
                ...(odeType !== 'pendulum' ? [{ key: 'omega', label: '角频率 ω', value: params.omega, min: 0.5, max: 5, step: 0.5 }] : []),
                ...(odeType === 'damped' ? [{ key: 'gamma', label: '阻尼系数 γ', value: params.gamma, min: 0, max: 2, step: 0.1 }] : []),
                ...(odeType === 'pendulum' ? [
                  { key: 'L', label: '摆长 L', value: params.L, min: 0.5, max: 3, step: 0.5, unit: 'm' },
                ] : []),
                { key: 'x0', label: '初始位移', value: params.x0, min: -2, max: 2, step: 0.1 },
                { key: 'v0', label: '初始速度', value: params.v0, min: -2, max: 2, step: 0.1 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {odeType === 'logistic' && (
            <ParameterPanel
              title="Logistic参数"
              params={[
                { key: 'r', label: '增长率 r', value: params.r, min: 0.1, max: 2, step: 0.1 },
                { key: 'K', label: '容纳量 K', value: params.K, min: 50, max: 200, step: 10 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {odeType === 'predator-prey' && (
            <ParameterPanel
              title="Lotka-Volterra参数"
              params={[
                { key: 'alpha', label: '猎物增长率 α', value: params.alpha, min: 0.5, max: 2, step: 0.1 },
                { key: 'beta', label: '捕食率 β', value: params.beta, min: 0.1, max: 1, step: 0.1 },
                { key: 'delta', label: '捕食者增长 δ', value: params.delta, min: 0.05, max: 0.5, step: 0.05 },
                { key: 'gammaLV', label: '捕食者死亡 γ', value: params.gammaLV, min: 0.1, max: 1, step: 0.1 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {/* 数值方法说明 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">数值方法</h3>
            <p className="text-sm text-gray-600">
              使用四阶龙格-库塔法 (RK4) 求解微分方程，这是一种高精度的数值积分方法。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
