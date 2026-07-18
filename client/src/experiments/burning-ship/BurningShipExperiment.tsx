import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { burningShipNarration } from '../../narrations/scripts/burning-ship'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { VIEW_REGIONS, MAX_ITERS } from './burningShip'
import { drawBurningShip } from './draw'

const W = 600
const H = 480

export default function BurningShipExperiment() {
  const [regionIdx, setRegionIdx] = useState(0)
  const [maxIter, setMaxIter] = useState(120)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(burningShipNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBurningShip(canvas, VIEW_REGIONS[regionIdx], maxIter, 2)
  }, [regionIdx, maxIter])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">燃烧船分形</h1>
            <p className="text-gray-600">曼德博的绝对值变体</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{VIEW_REGIONS[regionIdx].name} · 迭代上限 {maxIter}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">观察区域</h3>
              <div className="space-y-2">
                {VIEW_REGIONS.map((r, i) => (
                  <button
                    key={r.name}
                    onClick={() => setRegionIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${regionIdx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">迭代上限</h3>
              <div className="flex gap-2">
                {MAX_ITERS.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMaxIter(m)}
                    className={`flex-1 px-2 py-2 rounded-lg text-sm font-medium ${maxIter === m ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 迭代式 z=(|Re z|+i|Im z|)²+c，仅比曼德博多一步<b>取绝对值</b>。</li>
                <li>• 取绝对值破坏上下对称，画面浮现一排排<b>船只</b>。</li>
                <li>• 颜色代表<b>逃逸时间</b>：逃得越快越暖亮，集合内近黑。</li>
                <li>• 主船身在实轴约 <b>-1.75</b> 处，放大可见无穷细节。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
