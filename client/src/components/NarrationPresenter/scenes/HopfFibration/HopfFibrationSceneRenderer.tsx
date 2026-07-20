/**
 * 霍普夫纤维化场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawHopfFibration } from '../../../../experiments/hopf-fibration/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '霍普夫纤维化', subtitle: 'S3 到 S2 的圆纤维' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '霍普夫纤维化', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['S3 映到 S2', '每点对应一个圆纤维', '球极投影后可见'],
    'sum-bundle': ['纤维互相环绕不交', '维拉索圆铺满 S3', '经典的非平凡纤维丛'],
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

function HopfCanvas({ count }: { count: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(0)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    const loop = () => {
      angleRef.current += 0.008
      drawHopfFibration(canvas, count, angleRef.current)
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [count])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-slate-900" />
    </div>
  )
}

export default function HopfFibrationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <HopfCanvas count={4} />
  const id = scene.scene.id
  const type = scene.scene.type
  const count = (scene.lineState?.params?.count as number | undefined) ?? 4

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <HopfCanvas key={count} count={count} />
}
