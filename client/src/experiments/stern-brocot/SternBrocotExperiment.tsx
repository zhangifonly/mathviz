import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sternBrocotNarration } from '../../narrations/scripts/stern-brocot'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DEPTHS, countNodes } from './sternBrocot'
import { drawSternBrocot } from './draw'

const W = 600
const H = 480

export default function SternBrocotExperiment() {
  const [depth, setDepth] = useState(4)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sternBrocotNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSternBrocot(canvas, depth)
  }, [depth])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Stern-Brocot树</h1>
            <p className="text-gray-600">生成所有既约分数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{depth} 层 · 共 {countNodes(depth)} 个既约分数</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">展开树的层数</h3>
              <div className="space-y-2">
                {DEPTHS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${depth === d ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {d} 层（{countNodes(d)} 个节点）
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关于这棵树</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 根是 <b>1/1</b>，由边界 0/1 与 1/0 取中位数得到。</li>
                <li>• 每个节点 = 左右邻居的<b>中位数</b> (a+c)/(b+d)。</li>
                <li>• 每个正<b>既约分数</b>都恰好出现一次，不重不漏。</li>
                <li>• 从根到某点的左右路径，对应它的<b>连分数</b>展开。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
