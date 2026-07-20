import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { kernelImageNarration } from '../../narrations/scripts/kernel-image'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_MATRICES, rank, imageDescription } from './kernelImage'
import { drawKernelImage } from './draw'

const W = 600
const H = 480
const KIND_LABEL: Record<string, string> = { plane: '全平面', line: '一条直线', point: '原点' }

export default function KernelImageExperiment() {
  const [idx, setIdx] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(kernelImageNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawKernelImage(canvas, SAMPLE_MATRICES[idx].m)
  }, [idx])

  const m = SAMPLE_MATRICES[idx].m
  const r = rank(m)
  const kind = imageDescription(m)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">核与像</h1>
            <p className="text-gray-600">线性映射的零空间与列空间</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{SAMPLE_MATRICES[idx].name} · 定义域 → 像</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <p className="text-sm text-gray-500 mt-2">红色点在核方向上，全部被映射到原点。</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择矩阵</h3>
              <div className="space-y-2">
                {SAMPLE_MATRICES.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setIdx(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.name} 矩阵
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">当前诊断</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 秩 rank = <b>{r}</b>，零化度 = <b>{2 - r}</b></li>
                <li>• 像(列空间) = <b>{KIND_LABEL[kind]}</b></li>
                <li>• 秩-零化度定理：<b>{r} + {2 - r} = 2</b></li>
                <li>• 核方向的点都被压成<b>零向量</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
