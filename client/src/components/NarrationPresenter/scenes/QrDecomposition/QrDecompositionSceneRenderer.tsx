/**
 * QR 分解场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { SAMPLE_MATRICES } from '../../../../experiments/qr-decomposition/qrDecomposition'
import { drawQrDecomposition } from '../../../../experiments/qr-decomposition/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: 'QR分解', subtitle: '正交阵乘上三角' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: 'QR分解', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['Q 的列两两正交', 'R 是上三角阵', 'A = Q R 完全还原'],
    'sum-uses': ['源自 Gram-Schmidt', '用于最小二乘拟合', 'QR 算法求特征值'],
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

function QrCanvas({ idx, showQ }: { idx: number; showQ: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const m = SAMPLE_MATRICES[idx] ?? SAMPLE_MATRICES[1]
    drawQrDecomposition(canvas, m.matrix, showQ)
  }, [idx, showQ])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function QrDecompositionSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <QrCanvas idx={1} showQ={true} />
  const id = scene.scene.id
  const type = scene.scene.type
  const idx = (scene.lineState?.params?.idx as number | undefined) ?? 1
  const showQ = ((scene.lineState?.params?.showQ as number | undefined) ?? 1) !== 0

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <QrCanvas key={`${idx}-${showQ}`} idx={idx} showQ={showQ} />
}
