/**
 * 留数定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { RESIDUE_SCENARIOS } from '../../../../experiments/residue-theorem/residueTheorem'
import { drawResidueTheorem } from '../../../../experiments/residue-theorem/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '留数定理', subtitle: '复围道积分只由奇点的留数决定' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '留数定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function FormulaScene() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-3xl md:text-5xl font-bold text-white tracking-wide">
        ∮<span className="text-sky-300">C</span> f(z) dz = 2πi · Σ Res(f, z<sub>k</sub>)
      </div>
      <p className="text-lg text-white/60">求和取遍围道 C 内部的所有奇点</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['∮ f dz = 2πi · ΣRes', '只算围道内部的奇点', '外部奇点不贡献'],
    'sum-power': ['复杂积分 → 几个留数', '内部无奇点则积分为零', '数与形的深刻联系'],
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

function ResidueCanvas({ scenarioKey }: { scenarioKey: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const s = RESIDUE_SCENARIOS.find((x) => x.key === scenarioKey) ?? RESIDUE_SCENARIOS[0]
    const data = { poles: s.poles, center: s.center, radius: s.radius }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = (progress + 0.006) % 1
      drawResidueTheorem(canvas, data, progress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scenarioKey])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function ResidueTheoremSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <ResidueCanvas scenarioKey="two-in" />
  const id = scene.scene.id
  const type = scene.scene.type
  const scenarioKey = (scene.lineState?.params?.scenario as string | undefined) ?? 'two-in'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  if (type === 'formula') return <FormulaScene />
  return <ResidueCanvas key={scenarioKey} scenarioKey={scenarioKey} />
}
