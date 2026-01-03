import { useState, useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'

type DecompositionType = 'svd' | 'eigen' | 'lu' | 'qr'

export default function MatrixDecompositionExperiment() {
  const [decomposition, setDecomposition] = useState<DecompositionType>('svd')
  const [matrix, setMatrix] = useState([[3, 1], [1, 3]])
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationAngle, setAnimationAngle] = useState(0)
  const animationRef = useRef<number | null>(null)

  // 动画效果：旋转矩阵变换
  useEffect(() => {
    if (!isAnimating) return

    const animate = () => {
      setAnimationAngle((prev) => (prev + 0.02) % (2 * Math.PI))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  // 动画时使用旋转矩阵
  const animatedMatrix = useMemo(() => {
    if (!isAnimating) return matrix
    const cos = Math.cos(animationAngle)
    const sin = Math.sin(animationAngle)
    return [
      [2 * cos + 1, -2 * sin],
      [2 * sin, 2 * cos + 1],
    ]
  }, [isAnimating, animationAngle, matrix])

  // 2x2 矩阵特征值分解
  const eigenDecomp = useMemo(() => {
    const [[a, b], [c, d]] = isAnimating ? animatedMatrix : matrix
    const trace = a + d
    const det = a * d - b * c
    const discriminant = trace * trace - 4 * det

    if (discriminant < 0) {
      return { eigenvalues: [], eigenvectors: [], valid: false }
    }

    const lambda1 = (trace + Math.sqrt(discriminant)) / 2
    const lambda2 = (trace - Math.sqrt(discriminant)) / 2

    // 特征向量
    const getEigenvector = (lambda: number) => {
      if (Math.abs(b) > 1e-10) {
        const v = [b, lambda - a]
        const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1])
        return [v[0] / norm, v[1] / norm]
      } else if (Math.abs(c) > 1e-10) {
        const v = [lambda - d, c]
        const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1])
        return [v[0] / norm, v[1] / norm]
      }
      return lambda === a ? [1, 0] : [0, 1]
    }

    return {
      eigenvalues: [lambda1, lambda2],
      eigenvectors: [getEigenvector(lambda1), getEigenvector(lambda2)],
      valid: true,
    }
  }, [isAnimating, animatedMatrix, matrix])

  // SVD 分解 (简化的2x2)
  const svdDecomp = useMemo(() => {
    const [[a, b], [c, d]] = isAnimating ? animatedMatrix : matrix

    // A^T * A
    const ata = [
      [a * a + c * c, a * b + c * d],
      [a * b + c * d, b * b + d * d],
    ]

    // 特征值
    const trace = ata[0][0] + ata[1][1]
    const det = ata[0][0] * ata[1][1] - ata[0][1] * ata[1][0]
    const discriminant = Math.max(0, trace * trace - 4 * det)

    const sigma1Sq = (trace + Math.sqrt(discriminant)) / 2
    const sigma2Sq = (trace - Math.sqrt(discriminant)) / 2

    const sigma1 = Math.sqrt(Math.max(0, sigma1Sq))
    const sigma2 = Math.sqrt(Math.max(0, sigma2Sq))

    return {
      singularValues: [sigma1, sigma2],
      valid: true,
    }
  }, [isAnimating, animatedMatrix, matrix])

  // LU 分解
  const luDecomp = useMemo(() => {
    const [[a, b], [c, d]] = isAnimating ? animatedMatrix : matrix

    if (Math.abs(a) < 1e-10) {
      return { L: [[1, 0], [0, 1]], U: matrix, valid: false }
    }

    const l21 = c / a
    const u11 = a
    const u12 = b
    const u22 = d - l21 * b

    return {
      L: [[1, 0], [l21, 1]],
      U: [[u11, u12], [0, u22]],
      valid: true,
    }
  }, [isAnimating, animatedMatrix, matrix])

  // QR 分解 (Gram-Schmidt)
  const qrDecomp = useMemo(() => {
    const [[a, b], [c, d]] = isAnimating ? animatedMatrix : matrix

    // 第一列
    const norm1 = Math.sqrt(a * a + c * c)
    if (norm1 < 1e-10) {
      return { Q: [[1, 0], [0, 1]], R: matrix, valid: false }
    }

    const q1 = [a / norm1, c / norm1]

    // 第二列正交化
    const proj = q1[0] * b + q1[1] * d
    const v2 = [b - proj * q1[0], d - proj * q1[1]]
    const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1])

    const q2 = norm2 > 1e-10 ? [v2[0] / norm2, v2[1] / norm2] : [0, 0]

    return {
      Q: [[q1[0], q2[0]], [q1[1], q2[1]]],
      R: [[norm1, proj], [0, norm2]],
      valid: true,
    }
  }, [isAnimating, animatedMatrix, matrix])

  // 可视化变换
  const transformedPoints = useMemo(() => {
    const points: { x: number; y: number }[] = []
    const transformed: { x: number; y: number }[] = []
    const currentMatrix = isAnimating ? animatedMatrix : matrix

    // 单位圆上的点
    for (let i = 0; i <= 50; i++) {
      const theta = (i / 50) * 2 * Math.PI
      const x = Math.cos(theta)
      const y = Math.sin(theta)
      points.push({ x, y })

      // 应用矩阵变换
      const tx = currentMatrix[0][0] * x + currentMatrix[0][1] * y
      const ty = currentMatrix[1][0] * x + currentMatrix[1][1] * y
      transformed.push({ x: tx, y: ty })
    }

    return { original: points, transformed }
  }, [isAnimating, animatedMatrix, matrix])

  const updateMatrix = (i: number, j: number, value: string) => {
    const newMatrix = matrix.map((row) => [...row])
    newMatrix[i][j] = parseFloat(value) || 0
    setMatrix(newMatrix)
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">矩阵分解</h1>
        <p className="text-gray-600">可视化 SVD、特征值分解、LU 和 QR 分解</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">矩阵变换可视化</h3>
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
                {
                  x: transformedPoints.original.map((p) => p.x),
                  y: transformedPoints.original.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#94a3b8', width: 2 },
                  name: '单位圆',
                },
                {
                  x: transformedPoints.transformed.map((p) => p.x),
                  y: transformedPoints.transformed.map((p) => p.y),
                  type: 'scatter',
                  mode: 'lines',
                  line: { color: '#8b5cf6', width: 2 },
                  name: '变换后',
                },
                ...(eigenDecomp.valid
                  ? eigenDecomp.eigenvectors.map((v, i) => ({
                      x: [0, v[0] * Math.abs(eigenDecomp.eigenvalues[i])],
                      y: [0, v[1] * Math.abs(eigenDecomp.eigenvalues[i])],
                      type: 'scatter' as const,
                      mode: 'lines+markers' as const,
                      line: { color: i === 0 ? '#ef4444' : '#22c55e', width: 3 },
                      marker: { size: 8 },
                      name: `特征向量 ${i + 1}`,
                    }))
                  : []),
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: 'x', range: [-5, 5], scaleanchor: 'y', scaleratio: 1 },
                yaxis: { title: 'y', range: [-5, 5] },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decomposition === 'svd' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">SVD 分解</h3>
                <div className="p-3 bg-purple-50 rounded-lg mb-3">
                  <MathFormula formula="A = U \Sigma V^T" />
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-blue-50 rounded">
                    <span className="text-blue-600">奇异值:</span>
                    <div className="font-mono">
                      σ₁ = {svdDecomp.singularValues[0].toFixed(4)}<br />
                      σ₂ = {svdDecomp.singularValues[1].toFixed(4)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    奇异值表示矩阵在各主方向上的拉伸程度。
                  </p>
                </div>
              </div>
            )}

            {decomposition === 'eigen' && eigenDecomp.valid && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">特征值分解</h3>
                <div className="p-3 bg-purple-50 rounded-lg mb-3">
                  <MathFormula formula="A = P D P^{-1}" />
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-red-50 rounded">
                    <span className="text-red-600">特征值:</span>
                    <div className="font-mono">
                      λ₁ = {eigenDecomp.eigenvalues[0].toFixed(4)}<br />
                      λ₂ = {eigenDecomp.eigenvalues[1].toFixed(4)}
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <span className="text-green-600">特征向量:</span>
                    <div className="font-mono text-sm">
                      v₁ = [{eigenDecomp.eigenvectors[0].map((x) => x.toFixed(3)).join(', ')}]<br />
                      v₂ = [{eigenDecomp.eigenvectors[1].map((x) => x.toFixed(3)).join(', ')}]
                    </div>
                  </div>
                </div>
              </div>
            )}

            {decomposition === 'lu' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">LU 分解</h3>
                <div className="p-3 bg-purple-50 rounded-lg mb-3">
                  <MathFormula formula="A = LU" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-blue-50 rounded">
                    <span className="text-blue-600 text-sm">L (下三角):</span>
                    <div className="font-mono text-sm">
                      [{luDecomp.L[0].map((x) => x.toFixed(2)).join(', ')}]<br />
                      [{luDecomp.L[1].map((x) => x.toFixed(2)).join(', ')}]
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <span className="text-green-600 text-sm">U (上三角):</span>
                    <div className="font-mono text-sm">
                      [{luDecomp.U[0].map((x) => x.toFixed(2)).join(', ')}]<br />
                      [{luDecomp.U[1].map((x) => x.toFixed(2)).join(', ')}]
                    </div>
                  </div>
                </div>
              </div>
            )}

            {decomposition === 'qr' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-2">QR 分解</h3>
                <div className="p-3 bg-purple-50 rounded-lg mb-3">
                  <MathFormula formula="A = QR" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-blue-50 rounded">
                    <span className="text-blue-600 text-sm">Q (正交):</span>
                    <div className="font-mono text-sm">
                      [{qrDecomp.Q[0].map((x) => x.toFixed(3)).join(', ')}]<br />
                      [{qrDecomp.Q[1].map((x) => x.toFixed(3)).join(', ')}]
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <span className="text-green-600 text-sm">R (上三角):</span>
                    <div className="font-mono text-sm">
                      [{qrDecomp.R[0].map((x) => x.toFixed(3)).join(', ')}]<br />
                      [{qrDecomp.R[1].map((x) => x.toFixed(3)).join(', ')}]
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">矩阵性质</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-50 rounded flex justify-between">
                  <span>行列式 det(A)</span>
                  <span className="font-mono">
                    {(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(4)}
                  </span>
                </div>
                <div className="p-2 bg-gray-50 rounded flex justify-between">
                  <span>迹 tr(A)</span>
                  <span className="font-mono">{(matrix[0][0] + matrix[1][1]).toFixed(4)}</span>
                </div>
                <div className="p-2 bg-gray-50 rounded flex justify-between">
                  <span>条件数</span>
                  <span className="font-mono">
                    {svdDecomp.singularValues[1] > 1e-10
                      ? (svdDecomp.singularValues[0] / svdDecomp.singularValues[1]).toFixed(2)
                      : '∞'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">输入矩阵 A</h3>
            <div className="grid grid-cols-2 gap-2">
              {matrix.map((row, i) =>
                row.map((val, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    step="0.5"
                    value={val}
                    onChange={(e) => updateMatrix(i, j, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-center font-mono"
                  />
                ))
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setMatrix([[2, 1], [1, 2]])}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
              >
                对称
              </button>
              <button
                onClick={() => setMatrix([[0, -1], [1, 0]])}
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
              >
                旋转
              </button>
              <button
                onClick={() => setMatrix([[2, 0], [0, 1]])}
                className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
              >
                缩放
              </button>
              <button
                onClick={() => setMatrix([[1, 1], [0, 1]])}
                className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded"
              >
                剪切
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">选择分解</h3>
            <div className="space-y-2">
              {[
                { type: 'svd' as const, name: 'SVD 奇异值分解' },
                { type: 'eigen' as const, name: '特征值分解' },
                { type: 'lu' as const, name: 'LU 分解' },
                { type: 'qr' as const, name: 'QR 分解' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setDecomposition(item.type)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    decomposition === item.type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">分解用途</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>SVD</strong>: 降维、推荐系统</li>
              <li>• <strong>特征值</strong>: 稳定性分析</li>
              <li>• <strong>LU</strong>: 解线性方程组</li>
              <li>• <strong>QR</strong>: 最小二乘问题</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">几何解释</h3>
            <p className="text-sm text-gray-600">
              灰色圆是单位圆，紫色椭圆是变换后的形状。
              红色和绿色箭头是特征向量方向，长度为特征值。
              SVD 的奇异值是椭圆的半轴长度。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
