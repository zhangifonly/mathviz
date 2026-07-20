import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gibbsPhenomenonNarration } from '../../narrations/scripts/gibbs-phenomenon'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { TERM_COUNTS, overshootFraction } from './gibbsPhenomenon'
import { drawGibbs } from './draw'

const W = 600
const H = 480

export default function GibbsPhenomenonExperiment() {
  const [terms, setTerms] = useState(15)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(gibbsPhenomenonNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGibbs(canvas, terms)
  }, [terms])

  const pct = (overshootFraction(terms) * 100).toFixed(2)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">吉布斯现象</h1>
            <p className="text-gray-600">跳变处的过冲</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{terms} 项部分和逼近方波</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">部分和项数</h3>
              <div className="space-y-2">
                {TERM_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setTerms(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${terms === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 项
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">当前过冲：<b className="text-red-500">{pct}%</b> · 跳变量</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 部分和 <b>Σ sin((2k-1)x)/(2k-1)</b> 逼近方波。</li>
                <li>• 跳变点两侧总会<b>冲过头</b>，出现振铃。</li>
                <li>• 过冲约占跳变量的 <b>9%</b>，项数再多也不消失。</li>
                <li>• 增项数只让振铃<b>更窄</b>，峰值高度几乎不变。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
