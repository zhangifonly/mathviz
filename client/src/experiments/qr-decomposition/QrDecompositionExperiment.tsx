import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { qrDecompositionNarration } from '../../narrations/scripts/qr-decomposition'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_MATRICES } from './qrDecomposition'
import { drawQrDecomposition } from './draw'

const W = 600
const H = 480

export default function QrDecompositionExperiment() {
  const [idx, setIdx] = useState(1)
  const [showQ, setShowQ] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(qrDecompositionNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawQrDecomposition(canvas, SAMPLE_MATRICES[idx].matrix, showQ)
  }, [idx, showQ])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">QR分解</h1>
            <p className="text-gray-600">正交阵乘上三角</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{SAMPLE_MATRICES[idx].label} · A = Q R</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择矩阵</h3>
              <div className="space-y-2">
                {SAMPLE_MATRICES.map((m, i) => (
                  <button
                    key={m.label}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowQ((v) => !v)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {showQ ? '隐藏正交列 Q' : '显示正交列 Q'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• Q 的列<b>两两正交</b>且长度为 1，满足 Q<sup>T</sup>Q = I。</li>
                <li>• R 是<b>上三角</b>阵，记录了正交化的投影系数。</li>
                <li>• 二者相乘正好还原 A，即 <b>A = Q R</b>。</li>
                <li>• QR 分解是最小二乘、求特征值 <b>QR 算法</b>的核心工具。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
