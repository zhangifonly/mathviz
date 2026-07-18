import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { pigeonholeNarration } from '../../narrations/scripts/pigeonhole'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SCENARIOS, guaranteedMax, hasCollision } from './pigeonhole'
import { drawPigeonhole } from './draw'

const W = 600
const H = 480

export default function PigeonholeExperiment() {
  const [items, setItems] = useState(13)
  const [holes, setHoles] = useState(12)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(pigeonholeNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawPigeonhole(canvas, items, holes, seed)
  }, [items, holes, seed])

  const gmax = guaranteedMax(items, holes)
  const collide = hasCollision(items, holes)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">鸽巢原理</h1>
            <p className="text-gray-600">抽屉里藏着的必然</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{items} 只鸽子 · {holes} 个巢</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">经典场景</h3>
              <div className="space-y-2">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => { setItems(s.items); setHoles(s.holes) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${items === s.items && holes === s.holes ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                <label className="block text-sm text-gray-600">鸽子数：{items}
                  <input type="range" min={1} max={40} value={items} onChange={(e) => setItems(+e.target.value)} className="w-full" />
                </label>
                <label className="block text-sm text-gray-600">巢数：{holes}
                  <input type="range" min={1} max={24} value={holes} onChange={(e) => setHoles(+e.target.value)} className="w-full" />
                </label>
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新随机分配
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">必然结论</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 必有某巢至少装 <b>{gmax}</b> 只（⌈{items}/{holes}⌉）。</li>
                <li>• {collide ? '鸽子多于巢，必然有巢挤下 2 只以上。' : '鸽子不多于巢，可能恰好一人一巢。'}</li>
                <li>• 无论怎么放都躲不掉——这就是鸽巢原理的<b>必然性</b>。</li>
                <li>• 生日悖论、握手问题都是它的化身。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
