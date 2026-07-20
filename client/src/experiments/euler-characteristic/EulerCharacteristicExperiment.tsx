import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { eulerCharacteristicNarration } from '../../narrations/scripts/euler-characteristic'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { POLYHEDRA, TORUS, polyhedronChar } from './eulerCharacteristic'
import { drawEulerCharacteristic } from './draw'

const W = 600
const H = 480
const SHAPES = [...POLYHEDRA, TORUS]

export default function EulerCharacteristicExperiment() {
  const [idx, setIdx] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(eulerCharacteristicNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawEulerCharacteristic(canvas, SHAPES[idx])
  }, [idx])

  const cur = SHAPES[idx]
  const chi = polyhedronChar(cur)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">欧拉示性数</h1>
            <p className="text-gray-600">V-E+F=2</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{cur.name} · χ = {chi}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择多面体</h3>
              <div className="space-y-2">
                {SHAPES.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {p.name}（χ={polyhedronChar(p)}）
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 凸多面体恒有 <b>V-E+F=2</b>，与形状无关。</li>
                <li>• 这个 2 是<b>球面</b>的拓扑不变量。</li>
                <li>• 环面（甜甜圈）的 χ = <b>0</b>。</li>
                <li>• 一般曲面 χ = 2 − 2g，g 是<b>洞的个数</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
