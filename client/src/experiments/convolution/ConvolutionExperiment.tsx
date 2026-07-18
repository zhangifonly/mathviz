import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { convolutionNarration } from '../../narrations/scripts/convolution'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { KERNELS, SIGNAL } from './convolution'
import { drawConvolution } from './draw'

const W = 600
const H = 480

export default function ConvolutionExperiment() {
  const [kernelKey, setKernelKey] = useState('gaussian')
  const [step, setStep] = useState(SIGNAL.length - 1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(convolutionNarration)
  }, [narration])

  const clamped = Math.min(step, SIGNAL.length - 1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawConvolution(canvas, SIGNAL, KERNELS[kernelKey].taps, clamped)
  }, [kernelKey, clamped])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">卷积</h1>
            <p className="text-gray-600">翻转滑动求重叠</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{KERNELS[kernelKey].label} · 滑动到第 {clamped} 位</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <input
              type="range" min={0} max={SIGNAL.length - 1} value={clamped}
              onChange={(e) => setStep(Number(e.target.value))}
              className="w-full mt-3"
            />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择卷积核</h3>
              <div className="space-y-2">
                {Object.keys(KERNELS).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKernelKey(k)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${kernelKey === k ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {KERNELS[k].label} [{KERNELS[k].taps.map((t) => t.toFixed(2)).join(', ')}]
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(SIGNAL.length - 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                查看完整输出
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 卷积 = 把核<b>翻转</b>后在信号上滑动，逐点相乘再求和。</li>
                <li>• 平滑核（平均/高斯）压制噪声，让信号变<b>柔和</b>。</li>
                <li>• 差分核（边缘检测）在<b>台阶</b>处输出峰值，突出变化。</li>
                <li>• 它是数字滤波、图像处理与卷积神经网络的基石。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
