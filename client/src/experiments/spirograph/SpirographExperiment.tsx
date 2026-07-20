import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { spirographNarration } from '../../narrations/scripts/spirograph'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { PRESETS, petalCount, gcd } from './spirograph'
import { drawSpirograph } from './draw'

const W = 600
const H = 480

export default function SpirographExperiment() {
  const [R, setR] = useState(100)
  const [r, setR2] = useState(40)
  const [d, setD] = useState(40)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(spirographNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSpirograph(canvas, { R, r, d }, 1)
  }, [R, r, d])

  const petals = petalCount(R, r)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">万花尺</h1>
            <p className="text-gray-600">内摆线的花纹</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{petals} 瓣花纹 · R={R} r={r} d={d}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">调整参数</h3>
              <div className="space-y-3 text-sm">
                <label className="block">大圆 R：{R}
                  <input type="range" min={60} max={140} value={R} onChange={(e) => setR(Number(e.target.value))} className="w-full" />
                </label>
                <label className="block">小圆 r：{r}
                  <input type="range" min={10} max={70} value={r} onChange={(e) => setR2(Number(e.target.value))} className="w-full" />
                </label>
                <label className="block">笔距 d：{d}
                  <input type="range" min={5} max={80} value={d} onChange={(e) => setD(Number(e.target.value))} className="w-full" />
                </label>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => { setR(p.R); setR2(p.r); setD(p.d) }}
                    className="px-2 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 花瓣数 = R / gcd(R, r)，此处 gcd={gcd(R, r)}。</li>
                <li>• 内摆线是小圆在大圆<b>内侧</b>滚动时笔尖的轨迹。</li>
                <li>• d 越大花瓣越"胖"，甚至出现交叉的回环。</li>
                <li>• 小圆滚满整数圈后，曲线才闭合成完整花纹。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
