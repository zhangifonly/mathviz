/**
 * 韦达定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_ROOTS } from '../../../../experiments/vieta-formulas/vietaFormulas'
import { drawVietaFormulas } from '../../../../experiments/vieta-formulas/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '韦达定理', subtitle: '根与系数的对称关系' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '韦达定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['系数是根的对称函数', '不必解方程即可知和与积', '统一于初等对称多项式'],
    'sum-rules': ['根之和 = -a_{n-1}/a_n', '根之积 = (-1)^n a_0/a_n', '二次特例：和=-b/a, 积=c/a'],
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

function VietaCanvas({ rootsIdx }: { rootsIdx: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const roots = SAMPLE_ROOTS[rootsIdx] ?? SAMPLE_ROOTS[0]
    drawVietaFormulas(canvas, roots)
  }, [rootsIdx])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function VietaFormulasSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <VietaCanvas rootsIdx={2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const rootsIdx = (scene.lineState?.params?.rootsIdx as number | undefined) ?? 2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <VietaCanvas key={rootsIdx} rootsIdx={rootsIdx} />
}
