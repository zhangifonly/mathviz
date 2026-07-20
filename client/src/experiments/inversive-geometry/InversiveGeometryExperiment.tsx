import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { inversiveGeometryNarration } from '../../narrations/scripts/inversive-geometry'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DEMO_SHAPES, INVERSION_RADIUS } from './inversiveGeometry'
import { drawInversiveGeometry } from './draw'

const W = 600
const H = 480
const RADII = [70, 110, 150]

export default function InversiveGeometryExperiment() {
  const [radius, setRadius] = useState(INVERSION_RADIUS)
  const [showImage, setShowImage] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(inversiveGeometryNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawInversiveGeometry(canvas, DEMO_SHAPES, radius, showImage)
  }, [radius, showImage])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">反演几何</h1>
            <p className="text-gray-600">圆与直线的互换</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">反演圆 R = {radius} · 实线原形，虚线为反演像</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">反演半径 R</h3>
              <div className="space-y-2">
                {RADII.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${radius === r ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    R = {r}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowImage((v) => !v)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                {showImage ? '隐藏反演像' : '显示反演像'}
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 反演满足 |OP'|·|OP| = R²，且 P' 与 P 在过 O 的同一射线上。</li>
                <li>• 过反演中心的<b>圆</b>反演成<b>直线</b>，不过 O 的直线反演成<b>过 O 的圆</b>。</li>
                <li>• 不过 O 的圆仍是圆，圆与直线在反演下统一为"广义圆"。</li>
                <li>• 反演保角，是<b>共形变换</b>，也是双曲几何与斯坦纳链的利器。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
