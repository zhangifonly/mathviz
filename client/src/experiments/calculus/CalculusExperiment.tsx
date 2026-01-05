import { useState, useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'
import { derivative, compile } from 'mathjs'

type FunctionType = 'x^2' | 'sin(x)' | 'e^x' | 'ln(x)' | 'x^3'

const functionInfo: Record<FunctionType, { formula: string; derivative: string; integral: string }> = {
  'x^2': { formula: 'f(x) = x^2', derivative: "f'(x) = 2x", integral: '\\int x^2 dx = \\frac{x^3}{3} + C' },
  'sin(x)': { formula: 'f(x) = \\sin(x)', derivative: "f'(x) = \\cos(x)", integral: '\\int \\sin(x) dx = -\\cos(x) + C' },
  'e^x': { formula: 'f(x) = e^x', derivative: "f'(x) = e^x", integral: '\\int e^x dx = e^x + C' },
  'ln(x)': { formula: 'f(x) = \\ln(x)', derivative: "f'(x) = \\frac{1}{x}", integral: '\\int \\ln(x) dx = x\\ln(x) - x + C' },
  'x^3': { formula: 'f(x) = x^3', derivative: "f'(x) = 3x^2", integral: '\\int x^3 dx = \\frac{x^4}{4} + C' },
}

export default function CalculusExperiment() {
  const [params, setParams] = useState({
    tangentPoint: 1,
    integralStart: 0,
    integralEnd: 2,
  })
  const [funcType, setFuncType] = useState<FunctionType>('x^2')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  // 动画效果：切点沿曲线移动
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setParams((prev) => {
        const nextPoint = prev.tangentPoint + 0.05
        if (nextPoint > 2) {
          return { ...prev, tangentPoint: -2 }
        }
        return { ...prev, tangentPoint: nextPoint }
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  const { xValues, yValues, tangentLine, derivativeValues, integralArea } = useMemo(() => {
    const expr = funcType === 'e^x' ? 'exp(x)' : funcType === 'ln(x)' ? 'log(x)' : funcType
    const compiled = compile(expr)
    const derivExpr = derivative(expr, 'x').toString()
    const derivCompiled = compile(derivExpr)

    const xMin = funcType === 'ln(x)' ? 0.1 : -3
    const xMax = 3
    const xVals: number[] = []
    const yVals: number[] = []
    const derivVals: number[] = []

    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin)
      xVals.push(x)
      try {
        yVals.push(compiled.evaluate({ x }))
        derivVals.push(derivCompiled.evaluate({ x }))
      } catch {
        yVals.push(NaN)
        derivVals.push(NaN)
      }
    }

    const tp = params.tangentPoint
    let yAtPoint: number, slopeAtPoint: number
    try {
      yAtPoint = compiled.evaluate({ x: tp })
      slopeAtPoint = derivCompiled.evaluate({ x: tp })
    } catch {
      yAtPoint = 0
      slopeAtPoint = 0
    }

    const tangentX = [tp - 1, tp + 1]
    const tangentY = tangentX.map((x) => yAtPoint + slopeAtPoint * (x - tp))

    const areaX: number[] = []
    const areaY: number[] = []
    const start = Math.max(params.integralStart, funcType === 'ln(x)' ? 0.1 : -3)
    const end = params.integralEnd
    for (let i = 0; i <= 50; i++) {
      const x = start + (i / 50) * (end - start)
      areaX.push(x)
      try {
        areaY.push(compiled.evaluate({ x }))
      } catch {
        areaY.push(0)
      }
    }

    return {
      xValues: xVals,
      yValues: yVals,
      tangentLine: { x: tangentX, y: tangentY, point: { x: tp, y: yAtPoint }, slope: slopeAtPoint },
      derivativeValues: derivVals,
      integralArea: { x: areaX, y: areaY },
    }
  }, [funcType, params])

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 页面标题 */}
      <header className="flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <span className="text-xl md:text-2xl">∫</span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">微积分</h1>
          <p className="text-slate-500 text-sm md:text-base">理解导数和积分的几何意义</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* 导数卡片 */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <span className="text-xs md:text-sm text-white font-bold">∂</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">导数：切线斜率</h3>
              </div>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                  isAnimating
                    ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/25'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                }`}
              >
                {isAnimating ? '停止' : '播放'}
              </button>
            </div>
            <div className="p-2 md:p-4">
              <Plot
                data={[
                  { x: xValues, y: yValues, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#6366f1', width: 2 } },
                  { x: tangentLine.x, y: tangentLine.y, type: 'scatter', mode: 'lines', name: '切线', line: { color: '#f43f5e', width: 2 } },
                  { x: [tangentLine.point.x], y: [tangentLine.point.y], type: 'scatter', mode: 'markers', name: '切点', marker: { color: '#f43f5e', size: 10 } },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 20, r: 20, b: 40, l: 40 },
                  xaxis: { title: 'x', range: [-3, 3], gridcolor: '#f1f5f9' },
                  yaxis: { title: 'y', range: [-2, 10], gridcolor: '#f1f5f9' },
                  legend: { orientation: 'h', y: -0.25, font: { size: 10 } },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  annotations: [{
                    x: tangentLine.point.x + 0.5,
                    y: tangentLine.point.y + 1,
                    text: `斜率 = ${tangentLine.slope.toFixed(2)}`,
                    showarrow: false,
                    font: { color: '#f43f5e', size: 12 },
                  }],
                }}
                config={{ responsive: true, displayModeBar: false }}
                className="w-full"
              />
            </div>
          </div>

          {/* 积分卡片 */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md shadow-violet-500/20">
                  <span className="text-xs md:text-sm text-white font-bold">∫</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">积分：曲线下面积</h3>
              </div>
            </div>
            <div className="p-2 md:p-4">
              <Plot
                data={[
                  { x: xValues, y: yValues, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#6366f1', width: 2 } },
                  {
                    x: [...integralArea.x, integralArea.x[integralArea.x.length - 1], integralArea.x[0]],
                    y: [...integralArea.y, 0, 0],
                    type: 'scatter',
                    fill: 'toself',
                    fillcolor: 'rgba(139, 92, 246, 0.3)',
                    line: { color: 'rgba(139, 92, 246, 0.5)' },
                    name: '积分区域',
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 20, r: 20, b: 40, l: 40 },
                  xaxis: { title: 'x', range: [-3, 3], gridcolor: '#f1f5f9' },
                  yaxis: { title: 'y', range: [-2, 10], gridcolor: '#f1f5f9' },
                  legend: { orientation: 'h', y: -0.25, font: { size: 10 } },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                }}
                config={{ responsive: true, displayModeBar: false }}
                className="w-full"
              />
            </div>
          </div>

          {/* 导函数卡片 */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <span className="text-xs md:text-sm text-white font-bold">f'</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">导函数图像</h3>
              </div>
            </div>
            <div className="p-2 md:p-4">
              <Plot
                data={[
                  { x: xValues, y: derivativeValues, type: 'scatter', mode: 'lines', name: "f'(x)", line: { color: '#10b981', width: 2 } },
                ]}
                layout={{
                  autosize: true,
                  height: 180,
                  margin: { t: 20, r: 20, b: 40, l: 40 },
                  xaxis: { title: 'x', range: [-3, 3], gridcolor: '#f1f5f9' },
                  yaxis: { title: "f'(x)", gridcolor: '#f1f5f9' },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                }}
                config={{ responsive: true, displayModeBar: false }}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* 函数选择卡片 */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <span className="text-xs md:text-sm">𝑓</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">选择函数</h3>
              </div>
            </div>
            <div className="p-3 md:p-4">
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {(Object.keys(functionInfo) as FunctionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFuncType(type)}
                    className={`px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 ${
                      funcType === type
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ParameterPanel
            title="参数控制"
            params={[
              { key: 'tangentPoint', label: '切点位置', value: params.tangentPoint, min: -2, max: 2, step: 0.1 },
              { key: 'integralStart', label: '积分起点', value: params.integralStart, min: -2, max: 2, step: 0.1 },
              { key: 'integralEnd', label: '积分终点', value: params.integralEnd, min: -2, max: 3, step: 0.1 },
            ]}
            onChange={handleParamChange}
          />

          {/* 公式卡片 */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
            <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <span className="text-xs md:text-sm">∑</span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">公式</h3>
              </div>
            </div>
            <div className="p-3 md:p-5 space-y-2 md:space-y-3">
              <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-lg md:rounded-xl p-2.5 md:p-3 overflow-x-auto">
                <MathFormula formula={functionInfo[funcType].formula} className="text-sm md:text-base" />
              </div>
              <div className="bg-gradient-to-r from-slate-50 to-rose-50/50 rounded-lg md:rounded-xl p-2.5 md:p-3 overflow-x-auto">
                <MathFormula formula={functionInfo[funcType].derivative} className="text-sm md:text-base" />
              </div>
              <div className="bg-gradient-to-r from-slate-50 to-violet-50/50 rounded-lg md:rounded-xl p-2.5 md:p-3 overflow-x-auto">
                <MathFormula formula={functionInfo[funcType].integral} className="text-sm md:text-base" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
