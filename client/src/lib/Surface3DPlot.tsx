/**
 * 可拖拽旋转的 3D 曲面视图（实验页专用）
 *
 * 每个 3D 实验页都要写一份大同小异的 Plotly surface 配置(约 30 行样板),
 * 抽到这里统一维护; 讲解层不用本组件, 见 draw3d.ts 顶部说明。
 */
import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { sampleSurface, type Vec3 } from './proj3d'

export interface Surface3DPlotProps {
  /** 参数方程 (u,v) -> 空间点 */
  fn: (u: number, v: number) => Vec3
  uRange: [number, number]
  vRange: [number, number]
  uSteps?: number
  vSteps?: number
  colorscale?: string
  height?: number
  /** aspectmode='data' 保持真实比例, 'cube' 拉满立方体 */
  aspect?: 'data' | 'cube'
  /** 变化时重新采样的依赖项(参数方程闭包捕获的那些参数) */
  deps?: readonly unknown[]
}

export default function Surface3DPlot({
  fn, uRange, vRange, uSteps = 100, vSteps = 40,
  colorscale = 'Viridis', height = 480, aspect = 'data', deps = [],
}: Surface3DPlotProps) {
  const data = useMemo(() => {
    const grid = sampleSurface(fn, uRange, vRange, uSteps, vSteps)
    return {
      x: grid.map(r => r.map(p => p[0])),
      y: grid.map(r => r.map(p => p[1])),
      z: grid.map(r => r.map(p => p[2])),
    }
    // fn 是每次渲染新建的闭包, 不能进依赖数组; 由调用方用 deps 声明真实依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uRange, vRange, uSteps, vSteps, ...deps])

  const axis = { showgrid: true, zeroline: false }
  return (
    <Plot
      data={[{
        type: 'surface',
        x: data.x,
        y: data.y,
        z: data.z,
        colorscale,
        showscale: false,
      }]}
      layout={{
        autosize: true,
        height,
        margin: { t: 0, r: 0, b: 0, l: 0 },
        scene: {
          xaxis: { ...axis, title: { text: 'x' } },
          yaxis: { ...axis, title: { text: 'y' } },
          zaxis: { ...axis, title: { text: 'z' } },
          aspectmode: aspect,
          camera: { eye: { x: 1.7, y: 1.7, z: 0.9 } },
        },
      }}
      config={{ responsive: true, displaylogo: false }}
      className="w-full"
    />
  )
}
