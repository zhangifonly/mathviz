import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { steinerChainNarration } from '../../narrations/scripts/steiner-chain'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { CHAIN_COUNTS } from './steinerChain'
import { drawSteinerChain } from './draw'

const W = 600
const H = 480

export default function SteinerChainExperiment() {
  const [count, setCount] = useState(6)
  const [mode, setMode] = useState<'general' | 'concentric'>('general')
  const [spin, setSpin] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotRef = useRef(0)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(steinerChainNarration)
  }, [narration])

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const canvas = canvasRef.current
      if (canvas) {
        if (spin) rotRef.current += 0.006
        drawSteinerChain(canvas, count, rotRef.current, mode)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [count, mode, spin])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">斯坦纳链</h1>
            <p className="text-gray-600">首尾相切的圆环链</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{count} 环链 · {mode === 'general' ? '一般（反演）' : '同心'}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">链圆数量</h3>
              <div className="space-y-2">
                {CHAIN_COUNTS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${count === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 个圆的闭合链
                  </button>
                ))}
              </div>
              <button onClick={() => setMode((m) => (m === 'general' ? 'concentric' : 'general'))} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-cyan-100 text-cyan-700 hover:bg-cyan-200">
                切换 {mode === 'general' ? '同心' : '一般'} 视图
              </button>
              <button onClick={() => setSpin((s) => !s)} className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {spin ? '⏸ 暂停旋转' : '▶ 让链条旋转'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每个链圆同时与内、外圆相切，且与左右邻居相切。</li>
                <li>• 闭合条件：<b>sin(π/n) = (R−r)/(R+r)</b>。</li>
                <li>• 斯坦纳定理：一旦闭合，链条可<b>任意旋转</b>仍闭合。</li>
                <li>• 一般情形由同心链经<b>圆反演</b>映射而来，相切关系不变。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
