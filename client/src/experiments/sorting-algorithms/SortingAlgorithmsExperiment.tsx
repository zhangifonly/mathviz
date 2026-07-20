import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sortingAlgorithmsNarration } from '../../narrations/scripts/sorting-algorithms'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makeArray, runSort, ALGORITHMS, ARRAY_SIZE } from './sortingAlgorithms'
import { drawSortingAlgorithms } from './draw'

const W = 600
const H = 480

export default function SortingAlgorithmsExperiment() {
  const [algo, setAlgo] = useState('bubble')
  const [seed, setSeed] = useState(7)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const steps = useMemo(() => runSort(algo, makeArray(ARRAY_SIZE, seed)), [algo, seed])
  const total = steps.length
  const cur = Math.min(step, total - 1)
  const info = ALGORITHMS.find((a) => a.key === algo)!

  useEffect(() => {
    if (narration) narration.loadScript(sortingAlgorithmsNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) drawSortingAlgorithms(canvas, steps[cur], ARRAY_SIZE)
  }, [steps, cur])
  const done = cur >= total - 1

  useEffect(() => {
    if (!playing || done) return
    const t = setTimeout(() => setStep((s) => Math.min(s + 1, total - 1)), 180)
    return () => clearTimeout(t)
  }, [playing, done, total])
  const pick = (key: string) => { setAlgo(key); setStep(0); setPlaying(false) }
  const reshuffle = () => { setSeed((s) => s + 1); setStep(0); setPlaying(false) }
  const go = (d: number) => { setStep((s) => Math.min(total - 1, Math.max(0, s + d))); setPlaying(false) }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">排序算法可视化</h1>
            <p className="text-gray-600">冒泡插入快排归并</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.name} · 第 {cur + 1}/{total} 步</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => go(-1)} className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">上一步</button>
              <button onClick={() => { if (done) setStep(0); setPlaying((p) => !p) }} className="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600">{playing ? '暂停' : '播放'}</button>
              <button onClick={() => go(1)} className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">下一步</button>
              <button onClick={reshuffle} className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">🎲 重排</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择算法</h3>
              <div className="space-y-2">
                {ALGORITHMS.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => pick(a.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${algo === a.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <span>{a.name}</span>
                    <span className="opacity-80">{a.complexity}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">复杂度与稳定性</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• <b>黄</b>=比较，<b>红</b>=交换，<b>绿</b>=已就位。</li>
                <li>• 冒泡、插入 O(n²) 简单；快排、归并 O(n log n) 高效。</li>
                <li>• 当前算法{info.stable ? '稳定：相等元素次序不变' : '不稳定：相等元素次序可能改变'}。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
