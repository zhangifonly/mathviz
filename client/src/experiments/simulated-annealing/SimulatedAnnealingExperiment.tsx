import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { simulatedAnnealingNarration } from '../../narrations/scripts/simulated-annealing'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import {
  runAnneal,
  ENERGY_OPTIONS,
  COOLING_OPTIONS,
} from './simulatedAnnealing'
import type { CoolingSchedule } from './simulatedAnnealing'
import { drawSimulatedAnnealing } from './draw'

export default function SimulatedAnnealingExperiment() {
  const [energyId, setEnergyId] = useState('multi-well')
  const [schedule, setSchedule] = useState<CoolingSchedule>('geometric')
  const [seed, setSeed] = useState(20260712)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(simulatedAnnealingNarration)
  }, [narration])

  const opt = ENERGY_OPTIONS.find((o) => o.id === energyId)!

  const result = useMemo(
    () =>
      runAnneal({
        energy: opt.energy,
        domain: opt.domain,
        x0: opt.x0,
        T0: 6,
        rate: schedule === 'exponential' ? 0.006 : 0.99,
        steps: 2000,
        stepSize: 1.1,
        schedule,
        seed,
      }),
    [opt, schedule, seed],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.01)
      drawSimulatedAnnealing(canvas, result, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [result])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🔥 模拟退火</h1>
            <p className="text-gray-600">向大自然学来的全局优化算法</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{opt.label} · {COOLING_OPTIONS.find((c) => c.id === schedule)!.label}</h3>
            <canvas ref={canvasRef} width={640} height={560} className="w-full rounded-lg" />
            <p className="mt-3 text-sm text-gray-600">
              找到的最优能量 <b className="text-emerald-600">{result.bestEnergy.toFixed(4)}</b>
              ，位置 x = {result.bestX.toFixed(4)}
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择能量地形</h3>
              <div className="space-y-2">
                {ENERGY_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setEnergyId(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${energyId === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${energyId === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">降温策略</h3>
              <div className="space-y-2">
                {COOLING_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSchedule(c.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${schedule === c.id ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                  >
                    <div>{c.label}</div>
                    <div className={`text-xs ${schedule === c.id ? 'text-emerald-100' : 'text-emerald-400'}`}>{c.note}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSeed((s) => s + 1)}
                className="mt-3 w-full px-3 py-2 rounded-lg text-sm font-medium bg-amber-100 text-amber-700 hover:bg-amber-200"
              >
                🔀 换一个随机种子重跑
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">算法要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 目标函数是一片<b>能量地形</b>，越低越好。</li>
                <li>• 更好的一步<b>必接受</b>，更坏的一步<b>按概率接受</b>。</li>
                <li>• 接受概率 = e 的 <b>负能量差除以温度</b> 次方。</li>
                <li>• 温度<b>缓慢下降</b>，从大胆探索到精细收敛。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
