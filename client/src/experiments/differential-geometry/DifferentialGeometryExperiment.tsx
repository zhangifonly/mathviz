import { useState, useMemo, useEffect, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { differentialGeometryNarration } from '../../narrations/scripts/differential-geometry'

type CurveType = 'helix' | 'torus-knot' | 'viviani' | 'lissajous'
type SurfaceType = 'sphere' | 'torus' | 'saddle' | 'mobius' | 'klein'

export default function DifferentialGeometryExperiment() {
  const [curveType, setCurveType] = useState<CurveType>('helix')
  const [surfaceType, setSurfaceType] = useState<SurfaceType>('torus')
  const [showFrenet, setShowFrenet] = useState(true)
  const [parameter, setParameter] = useState(0.5)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(differentialGeometryNarration)
    }
  }, [narration])

  // 开始讲解
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

  // 生成曲线数据
  const curveData = useMemo(() => {
    const n = 200
    const x: number[] = []
    const y: number[] = []
    const z: number[] = []

    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 4 * Math.PI

      switch (curveType) {
        case 'helix':
          x.push(Math.cos(t))
          y.push(Math.sin(t))
          z.push(t / (2 * Math.PI))
          break
        case 'torus-knot': {
          const p = 2, q = 3
          const r = Math.cos(q * t) + 2
          x.push(r * Math.cos(p * t))
          y.push(r * Math.sin(p * t))
          z.push(-Math.sin(q * t))
          break
        }
        case 'viviani':
          x.push(Math.cos(t) * Math.cos(t))
          y.push(Math.cos(t) * Math.sin(t))
          z.push(Math.sin(t))
          break
        case 'lissajous':
          x.push(Math.sin(3 * t))
          y.push(Math.sin(4 * t))
          z.push(Math.sin(5 * t))
          break
      }
    }

    return { x, y, z }
  }, [curveType])

  // 计算 Frenet 标架
  const frenetFrame = useMemo(() => {
    const idx = Math.floor(parameter * (curveData.x.length - 2))

    // 位置
    const pos = {
      x: curveData.x[idx],
      y: curveData.y[idx],
      z: curveData.z[idx]
    }

    // 切向量 T (近似)
    const T = {
      x: curveData.x[idx + 1] - curveData.x[idx],
      y: curveData.y[idx + 1] - curveData.y[idx],
      z: curveData.z[idx + 1] - curveData.z[idx]
    }
    const Tlen = Math.sqrt(T.x * T.x + T.y * T.y + T.z * T.z)
    T.x /= Tlen; T.y /= Tlen; T.z /= Tlen

    // 主法向量 N (近似)
    const T2 = {
      x: curveData.x[Math.min(idx + 2, curveData.x.length - 1)] - curveData.x[idx + 1],
      y: curveData.y[Math.min(idx + 2, curveData.y.length - 1)] - curveData.y[idx + 1],
      z: curveData.z[Math.min(idx + 2, curveData.z.length - 1)] - curveData.z[idx + 1]
    }
    const T2len = Math.sqrt(T2.x * T2.x + T2.y * T2.y + T2.z * T2.z)
    T2.x /= T2len; T2.y /= T2len; T2.z /= T2len

    const dT = { x: T2.x - T.x, y: T2.y - T.y, z: T2.z - T.z }
    const dTlen = Math.sqrt(dT.x * dT.x + dT.y * dT.y + dT.z * dT.z) || 1
    const N = { x: dT.x / dTlen, y: dT.y / dTlen, z: dT.z / dTlen }

    // 副法向量 B = T × N
    const B = {
      x: T.y * N.z - T.z * N.y,
      y: T.z * N.x - T.x * N.z,
      z: T.x * N.y - T.y * N.x
    }

    return { pos, T, N, B }
  }, [curveData, parameter])

  // 生成曲面数据
  const surfaceData = useMemo(() => {
    const nu = 50, nv = 50
    const x: number[][] = []
    const y: number[][] = []
    const z: number[][] = []

    for (let i = 0; i <= nu; i++) {
      const row_x: number[] = []
      const row_y: number[] = []
      const row_z: number[] = []
      const u = (i / nu) * 2 * Math.PI

      for (let j = 0; j <= nv; j++) {
        const v = (j / nv) * 2 * Math.PI

        switch (surfaceType) {
          case 'sphere': {
            const phi = (j / nv) * Math.PI
            row_x.push(Math.sin(phi) * Math.cos(u))
            row_y.push(Math.sin(phi) * Math.sin(u))
            row_z.push(Math.cos(phi))
            break
          }
          case 'torus': {
            const R = 2, r = 0.7
            row_x.push((R + r * Math.cos(v)) * Math.cos(u))
            row_y.push((R + r * Math.cos(v)) * Math.sin(u))
            row_z.push(r * Math.sin(v))
            break
          }
          case 'saddle': {
            const sx = (i / nu - 0.5) * 4
            const sy = (j / nv - 0.5) * 4
            row_x.push(sx)
            row_y.push(sy)
            row_z.push(sx * sx - sy * sy)
            break
          }
          case 'mobius': {
            const w = (j / nv - 0.5) * 2
            row_x.push((1 + w / 2 * Math.cos(u / 2)) * Math.cos(u))
            row_y.push((1 + w / 2 * Math.cos(u / 2)) * Math.sin(u))
            row_z.push(w / 2 * Math.sin(u / 2))
            break
          }
          case 'klein': {
            const a = 3
            if (u < Math.PI) {
              row_x.push(a * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v))
              row_y.push(a * Math.sin(u) + (2 * (1 - Math.cos(u) / 2)) * Math.sin(u) * Math.cos(v))
            } else {
              row_x.push(a * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI))
              row_y.push(a * Math.sin(u))
            }
            row_z.push((2 * (1 - Math.cos(u) / 2)) * Math.sin(v))
            break
          }
        }
      }
      x.push(row_x)
      y.push(row_y)
      z.push(row_z)
    }

    return { x, y, z }
  }, [surfaceType])

  // 曲线信息
  const curveInfo: Record<CurveType, { name: string; formula: string; description: string }> = {
    helix: {
      name: '螺旋线',
      formula: 'r(t) = (\\cos t, \\sin t, t)',
      description: '曲率和挠率都是常数的曲线',
    },
    'torus-knot': {
      name: '环面纽结',
      formula: 'r(t) = ((\\cos qt + 2)\\cos pt, (\\cos qt + 2)\\sin pt, -\\sin qt)',
      description: '缠绕在环面上的闭合曲线',
    },
    viviani: {
      name: 'Viviani 曲线',
      formula: 'r(t) = (\\cos^2 t, \\cos t \\sin t, \\sin t)',
      description: '球面与圆柱面的交线',
    },
    lissajous: {
      name: 'Lissajous 曲线',
      formula: 'r(t) = (\\sin 3t, \\sin 4t, \\sin 5t)',
      description: '三维李萨如图形',
    },
  }

  // 曲面信息
  const surfaceInfo: Record<SurfaceType, { name: string; K: string; H: string; description: string }> = {
    sphere: {
      name: '球面',
      K: 'K = 1/R^2 > 0',
      H: 'H = 1/R',
      description: '高斯曲率恒正的曲面',
    },
    torus: {
      name: '环面',
      K: 'K \\text{ 变号}',
      H: 'H \\neq 0',
      description: '内侧 K<0，外侧 K>0',
    },
    saddle: {
      name: '马鞍面',
      K: 'K < 0',
      H: 'H = 0',
      description: '高斯曲率恒负的极小曲面',
    },
    mobius: {
      name: 'Möbius 带',
      K: 'K = 0',
      H: 'H = 0',
      description: '不可定向的可展曲面',
    },
    klein: {
      name: 'Klein 瓶',
      K: 'K \\text{ 变号}',
      H: 'H \\neq 0',
      description: '不可定向的闭曲面',
    },
  }

  return (
    <>
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">微分几何</h1>
            <p className="text-gray-600">探索曲线与曲面的内在性质</p>
          </div>
          <button
            onClick={handleStartNarration}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
          >
            开始讲解
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 曲线可视化 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">空间曲线 - {curveInfo[curveType].name}</h3>
              <Plot
                data={[
                  {
                    x: curveData.x,
                    y: curveData.y,
                    z: curveData.z,
                    type: 'scatter3d' as const,
                    mode: 'lines' as const,
                    line: { color: '#3b82f6', width: 4 },
                    name: '曲线',
                  },
                  ...(showFrenet ? [
                    {
                      x: [frenetFrame.pos.x, frenetFrame.pos.x + frenetFrame.T.x * 0.5],
                      y: [frenetFrame.pos.y, frenetFrame.pos.y + frenetFrame.T.y * 0.5],
                      z: [frenetFrame.pos.z, frenetFrame.pos.z + frenetFrame.T.z * 0.5],
                      type: 'scatter3d' as const,
                      mode: 'lines' as const,
                      line: { color: '#ef4444', width: 6 },
                      name: 'T (切向量)',
                    },
                    {
                      x: [frenetFrame.pos.x, frenetFrame.pos.x + frenetFrame.N.x * 0.5],
                      y: [frenetFrame.pos.y, frenetFrame.pos.y + frenetFrame.N.y * 0.5],
                      z: [frenetFrame.pos.z, frenetFrame.pos.z + frenetFrame.N.z * 0.5],
                      type: 'scatter3d' as const,
                      mode: 'lines' as const,
                      line: { color: '#22c55e', width: 6 },
                      name: 'N (主法向)',
                    },
                    {
                      x: [frenetFrame.pos.x, frenetFrame.pos.x + frenetFrame.B.x * 0.5],
                      y: [frenetFrame.pos.y, frenetFrame.pos.y + frenetFrame.B.y * 0.5],
                      z: [frenetFrame.pos.z, frenetFrame.pos.z + frenetFrame.B.z * 0.5],
                      type: 'scatter3d' as const,
                      mode: 'lines' as const,
                      line: { color: '#8b5cf6', width: 6 },
                      name: 'B (副法向)',
                    },
                  ] : []),
                ]}
                layout={{
                  autosize: true,
                  height: 400,
                  margin: { t: 30, r: 30, b: 30, l: 30 },
                  scene: {
                    xaxis: { title: { text: 'x' } },
                    yaxis: { title: { text: 'y' } },
                    zaxis: { title: { text: 'z' } },
                    camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } },
                  },
                  legend: { orientation: 'h', y: -0.1 },
                }}
                config={{ responsive: true, displaylogo: false }}
                className="w-full"
              />
              <div className="mt-3">
                <label className="text-sm text-gray-600">参数位置: t = {(parameter * 4 * Math.PI).toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="0.95"
                  step="0.01"
                  value={parameter}
                  onChange={(e) => setParameter(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* 曲面可视化 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">曲面 - {surfaceInfo[surfaceType].name}</h3>
              <Plot
                data={[
                  {
                    x: surfaceData.x,
                    y: surfaceData.y,
                    z: surfaceData.z,
                    type: 'surface' as const,
                    colorscale: 'Viridis' as const,
                    showscale: false,
                    opacity: 0.9,
                  } as const,
                ]}
                layout={{
                  autosize: true,
                  height: 450,
                  margin: { t: 30, r: 30, b: 30, l: 30 },
                  scene: {
                    xaxis: { title: { text: 'x' } },
                    yaxis: { title: { text: 'y' } },
                    zaxis: { title: { text: 'z' } },
                    camera: { eye: { x: 1.8, y: 1.8, z: 1.2 } },
                  },
                }}
                config={{ responsive: true, displaylogo: false }}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* 曲线选择 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">曲线类型</h3>
              <div className="space-y-2">
                {(Object.keys(curveInfo) as CurveType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCurveType(type)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      curveType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {curveInfo[type].name}
                  </button>
                ))}
              </div>
            </div>

            {/* 曲面选择 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">曲面类型</h3>
              <div className="space-y-2">
                {(Object.keys(surfaceInfo) as SurfaceType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSurfaceType(type)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      surfaceType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {surfaceInfo[type].name}
                  </button>
                ))}
              </div>
            </div>

            {/* 显示选项 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">显示选项</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showFrenet}
                    onChange={(e) => setShowFrenet(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">显示 Frenet 标架</span>
                </label>
              </div>
            </div>

            {/* 曲线公式 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">{curveInfo[curveType].name}</h3>
              <div className="p-3 bg-blue-50 rounded-lg mb-2">
                <MathFormula formula={curveInfo[curveType].formula} />
              </div>
              <p className="text-sm text-gray-600">{curveInfo[curveType].description}</p>
            </div>

            {/* 曲面曲率 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">曲率信息</h3>
              <div className="space-y-2">
                <div className="p-2 bg-purple-50 rounded">
                  <span className="text-sm text-gray-600">高斯曲率: </span>
                  <MathFormula formula={surfaceInfo[surfaceType].K} />
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-600">平均曲率: </span>
                  <MathFormula formula={surfaceInfo[surfaceType].H} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{surfaceInfo[surfaceType].description}</p>
            </div>

            {/* Frenet-Serret 公式 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Frenet-Serret 公式</h3>
              <div className="p-3 bg-amber-50 rounded-lg text-sm space-y-1">
                <MathFormula formula="T' = \kappa N" />
                <MathFormula formula="N' = -\kappa T + \tau B" />
                <MathFormula formula="B' = -\tau N" />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                κ: 曲率, τ: 挠率
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
