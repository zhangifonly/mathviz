/**
 * 洛伦兹84大气模型 讲解场景渲染器
 *
 * 轨道用 Canvas 2D + lib/drawAttractor 绘制(不用 Plotly, 见 draw3d.ts 顶部说明)。
 * ⚠️ 轨道按参数 useMemo 缓存: RK4 跑上万步, 每帧重算会卡。
 */
import { useEffect, useMemo, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { drawOrbit } from '../../../../lib/drawAttractor'
import { orbit } from '../../../../lib/attractor3d'
import { l84FieldF, START } from '../../../../experiments/lorenz-atmosphere/lorenzAtmosphere'

const W = 640
const H = 540
const TITLES: Record<string, { title: string; subtitle: string }> = {
  'intro-1': { title: '洛伦兹84大气模型', subtitle: '天气为什么只能预报一周' },
  'sum-3': { title: '感谢观看', subtitle: '探索数学之美' },
}
const SUMMARIES: Record<string, string[]> = {
  'sum-1': ['X 是西风急流强度', 'Y/Z 是涡旋波分量', '参数 F 对应季节'],
  'sum-2': ['西风强弱不规则切换', '对应阻塞高压与正常环流', '这是预报期限的根源'],
}

function TitleScene({ sceneId }: { sceneId: string }) {
  const { title, subtitle } = TITLES[sceneId] || { title: '洛伦兹84大气模型', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {(SUMMARIES[sceneId] || []).map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

function OrbitCanvas({ F, showDiag }: { F: number; showDiag: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const field = useMemo(() => l84FieldF(F), [F])
  const pts = useMemo(
    () => orbit(field, { start: START, dt: 0.01, steps: 20000, skip: 4000 }),
    [field],
  )

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawOrbit(canvas, pts, {
        title: '洛伦兹84大气模型',
        paramLabel: '季节强迫 F = ' + F.toFixed(3),
        ramp: 'coolwarm',
        yaw: 0.6 + el * 0.2,
        progress: Math.min(1, el / 3),
        field: showDiag ? field : undefined,
        start: showDiag ? START : undefined,
        showDiagnostics: showDiag,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [pts, field, F, showDiag])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <canvas ref={ref} width={W} height={H} className="max-w-full max-h-full rounded-lg" />
    </div>
  )
}

export default function LorenzAtmosphereSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <OrbitCanvas F={8} showDiag={false} />
  const id = scene.scene.id
  const type = scene.scene.type
  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  const p = scene.lineState?.params ?? {}
  return (
    <OrbitCanvas
      F={typeof p.F === 'number' ? p.F : 8}
      showDiag={p.showDiag === true}
    />
  )
}
