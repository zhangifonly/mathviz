/**
 * 莫比乌斯环场景渲染器
 * PPT 讲解模式下渲染 3D 拓扑曲面
 */

import Plot from 'react-plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { buildSurface, type SurfaceKind } from '../../../../experiments/mobius/surfaces'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '莫比乌斯环与克莱因瓶', subtitle: '只有一个面的曲面' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '拓扑曲面', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 总结场景
function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['莫比乌斯环：只有一个面', '克莱因瓶：没有内外之分', '蚂蚁绕两圈才归位'],
    'sum-topology': ['可定向 vs 不可定向', '拓扑学研究形状的本质', '想象力超越维度'],
  }
  const list = items[sceneId] || []
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {list.map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

export default function MobiusSceneRenderer({ scene }: SceneRendererProps) {
  return <SceneBody scene={scene} />
}

// 3D 曲面展示（拖动旋转由 Plotly 提供）
function Surface3D({ kind }: { kind: SurfaceKind }) {
  const s = buildSurface(kind)
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Plot
        data={[{
          type: 'surface',
          x: s.x,
          y: s.y,
          z: s.z,
          colorscale: 'Viridis',
          showscale: false,
        }]}
        layout={{
          autosize: true,
          height: 540,
          paper_bgcolor: 'rgba(0,0,0,0)',
          margin: { t: 0, r: 0, b: 0, l: 0 },
          scene: {
            xaxis: { showgrid: false, zeroline: false, showticklabels: false, title: { text: '' }, showbackground: false },
            yaxis: { showgrid: false, zeroline: false, showticklabels: false, title: { text: '' }, showbackground: false },
            zaxis: { showgrid: false, zeroline: false, showticklabels: false, title: { text: '' }, showbackground: false },
            aspectmode: 'data',
            camera: { eye: { x: 1.7, y: 1.7, z: 1.1 } },
          },
        }}
        config={{ responsive: true, displaylogo: false, displayModeBar: false }}
        style={{ width: '90%' }}
      />
    </div>
  )
}

function SceneBody({ scene }: { scene: SceneRendererProps['scene'] }) {
  if (!scene) return <Surface3D kind="mobius" />
  const id = scene.scene.id
  const type = scene.scene.type
  const kind = (scene.lineState?.params?.surface as SurfaceKind | undefined) ?? 'mobius'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <Surface3D key={kind} kind={kind} />
}
