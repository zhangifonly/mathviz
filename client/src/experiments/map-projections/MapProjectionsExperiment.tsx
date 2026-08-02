import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { mapProjectionsNarration } from '../../narrations/scripts/map-projections'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawMap } from './draw'
import SidePanel from './SidePanel'
import type { ProjectionKind } from './mapProjections'

const W = 660
const H = 460

export default function MapProjectionsExperiment() {
  const [kind, setKind] = useState<ProjectionKind>('mercator')
  const [heatmap, setHeatmap] = useState<'none' | 'area' | 'angle'>('area')
  const [probeLat, setProbeLat] = useState(60)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(mapProjectionsNarration)
  }, [narration])

  // 地图是静态的, 不需要逐帧动画 —— 参数变化时重画一次即可
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawMap(canvas, { kind, heatmap, showTissot: true, highlightLat: probeLat })
  }, [kind, heatmap, probeLat])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">地图投影与失真</h1>
            <p className="text-gray-600">为什么格陵兰看着比非洲还大</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              黄色椭圆是 Tissot 指示椭圆：球面小圆投影后的样子
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            kind={kind} heatmap={heatmap} probeLat={probeLat}
            onKind={setKind} onHeatmap={setHeatmap} onProbeLat={setProbeLat}
          />
        </div>
      </div>
    </>
  )
}
