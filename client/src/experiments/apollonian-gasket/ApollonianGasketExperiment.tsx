import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { apollonianGasketNarration } from '../../narrations/scripts/apollonian-gasket'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { generateGasket, DEPTHS } from './apollonianGasket'
import { drawApollonianGasket } from './draw'

const W = 600
const H = 480

export default function ApollonianGasketExperiment() {
  const [depth, setDepth] = useState(4)
  const [fill, setFill] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(apollonianGasketNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawApollonianGasket(canvas, depth, fill)
  }, [depth, fill])

  const total = generateGasket(depth).length

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">阿波罗尼垫片</h1>
            <p className="text-gray-600">相切圆的分形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">递归深度 {depth} · 共 {total} 个圆</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">递归深度</h3>
              <div className="space-y-2">
                {DEPTHS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${depth === d ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    深度 {d}
                  </button>
                ))}
              </div>
              <button onClick={() => setFill((f) => !f)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {fill ? '只描边框' : '填充色彩'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">笛卡尔圆定理</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 曲率 <b>k = 1/r</b>，包住别人的外圆取<b>负</b>曲率。</li>
                <li>• 四相切圆：<b>(k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²)</b>。</li>
                <li>• 每个缝隙都可再嵌一个相切圆，无限递归。</li>
                <li>• 垫片的分形维数约为 <b>1.3057</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
