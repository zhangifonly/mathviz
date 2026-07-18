import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { vibratingStringNarration } from '../../narrations/scripts/vibrating-string'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { MODES, type Mode } from './vibratingString'
import { drawVibratingString } from './draw'

const W = 600
const H = 480
const AMPS: Record<number, number> = { 1: 1, 2: 0.6, 3: 0.45 }

export default function VibratingStringExperiment() {
  const [active, setActive] = useState<number[]>([1])
  const [playing, setPlaying] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(vibratingStringNarration)
  }, [narration])

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const modes: Mode[] = active.map((n) => ({ n, amp: AMPS[n] ?? 0.4 }))
    const loop = (now: number) => {
      const canvas = canvasRef.current
      if (canvas) {
        const t = playing ? (now - start) / 1000 : 0
        drawVibratingString(canvas, modes, t, true)
      }
      if (playing) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active, playing])

  const toggle = (n: number) =>
    setActive((prev) => (prev.includes(n) ? prev.filter((k) => k !== n) : [...prev, n].sort()))

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">弦振动</h1>
            <p className="text-gray-600">驻波与泛音</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">两端固定弦 · 驻波叠加</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">叠加模态</h3>
              <div className="space-y-2">
                {MODES.map((n) => (
                  <button
                    key={n}
                    onClick={() => toggle(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${active.includes(n) ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n === 1 ? '基频 (n=1)' : `${n} 次泛音 (n=${n})`}
                  </button>
                ))}
              </div>
              <button onClick={() => setPlaying((p) => !p)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {playing ? '⏸ 暂停振动' : '▶ 播放振动'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 弦形是各<b>驻波模态</b>的叠加，端点始终不动。</li>
                <li>• 第 n 阶模态有 <b>n-1</b> 个内部<b>节点</b>与 n 个腹。</li>
                <li>• 基频决定<b>音高</b>，泛音的比例决定<b>音色</b>。</li>
                <li>• 吉他、小提琴、钢琴都靠这套驻波规律发声。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
