import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gamblersRuinNarration } from '../../narrations/scripts/gamblers-ruin'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SCENARIOS, ruinProbability } from './gamblersRuin'
import { drawGamblersRuin } from './draw'

const W = 600
const H = 480

export default function GamblersRuinExperiment() {
  const [idx, setIdx] = useState(0)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(gamblersRuinNarration)
  }, [narration])

  const sc = SCENARIOS[idx]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGamblersRuin(canvas, sc.i, sc.N, sc.p, 14, seed)
  }, [sc, seed])

  const ruin = ruinProbability(sc.i, sc.N, sc.p)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">赌徒破产</h1>
            <p className="text-gray-600">随机游走到破产或达标</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">本金 {sc.i} · 目标 {sc.N} · 胜率 {(sc.p * 100).toFixed(0)}%</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            <p className="text-sm text-gray-500 mt-2">红线=破产触 0，绿线=达标触 {sc.N}。共模拟 14 局。</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">赌局设置</h3>
              <div className="space-y-2">
                {SCENARIOS.map((s, k) => (
                  <button
                    key={s.label}
                    onClick={() => setIdx(k)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${idx === k ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.label}（本金 {s.i} / 目标 {s.N} / 胜率 {(s.p * 100).toFixed(0)}%）
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((v) => v + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新模拟这些赌局
              </button>
              <div className="mt-3 text-sm text-gray-700">
                理论破产概率：<b className="text-rose-600">{(ruin * 100).toFixed(1)}%</b>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关键结论</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 公平赌局破产概率 = <b>(N−i)/N</b>，本金占比越小越易破产。</li>
                <li>• 胜率哪怕只低一点点，长期几乎必然破产。</li>
                <li>• 赌场靠的正是这微小而稳定的胜率优势。</li>
                <li>• 只要一直玩下去，游走终会撞上某个吸收壁。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
