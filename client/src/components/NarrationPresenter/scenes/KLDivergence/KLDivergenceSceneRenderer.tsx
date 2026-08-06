/**
 * KL 散度与交叉熵 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawKLDivergence } from '../../../../experiments/kl-divergence/draw'
import type { Dist } from '../../../../experiments/kl-divergence/klDivergence'

const W = 680
const H = 560
const TITLES = {
  'as-1': { title: 'KL 散度与交叉熵', subtitle: '用错分布要多付多少比特' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['D(p‖q) = 用错分布多付的比特数', 'Gibbs：D ≥ 0，等号仅当 p = q', '这是极大似然估计的理论根据'],
  'sum-2': ['不对称，也不满足三角不等式', '所以不是距离，要距离用 JS 或总变差', 'q=0 而 p>0 时是真正的无穷大'],
  'sum-3': ['交叉熵 = 熵 + KL，熵与模型无关', '前向 KL 趋向覆盖所有峰', '反向 KL 趋向挑一个峰'],
}

type Flags = [boolean, boolean, boolean]

function KLCanvas({
  p, q, show, camYaw,
}: { p: Dist; q: Dist; show: Flags; camYaw: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawKLDivergence(canvas, { p, q, show, camYaw })
  }, [p, q, show, camYaw])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

const isDist = (v: unknown): v is Dist =>
  Array.isArray(v) && v.length >= 2 && v.every((x) => typeof x === 'number')
const isFlags = (v: unknown): v is Flags =>
  Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === 'boolean')

export default function KLDivergenceSceneRenderer({ scene }: SceneRendererProps) {
  const fp: Dist = [0.5, 0.3, 0.2]
  const fq: Dist = [0.98, 0.01, 0.01]
  if (!scene) return <KLCanvas p={fp} q={fq} show={[true, false, false]} camYaw={0.7} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="KL 散度与交叉熵" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const s = scene.lineState?.params ?? {}
  return (
    <KLCanvas
      p={isDist(s.p) ? s.p : fp}
      q={isDist(s.q) ? s.q : fq}
      show={isFlags(s.show) ? s.show : [true, false, false]}
      camYaw={typeof s.camYaw === 'number' ? s.camYaw : 0.7}
    />
  )
}
