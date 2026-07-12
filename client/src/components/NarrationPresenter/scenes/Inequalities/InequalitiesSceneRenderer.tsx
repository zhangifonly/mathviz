/**
 * 不等式与数轴场景渲染器
 */
import { useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { solveLinear, formatSolution, INEQUALITY_OPTIONS } from '../../../../experiments/inequalities/inequalities'
import { drawInequalities } from '../../../../experiments/inequalities/draw'

function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '不等式与数轴', subtitle: '在数轴上看见解集' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '不等式与数轴', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-solve': ['移项分离未知数与常数', '系数化为 1 得到解', '和解方程几乎一样'],
    'sum-flip': ['乘除负数不等号翻转', '实心圆含等号 / 空心不含', '数轴让解集变直观'],
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

function NumberLineScene({ optionId }: { optionId: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const option = INEQUALITY_OPTIONS.find((o) => o.id === optionId) || INEQUALITY_OPTIONS[0]
  const solution = solveLinear(option.ineq)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawInequalities(canvas, solution, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [solution])
  return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-4">
      <div className="text-2xl font-semibold text-white/90">{option.label}</div>
      <canvas ref={ref} width={640} height={300} className="max-w-full max-h-full rounded-lg" />
      <div className="text-lg text-indigo-300">解集：{formatSolution(solution)}</div>
    </div>
  )
}

export default function InequalitiesSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) return <NumberLineScene optionId="simple" />
  const id = scene.scene.id
  const type = scene.scene.type
  const optionId = (scene.lineState?.params?.optionId as string | undefined) ?? 'simple'

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <NumberLineScene key={optionId} optionId={optionId} />
}
