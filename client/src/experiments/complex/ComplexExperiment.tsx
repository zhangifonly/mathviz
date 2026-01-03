import { useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'

export default function ComplexExperiment() {
  const [params, setParams] = useState({
    real1: 1,
    imag1: 1,
    real2: 0.5,
    imag2: 0.866,
    eulerTheta: 45,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setParams((prev) => ({
          ...prev,
          eulerTheta: (prev.eulerTheta + 2) % 360,
        }))
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

  // 复数 z1 和 z2
  const z1 = { re: params.real1, im: params.imag1 }
  const z2 = { re: params.real2, im: params.imag2 }

  // 复数加法: z1 + z2
  const zSum = { re: z1.re + z2.re, im: z1.im + z2.im }

  // 复数乘法: z1 * z2 = (a+bi)(c+di) = (ac-bd) + (ad+bc)i
  const zProduct = {
    re: z1.re * z2.re - z1.im * z2.im,
    im: z1.re * z2.im + z1.im * z2.re,
  }

  // 模和辐角
  const mod1 = Math.sqrt(z1.re ** 2 + z1.im ** 2)
  const arg1 = (Math.atan2(z1.im, z1.re) * 180) / Math.PI
  const mod2 = Math.sqrt(z2.re ** 2 + z2.im ** 2)
  const arg2 = (Math.atan2(z2.im, z2.re) * 180) / Math.PI
  const modProduct = mod1 * mod2
  const argProduct = arg1 + arg2

  // 欧拉公式: e^(iθ) = cos(θ) + i*sin(θ)
  const thetaRad = (params.eulerTheta * Math.PI) / 180
  const eulerPoint = { re: Math.cos(thetaRad), im: Math.sin(thetaRad) }

  // 单位圆
  const circleTheta = Array.from({ length: 100 }, (_, i) => (i / 99) * 2 * Math.PI)
  const circleX = circleTheta.map(Math.cos)
  const circleY = circleTheta.map(Math.sin)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">复数与复平面</h1>
        <p className="text-gray-600">探索复数的几何意义与欧拉公式</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 复数运算可视化 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">复数运算</h3>
            <Plot
              data={[
                // 坐标轴
                { x: [-3, 3], y: [0, 0], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#cbd5e1', width: 1 } },
                { x: [0, 0], y: [-3, 3], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#cbd5e1', width: 1 } },
                // z1 向量
                { x: [0, z1.re], y: [0, z1.im], type: 'scatter', mode: 'lines+markers', name: 'z₁', line: { color: '#3b82f6', width: 3 }, marker: { size: 10 } },
                // z2 向量
                { x: [0, z2.re], y: [0, z2.im], type: 'scatter', mode: 'lines+markers', name: 'z₂', line: { color: '#22c55e', width: 3 }, marker: { size: 10 } },
                // 加法结果 (平行四边形)
                { x: [z1.re, zSum.re], y: [z1.im, zSum.im], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#22c55e', width: 1, dash: 'dash' } },
                { x: [z2.re, zSum.re], y: [z2.im, zSum.im], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#3b82f6', width: 1, dash: 'dash' } },
                { x: [0, zSum.re], y: [0, zSum.im], type: 'scatter', mode: 'lines+markers', name: 'z₁+z₂', line: { color: '#f59e0b', width: 3 }, marker: { size: 10 } },
                // 乘法结果
                { x: [0, zProduct.re], y: [0, zProduct.im], type: 'scatter', mode: 'lines+markers', name: 'z₁×z₂', line: { color: '#ef4444', width: 3 }, marker: { size: 10 } },
              ]}
              layout={{
                autosize: true,
                height: 350,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'Re', range: [-3, 3], scaleanchor: 'y', scaleratio: 1 },
                yaxis: { title: 'Im', range: [-3, 3] },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          {/* 欧拉公式可视化 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">欧拉公式: e^(iθ) = cos(θ) + i·sin(θ)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Plot
                data={[
                  // 单位圆
                  { x: circleX, y: circleY, type: 'scatter', mode: 'lines', name: '单位圆', line: { color: '#94a3b8', width: 2 } },
                  // 坐标轴
                  { x: [-1.5, 1.5], y: [0, 0], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#cbd5e1', width: 1 } },
                  { x: [0, 0], y: [-1.5, 1.5], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#cbd5e1', width: 1 } },
                  // e^(iθ) 点
                  { x: [0, eulerPoint.re], y: [0, eulerPoint.im], type: 'scatter', mode: 'lines', name: 'e^(iθ)', line: { color: '#8b5cf6', width: 3 } },
                  { x: [eulerPoint.re], y: [eulerPoint.im], type: 'scatter', mode: 'markers', showlegend: false, marker: { color: '#8b5cf6', size: 12 } },
                  // cos(θ) 投影
                  { x: [eulerPoint.re, eulerPoint.re], y: [0, eulerPoint.im], type: 'scatter', mode: 'lines', name: 'sin(θ)', line: { color: '#ef4444', width: 2, dash: 'dash' } },
                  { x: [0, eulerPoint.re], y: [0, 0], type: 'scatter', mode: 'lines', name: 'cos(θ)', line: { color: '#22c55e', width: 2, dash: 'dash' } },
                ]}
                layout={{
                  autosize: true,
                  height: 280,
                  margin: { t: 20, r: 20, b: 20, l: 20 },
                  xaxis: { range: [-1.5, 1.5], scaleanchor: 'y', scaleratio: 1, showgrid: false },
                  yaxis: { range: [-1.5, 1.5], showgrid: false },
                  showlegend: false,
                }}
                config={{ responsive: true, displayModeBar: false }}
                className="w-full"
              />
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 mb-1">θ = {params.eulerTheta}°</div>
                  <MathFormula formula={`e^{i \\cdot ${params.eulerTheta}°} = ${eulerPoint.re.toFixed(3)} + ${eulerPoint.im.toFixed(3)}i`} displayMode={false} />
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">cos({params.eulerTheta}°) = {eulerPoint.re.toFixed(4)}</span>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600">sin({params.eulerTheta}°) = {eulerPoint.im.toFixed(4)}</span>
                </div>
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isAnimating ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  {isAnimating ? '停止旋转' : '开始旋转'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 复数 z1 参数 */}
          <ParameterPanel
            title="复数 z₁"
            params={[
              { key: 'real1', label: '实部 (Re)', value: params.real1, min: -2, max: 2, step: 0.1 },
              { key: 'imag1', label: '虚部 (Im)', value: params.imag1, min: -2, max: 2, step: 0.1 },
            ]}
            onChange={handleParamChange}
          />

          {/* 复数 z2 参数 */}
          <ParameterPanel
            title="复数 z₂"
            params={[
              { key: 'real2', label: '实部 (Re)', value: params.real2, min: -2, max: 2, step: 0.1 },
              { key: 'imag2', label: '虚部 (Im)', value: params.imag2, min: -2, max: 2, step: 0.1 },
            ]}
            onChange={handleParamChange}
          />

          {/* 欧拉角度 */}
          <ParameterPanel
            title="欧拉公式"
            params={[
              { key: 'eulerTheta', label: '角度 θ', value: params.eulerTheta, min: 0, max: 360, step: 5, unit: '°' },
            ]}
            onChange={handleParamChange}
          />

          {/* 计算结果 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">运算结果</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 rounded">
                <span className="text-blue-700">z₁ = {z1.re.toFixed(2)} + {z1.im.toFixed(2)}i</span>
                <div className="text-xs text-blue-500">|z₁| = {mod1.toFixed(2)}, arg = {arg1.toFixed(1)}°</div>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <span className="text-green-700">z₂ = {z2.re.toFixed(2)} + {z2.im.toFixed(2)}i</span>
                <div className="text-xs text-green-500">|z₂| = {mod2.toFixed(2)}, arg = {arg2.toFixed(1)}°</div>
              </div>
              <div className="p-2 bg-amber-50 rounded">
                <span className="text-amber-700">z₁+z₂ = {zSum.re.toFixed(2)} + {zSum.im.toFixed(2)}i</span>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <span className="text-red-700">z₁×z₂ = {zProduct.re.toFixed(2)} + {zProduct.im.toFixed(2)}i</span>
                <div className="text-xs text-red-500">|z₁×z₂| = {modProduct.toFixed(2)}, arg = {argProduct.toFixed(1)}°</div>
              </div>
            </div>
          </div>

          {/* 公式 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">核心公式</h3>
            <div className="space-y-3">
              <MathFormula formula="e^{i\theta} = \cos\theta + i\sin\theta" />
              <MathFormula formula="z = r(\cos\theta + i\sin\theta) = re^{i\theta}" />
              <MathFormula formula="|z_1 \cdot z_2| = |z_1| \cdot |z_2|" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
