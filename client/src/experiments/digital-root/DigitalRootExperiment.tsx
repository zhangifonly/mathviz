import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { digitalRootNarration } from '../../narrations/scripts/digital-root'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { digitalRoot, castingOutNines, SAMPLES, type CastOp } from './digitalRoot'
import { drawDigitalRoot, drawCasting } from './draw'

const W = 600
const H = 480

export default function DigitalRootExperiment() {
  const [n, setN] = useState(12345)
  const [a, setA] = useState(1234)
  const [b, setB] = useState(5678)
  const [op, setOp] = useState<CastOp>('add')
  const rootRef = useRef<HTMLCanvasElement>(null)
  const castRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(digitalRootNarration)
  }, [narration])

  useEffect(() => {
    if (rootRef.current) drawDigitalRoot(rootRef.current, n)
  }, [n])

  useEffect(() => {
    if (castRef.current) drawCasting(castRef.current, castingOutNines(a, b, op))
  }, [a, b, op])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">数字根与弃九验算</h1>
            <p className="text-gray-600">模九的巧妙应用</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">逐步坍缩 · 数字根 = {digitalRoot(n)}</h3>
              <canvas ref={rootRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">弃九验算对照</h3>
              <canvas ref={castRef} width={W} height={280} className="w-full rounded-lg bg-slate-50" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">求数字根</h3>
              <input type="number" value={n} onChange={(e) => setN(Math.abs(Math.trunc(Number(e.target.value) || 0)))}
                className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-300 text-sm" />
              <div className="flex flex-wrap gap-2">
                {SAMPLES.map((s) => (
                  <button key={s} onClick={() => setN(s)} className={`px-2 py-1 rounded text-xs font-medium ${n === s ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">弃九验算算式</h3>
              <div className="flex items-center gap-2">
                <input type="number" value={a} onChange={(e) => setA(Math.abs(Math.trunc(Number(e.target.value) || 0)))} className="w-20 px-2 py-1 rounded border border-gray-300 text-sm" />
                <button onClick={() => setOp((o) => (o === 'add' ? 'mul' : 'add'))} className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-bold">{op === 'add' ? '+' : '×'}</button>
                <input type="number" value={b} onChange={(e) => setB(Math.abs(Math.trunc(Number(e.target.value) || 0)))} className="w-20 px-2 py-1 rounded border border-gray-300 text-sm" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 数字根 = 反复各位求和后剩下的<b>一位数</b>。</li>
                <li>• 它等于原数<b>模 9</b>（余 0 记作 9）。</li>
                <li>• 因为 10 除以 9 余 1，每一位权重对 9 都余 1。</li>
                <li>• <b>弃九验算</b>：两边数字根不符则算术必错。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
