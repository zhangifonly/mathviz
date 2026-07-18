import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { besselFunctionsNarration } from '../../narrations/scripts/bessel-functions'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { ORDERS, besselZeros } from './besselFunctions'
import { drawBesselFunctions } from './draw'

const W = 600
const H = 480

export default function BesselFunctionsExperiment() {
  const [orders, setOrders] = useState<number[]>([...ORDERS])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(besselFunctionsNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBesselFunctions(canvas, orders, 20, true)
  }, [orders])

  const toggle = (n: number) =>
    setOrders((prev) => (prev.includes(n) ? prev.filter((o) => o !== n) : [...prev, n].sort()))

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">贝塞尔函数</h1>
            <p className="text-gray-600">圆膜振动的解</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第一类贝塞尔函数 · 衰减振荡</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择阶数 n</h3>
              <div className="space-y-2">
                {ORDERS.map((n) => (
                  <button
                    key={n}
                    onClick={() => toggle(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${orders.includes(n) ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    J{n}(x) {orders.includes(n) ? '显示中' : '已隐藏'}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                J0 前三个零点：{besselZeros(0, 3).map((z) => z.toFixed(3)).join(' , ')}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">物理意义</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• J_n(x) 是<b>圆膜振动</b>径向部分的解。</li>
                <li>• 曲线像<b>衰减的正弦</b>，越远振幅越小。</li>
                <li>• 每个<b>零点</b>对应鼓面上一圈不动的<b>节圆</b>。</li>
                <li>• 阶数 n 决定角向的节径条数。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
