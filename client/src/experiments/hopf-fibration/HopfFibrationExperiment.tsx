import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { hopfFibrationNarration } from '../../narrations/scripts/hopf-fibration'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FIBER_COUNTS } from './hopfFibration'
import { drawHopfFibration } from './draw'

const W = 600
const H = 480

export default function HopfFibrationExperiment() {
  const [count, setCount] = useState(4)
  const [spinning, setSpinning] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const angleRef = useRef(0)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(hopfFibrationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    const loop = () => {
      if (spinning) angleRef.current += 0.008
      drawHopfFibration(canvas, count, angleRef.current)
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [count, spinning])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">霍普夫纤维化</h1>
            <p className="text-gray-600">S3 到 S2 的圆纤维</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{count} 条纤维 · 球极投影到 3D</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">纤维数量</h3>
              <div className="space-y-2">
                {FIBER_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${count === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 条纤维
                  </button>
                ))}
              </div>
              <button onClick={() => setSpinning((s) => !s)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {spinning ? '⏸ 暂停旋转' : '▶ 继续旋转'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">你看到的是什么</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• S2 上<b>每个点</b>对应 S3 中一整个<b>圆</b>（纤维）。</li>
                <li>• 任意两条纤维都<b>互相环扣</b>，永不相交。</li>
                <li>• 这些环扣的圆叫<b>维拉索圆</b>，来自环面的斜切。</li>
                <li>• 它是拓扑学里第一个非平凡的<b>纤维丛</b>例子。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
