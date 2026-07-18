import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { lookAndSayNarration } from '../../narrations/scripts/look-and-say'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { sequence, lengthRatio, CONWAY_CONSTANT, TERMS } from './lookAndSay'
import { drawLookAndSay } from './draw'

const W = 600
const H = 480

export default function LookAndSayExperiment() {
  const [shown, setShown] = useState(TERMS)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(lookAndSayNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawLookAndSay(canvas, TERMS, Math.min(shown, TERMS))
  }, [shown])

  const ratios = lengthRatio(sequence(TERMS))
  const lastRatio = ratios[ratios.length - 1]

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">外观数列</h1>
            <p className="text-gray-600">读出上一项</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">前 {Math.min(shown, TERMS)} 项 · 项长增长</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">展开项数</h3>
              <input
                type="range" min={1} max={TERMS} value={Math.min(shown, TERMS)}
                onChange={(e) => setShown(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="mt-2 text-sm text-gray-600">显示到第 <b>{Math.min(shown, TERMS)}</b> 项</div>
              <div className="mt-3 text-sm text-gray-600">
                相邻项长度比约 <b className="text-indigo-600">{lastRatio.toFixed(3)}</b>
                <br />趋于康威常数 <b>{CONWAY_CONSTANT.toFixed(3)}</b>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">规则与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每一项都是<b>读出</b>上一项：几个几。</li>
                <li>• "1"读作"一个1"即"11"，再读作"两个1"即"21"。</li>
                <li>• 从 1 出发，各项只含数字 <b>1、2、3</b>。</li>
                <li>• 项长每步约乘 <b>1.303</b>，即康威常数。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
