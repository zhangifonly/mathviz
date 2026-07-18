import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { josephusProblemNarration } from '../../narrations/scripts/josephus-problem'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { josephusSurvivor, SAMPLES } from './josephusProblem'
import { drawJosephusProblem } from './draw'

const W = 600
const H = 480

export default function JosephusProblemExperiment() {
  const [n, setN] = useState(7)
  const [k, setK] = useState(3)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(josephusProblemNarration)
  }, [narration])

  const shown = Math.min(step, n - 1) // 派生钳制，避免 effect 内重置
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) drawJosephusProblem(canvas, n, k, shown)
  }, [n, k, shown])

  useEffect(() => {
    if (!playing || step >= n - 1) return
    const t = setTimeout(() => {
      setStep((s) => {
        const next = s + 1
        if (next >= n - 1) setPlaying(false)
        return next
      })
    }, 600)
    return () => clearTimeout(t)
  }, [playing, step, n])

  const survivor = josephusSurvivor(n, k)
  const pick = (nn: number, kk: number) => { setN(nn); setK(kk); setStep(0); setPlaying(false) }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">约瑟夫问题</h1>
            <p className="text-gray-600">循环报数出局，谁能笑到最后</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{n} 人围圈 · 每数到 {k} 出局</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">人数 n = {n}</h3>
              <input type="range" min={2} max={30} value={n} onChange={(e) => pick(Number(e.target.value), k)} className="w-full" />
              <h3 className="text-lg font-semibold mt-3 mb-3">报数 k = {k}</h3>
              <input type="range" min={1} max={9} value={k} onChange={(e) => pick(n, Number(e.target.value))} className="w-full" />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setPlaying((p) => !p)} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600">
                  {playing ? '⏸ 暂停' : '▶ 播放出局'}
                </button>
                <button onClick={() => { setStep(0); setPlaying(false) }} className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                  ↺ 重置
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {SAMPLES.map((s) => (
                  <button key={`${s.n}-${s.k}`} onClick={() => pick(s.n, s.k)} className="px-2 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100">
                    {s.n},{s.k}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">递推公式</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b>J(n,k) = (J(n-1,k) + k) % n</b>，从 J(1)=0 起递推。</li>
                <li>• 灰色=已出局，<b className="text-green-600">绿色</b>=最终幸存者。</li>
                <li>• 当前参数下，幸存者是 <b>{survivor} 号</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
