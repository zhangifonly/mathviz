import { useState, useEffect, useRef, useMemo } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { confidenceIntervalNarration } from '../../narrations/scripts/confidence-interval'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { manyIntervals, CONF_LEVELS } from './confidenceInterval'
import { drawConfidenceInterval } from './draw'

const W = 600
const H = 480
const TRUE_MU = 50
const SIGMA = 10
const N = 30
const TRIALS = 40

export default function ConfidenceIntervalExperiment() {
  const [level, setLevel] = useState(0.95)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const { intervals, coverage } = useMemo(
    () => manyIntervals(TRUE_MU, SIGMA, N, TRIALS, level, seed),
    [level, seed],
  )

  useEffect(() => {
    if (narration) narration.loadScript(confidenceIntervalNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawConfidenceInterval(canvas, intervals, TRUE_MU, SIGMA, N)
  }, [intervals])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">置信区间</h1>
            <p className="text-gray-600">95%置信到底啥意思</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{TRIALS} 次抽样 · 覆盖率 {(coverage * 100).toFixed(1)}%</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">置信水平</h3>
              <div className="space-y-2">
                {CONF_LEVELS.map((lv) => (
                  <button
                    key={lv}
                    onClick={() => setLevel(lv)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${level === lv ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {(lv * 100).toFixed(0)}% 置信
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新多次抽样
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点提示</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 绿条<b>盖住</b>真值竖线，红条<b>错过</b>了真值。</li>
                <li>• 区间 = 样本均值 ± <b>z·标准误</b>，z(95%)=1.96。</li>
                <li>• 随机的是<b>区间</b>不是真值，覆盖率约等于置信水平。</li>
                <li>• 置信水平越高，区间越宽，红条越少。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
