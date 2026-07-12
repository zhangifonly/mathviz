/**
 * 帕斯卡三角染色场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { pascalMod } from '../../../../experiments/pascal-triangle/pascal'
import { drawPascal } from '../../../../experiments/pascal-triangle/draw'

const ROWS = 128

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '帕斯卡三角染色', subtitle: '二项式系数里涌现的分形' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '帕斯卡三角', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['每数 = 上方两数之和', '奇偶染色 → 谢尔宾斯基三角', '数即二项式系数'],
    'sum-recur': ['奇偶性递归自复制', 'mod 3/5 涌现更精细分形', '数与形完美交融'],
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

function PascalCanvas({ mod }: { mod: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const tri = pascalMod(ROWS, mod)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawPascal(canvas, tri, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mod])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={620} height={580} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function PascalTriangleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <PascalCanvas mod={2} />
  const id = scene.scene.id
  const type = scene.scene.type
  const mod = (scene.lineState?.params?.mod as number | undefined) ?? 2

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <PascalCanvas key={mod} mod={mod} />
}
