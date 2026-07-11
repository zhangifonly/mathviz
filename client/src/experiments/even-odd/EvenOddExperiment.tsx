import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { evenOddNarration } from '../../narrations/scripts/even-odd'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { buildGrid, countDivisible, DIVISOR_OPTIONS } from './evenOdd'
import { drawEvenOdd } from './draw'

const COUNT = 100

export default function EvenOddExperiment() {
  const [divisor, setDivisor] = useState(2)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(evenOddNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const cells = buildGrid(COUNT, divisor)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawEvenOdd(canvas, cells, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [divisor])

  const info = DIVISOR_OPTIONS.find((o) => o.divisor === divisor)!
  const hitCount = countDivisible(COUNT, divisor)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">奇偶数与整除</h1>
            <p className="text-gray-600">把数字排成方格，一眼看清整除的规律</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 1 到 {COUNT}</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择除数</h3>
              <div className="space-y-2">
                {DIVISOR_OPTIONS.map((o) => (
                  <button
                    key={o.divisor}
                    onClick={() => setDivisor(o.divisor)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${divisor === o.divisor ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${divisor === o.divisor ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600">
                1 到 {COUNT} 中能被 {divisor} 整除的有 <b className="text-indigo-600">{hitCount}</b> 个。
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">数字小知识</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 能被 <b>2</b> 整除的是<b>偶数</b>，不能的是<b>奇数</b>。</li>
                <li>• 偶+偶=偶，奇+奇=偶，一奇一偶相加得<b>奇数</b>。</li>
                <li>• 相乘时，<b>两个奇数</b>的积才是奇数，否则为偶数。</li>
                <li>• <b>整除</b>就是相除余数为 0，被整除的数是除数的<b>倍数</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
