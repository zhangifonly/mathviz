import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { integerPartitionNarration } from '../../narrations/scripts/integer-partition'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { partitions, partitionCount, conjugate, NS } from './integerPartition'
import { drawIntegerPartition } from './draw'

const W = 600
const H = 480

export default function IntegerPartitionExperiment() {
  const [n, setN] = useState(5)
  const [idx, setIdx] = useState(0)
  const [showConj, setShowConj] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(integerPartitionNarration)
  }, [narration])

  const all = partitions(n)
  const safeIdx = Math.min(idx, all.length - 1)
  const current = all[safeIdx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawIntegerPartition(canvas, current, showConj)
  }, [current, showConj])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">整数分拆</h1>
            <p className="text-gray-600">杨氏图与分拆数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">n = {n} · 第 {safeIdx + 1} / {all.length} 个分拆</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择 n</h3>
              <div className="grid grid-cols-4 gap-2">
                {NS.map((v) => (
                  <button
                    key={v}
                    onClick={() => { setN(v); setIdx(0) }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${n === v ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">分拆数 p({n}) = <b>{partitionCount(n)}</b></p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setIdx((i) => (i - 1 + all.length) % all.length)} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">上一个</button>
                <button onClick={() => setIdx((i) => (i + 1) % all.length)} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">下一个</button>
              </div>
              <button onClick={() => setShowConj((s) => !s)} className={`w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium ${showConj ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'}`}>
                {showConj ? '隐藏共轭' : '显示共轭分拆'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">知识卡</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 当前分拆：<b>{current.join(' + ')}</b></li>
                <li>• 共轭分拆：<b>{conjugate(current).join(' + ')}</b></li>
                <li>• 杨氏图把每个部件画成一行方块。</li>
                <li>• 沿对角线转置，就得到共轭分拆。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
