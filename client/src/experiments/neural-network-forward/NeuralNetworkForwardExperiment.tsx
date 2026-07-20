import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { neuralNetworkForwardNarration } from '../../narrations/scripts/neural-network-forward'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { NETWORK, INPUT_PRESETS, forward } from './neuralNetworkForward'
import { drawNeuralNetworkForward } from './draw'

const W = 600
const H = 480

export default function NeuralNetworkForwardExperiment() {
  const [preset, setPreset] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(neuralNetworkForwardNarration)
  }, [narration])

  const input = INPUT_PRESETS[preset]
  const output = forward(input, NETWORK).at(-1) ?? []

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawNeuralNetworkForward(canvas, INPUT_PRESETS[preset], NETWORK)
  }, [preset])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">神经网络前向传播</h1>
            <p className="text-gray-600">信号层层流动</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">2-3-2 网络 · 输入 [{input.join(', ')}]</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择输入</h3>
              <div className="space-y-2">
                {INPUT_PRESETS.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setPreset(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${preset === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    输入 [{v.join(', ')}]
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                输出层激活：<b>{output.map((o) => o.toFixed(3)).join(' , ')}</b>
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">读图指南</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每个圆是一个<b>神经元</b>，越亮代表激活值越大。</li>
                <li>• 连线是<b>权重</b>：蓝为正、红为负，越粗绝对值越大。</li>
                <li>• 信号从左到右：a = 激活函数(权重和 + 偏置)。</li>
                <li>• 非线性激活让网络能拟合复杂的曲线关系。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
