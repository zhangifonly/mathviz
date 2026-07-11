import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { symmetryNarration } from '../../narrations/scripts/symmetry'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SYMMETRY_OPTIONS, symmetryCopyCount } from './symmetry'
import { drawSymmetry } from './draw'

export default function SymmetryExperiment() {
  const [optionId, setOptionId] = useState('butterfly')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(symmetryNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const option = SYMMETRY_OPTIONS.find((o) => o.id === optionId) ?? SYMMETRY_OPTIONS[0]
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawSymmetry(canvas, option, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [optionId])

  const info = SYMMETRY_OPTIONS.find((o) => o.id === optionId)!
  const copies = symmetryCopyCount(info.order, info.mirror)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🦋 对称之美</h1>
            <p className="text-gray-600">藏在蝴蝶与雪花里的镜像与旋转规律</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label}</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择图案</h3>
              <div className="space-y-2">
                {SYMMETRY_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setOptionId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${optionId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.icon} {o.label}</div>
                    <div className={`text-xs ${optionId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">当前图案</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 旋转重数：<b>{info.order} 重</b>，转 {Math.round(360 / info.order)} 度可重合。</li>
                <li>• 镜像对称：<b>{info.mirror ? '有对称轴' : '无对称轴'}</b>。</li>
                <li>• 一共由 <b>{copies}</b> 份相同基元拼成。</li>
                <li>• 对称就是<b>变换之后仍能和自己重合</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
