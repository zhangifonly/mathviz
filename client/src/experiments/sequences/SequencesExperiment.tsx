import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sequencesNarration } from '../../narrations/scripts/sequences'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import {
  arithmeticSequence,
  geometricSequence,
  arithmeticSum,
  geometricSum,
  geometricInfiniteSum,
  SEQUENCE_OPTIONS,
} from './sequences'
import { drawSequences } from './draw'

const TERMS = 8

export default function SequencesExperiment() {
  const [index, setIndex] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sequencesNarration)
  }, [narration])

  const opt = SEQUENCE_OPTIONS[index]
  const seq =
    opt.kind === 'arithmetic'
      ? arithmeticSequence(opt.a1, opt.step, TERMS)
      : geometricSequence(opt.a1, opt.step, TERMS)
  const sum =
    opt.kind === 'arithmetic'
      ? arithmeticSum(opt.a1, opt.step, TERMS)
      : geometricSum(opt.a1, opt.step, TERMS)
  const infSum = opt.kind === 'geometric' ? geometricInfiniteSum(opt.a1, opt.step) : null

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawSequences(canvas, seq, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seq])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">等差等比数列</h1>
            <p className="text-gray-600">藏在数字排队里的两种节奏</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{opt.label} · 前 {TERMS} 项</h3>
            <canvas ref={canvasRef} width={620} height={420} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择数列</h3>
              <div className="space-y-2">
                {SEQUENCE_OPTIONS.map((o, i) => (
                  <button
                    key={o.label}
                    onClick={() => setIndex(i)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${index === i ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${index === i ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">当前数列</h3>
              <p className="text-sm text-gray-700 mb-2 break-words">
                {seq.map((v) => (Number.isInteger(v) ? v : v.toFixed(2))).join(', ')} …
              </p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 类型：<b>{opt.kind === 'arithmetic' ? '等差数列' : '等比数列'}</b></li>
                <li>• {opt.kind === 'arithmetic' ? '公差 d' : '公比 r'}：<b>{opt.step}</b></li>
                <li>• 前 {TERMS} 项和：<b>{Number.isInteger(sum) ? sum : sum.toFixed(3)}</b></li>
                {infSum !== null && (
                  <li>• 无穷项和（公比小于 1 收敛）：<b>{infSum.toFixed(3)}</b></li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
