/**
 * 费马小定理场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawFermatLittle } from '../../../../experiments/fermat-little/draw'

const W = 640
const H = 540

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '费马小定理', subtitle: 'a^p≡a模p，素数的隐秘指纹' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '费马小定理', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-recap': ['a^(p-1)≡1 (mod p)', '幂在模 p 下循环', '末列必回到 1'],
    'sum-crypto': ['费马素性测试的基础', '现代密码学的基石', '当心卡迈克尔伪素数'],
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

function FermatCanvas({ p, a }: { p: number; a: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawFermatLittle(canvas, p, a)
  }, [p, a])
  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg bg-white/95" />
    </div>
  )
}

export default function FermatLittleSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <FermatCanvas p={7} a={3} />
  const id = scene.scene.id
  const type = scene.scene.type
  const p = (scene.lineState?.params?.p as number | undefined) ?? 7
  const a = (scene.lineState?.params?.a as number | undefined) ?? 3

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <FermatCanvas key={`${p}-${a}`} p={p} a={a} />
}
