import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sprottAttractorNarration } from '../../narrations/scripts/sprott-attractor'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawOrbit } from '../../lib/drawAttractor'
import { orbit, lyapunovExponent, divergence } from '../../lib/attractor3d'
import DiagnosticsCard from '../../lib/DiagnosticsCard'
import {
  sprottField, startOf, infoOf, meanDivergence, CASE_INFO, REFERENCE_SYSTEMS,
  type SprottCase,
} from './sprottAttractor'

const W = 640
const H = 480

export default function SprottAttractorExperiment() {
  const [kind, setKind] = useState<SprottCase>('A')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sprottAttractorNarration)
  }, [narration])

  // 轨道与诊断按 case 缓存: RK4 跑上万步, 每帧重算会卡
  const { pts, lam, div, meanDiv } = useMemo(() => {
    const f = sprottField(kind)
    const start = startOf(kind)
    return {
      pts: orbit(f, { start, dt: 0.005, steps: 14000, skip: 3000 }),
      lam: lyapunovExponent(f, start, 0.005, 8000),
      div: divergence(f, start),
      meanDiv: meanDivergence(kind),
    }
  }, [kind])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawOrbit(canvas, pts, {
        title: `Sprott ${kind}`,
        paramLabel: infoOf(kind).equations,
        ramp: 'viridis',
        yaw: 0.6 + el * 0.2,
        progress: Math.min(1, el / 3),
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [pts, kind])

  const info = infoOf(kind)
  const tag = lam > 0.005 ? '混沌' : lam < -0.005 ? '收敛' : '临界'
  const facts: Array<[string, string]> = [
    ['只有 5 项', `，比洛伦兹与罗斯勒都少 2 项，含 2 个二次非线性项。`],
    ['散度时间平均', ` ${meanDiv.toFixed(4)}${info.conservative ? '（≈0，保守系统）' : '（负值，耗散）'}`],
    ['耗散不是混沌的前提', '：Case A 保守却混沌，两者相互独立。'],
  ]
  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">斯普罗特极简吸引子</h1>
            <p className="text-gray-600">混沌最少需要几项</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">轨道渐变着色 · 冷色为早期</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择 Case</h3>
              <div className="space-y-2">
                {CASE_INFO.map((c) => (
                  <button key={c.id} onClick={() => setKind(c.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kind === c.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    <div className="flex justify-between"><span>{c.label}</span><span className="text-xs opacity-70">{c.terms} 项</span></div>
                    <div className="text-xs opacity-70 mt-0.5">{c.note}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                {REFERENCE_SYSTEMS.map((r) => `${r.name} ${r.terms} 项`).join(' · ')}
              </div>
            </div>
            <DiagnosticsCard lam={lam} div={div} tag={tag} facts={facts} />
          </div>
        </div>
      </div>
    </>
  )
}
