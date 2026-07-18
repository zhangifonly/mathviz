import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { aliasingNarration } from '../../narrations/scripts/aliasing'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { aliasFrequency, isAliased, PRESETS } from './aliasing'
import { drawAliasing } from './draw'

const W = 600
const H = 480

export default function AliasingExperiment() {
  const [f, setF] = useState(9)
  const [fs, setFs] = useState(10)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(aliasingNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawAliasing(canvas, f, fs)
  }, [f, fs])

  const fa = aliasFrequency(f, fs)
  const aliased = isAliased(f, fs)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">混叠现象</h1>
            <p className="text-gray-600">采样不足的频率伪装</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              灰=真实 {f}Hz · 蓝=采样点(fs={fs}Hz) · 红=表观 {fa.toFixed(1)}Hz
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">预设组合</h3>
              <div className="space-y-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setF(p.f); setFs(p.fs) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${f === p.f && fs === p.fs ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <label className="block mt-4 text-sm font-medium text-gray-700">真实频率 f: {f} Hz</label>
              <input type="range" min={1} max={20} value={f} onChange={(e) => setF(Number(e.target.value))} className="w-full" />
              <label className="block mt-2 text-sm font-medium text-gray-700">采样率 fs: {fs} Hz</label>
              <input type="range" min={2} max={40} value={fs} onChange={(e) => setFs(Number(e.target.value))} className="w-full" />
              <p className={`mt-3 text-sm font-medium ${aliased ? 'text-red-600' : 'text-emerald-600'}`}>
                {aliased ? `混叠中！奈奎斯特要求 fs ≥ ${2 * f}Hz` : '采样充分，无混叠'}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 电影里车轮<b>倒转</b>，正是帧率对轮辐的混叠。</li>
                <li>• 采样率必须<b>大于信号最高频的两倍</b>(奈奎斯特定理)。</li>
                <li>• 数码相机的<b>摩尔纹</b>是空间频率的混叠。</li>
                <li>• 音频 44.1kHz 采样正为覆盖 20kHz 听觉上限。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
