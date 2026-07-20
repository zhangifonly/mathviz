import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { birthdayParadoxNarration } from '../../narrations/scripts/birthday-paradox'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { collisionProb, simulate, GROUP_SIZES } from './birthdayParadox'
import { drawBirthdayParadox } from './draw'

const W = 600
const H = 480

export default function BirthdayParadoxExperiment() {
  const [n, setN] = useState(23)
  const [simProb, setSimProb] = useState<number | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(birthdayParadoxNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBirthdayParadox(canvas, n, simProb)
  }, [n, simProb])

  const runSim = () => setSimProb(simulate(n, 5000, Date.now() & 0x7fffffff))
  const theory = collisionProb(n)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">生日悖论</h1>
            <p className="text-gray-600">23人竟有一半概率同天</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{n} 人 · 至少两人同天生日概率 {(theory * 100).toFixed(1)}%</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">房间里的人数：{n}</h3>
              <input type="range" min={2} max={100} value={n} onChange={(e) => { setN(Number(e.target.value)); setSimProb(undefined) }} className="w-full accent-indigo-500" />
              <div className="flex flex-wrap gap-2 mt-3">
                {GROUP_SIZES.map((g) => (
                  <button key={g} onClick={() => { setN(g); setSimProb(undefined) }} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${n === g ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>{g} 人</button>
                ))}
              </div>
              <button onClick={runSim} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 模拟 5000 次房间
              </button>
              {simProb !== undefined && (
                <p className="text-sm text-cyan-700 mt-2">模拟碰撞频率：<b>{(simProb * 100).toFixed(1)}%</b>（理论 {(theory * 100).toFixed(1)}%）</p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">为什么反直觉</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 比较的是<b>任意两人</b>配对，23 人有 253 对。</li>
                <li>• 用补事件算：所有人生日都不同的概率快速衰减。</li>
                <li>• n=23 概率过半，n=70 时约 99.9%。</li>
                <li>• 与"某人和我同天"不同，那才需要 253 人左右。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
