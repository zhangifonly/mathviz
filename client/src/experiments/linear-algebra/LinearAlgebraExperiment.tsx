import { useState, useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'

type TransformType = 'rotation' | 'scale' | 'shear' | 'custom'

export default function LinearAlgebraExperiment() {
  const [params, setParams] = useState({
    rotationAngle: 45,
    scaleX: 1.5,
    scaleY: 1.5,
    shearX: 0.5,
    shearY: 0,
    a11: 1,
    a12: 0,
    a21: 0,
    a22: 1,
  })
  const [transformType, setTransformType] = useState<TransformType>('rotation')
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)

  // 动画效果：旋转动画
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setParams((prev) => {
        const nextAngle = (prev.rotationAngle + 2) % 360
        return { ...prev, rotationAngle: nextAngle }
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

  const { originalShape, transformedShape, matrix, eigenInfo } = useMemo(() => {
    const square = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
    ]

    let m: [[number, number], [number, number]]
    const angle = (params.rotationAngle * Math.PI) / 180

    switch (transformType) {
      case 'rotation':
        m = [
          [Math.cos(angle), -Math.sin(angle)],
          [Math.sin(angle), Math.cos(angle)],
        ]
        break
      case 'scale':
        m = [
          [params.scaleX, 0],
          [0, params.scaleY],
        ]
        break
      case 'shear':
        m = [
          [1, params.shearX],
          [params.shearY, 1],
        ]
        break
      case 'custom':
        m = [
          [params.a11, params.a12],
          [params.a21, params.a22],
        ]
        break
    }

    const transformed = square.map((p) => ({
      x: m[0][0] * p.x + m[0][1] * p.y,
      y: m[1][0] * p.x + m[1][1] * p.y,
    }))

    const trace = m[0][0] + m[1][1]
    const det = m[0][0] * m[1][1] - m[0][1] * m[1][0]
    const discriminant = trace * trace - 4 * det

    let eigenvalues: string[] = []
    let eigenvectors: Array<{ x: number; y: number }> = []

    if (discriminant >= 0) {
      const lambda1 = (trace + Math.sqrt(discriminant)) / 2
      const lambda2 = (trace - Math.sqrt(discriminant)) / 2
      eigenvalues = [lambda1.toFixed(3), lambda2.toFixed(3)]

      if (Math.abs(m[0][1]) > 0.001) {
        eigenvectors = [
          { x: lambda1 - m[1][1], y: m[1][0] },
          { x: lambda2 - m[1][1], y: m[1][0] },
        ]
      } else if (Math.abs(m[1][0]) > 0.001) {
        eigenvectors = [
          { x: m[0][1], y: lambda1 - m[0][0] },
          { x: m[0][1], y: lambda2 - m[0][0] },
        ]
      } else {
        eigenvectors = [
          { x: 1, y: 0 },
          { x: 0, y: 1 },
        ]
      }

      eigenvectors = eigenvectors.map((v) => {
        const norm = Math.sqrt(v.x * v.x + v.y * v.y) || 1
        return { x: v.x / norm, y: v.y / norm }
      })
    } else {
      const realPart = trace / 2
      const imagPart = Math.sqrt(-discriminant) / 2
      eigenvalues = [`${realPart.toFixed(2)} + ${imagPart.toFixed(2)}i`, `${realPart.toFixed(2)} - ${imagPart.toFixed(2)}i`]
    }

    return {
      originalShape: square,
      transformedShape: transformed,
      matrix: m,
      eigenInfo: { values: eigenvalues, vectors: eigenvectors, determinant: det },
    }
  }, [params, transformType])

  const matrixFormula = `A = \\begin{pmatrix} ${matrix[0][0].toFixed(2)} & ${matrix[0][1].toFixed(2)} \\\\ ${matrix[1][0].toFixed(2)} & ${matrix[1][1].toFixed(2)} \\end{pmatrix}`

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">线性代数</h1>
        <p className="text-gray-600">可视化矩阵变换与特征值</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">矩阵变换</h3>
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setTransformType('rotation')
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
                { x: [-3, 3], y: [0, 0], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#cbd5e1', width: 1 } },
                { x: [0, 0], y: [-3, 3], type: 'scatter', mode: 'lines', showlegend: false, line: { color: '#cbd5e1', width: 1 } },
                {
                  x: originalShape.map((p) => p.x),
                  y: originalShape.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  name: '原始形状',
                  fill: 'toself',
                  fillcolor: 'rgba(59, 130, 246, 0.2)',
                  line: { color: '#3b82f6', width: 2 },
                },
                {
                  x: transformedShape.map((p) => p.x),
                  y: transformedShape.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  name: '变换后',
                  fill: 'toself',
                  fillcolor: 'rgba(239, 68, 68, 0.2)',
                  line: { color: '#ef4444', width: 2 },
                },
                ...eigenInfo.vectors.map((v, i) => ({
                  x: [0, v.x * 1.5],
                  y: [0, v.y * 1.5],
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  name: `特征向量 ${i + 1}`,
                  line: { color: i === 0 ? '#22c55e' : '#a855f7', width: 3 },
                })),
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { range: [-3, 3], scaleanchor: 'y', scaleratio: 1 },
                yaxis: { range: [-3, 3] },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">变换矩阵</h3>
              <MathFormula formula={matrixFormula} className="text-center" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">特征信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">行列式:</span>
                  <span className="font-mono font-bold">{eigenInfo.determinant.toFixed(3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">特征值 1:</span>
                  <span className="font-mono font-bold text-green-600">{eigenInfo.values[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">特征值 2:</span>
                  <span className="font-mono font-bold text-purple-600">{eigenInfo.values[1]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">变换类型</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['rotation', 'scale', 'shear', 'custom'] as TransformType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTransformType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    transformType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'rotation' && '旋转'}
                  {type === 'scale' && '缩放'}
                  {type === 'shear' && '剪切'}
                  {type === 'custom' && '自定义'}
                </button>
              ))}
            </div>
          </div>

          {transformType === 'rotation' && (
            <ParameterPanel
              title="旋转参数"
              params={[{ key: 'rotationAngle', label: '旋转角度', value: params.rotationAngle, min: 0, max: 360, step: 5, unit: '°' }]}
              onChange={handleParamChange}
            />
          )}

          {transformType === 'scale' && (
            <ParameterPanel
              title="缩放参数"
              params={[
                { key: 'scaleX', label: 'X缩放', value: params.scaleX, min: 0.1, max: 3, step: 0.1 },
                { key: 'scaleY', label: 'Y缩放', value: params.scaleY, min: 0.1, max: 3, step: 0.1 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {transformType === 'shear' && (
            <ParameterPanel
              title="剪切参数"
              params={[
                { key: 'shearX', label: 'X剪切', value: params.shearX, min: -2, max: 2, step: 0.1 },
                { key: 'shearY', label: 'Y剪切', value: params.shearY, min: -2, max: 2, step: 0.1 },
              ]}
              onChange={handleParamChange}
            />
          )}

          {transformType === 'custom' && (
            <ParameterPanel
              title="自定义矩阵"
              params={[
                { key: 'a11', label: 'a₁₁', value: params.a11, min: -3, max: 3, step: 0.1 },
                { key: 'a12', label: 'a₁₂', value: params.a12, min: -3, max: 3, step: 0.1 },
                { key: 'a21', label: 'a₂₁', value: params.a21, min: -3, max: 3, step: 0.1 },
                { key: 'a22', label: 'a₂₂', value: params.a22, min: -3, max: 3, step: 0.1 },
              ]}
              onChange={handleParamChange}
            />
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">核心公式</h3>
            <div className="space-y-3">
              <MathFormula formula="A\vec{v} = \lambda\vec{v}" />
              <MathFormula formula="\det(A - \lambda I) = 0" />
              <MathFormula formula="\det(A) = \lambda_1 \cdot \lambda_2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
