/**
 * 四元数与三维旋转 讲解场景渲染器
 *
 * 3D 场景，走共享的 Canvas 内核（proj3d），不用 WebGL——
 * 讲解层可能同时有多个场景存活，WebGL 上下文有数量上限。
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { TitleScene, SummaryScene } from '../SceneShells'
import { drawQuaternionRotation, type Mode } from '../../../../experiments/quaternion-rotation/draw'
import { PRESETS } from '../../../../experiments/quaternion-rotation/quaternionRotation'

const W = 680
const H = 540
const TITLES = {
  'wh-1': { title: '四元数与三维旋转', subtitle: '半角、双重覆盖，以及为什么工程上用它做插值' },
  'sum-4': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES = {
  'sum-1': ['绕轴 n 转 θ：q = (cos(θ/2), sin(θ/2)·n)', '作用方式 v′ = q v q⁻¹', '半角来自 q 在共轭里用了两次'],
  'sum-2': ['q 与 −q 是同一个旋转', 'S³ 双重覆盖 SO(3)', '转 360° 得 −1，转 720° 才回到 1'],
  'sum-3': ['SLERP 沿 S³ 大圆匀速走', '每步转角 max/min = 1.000', '总转角 = 两姿态夹角，即最短路径'],
}

function QRCanvas({
  presetId, t, mode, camYaw, camPitch,
}: { presetId: string; t: number; mode: Mode; camYaw: number; camPitch: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const p = PRESETS.find((x) => x.id === presetId) ?? PRESETS[0]
    drawQuaternionRotation(canvas, {
      from: p.from, to: p.to, t, mode, camYaw, camPitch, showTrail: true,
    })
  }, [presetId, t, mode, camYaw, camPitch])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function QuaternionRotationSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return <QRCanvas presetId="wide" t={0.35} mode="compare" camYaw={0.6} camPitch={0.32} />
  }
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') {
    return <TitleScene sceneId={id} titles={TITLES} fallbackTitle="四元数与三维旋转" />
  }
  if (type === 'summary') return <SummaryScene sceneId={id} summaries={SUMMARIES} />
  const p = scene.lineState?.params ?? {}
  return (
    <QRCanvas
      presetId={typeof p.presetId === 'string' ? p.presetId : 'wide'}
      t={typeof p.t === 'number' ? p.t : 0.35}
      mode={p.mode === 'single' ? 'single' : 'compare'}
      camYaw={typeof p.camYaw === 'number' ? p.camYaw : 0.6}
      camPitch={typeof p.camPitch === 'number' ? p.camPitch : 0.32}
    />
  )
}
