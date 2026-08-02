import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { geodesicShortestPathNarration } from '../../narrations/scripts/geodesic-shortest-path'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawSphereScene } from '../../lib/drawSphere'
import SidePanel from './SidePanel'
import { buildRouteScene } from './scene'
import { toKilometers } from './geodesicShortestPath'

const W = 640
const H = 480

export default function GeodesicShortestPathExperiment() {
  const [pairIndex, setPairIndex] = useState(0)
  const [detour, setDetour] = useState(0.35)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(geodesicShortestPathNarration)
  }, [narration])

  const scene = useMemo(() => buildRouteScene(pairIndex, detour), [pairIndex, detour])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawSphereScene(canvas, {
        title: `${scene.pair.from} → ${scene.pair.to}`,
        subtitle: `大圆距离 ${toKilometers(scene.gc).toFixed(0)} km · ${scene.pair.note}`,
        paths: scene.paths,
        markers: scene.markers,
        yaw: 0.6 + el * 0.18,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [scene])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">球面测地线</h1>
            <p className="text-gray-600">为什么跨洋航班往北飞</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">黄线最短，灰线沿纬线，红线绕道</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            pairIndex={pairIndex} detour={detour}
            onPair={setPairIndex} onDetour={setDetour}
          />
        </div>
      </div>
    </>
  )
}
