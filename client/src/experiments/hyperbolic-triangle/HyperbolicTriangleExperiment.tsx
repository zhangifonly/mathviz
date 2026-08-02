import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { hyperbolicTriangleNarration } from '../../narrations/scripts/hyperbolic-triangle'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawHyperbolic } from './draw'
import SidePanel from './SidePanel'
import { triangleOf, angleSum, angularDefect, areaFraction } from './hyperbolicTriangle'

const W = 560
const H = 480
const DEG = 180 / Math.PI

export default function HyperbolicTriangleExperiment() {
  const [scale, setScale] = useState(0.5)
  const [showGrid, setShowGrid] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(hyperbolicTriangleNarration)
  }, [narration])

  const tri = useMemo(() => triangleOf(scale), [scale])

  // 双曲图是静态的, 参数变化时重画一次即可
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawHyperbolic(canvas, {
      triangle: tri,
      showGrid,
      showAngles: true,
      title: '庞加莱圆盘中的双曲三角形',
      subtitle: `内角和 ${(angleSum(tri) * DEG).toFixed(2)}° · 角亏 ${angularDefect(tri).toFixed(4)}`,
      readout: `面积占上界 π 的 ${(areaFraction(tri) * 100).toFixed(1)}%`,
    })
  }, [tri, showGrid])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">双曲三角形与角亏</h1>
            <p className="text-gray-600">面积竟然有上界</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">三条边都是垂直于边界的测地线</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            scale={scale} showGrid={showGrid}
            onScale={setScale} onToggleGrid={() => setShowGrid((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
