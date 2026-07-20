import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { backpropagationNarration } from '../../narrations/scripts/backpropagation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { NETWORK, LEARNING_RATE, XOR_SAMPLES, trainStep, type Network, type Grads } from './backpropagation'
import { drawBackpropagation } from './draw'

const W = 600
const H = 480

export default function BackpropagationExperiment() {
  const [net, setNet] = useState<Network>(NETWORK)
  const [grads, setGrads] = useState<Grads | null>(null)
  const [losses, setLosses] = useState<number[]>([])
  const [sampleIdx, setSampleIdx] = useState(0)
  const [step, setStep] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)
  const sample = XOR_SAMPLES[sampleIdx]

  useEffect(() => {
    if (narration) narration.loadScript(backpropagationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBackpropagation(canvas, net, sample.input, sample.target, grads, losses)
  }, [net, grads, losses, sample])

  const doStep = () => {
    const i = step % XOR_SAMPLES.length
    const s = XOR_SAMPLES[i]
    const r = trainStep(net, s.input, s.target, LEARNING_RATE)
    setNet(r.next); setGrads(r.grads); setSampleIdx(i)
    setLosses((ls) => [...ls.slice(-119), r.loss]); setStep((k) => k + 1)
  }

  const doEpochs = () => {
    let cur = net
    const acc: number[] = []
    for (let e = 0; e < 200; e++)
      for (const s of XOR_SAMPLES) {
        const r = trainStep(cur, s.input, s.target, LEARNING_RATE)
        cur = r.next; acc.push(r.loss)
      }
    setNet(cur); setGrads(null)
    setLosses((ls) => [...ls, ...acc].slice(-120)); setStep((k) => k + 800)
  }

  const reset = () => { setNet(NETWORK); setGrads(null); setLosses([]); setStep(0); setSampleIdx(0) }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">反向传播</h1>
            <p className="text-gray-600">链式法则求梯度</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">2-2-1 网络 · 第 {step} 步 · 样本 [{sample.input.join(',')}]→{sample.target}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">训练控制</h3>
              <div className="space-y-2">
                <button onClick={doStep} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600">单步训练（前向+反向）</button>
                <button onClick={doEpochs} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">快进 200 轮</button>
                <button onClick={reset} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">↺ 重置权重</button>
              </div>
              <p className="mt-3 text-xs text-gray-500">学习率 η = {LEARNING_RATE}。连线宽度=权重，<b className="text-red-500">红</b>/<b className="text-blue-500">蓝</b>=梯度正负。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 前向传播算出输出，损失衡量与目标的差距。</li>
                <li>• 反向传播用<b>链式法则</b>把误差层层回传，得到每个权重的梯度。</li>
                <li>• 沿负梯度更新权重，损失逐步下降。</li>
                <li>• 这正是深度学习训练神经网络的核心算法。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
