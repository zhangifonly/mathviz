import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pcaNarration } from '../../narrations/scripts/pca'

type DatasetType = 'random' | 'correlated' | 'clusters' | 'custom'

export default function PCAExperiment() {
  const [showPresenter, setShowPresenter] = useState(false)
  const narration = useNarrationOptional()

  const [dataset, setDataset] = useState<DatasetType>('correlated')
  const [numPoints, setNumPoints] = useState(100)
  const [correlation, setCorrelation] = useState(0.8)
  const [showProjection, setShowProjection] = useState(true)
  const [pcToShow, setPcToShow] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedCorrelation, setAnimatedCorrelation] = useState(-1)
  const animationRef = useRef<number | null>(null)

  // 讲解系统
  useEffect(() => {
    if (narration) {
      narration.loadScript(pcaNarration)
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

  // 动画效果：相关系数从-1到1变化
  useEffect(() => {
    if (!isAnimating || dataset !== 'correlated') return

    const animate = () => {
      setAnimatedCorrelation((prev) => {
        const newVal = prev + 0.02
        if (newVal > 1) {
          return -1
        }
        return newVal
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating, dataset])

  const currentCorrelation = isAnimating && dataset === 'correlated' ? animatedCorrelation : correlation

  // 生成数据
  const data = useMemo(() => {
    const points: { x: number; y: number }[] = []

    switch (dataset) {
      case 'random':
        for (let i = 0; i < numPoints; i++) {
          points.push({
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4,
          })
        }
        break

      case 'correlated':
        for (let i = 0; i < numPoints; i++) {
          const x = (Math.random() - 0.5) * 4
          const noise = (Math.random() - 0.5) * 2 * (1 - Math.abs(currentCorrelation))
          const y = currentCorrelation * x + noise
          points.push({ x, y })
        }
        break

      case 'clusters':
        const centers = [
          { x: -1.5, y: -1 },
          { x: 1.5, y: 1 },
          { x: 0, y: 2 },
        ]
        for (let i = 0; i < numPoints; i++) {
          const center = centers[i % 3]
          points.push({
            x: center.x + (Math.random() - 0.5) * 1.5,
            y: center.y + (Math.random() - 0.5) * 1.5,
          })
        }
        break

      case 'custom':
        // 椭圆形数据
        for (let i = 0; i < numPoints; i++) {
          const angle = Math.random() * 2 * Math.PI
          const rx = 2, ry = 0.5
          const rotAngle = Math.PI / 4
          const x0 = rx * Math.cos(angle) + (Math.random() - 0.5) * 0.3
          const y0 = ry * Math.sin(angle) + (Math.random() - 0.5) * 0.3
          points.push({
            x: x0 * Math.cos(rotAngle) - y0 * Math.sin(rotAngle),
            y: x0 * Math.sin(rotAngle) + y0 * Math.cos(rotAngle),
          })
        }
        break
    }

    return points
  }, [dataset, numPoints, currentCorrelation])

  // PCA 计算
  const pcaResult = useMemo(() => {
    const n = data.length
    if (n < 2) return null

    // 计算均值
    const meanX = data.reduce((s, p) => s + p.x, 0) / n
    const meanY = data.reduce((s, p) => s + p.y, 0) / n

    // 中心化数据
    const centered = data.map((p) => ({ x: p.x - meanX, y: p.y - meanY }))

    // 计算协方差矩阵
    let cxx = 0, cyy = 0, cxy = 0
    for (const p of centered) {
      cxx += p.x * p.x
      cyy += p.y * p.y
      cxy += p.x * p.y
    }
    cxx /= n - 1
    cyy /= n - 1
    cxy /= n - 1

    const covMatrix = [[cxx, cxy], [cxy, cyy]]

    // 计算特征值和特征向量 (2x2 矩阵的解析解)
    const trace = cxx + cyy
    const det = cxx * cyy - cxy * cxy
    const discriminant = Math.sqrt(trace * trace - 4 * det)

    const lambda1 = (trace + discriminant) / 2
    const lambda2 = (trace - discriminant) / 2

    // 特征向量
    let v1: [number, number], v2: [number, number]

    if (Math.abs(cxy) > 1e-10) {
      v1 = [lambda1 - cyy, cxy]
      v2 = [lambda2 - cyy, cxy]
    } else {
      v1 = cxx >= cyy ? [1, 0] : [0, 1]
      v2 = cxx >= cyy ? [0, 1] : [1, 0]
    }

    // 归一化
    const norm1 = Math.sqrt(v1[0] * v1[0] + v1[1] * v1[1])
    const norm2 = Math.sqrt(v2[0] * v2[0] + v2[1] * v2[1])
    v1 = [v1[0] / norm1, v1[1] / norm1]
    v2 = [v2[0] / norm2, v2[1] / norm2]

    // 投影到主成分
    const projections = centered.map((p) => ({
      pc1: p.x * v1[0] + p.y * v1[1],
      pc2: p.x * v2[0] + p.y * v2[1],
    }))

    // 方差解释比例
    const totalVar = lambda1 + lambda2
    const explainedVar1 = lambda1 / totalVar
    const explainedVar2 = lambda2 / totalVar

    return {
      mean: { x: meanX, y: meanY },
      centered,
      covMatrix,
      eigenvalues: [lambda1, lambda2],
      eigenvectors: [v1, v2],
      projections,
      explainedVariance: [explainedVar1, explainedVar2],
    }
  }, [data])

  // 重建数据
  const reconstructed = useMemo(() => {
    if (!pcaResult) return []

    const { mean, projections, eigenvectors } = pcaResult
    const v = eigenvectors[pcToShow - 1]

    return projections.map((p) => {
      const proj = pcToShow === 1 ? p.pc1 : p.pc2
      return {
        x: mean.x + proj * v[0],
        y: mean.y + proj * v[1],
      }
    })
  }, [pcaResult, pcToShow])

  if (!pcaResult) return <div>数据不足</div>

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">主成分分析 (PCA)</h1>
            <p className="text-gray-600">可视化数据降维和特征提取</p>
          </div>
          <div className="flex gap-2">
            {dataset === 'correlated' && (
              <button
                onClick={() => {
                  if (!isAnimating) {
                    setAnimatedCorrelation(-1)
                  }
                  setIsAnimating(!isAnimating)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isAnimating ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}
              >
                {isAnimating ? '停止' : '播放动画'}
              </button>
            )}
            <button
              onClick={handleStartNarration}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
            >
              开始讲解
            </button>
          </div>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">数据与主成分</h3>
            <Plot
              data={[
                {
                  x: data.map((p) => p.x),
                  y: data.map((p) => p.y),
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { size: 6, color: '#3b82f6', opacity: 0.6 },
                  name: '原始数据',
                } as const,
                // PC1 向量
                {
                  x: [pcaResult.mean.x, pcaResult.mean.x + pcaResult.eigenvectors[0][0] * Math.sqrt(pcaResult.eigenvalues[0]) * 2],
                  y: [pcaResult.mean.y, pcaResult.mean.y + pcaResult.eigenvectors[0][1] * Math.sqrt(pcaResult.eigenvalues[0]) * 2],
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#ef4444', width: 3 },
                  name: 'PC1',
                } as const,
                // PC2 向量
                {
                  x: [pcaResult.mean.x, pcaResult.mean.x + pcaResult.eigenvectors[1][0] * Math.sqrt(pcaResult.eigenvalues[1]) * 2],
                  y: [pcaResult.mean.y, pcaResult.mean.y + pcaResult.eigenvectors[1][1] * Math.sqrt(pcaResult.eigenvalues[1]) * 2],
                  type: 'scatter' as const,
                  mode: 'lines' as const,
                  line: { color: '#22c55e', width: 3 },
                  name: 'PC2',
                } as const,
                // 投影点
                ...(showProjection
                  ? [{
                      x: reconstructed.map((p) => p.x),
                      y: reconstructed.map((p) => p.y),
                      type: 'scatter' as const,
                      mode: 'markers' as const,
                      marker: { size: 6, color: '#f59e0b', opacity: 0.6 },
                      name: `PC${pcToShow}投影`,
                    } as const]
                  : []),
                // 均值点
                {
                  x: [pcaResult.mean.x],
                  y: [pcaResult.mean.y],
                  type: 'scatter' as const,
                  mode: 'markers' as const,
                  marker: { size: 12, color: '#8b5cf6', symbol: 'x' },
                  name: '均值',
                } as const,
              ]}
              layout={{
                autosize: true,
                height: 400,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: 'X' }, scaleanchor: 'y', scaleratio: 1 },
                yaxis: { title: { text: 'Y' } },
                legend: { orientation: 'h', y: -0.15 },
              }}
              config={{ responsive: true }}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">主成分空间</h3>
              <Plot
                data={[
                  {
                    x: pcaResult.projections.map((p) => p.pc1),
                    y: pcaResult.projections.map((p) => p.pc2),
                    type: 'scatter' as const,
                    mode: 'markers' as const,
                    marker: { size: 6, color: '#8b5cf6', opacity: 0.6 },
                  } as const,
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  xaxis: { title: { text: 'PC1' } },
                  yaxis: { title: { text: 'PC2' } },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">方差解释比例</h3>
              <Plot
                data={[
                  {
                    x: ['PC1', 'PC2'],
                    y: pcaResult.explainedVariance.map((v) => v * 100),
                    type: 'bar' as const,
                    marker: { color: ['#ef4444', '#22c55e'] },
                  } as const,
                ]}
                layout={{
                  autosize: true,
                  height: 250,
                  margin: { t: 30, r: 30, b: 40, l: 50 },
                  yaxis: { title: { text: '方差解释 (%)' }, range: [0, 100] },
                }}
                config={{ responsive: true }}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">协方差矩阵</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">协方差矩阵 Σ</h4>
                <table className="w-full text-sm border">
                  <tbody>
                    {pcaResult.covMatrix.map((row, i) => (
                      <tr key={i}>
                        {row.map((val, j) => (
                          <td key={j} className="border px-3 py-2 text-center font-mono">
                            {val.toFixed(4)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">特征值 & 特征向量</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-red-50 rounded">
                    <div>λ₁ = {pcaResult.eigenvalues[0].toFixed(4)}</div>
                    <div className="font-mono">
                      v₁ = [{pcaResult.eigenvectors[0][0].toFixed(3)}, {pcaResult.eigenvectors[0][1].toFixed(3)}]
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <div>λ₂ = {pcaResult.eigenvalues[1].toFixed(4)}</div>
                    <div className="font-mono">
                      v₂ = [{pcaResult.eigenvectors[1][0].toFixed(3)}, {pcaResult.eigenvectors[1][1].toFixed(3)}]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">数据集</h3>
            <div className="space-y-2">
              {[
                { type: 'random' as const, name: '随机分布' },
                { type: 'correlated' as const, name: '相关数据' },
                { type: 'clusters' as const, name: '聚类数据' },
                { type: 'custom' as const, name: '椭圆分布' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setDataset(item.type)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    dataset === item.type
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
            <h3 className="text-lg font-semibold mb-3">参数设置</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">数据点数: {numPoints}</label>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={numPoints}
                  onChange={(e) => setNumPoints(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              {dataset === 'correlated' && (
                <div>
                  <label className="text-sm text-gray-600">相关系数: {correlation.toFixed(2)}</label>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={correlation}
                    onChange={(e) => setCorrelation(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">投影显示</h3>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={showProjection}
                onChange={(e) => setShowProjection(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">显示投影点</span>
            </label>
            {showProjection && (
              <div className="flex gap-2">
                <button
                  onClick={() => setPcToShow(1)}
                  className={`flex-1 px-3 py-1 rounded text-sm ${
                    pcToShow === 1 ? 'bg-red-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  PC1
                </button>
                <button
                  onClick={() => setPcToShow(2)}
                  className={`flex-1 px-3 py-1 rounded text-sm ${
                    pcToShow === 2 ? 'bg-green-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  PC2
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">统计信息</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 bg-blue-50 rounded flex justify-between">
                <span>数据点数</span>
                <span className="font-mono">{data.length}</span>
              </div>
              <div className="p-2 bg-purple-50 rounded flex justify-between">
                <span>PC1 方差解释</span>
                <span className="font-mono">{(pcaResult.explainedVariance[0] * 100).toFixed(1)}%</span>
              </div>
              <div className="p-2 bg-green-50 rounded flex justify-between">
                <span>PC2 方差解释</span>
                <span className="font-mono">{(pcaResult.explainedVariance[1] * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">PCA 原理</h3>
            <div className="p-3 bg-purple-50 rounded-lg text-sm">
              <MathFormula formula="\Sigma v = \lambda v" />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              PCA 找到数据协方差矩阵的特征向量，作为新的正交基。
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
