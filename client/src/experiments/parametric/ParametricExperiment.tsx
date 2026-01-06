import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { parametricNarration } from '../../narrations/scripts/parametric'

type CurveType = 'lissajous' | 'cycloid' | 'epicycloid' | 'bezier' | 'hypotrochoid'

const curveInfo: Record<CurveType, { name: string; formulaX: string; formulaY: string; description: string }> = {
  lissajous: {
    name: '利萨如图形',
    formulaX: 'x = A\\sin(at + \\delta)',
    formulaY: 'y = B\\sin(bt)',
    description: '两个正交简谐振动的合成，频率比决定图形形状',
  },
  cycloid: {
    name: '摆线',
    formulaX: 'x = r(t - \\sin t)',
    formulaY: 'y = r(1 - \\cos t)',
    description: '圆在直线上滚动时，圆周上一点的轨迹',
  },
  epicycloid: {
    name: '外摆线',
    formulaX: 'x = (R+r)\\cos t - r\\cos(\\frac{R+r}{r}t)',
    formulaY: 'y = (R+r)\\sin t - r\\sin(\\frac{R+r}{r}t)',
    description: '小圆在大圆外部滚动时，小圆上一点的轨迹',
  },
  bezier: {
    name: '贝塞尔曲线',
    formulaX: 'B(t) = (1-t)^3P_0 + 3(1-t)^2tP_1 + ...',
    formulaY: '... + 3(1-t)t^2P_2 + t^3P_3',
    description: '计算机图形学中常用的参数曲线',
  },
  hypotrochoid: {
    name: '内旋轮线',
    formulaX: 'x = (R-r)\\cos t + d\\cos(\\frac{R-r}{r}t)',
    formulaY: 'y = (R-r)\\sin t - d\\sin(\\frac{R-r}{r}t)',
    description: '万花尺原理，小圆在大圆内部滚动',
  },
}

