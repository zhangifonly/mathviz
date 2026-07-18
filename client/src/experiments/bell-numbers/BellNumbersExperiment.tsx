import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { bellNumbersNarration } from '../../narrations/scripts/bell-numbers'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ROW_COUNTS, bellSequence } from './bellNumbers'
import { drawBellNumbers } from './draw'

const W = 600
const H = 480

export default function BellNumbersExperiment() {
  const [rows, setRows] = useState(8)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(bellNumbersNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBellNumbers(canvas, rows, 1)
  }, [rows])

  const seq = bellSequence(rows)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">贝尔数</h1>
            <p className="text-gray-600">集合划分总数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">贝尔三角 · 前 {rows} 行</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">显示行数</h3>
              <div className="space-y-2">
                {ROW_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setRows(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${rows === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 行
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <div className="font-medium mb-1">贝尔数序列 B(0..{rows})</div>
                <div className="font-mono text-amber-600 break-all">{seq.join(', ')}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">知识卡</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• B(n) = n 个元素集合的<b>划分方式总数</b>。</li>
                <li>• 贝尔三角：行首抄上行末尾，其余=<b>左+左上</b>。</li>
                <li>• 每行末尾的高亮数正是<b>下一个贝尔数</b>。</li>
                <li>• B(n)=第二类<b>斯特林数</b>按 k 求和。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
