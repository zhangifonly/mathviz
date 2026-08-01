import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { meanCurvatureFlowNarration } from '../../narrations/scripts/mean-curvature-flow'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawFlow } from './draw'
import FactsCard from './FactsCard'
import {
  initialProfile, stepProfile, SHAPE_INFO, PROFILE_POINTS, type ShapeKind,
} from './meanCurvatureFlow'

const W = 640
const H = 480
const DZ = 2 / (PROFILE_POINTS - 1)
const DT = 2e-5

export default function MeanCurvatureFlowExperiment() {
  const [kind, setKind] = useState<ShapeKind>('dumbbell')
  const [playing, setPlaying] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // 演化状态放 ref: 它是逐帧累积的, 不能每帧从头重算
  const stateRef = useRef({ profile: initialProfile('dumbbell'), time: 0 })

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(meanCurvatureFlowNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // 换形状时重置演化。写在 effect 里是安全的: 改的是 ref 不是 state
    stateRef.current = { profile: initialProfile(kind), time: 0 }
    let raf = 0
    const loop = () => {
      const st = stateRef.current
      if (playing) {
        // 每帧推进若干步, 否则演化太慢看不出变化
        for (let k = 0; k < 40; k++) {
          st.profile = stepProfile(st.profile, DZ, DT)
          st.time += DT
        }
      }
      drawFlow(canvas, {
        profile: st.profile, kind, time: st.time, showMeasure: true,
        yaw: 0.6 + st.time * 3,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [kind, playing])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">平均曲率流</h1>
            <p className="text-gray-600">几何中的热方程</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">∂X/∂t = −H·N · 逐帧演化</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">初始形状</h3>
              <div className="space-y-2">
                {SHAPE_INFO.map((s) => (
                  <button key={s.kind} onClick={() => setKind(s.kind)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${kind === s.kind ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    <span>{s.label}</span><span className="text-xs opacity-70">{s.note}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setPlaying((v) => !v)}
                className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {playing ? '⏸ 暂停演化' : '▶ 继续演化'}
              </button>
            </div>

            <FactsCard />
          </div>
        </div>
      </div>
    </>
  )
}
