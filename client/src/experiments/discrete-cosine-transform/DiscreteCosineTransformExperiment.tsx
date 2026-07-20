import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { discreteCosineTransformNarration } from '../../narrations/scripts/discrete-cosine-transform'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SIGNAL, KEEP_COUNTS } from './discreteCosineTransform'
import { drawDiscreteCosineTransform } from './draw'

const W = 600
const H = 480

export default function DiscreteCosineTransformExperiment() {
  const [keep, setKeep] = useState(4)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(discreteCosineTransformNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDiscreteCosineTransform(canvas, SIGNAL, keep)
  }, [keep])

  const ratio = Math.round((keep / SIGNAL.length) * 100)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">离散余弦变换</h1>
            <p className="text-gray-600">JPEG 压缩的核心</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">保留前 {keep} 个系数 · 数据量约 {ratio}%</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">保留系数个数</h3>
              <div className="space-y-2">
                {KEEP_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setKeep(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${keep === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    保留前 {n} 个（共 {SIGNAL.length} 个）
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">保留越少，压缩率越高，重建越粗糙；能量集中在低频，少数系数即可近似还原。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• DCT 把信号写成一组<b>余弦基</b>的叠加。</li>
                <li>• 平滑信号的能量<b>集中在低频</b>，高频系数很小。</li>
                <li>• 丢弃高频系数 = <b>有损压缩</b>，肉眼几乎看不出差别。</li>
                <li>• JPEG 对 8×8 图像块做二维 DCT，是它的压缩核心。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
