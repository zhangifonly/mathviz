import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { nyquistSamplingNarration } from '../../narrations/scripts/nyquist-sampling'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PRESETS, isSufficient, nyquistFreq } from './nyquistSampling'
import { drawNyquistSampling } from './draw'

const W = 600
const H = 480

export default function NyquistSamplingExperiment() {
  const [freq, setFreq] = useState(2)
  const [fs, setFs] = useState(10)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(nyquistSamplingNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawNyquistSampling(canvas, freq, fs)
  }, [freq, fs])

  const ok = isSufficient(freq, fs)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">奈奎斯特采样</h1>
            <p className="text-gray-600">采样定理与信号重建</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">信号 {freq}Hz · 采样率 {fs}Hz · 奈奎斯特频率 {nyquistFreq(fs)}Hz</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">采样率 fs = {fs}Hz</h3>
              <input type="range" min={2} max={20} step={1} value={fs} onChange={(e) => setFs(Number(e.target.value))} className="w-full" />
              <h3 className="text-lg font-semibold mt-4 mb-2">信号频率 f = {freq}Hz</h3>
              <input type="range" min={1} max={5} step={1} value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="w-full" />
              <div className="mt-3 space-y-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setFreq(p.freq); setFs(p.fs) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${freq === p.freq && fs === p.fs ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className={`mt-3 px-3 py-2 rounded-lg text-sm font-medium ${ok ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {ok ? '✓ fs > 2f，可完美重建' : '✗ fs ≤ 2f，重建失真'}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 灰线是原信号，红点是采样值。</li>
                <li>• 蓝线由 <b>sinc 插值</b>重建：每个采样点叠加一个 sinc 波。</li>
                <li>• 采样率大于最高频率两倍时，蓝线与灰线重合。</li>
                <li>• 采样不足时，重建波形偏离原信号，信息已丢失。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
