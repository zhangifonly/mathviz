import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { torusKleinNarration } from '../../narrations/scripts/torus-klein'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SURFACES, isOrientable, type Surface } from './torusKlein'
import { drawTorusKlein } from './draw'

const W = 600
const H = 480
const LABELS: Record<Surface, string> = { torus: '环面 Torus', klein: '克莱因瓶 Klein' }

export default function TorusKleinExperiment() {
  const [surface, setSurface] = useState<Surface>('torus')
  const [angle, setAngle] = useState(0.7)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(torusKleinNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawTorusKlein(canvas, surface, angle, 0.5)
  }, [surface, angle])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">环面与克莱因瓶</h1>
            <p className="text-gray-600">边的粘合</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{LABELS[surface]} · 3D 线框投影</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-900" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择曲面</h3>
              <div className="space-y-2">
                {SURFACES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSurface(s)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${surface === s ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {LABELS[s]} · {isOrientable(s) ? '可定向' : '不可定向'}
                  </button>
                ))}
              </div>
              <label className="block text-sm text-gray-600 mt-4 mb-1">旋转角度</label>
              <input type="range" min={0} max={6.28} step={0.05} value={angle} onChange={(e) => setAngle(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">边的粘合</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 正方形<b>左右</b>、<b>上下</b>两对边都同向粘 = <b>环面</b>。</li>
                <li>• 只把一对边<b>翻面反向</b>粘 = <b>克莱因瓶</b>。</li>
                <li>• 环面有里外，可定向；克莱因瓶无内外，<b>不可定向</b>。</li>
                <li>• 克莱因瓶在三维必须自我穿过，真身住在<b>四维</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
