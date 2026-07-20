/**
 * 盒维数场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { makeSierpinski, EPSILONS } from '../../../../experiments/box-counting-dimension/boxCountingDimension'
import { drawFractal, drawLogLog } from '../../../../experiments/box-counting-dimension/draw'

const CW = 300
const CH = 300

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '盒维数', subtitle: '给分形量一个维数' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '盒维数', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['边长 ε 的方格覆盖分形', '数出非空格子 N(ε)', '多个尺度反复测量'],
    'sum-slope': ['log N 对 log(1/ε) 拟合', '直线斜率就是维数 D', '维数可以是分数'],
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

function BoxCanvas({ epsilon }: { epsilon: number }) {
  const fractalRef = useRef<HTMLCanvasElement>(null)
  const plotRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const points = makeSierpinski(60000, 512, 1)
    if (fractalRef.current) drawFractal(fractalRef.current, points, epsilon)
    if (plotRef.current) drawLogLog(plotRef.current, points, EPSILONS)
  }, [epsilon])
  return (
    <div className="flex items-center justify-center gap-4 h-full w-full flex-wrap">
      <canvas ref={fractalRef} width={CW} height={CH} className="max-w-full max-h-full rounded-lg bg-white/95" />
      <canvas ref={plotRef} width={CW} height={CH} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function BoxCountingDimensionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <BoxCanvas epsilon={32} />
  const id = scene.scene.id
  const type = scene.scene.type
  const epsilon = (scene.lineState?.params?.epsilon as number | undefined) ?? 32

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <BoxCanvas key={epsilon} epsilon={epsilon} />
}
