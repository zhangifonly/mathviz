import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { particleSwarmNarration } from '../../narrations/scripts/particle-swarm'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makeSwarm, step, SWARM_SIZE, PARAMS, type Swarm } from './particleSwarm'
import { drawParticleSwarm } from './draw'

const W = 600
const H = 480

export default function ParticleSwarmExperiment() {
  const [swarm, setSwarm] = useState<Swarm>(() => makeSwarm(SWARM_SIZE, 1))
  const [iter, setIter] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(particleSwarmNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) drawParticleSwarm(canvas, swarm, 4)
  }, [swarm])

  const doStep = () => {
    setSwarm((s) => step(s, iter + 1))
    setIter((i) => i + 1)
  }
  const reset = (seed: number) => {
    setSwarm(makeSwarm(SWARM_SIZE, seed))
    setIter(0)
  }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">粒子群优化</h1>
            <p className="text-gray-600">群体智能寻优</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">第 {iter} 步 · 全局最优值 {swarm.gBestVal.toFixed(3)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">迭代控制</h3>
              <div className="space-y-2">
                <button onClick={doStep} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600">
                  ▶ 单步迭代
                </button>
                <button onClick={() => reset(1)} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                  ↺ 重置
                </button>
                <button onClick={() => reset(Math.floor(Math.random() * 9999) + 2)} className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                  🎲 随机初始分布
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">惯性 w={PARAMS.w} · 认知 c1={PARAMS.c1} · 社会 c2={PARAMS.c2}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 黄点是<b>粒子</b>,白线是它当前的<b>速度</b>方向。</li>
                <li>• 红环是当前找到的<b>全局最优</b>位置。</li>
                <li>• 速度 = 惯性 + 飞向个体最优 + 飞向全局最优。</li>
                <li>• PSO 用于<b>神经网络调参</b>、天线设计、路径规划等。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
