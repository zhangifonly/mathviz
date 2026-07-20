import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { phasePortraitNarration } from '../../narrations/scripts/phase-portrait'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { classify, SYSTEMS } from './phasePortrait'
import { drawPhasePortrait } from './draw'

const W = 600
const H = 480

export default function PhasePortraitExperiment() {
  const [idx, setIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(phasePortraitNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPhasePortrait(canvas, SYSTEMS[idx].A, true)
  }, [idx])

  const sys = SYSTEMS[idx]
  const c = classify(sys.A)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">相图分析</h1>
            <p className="text-gray-600">平衡点的类型</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">x' = A x · {sys.label}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择系统</h3>
              <div className="space-y-2">
                {SYSTEMS.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">当前系统</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 迹 tr = <b>{c.trace.toFixed(2)}</b>，行列式 det = <b>{c.det.toFixed(2)}</b></li>
                <li>• 判别式 = <b>{c.disc.toFixed(2)}</b>（{c.disc >= 0 ? '实特征值' : '复特征值'}）</li>
                <li>• 类型：<b>{sys.label}</b>，{c.stable ? '渐近稳定' : '不稳定'}</li>
                <li>• {c.detail}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