export default function ParametricExperiment() {
  const [params, setParams] = useState({
    a: 3,
    b: 2,
    delta: 90,
    R: 5,
    r: 3,
    d: 2,
  })
  const [curveType, setCurveType] = useState<CurveType>('lissajous')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const [animT, setAnimT] = useState(0)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(parametricNarration)
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

  // 贝塞尔控制点
  const [bezierPoints] = useState([
    { x: -3, y: 0 },
    { x: -1, y: 3 },
    { x: 1, y: -3 },
    { x: 3, y: 0 },
  ])

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setAnimT((prev) => (prev + 0.02) % (Math.PI * 4))
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

  const { xValues, yValues, animX, animY } = useMemo(() => {
    const points = 1000
    const xVals: number[] = []
    const yVals: number[] = []
    const deltaRad = (params.delta * Math.PI) / 180

    const tMax = curveType === 'bezier' ? 1 : Math.PI * 4

    for (let i = 0; i <= points; i++) {
      const t = (i / points) * tMax
      let x = 0, y = 0

      switch (curveType) {
        case 'lissajous':
          x = Math.sin(params.a * t + deltaRad)
          y = Math.sin(params.b * t)
          break
        case 'cycloid':
          x = params.r * (t - Math.sin(t))
          y = params.r * (1 - Math.cos(t))
          break
        case 'epicycloid':
          x = (params.R + params.r) * Math.cos(t) - params.r * Math.cos(((params.R + params.r) / params.r) * t)
          y = (params.R + params.r) * Math.sin(t) - params.r * Math.sin(((params.R + params.r) / params.r) * t)
          break
        case 'bezier':
          const p0 = bezierPoints[0], p1 = bezierPoints[1], p2 = bezierPoints[2], p3 = bezierPoints[3]
          x = Math.pow(1-t, 3) * p0.x + 3 * Math.pow(1-t, 2) * t * p1.x + 3 * (1-t) * t * t * p2.x + Math.pow(t, 3) * p3.x
          y = Math.pow(1-t, 3) * p0.y + 3 * Math.pow(1-t, 2) * t * p1.y + 3 * (1-t) * t * t * p2.y + Math.pow(t, 3) * p3.y
          break
        case 'hypotrochoid':
          x = (params.R - params.r) * Math.cos(t) + params.d * Math.cos(((params.R - params.r) / params.r) * t)
          y = (params.R - params.r) * Math.sin(t) - params.d * Math.sin(((params.R - params.r) / params.r) * t)
          break
      }

      xVals.push(x)
      yVals.push(y)
    }

    // 动画点
    const tAnim = curveType === 'bezier' ? (animT / (Math.PI * 4)) : animT
    let ax = 0, ay = 0
    switch (curveType) {
      case 'lissajous':
        ax = Math.sin(params.a * tAnim + deltaRad)
        ay = Math.sin(params.b * tAnim)
        break
      case 'cycloid':
        ax = params.r * (tAnim - Math.sin(tAnim))
        ay = params.r * (1 - Math.cos(tAnim))
        break
      case 'epicycloid':
        ax = (params.R + params.r) * Math.cos(tAnim) - params.r * Math.cos(((params.R + params.r) / params.r) * tAnim)
        ay = (params.R + params.r) * Math.sin(tAnim) - params.r * Math.sin(((params.R + params.r) / params.r) * tAnim)
        break
      case 'bezier':
        const p0 = bezierPoints[0], p1 = bezierPoints[1], p2 = bezierPoints[2], p3 = bezierPoints[3]
        ax = Math.pow(1-tAnim, 3) * p0.x + 3 * Math.pow(1-tAnim, 2) * tAnim * p1.x + 3 * (1-tAnim) * tAnim * tAnim * p2.x + Math.pow(tAnim, 3) * p3.x
        ay = Math.pow(1-tAnim, 3) * p0.y + 3 * Math.pow(1-tAnim, 2) * tAnim * p1.y + 3 * (1-tAnim) * tAnim * tAnim * p2.y + Math.pow(tAnim, 3) * p3.y
        break
      case 'hypotrochoid':
        ax = (params.R - params.r) * Math.cos(tAnim) + params.d * Math.cos(((params.R - params.r) / params.r) * tAnim)
        ay = (params.R - params.r) * Math.sin(tAnim) - params.d * Math.sin(((params.R - params.r) / params.r) * tAnim)
        break
    }

    return { xValues: xVals, yValues: yVals, animX: ax, animY: ay }
  }, [curveType, params, animT, bezierPoints])

  const range = useMemo(() => {
    const maxVal = Math.max(
      Math.max(...xValues.map(Math.abs)),
      Math.max(...yValues.map(Math.abs))
    ) * 1.2
    return [-maxVal || 5, maxVal || 5]
  }, [xValues, yValues])

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">参数方程</h1>
            <p className="text-gray-600">探索参数曲线的美妙世界</p>
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
            <h3 className="text-lg font-semibold mb-2">{curveInfo[curveType].name}</h3>
            <Plot
              data={[
                { x: [range[0], range[1]], y: [0, 0], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#e2e8f0', width: 1 } },
                { x: [0, 0], y: [range[0], range[1]], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#e2e8f0', width: 1 } },
                {
                  x: xValues,
                  y: yValues,
                  type: 'scatter',
                  mode: 'lines',
                  name: curveInfo[curveType].name,
                  line: { color: '#3b82f6', width: 2 },
                },
                ...(curveType === 'bezier' ? [{
                  x: bezierPoints.map(p => p.x),
                  y: bezierPoints.map(p => p.y),
                  type: 'scatter' as const,
                  mode: 'lines+markers' as const,
                  name: '控制点',
                  line: { color: '#94a3b8', width: 1, dash: 'dash' as const },
                  marker: { color: '#ef4444', size: 10 },
                }] : []),
                {
                  x: [animX],
                  y: [animY],
                  type: 'scatter',
                  mode: 'markers',
                  name: '当前点',
                  marker: { color: '#ef4444', size: 12 },
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

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">参数方程</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <MathFormula formula={curveInfo[curveType].formulaX} />
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <MathFormula formula={curveInfo[curveType].formulaY} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-3">{curveInfo[curveType].description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择曲线</h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(curveInfo) as CurveType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setCurveType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    curveType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {curveInfo[type].name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">动画控制</h3>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isAnimating ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isAnimating ? '停止动画' : '开始动画'}
            </button>
          </div>

          {curveType === 'lissajous' && (
            <ParameterPanel
              title="利萨如参数"
              params={[
                { key: 'a', label: 'a (x频率)', value: params.a, min: 1, max: 7, step: 1 },
                { key: 'b', label: 'b (y频率)', value: params.b, min: 1, max: 7, step: 1 },
                { key: 'delta', label: '相位差 δ', value: params.delta, min: 0, max: 180, step: 15, unit: '°' },
              ]}
              onChange={handleParamChange}
            />
          )}

          {(curveType === 'cycloid') && (
            <ParameterPanel
              title="摆线参数"
              params={[
                { key: 'r', label: '半径 r', value: params.r, min: 1, max: 5, step: 0.5 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {(curveType === 'epicycloid' || curveType === 'hypotrochoid') && (
            <ParameterPanel
              title="轮线参数"
              params={[
                { key: 'R', label: '大圆半径 R', value: params.R, min: 3, max: 10, step: 1 },
                { key: 'r', label: '小圆半径 r', value: params.r, min: 1, max: 5, step: 1 },
                ...(curveType === 'hypotrochoid' ? [{ key: 'd', label: '描点距离 d', value: params.d, min: 0.5, max: 5, step: 0.5 }] : []),
              ]}
              onChange={handleParamChange}
            />
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">参数方程通用形式</h3>
            <div className="space-y-2">
              <MathFormula formula="x = f(t)" />
              <MathFormula formula="y = g(t)" />
              <MathFormula formula="t \in [t_0, t_1]" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
