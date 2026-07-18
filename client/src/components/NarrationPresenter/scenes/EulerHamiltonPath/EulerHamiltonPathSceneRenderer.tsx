/**
 * 欧拉与哈密顿回路场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_GRAPHS } from '../../../../experiments/euler-hamilton-path/eulerHamiltonPath'
import { drawEulerHamiltonPath } from '../../../../experiments/euler-hamilton-path/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '欧拉与哈密顿回路', subtitle: '一笔画与遍历顶点' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '欧拉与哈密顿回路', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-euler': ['度数是连出的边数', '全偶度可欧拉回路', '恰两奇度有欧拉路径'],
    'sum-hamilton': ['哈密顿走遍每个顶点', '没有简单判据', '一座桥引出一门学问'],
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

function GraphCanvas({ gi, progress }: { gi: number; progress: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawEulerHamiltonPath(canvas, SAMPLE_GRAPHS[gi].graph, progress)
  }, [gi, progress])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function EulerHamiltonPathSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GraphCanvas gi={0} progress={0} />
  const id = scene.scene.id
  const type = scene.scene.type
  const gi = (scene.lineState?.params?.gi as number | undefined) ?? 0
  const progress = (scene.lineState?.params?.progress as number | undefined) ?? 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GraphCanvas key={`${gi}-${progress}`} gi={gi} progress={progress} />
}
