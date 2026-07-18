import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { eulerHamiltonPathNarration } from '../../narrations/scripts/euler-hamilton-path'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_GRAPHS, classifyEuler, findHamiltonCircuit } from './eulerHamiltonPath'
import { drawEulerHamiltonPath } from './draw'

const W = 600
const H = 480
const KIND_LABEL: Record<string, string> = {
  circuit: '欧拉回路（全偶度）',
  path: '欧拉路径（恰两奇度）',
  none: '无法一笔画',
}

export default function EulerHamiltonPathExperiment() {
  const [gi, setGi] = useState(0)
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(eulerHamiltonPathNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawEulerHamiltonPath(canvas, SAMPLE_GRAPHS[gi].graph, progress)
  }, [gi, progress])

  const graph = SAMPLE_GRAPHS[gi].graph
  const kind = classifyEuler(graph)
  const hamilton = findHamiltonCircuit(graph)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">欧拉与哈密顿回路</h1>
            <p className="text-gray-600">一笔画与遍历顶点</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{SAMPLE_GRAPHS[gi].name} · {KIND_LABEL[kind]}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <input type="range" min={0} max={1} step={0.02} value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full mt-3" />
            <p className="text-sm text-gray-500 mt-1">拖动滑块，粉色高亮沿欧拉路径逐边点亮（无法一笔画的图不会点亮）。</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择图形</h3>
              <div className="space-y-2">
                {SAMPLE_GRAPHS.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => { setGi(i); setProgress(0) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${gi === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">判据与结论</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 欧拉：看奇度顶点数，0 个可回路，2 个有路径。</li>
                <li>• 本图哈密顿回路：<b>{hamilton.length ? '存在' : '不存在'}</b>。</li>
                <li>• 七桥四个顶点全奇度，故欧拉当年断定无解。</li>
                <li>• 哈密顿走遍<b>顶点</b>，至今没有简单判据，通常更难。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
