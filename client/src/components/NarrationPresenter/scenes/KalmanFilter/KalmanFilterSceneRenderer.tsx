/**
 * 卡尔曼滤波场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { generateDataset, NOISE_OPTIONS } from '../../../../experiments/kalman-filter/kalmanFilter'
import { drawKalmanFilter } from '../../../../experiments/kalman-filter/draw'

const N = 140

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '卡尔曼滤波', subtitle: '在噪声里追踪真相的最优估计' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '卡尔曼滤波', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['按不确定度融合预测与测量', '卡尔曼增益 K 在 0 到 1 之间', '新息驱动估计修正'],
    'sum-shrink': ['融合后方差必然收缩', '估计比原始测量更贴近真值', '导航 / 雷达 / 金融广泛应用'],
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

function KalmanCanvas({ preset }: { preset: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const opt = NOISE_OPTIONS[preset] ?? NOISE_OPTIONS[1]
    const data = generateDataset(N, opt.Q, opt.R)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawKalmanFilter(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [preset])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={720} height={520} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function KalmanFilterSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <KalmanCanvas preset={1} />
  const id = scene.scene.id
  const type = scene.scene.type
  const preset = (scene.lineState?.params?.preset as number | undefined) ?? 1

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <KalmanCanvas key={preset} preset={preset} />
}
