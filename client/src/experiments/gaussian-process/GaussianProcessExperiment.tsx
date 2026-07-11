import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gaussianProcessNarration } from '../../narrations/scripts/gaussian-process'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { KERNEL_OPTIONS } from './gaussianProcess'
import { drawGaussianProcess, type GPData } from './draw'

const X_TRAIN = [-4, -2.5, -1, 0.5, 2, 3.5]
const Y_TRAIN = [-0.8, 1.2, 0.3, -1.1, 0.9, 0.1]
const DOMAIN: [number, number] = [-5, 5]

export default function GaussianProcessExperiment() {
  const [optIndex, setOptIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(gaussianProcessNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data: GPData = {
      xTrain: X_TRAIN,
      yTrain: Y_TRAIN,
      opt: KERNEL_OPTIONS[optIndex],
      domain: DOMAIN,
    }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawGaussianProcess(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [optIndex])

  const info = KERNEL_OPTIONS[optIndex]

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">高斯过程</h1>
            <p className="text-gray-600">为函数本身赋予概率分布</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 后验均值与 ±2 标准差置信带</h3>
            <canvas ref={canvasRef} width={640} height={480} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择核参数</h3>
              <div className="space-y-2">
                {KERNEL_OPTIONS.map((o, i) => (
                  <button
                    key={o.label}
                    onClick={() => setOptIndex(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${optIndex === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${optIndex === i ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 高斯过程是<b>函数上的高斯分布</b>，非单一曲线。</li>
                <li>• <b>核函数</b>用点距刻画相关性，长度尺度决定平滑度。</li>
                <li>• <b>后验均值</b>是预测，贴近每个观测点。</li>
                <li>• <b>后验方差</b>（浅色带）在数据附近收窄、远处张开。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
