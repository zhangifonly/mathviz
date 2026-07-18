import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { inverseFunctionNarration } from '../../narrations/scripts/inverse-function'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { FUNCTIONS, getFunction } from './inverseFunction'
import { drawInverseFunction } from './draw'

const W = 600
const H = 480

export default function InverseFunctionExperiment() {
  const [key, setKey] = useState('linear')
  const [showInverse, setShowInverse] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(inverseFunctionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawInverseFunction(canvas, getFunction(key), showInverse)
  }, [key, showInverse])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">反函数</h1>
            <p className="text-gray-600">关于 y=x 对称</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{getFunction(key).label} · 与反函数镜像</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <div className="mt-2 flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><span className="inline-block w-4 h-1 bg-indigo-600" />原函数</span>
              <span className="flex items-center gap-1"><span className="inline-block w-4 h-1 bg-pink-500" />反函数</span>
              <span className="flex items-center gap-1"><span className="inline-block w-4 h-1 bg-violet-400" />y=x</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择函数</h3>
              <div className="space-y-2">
                {FUNCTIONS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setKey(f.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${key === f.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowInverse((v) => !v)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {showInverse ? '隐藏反函数' : '显示反函数'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 反函数把输入和输出<b>交换</b>：先 f 再 g，回到原点。</li>
                <li>• 原函数与反函数的图象关于直线 <b>y=x 对称</b>。</li>
                <li>• 函数<b>单调</b>（水平线检验只交一次）才存在反函数。</li>
                <li>• eˣ 与 ln x、x³ 与 ∛x，都是经典的互反对。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
