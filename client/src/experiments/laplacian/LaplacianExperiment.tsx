import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { laplacianNarration } from '../../narrations/scripts/laplacian'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { sampleField, FUNCTIONS } from './laplacian'
import { drawLaplacian } from './draw'

const W = 600
const H = 480
const RES = 60

export default function LaplacianExperiment() {
  const [fnKey, setFnKey] = useState('bump')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(laplacianNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const def = FUNCTIONS.find((f) => f.key === fnKey) ?? FUNCTIONS[0]
    const field = sampleField(def.fn, RES, RES)
    drawLaplacian(canvas, field, 'both')
  }, [fnKey])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">拉普拉斯算子</h1>
            <p className="text-gray-600">偏离邻域平均的度量</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">左：函数 f · 右：拉普拉斯 ∇²f</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数 f(x,y)</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFnKey(f.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${fnKey === f.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">怎么读这张图</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• ∇²f = 四邻居之和 - 中心值的<b>四倍</b>，即 4×(邻域平均 - 中心)。</li>
                <li>• 右图<b>蓝色</b>=局部低谷（比周围低），<b>红色</b>=局部高峰。</li>
                <li>• 调和函数 ∇²f=0，处处等于邻域平均，右图一片<b>纯白</b>。</li>
                <li>• 热扩散 u += α∇²u 就是让每点不断靠近邻域平均，抹平差异。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
