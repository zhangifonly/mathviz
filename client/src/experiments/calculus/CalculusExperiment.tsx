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
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">微积分</h1>
        <p className="text-gray-600">理解导数和积分的几何意义</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">导数：切线斜率</h3>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className={`px-4 py-1 rounded-lg text-sm font-medium ${
                  isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isAnimating ? '停止' : '播放动画'}
              </button>
            </div>
            <Plot
              data={[
                { x: xValues, y: yValues, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#3b82f6', width: 2 } },
                { x: tangentLine.x, y: tangentLine.y, type: 'scatter', mode: 'lines', name: '切线', line: { color: '#ef4444', width: 2 } },
                { x: [tangentLine.point.x], y: [tangentLine.point.y], type: 'scatter', mode: 'markers', name: '切点', marker: { color: '#ef4444', size: 10 } },
              ]}
              layout={{
                autosize: true,
                height: 300,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x', range: [-3, 3] },
                yaxis: { title: 'y', range: [-2, 10] },
                legend: { orientation: 'h', y: -0.2 },
                annotations: [{
                  x: tangentLine.point.x + 0.5,
                  y: tangentLine.point.y + 1,
                  text: `斜率 = ${tangentLine.slope.toFixed(2)}`,
                  showarrow: false,
                  font: { color: '#ef4444' },
                }],
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">积分：曲线下面积</h3>
            <Plot
              data={[
                { x: xValues, y: yValues, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#3b82f6', width: 2 } },
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
                height: 300,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x', range: [-3, 3] },
                yaxis: { title: 'y', range: [-2, 10] },
                legend: { orientation: 'h', y: -0.2 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">导函数图像</h3>
            <Plot
              data={[
                { x: xValues, y: derivativeValues, type: 'scatter', mode: 'lines', name: "f'(x)", line: { color: '#22c55e', width: 2 } },
              ]}
              layout={{
                autosize: true,
                height: 200,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x', range: [-3, 3] },
                yaxis: { title: "f'(x)" },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择函数</h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(functionInfo) as FunctionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFuncType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    funcType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">公式</h3>
            <div className="space-y-3">
              <MathFormula formula={functionInfo[funcType].formula} />
              <MathFormula formula={functionInfo[funcType].derivative} />
              <MathFormula formula={functionInfo[funcType].integral} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
