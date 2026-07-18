import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { knnNarration } from '../../narrations/scripts/knn'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makeDataset, K_VALUES, DATASETS } from './knn'
import { drawKnn, type QueryPoint } from './draw'

const W = 600
const H = 480

export default function KnnExperiment() {
  const [k, setK] = useState(3)
  const [dataset, setDataset] = useState(1)
  const [query, setQuery] = useState<QueryPoint>({ x: W / 2, y: H / 2 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(knnNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ds = DATASETS[dataset]
    const train = makeDataset(ds.classes, ds.perClass, W, H, 7)
    drawKnn(canvas, train, k, query, 6)
  }, [k, dataset, query])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const y = ((e.clientY - rect.top) / rect.height) * H
    setQuery({ x, y })
  }
  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">K近邻分类</h1>
            <p className="text-gray-600">最近邻居投票</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">k = {k} · 点击画布移动查询点</h3>
            <canvas ref={canvasRef} width={W} height={H} onClick={handleCanvasClick} className="w-full rounded-lg bg-slate-50 cursor-crosshair" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">邻居数 k</h3>
              <div className="grid grid-cols-4 gap-2">
                {K_VALUES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setK(v)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${k === v ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">数据集</h3>
              <div className="space-y-2">
                {DATASETS.map((d, i) => (
                  <button
                    key={d.name}
                    onClick={() => setDataset(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${dataset === i ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {d.name}数据
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 背景色 = 该位置被 KNN 预测的<b>类别</b>。</li>
                <li>• 白心圆是查询点，黑线连向它的 <b>k 个近邻</b>。</li>
                <li>• k 越大<b>决策边界</b>越平滑，推荐、识别、异常检测都用它。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
