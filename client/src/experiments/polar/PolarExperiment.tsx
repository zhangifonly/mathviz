import { useState, useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'

type CurveType = 'rose' | 'cardioid' | 'spiral' | 'lemniscate' | 'limacon'

const curveInfo: Record<CurveType, { name: string; formula: string; description: string }> = {
  rose: {
    name: '玫瑰线',
    formula: 'r = a \\cos(n\\theta)',
    description: 'n为整数时，n为奇数有n瓣，n为偶数有2n瓣',
  },
  cardioid: {
    name: '心形线',
    formula: 'r = a(1 + \\cos\\theta)',
    description: '形状像心形，是蚶线的特例',
  },
  spiral: {
    name: '阿基米德螺线',
    formula: 'r = a + b\\theta',
    description: '等距螺旋，每圈间距相等',
  },
  lemniscate: {
    name: '双纽线',
    formula: 'r^2 = a^2 \\cos(2\\theta)',
    description: '形状像数字8或无穷符号∞',
  },
  limacon: {
    name: '蚶线',
    formula: 'r = a + b\\cos\\theta',
    description: '根据a/b比值呈现不同形态',
  },
}

export default function PolarExperiment() {
  const [params, setParams] = useState({
    a: 2,
    b: 1,
    n: 3,
    thetaMax: 360,
  })
  const [curveType, setCurveType] = useState<CurveType>('rose')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const [animTheta, setAnimTheta] = useState(0)

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setAnimTheta((prev) => (prev + 3) % (params.thetaMax + 1))
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating, params.thetaMax])

  const { xValues, yValues, animX, animY } = useMemo(() => {
    const maxTheta = (params.thetaMax * Math.PI) / 180
    const points = 1000
    const xVals: number[] = []
    const yVals: number[] = []

    for (let i = 0; i <= points; i++) {
      const theta = (i / points) * maxTheta
      let r = 0

      switch (curveType) {
        case 'rose':
          r = params.a * Math.cos(params.n * theta)
          break
        case 'cardioid':
          r = params.a * (1 + Math.cos(theta))
          break
        case 'spiral':
          r = params.a + params.b * theta
          break
        case 'lemniscate':
          const cos2t = Math.cos(2 * theta)
          r = cos2t >= 0 ? params.a * Math.sqrt(cos2t) : 0
          break
        case 'limacon':
          r = params.a + params.b * Math.cos(theta)
          break
      }

      xVals.push(r * Math.cos(theta))
      yVals.push(r * Math.sin(theta))
    }

    // 动画点
    const animThetaRad = (animTheta * Math.PI) / 180
    let animR = 0
    switch (curveType) {
      case 'rose':
        animR = params.a * Math.cos(params.n * animThetaRad)
        break
      case 'cardioid':
        animR = params.a * (1 + Math.cos(animThetaRad))
        break
      case 'spiral':
        animR = params.a + params.b * animThetaRad
        break
      case 'lemniscate':
        const cos2t = Math.cos(2 * animThetaRad)
        animR = cos2t >= 0 ? params.a * Math.sqrt(cos2t) : 0
        break
      case 'limacon':
        animR = params.a + params.b * Math.cos(animThetaRad)
        break
    }

    return {
      xValues: xVals,
      yValues: yVals,
      animX: animR * Math.cos(animThetaRad),
      animY: animR * Math.sin(animThetaRad),
    }
  }, [curveType, params, animTheta])

  // 计算合适的坐标范围
  const range = useMemo(() => {
    const maxVal = Math.max(
      Math.max(...xValues.map(Math.abs)),
      Math.max(...yValues.map(Math.abs))
    ) * 1.2
    return [-maxVal || 5, maxVal || 5]
  }, [xValues, yValues])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">极坐标图形</h1>
        <p className="text-gray-600">探索极坐标系中的美丽曲线</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 极坐标图 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{curveInfo[curveType].name}</h3>
            <Plot
              data={[
                // 坐标轴
                { x: [range[0], range[1]], y: [0, 0], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#e2e8f0', width: 1 } },
                { x: [0, 0], y: [range[0], range[1]], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#e2e8f0', width: 1 } },
                // 曲线
                {
                  x: xValues,
                  y: yValues,
                  type: 'scatter',
                  mode: 'lines',
                  name: curveInfo[curveType].name,
                  line: { color: '#8b5cf6', width: 2 },
                },
                // 动画点和半径线
                {
                  x: [0, animX],
                  y: [0, animY],
                  type: 'scatter',
                  mode: 'lines',
                  showlegend: false,
                  line: { color: '#ef4444', width: 2 },
                },
                {
                  x: [animX],
                  y: [animY],
                  type: 'scatter',
                  mode: 'markers',
                  name: '当前点',
                  marker: { color: '#ef4444', size: 10 },
                },
              ]}
              layout={{
                autosize: true,
                height: 450,
                margin: { t: 30, r: 30, b: 30, l: 30 },
                xaxis: { range, scaleanchor: 'y', scaleratio: 1, showgrid: true, gridcolor: '#f1f5f9' },
                yaxis: { range, showgrid: true, gridcolor: '#f1f5f9' },
                showlegend: false,
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {/* 说明 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">曲线说明</h3>
            <p className="text-gray-600">{curveInfo[curveType].description}</p>
            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
              <MathFormula formula={curveInfo[curveType].formula} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 曲线选择 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择曲线</h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(curveInfo) as CurveType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setCurveType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    curveType === type ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {curveInfo[type].name}
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
              {isAnimating ? '停止绘制' : '开始绘制'}
            </button>
            <div className="mt-3 text-sm text-gray-600">
              θ = {animTheta}° ({(animTheta * Math.PI / 180).toFixed(2)} rad)
            </div>
          </div>

          {/* 参数控制 */}
          <ParameterPanel
            title="参数控制"
            params={[
              { key: 'a', label: '参数 a', value: params.a, min: 0.5, max: 5, step: 0.5 },
              ...(curveType === 'spiral' || curveType === 'limacon'
                ? [{ key: 'b', label: '参数 b', value: params.b, min: 0.5, max: 5, step: 0.5 }]
                : []),
              ...(curveType === 'rose'
                ? [{ key: 'n', label: '瓣数 n', value: params.n, min: 1, max: 8, step: 1 }]
                : []),
              { key: 'thetaMax', label: '最大角度', value: params.thetaMax, min: 180, max: 720, step: 30, unit: '°' },
            ]}
            onChange={handleParamChange}
          />

          {/* 极坐标公式 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">极坐标转换</h3>
            <div className="space-y-2">
              <MathFormula formula="x = r\cos\theta" />
              <MathFormula formula="y = r\sin\theta" />
              <MathFormula formula="r = \sqrt{x^2 + y^2}" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
