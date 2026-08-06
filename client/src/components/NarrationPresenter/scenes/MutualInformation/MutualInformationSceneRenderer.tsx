/**
 * 互信息与信道容量 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawMutualInformation } from '../../../../experiments/mutual-information/draw'
import type { ChannelKind } from '../../../../experiments/mutual-information/mutualInformation'

const W = 680
const H = 560
const TITLES = {
  'tw-1': { title: '互信息与信道容量', subtitle: '知道了 Y，关于 X 的不确定性减少多少' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['I = H(X) − H(X|Y)，且对称', '= H(X)+H(Y)−H(X,Y)：两圆交集', '= D(P_XY‖P_X·P_Y)：离独立有多远'],
  'sum-2': ['容量 C = max over 输入分布 I(X;Y)', 'BSC：1−H(e)，均匀输入取到', 'BEC：1−e，因为知道自己丢了哪一位'],
  'sum-3': ['e=0.5 时容量精确为 0', '输出与输入独立，一个比特也传不了', 'Z 信道最优输入不是均匀的'],
}

function MICanvas({
  kind, a, e, showRidge, camYaw,
}: { kind: ChannelKind; a: number; e: number; showRidge: boolean; camYaw: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    drawMutualInformation(canvas, { kind, a, e, showRidge, camYaw })
  }, [kind, a, e, showRidge, camYaw])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

const isKind = (v: unknown): v is ChannelKind =>
  v === 'bsc' || v === 'bec' || v === 'z'

export default function MutualInformationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <MICanvas kind="bsc" a={0.5} e={0.1} showRidge camYaw={0.76} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="互信息与信道容量" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <MICanvas
      kind={isKind(p.kind) ? p.kind : 'bsc'}
      a={typeof p.a === 'number' ? p.a : 0.5}
      e={typeof p.e === 'number' ? p.e : 0.1}
      showRidge={p.showRidge !== false}
      camYaw={typeof p.camYaw === 'number' ? p.camYaw : 0.76}
    />
  )
}
