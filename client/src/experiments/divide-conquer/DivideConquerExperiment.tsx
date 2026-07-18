import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { divideConquerNarration } from '../../narrations/scripts/divide-conquer'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_ARRAY, makeArray, treeDepth, mergeSortTree } from './divideConquer'
import { drawDivideConquer } from './draw'

const W = 600
const H = 480

export default function DivideConquerExperiment() {
  const [arr, setArr] = useState<number[]>(SAMPLE_ARRAY)
  const [depth, setDepth] = useState(-1)
  const [merged, setMerged] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(divideConquerNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDivideConquer(canvas, arr, depth, merged)
  }, [arr, depth, merged])

  const maxD = treeDepth(mergeSortTree(arr))

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">分治算法</h1>
            <p className="text-gray-600">分而治之再合并</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">归并排序递归树 · {merged ? '合并阶段' : '分解阶段'}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">高亮层与阶段</h3>
              <div className="space-y-2">
                <button onClick={() => { setDepth(-1); setMerged(false) }} className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${depth === -1 ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                  显示完整递归树
                </button>
                {Array.from({ length: maxD + 1 }, (_, d) => (
                  <button key={d} onClick={() => setDepth(d)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${depth === d ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    高亮第 {d} 层
                  </button>
                ))}
              </div>
              <button onClick={() => setMerged((m) => !m)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {merged ? '↩ 看分解' : '↪ 看合并'}
              </button>
              <button onClick={() => { setArr(makeArray(8, Date.now() % 1000)); setDepth(-1); setMerged(false) }} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                🎲 随机新数组
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">分治三步</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b>分解</b>：数组从中点二分为左右两半。</li>
                <li>• <b>求解</b>：对每一半递归执行相同过程。</li>
                <li>• <b>合并</b>：双指针把两个有序段归并成一段。</li>
                <li>• 时间复杂度 <b>O(n log n)</b>，树高约 log₂n。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
