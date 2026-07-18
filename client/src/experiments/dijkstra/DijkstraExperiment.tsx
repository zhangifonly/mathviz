import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { dijkstraNarration } from '../../narrations/scripts/dijkstra'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_GRAPH, SOURCE_NODES } from './dijkstra'
import { drawDijkstra } from './draw'

const W = 600
const H = 480

export default function DijkstraExperiment() {
  const [source, setSource] = useState(0)
  const [target, setTarget] = useState(7)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(dijkstraNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDijkstra(canvas, SAMPLE_GRAPH, source, target)
  }, [source, target])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dijkstra最短路</h1>
            <p className="text-gray-600">贪心扩展最近节点</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">最短路径树 · 源点 {SAMPLE_GRAPH.nodes[source].label}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <p className="text-sm text-gray-500 mt-2">绿=源点 · 蓝=最短路径树 · 粉=到目标的最短路径</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择源点</h3>
              <div className="space-y-2">
                {SOURCE_NODES.map((n) => (
                  <button
                    key={n}
                    onClick={() => setSource(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${source === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    从 {SAMPLE_GRAPH.nodes[n].label} 出发
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-2">选择目标点</h3>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_GRAPH.nodes.map((nd) => (
                  <button
                    key={nd.id}
                    onClick={() => setTarget(nd.id)}
                    className={`px-2 py-2 rounded-lg text-sm font-medium ${target === nd.id ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                  >
                    {nd.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关键要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每步选出<b>未确定节点里距源点最近</b>的一个。</li>
                <li>• 用它<b>松弛</b>邻边，更新更短的距离与前驱。</li>
                <li>• 边权非负是贪心正确的前提。</li>
                <li>• 导航、路由、网络规划都靠它求最短路。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
