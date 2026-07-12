import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { circleGeometryNarration } from '../../narrations/scripts/circle-geometry'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { CIRCLE_TOPICS, circleMeasures, degToRad } from './circleGeometry'
import { drawCircleGeometry } from './draw'

export default function CircleGeometryExperiment() {
  const [topicId, setTopicId] = useState('circumference')
  const [angleDeg, setAngleDeg] = useState(90)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(circleGeometryNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.02)
      drawCircleGeometry(canvas, { topicId, angleDeg }, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [topicId, angleDeg])

  const info = CIRCLE_TOPICS.find((t) => t.id === topicId)!
  const radius = 1
  const m = circleMeasures(radius, degToRad(angleDeg))

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">圆的几何</h1>
            <p className="text-gray-600">从周长面积到圆周角定理</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · 圆心角 {angleDeg}°</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择主题</h3>
              <div className="space-y-2">
                {CIRCLE_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTopicId(t.id)
                      setAngleDeg(t.angleDeg)
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${topicId === t.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{t.label}</div>
                    <div className={`text-xs ${topicId === t.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{t.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">圆心角</h3>
              <input
                type="range"
                min={10}
                max={360}
                step={5}
                value={angleDeg}
                onChange={(e) => setAngleDeg(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <div>半径取 1 时（圆心角 {angleDeg}°）：</div>
                <div>• 弧长 ≈ {m.arcLength.toFixed(3)}</div>
                <div>• 扇形面积 ≈ {m.sectorArea.toFixed(3)}</div>
                <div>• 弦长 ≈ {m.chordLength.toFixed(3)}</div>
                <div>• 圆周角 ≈ {(angleDeg / 2).toFixed(1)}°</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">圆的趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 圆是<b>周长一定时面积最大</b>的平面图形。</li>
                <li>• 周长与面积都离不开常数<b>圆周率 π</b>。</li>
                <li>• 弧长和扇形面积都与<b>圆心角成正比</b>。</li>
                <li>• <b>圆周角定理</b>：同弧所对圆周角恒为圆心角的一半。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
