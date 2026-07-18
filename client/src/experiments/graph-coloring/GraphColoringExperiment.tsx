import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { graphColoringNarration } from '../../narrations/scripts/graph-coloring'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { greedyColoring, chromaticNumber, SAMPLE_GRAPHS } from './graphColoring'
import { drawGraphColoring } from './draw'

const W = 600
const H = 480

export default function GraphColoringExperiment() {
  const [graphKey, setGraphKey] = useState('map')
  const [mode, setMode] = useState<'greedy' | 'chromatic'>('chromatic')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(graphColoringNarration)
  }, [narration])

  const sample = useMemo(
    () => SAMPLE_GRAPHS.find((s) => s.key === graphKey) ?? SAMPLE_GRAPHS[0],
    [graphKey],
  )
  const greedy = useMemo(() => greedyColoring(sample.graph), [sample])
  const chrom = useMemo(() => chromaticNumber(sample.graph), [sample])
  const colors = mode === 'greedy' ? greedy : chrom.colors
  const usedCount = new Set(colors).size

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGraphColoring(canvas, sample.graph, colors)
  }, [sample, colors])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">图着色</h1>
            <p className="text-gray-600">相邻不同色，最少需要几种颜色</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{sample.name} · {mode === 'greedy' ? '贪心着色' : '最优色数'} · 用了 {usedCount} 色</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择图</h3>
              <div className="space-y-2">
                {SAMPLE_GRAPHS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setGraphKey(s.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${graphKey === s.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setMode('greedy')} className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'greedy' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>贪心</button>
                <button onClick={() => setMode('chromatic')} className={`px-3 py-2 rounded-lg text-sm font-medium ${mode === 'chromatic' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>色数</button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">知识卡</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 规则：每条边两端<b>颜色必须不同</b>。</li>
                <li>• 贪心法用了 <b>{new Set(greedy).size}</b> 色，回溯色数为 <b>{chrom.k}</b>。</li>
                <li>• <b>色数</b>是合法着色所需的最少颜色数。</li>
                <li>• <b>四色定理</b>：任何平面地图四色足够。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
