/**
 * 阿波罗尼垫片场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawApollonianGasket } from '../../../../experiments/apollonian-gasket/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '阿波罗尼垫片', subtitle: '相切圆的分形' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '阿波罗尼垫片', subtitle: '' }
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
      <h2 className="text-2xl font-bold text-white/80">笛卡尔圆定理</h2>
      <div className="text-3xl md:text-4xl font-mono text-emerald-300">
        (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)
      </div>
      <p className="text-lg text-white/60">曲率 k = 1/r，外圆曲率取负</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['缝隙里填相切圆', '一层层无穷递归', '生成分形垫片'],
    'sum-engine': ['笛卡尔圆定理为引擎', '曲率平方等式定圆', '简单规则生成秩序'],
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

function GasketCanvas({ depth }: { depth: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawApollonianGasket(canvas, depth, true)
  }, [depth])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-slate-900" />
    </div>
  )
}

export default function ApollonianGasketSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <GasketCanvas depth={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  const depth = (scene.lineState?.params?.depth as number | undefined) ?? 4

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  if (type === 'formula') return <FormulaScene />
  return <GasketCanvas key={depth} depth={depth} />
}
