import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sphericalLuneNarration } from '../../narrations/scripts/spherical-lune'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawSphereScene } from '../../lib/drawSphere'
import SidePanel from './SidePanel'
import { buildScene, type LuneMode } from './scene'

const W = 640
const H = 480

export default function SphericalLuneExperiment() {
  const [mode, setMode] = useState<LuneMode>('lune')
  const [alpha, setAlpha] = useState(Math.PI / 2)
  const [n, setN] = useState(5)
  const [latDeg, setLatDeg] = useState(35)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sphericalLuneNarration)
  }, [narration])

  const scene = useMemo(
    () => buildScene(mode, alpha, n, latDeg),
    [mode, alpha, n, latDeg],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      drawSphereScene(canvas, {
        title: scene.title,
        subtitle: scene.subtitle,
        readout: scene.readout,
        patches: scene.patches,
        paths: scene.paths,
        markers: scene.markers,
        greatCircles: scene.greatCircles,
        yaw: 0.6 + el * 0.2,
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
            <h1 className="text-2xl font-bold text-gray-800">球面二角形</h1>
            <p className="text-gray-600">平面上不存在的图形</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              {mode === 'lune' ? '两个大圆交于对径两点，夹出月牙' : '每条边是大圆弧'}
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            mode={mode} alpha={alpha} n={n} latDeg={latDeg}
            onMode={setMode} onAlpha={setAlpha} onN={setN} onLat={setLatDeg}
          />
        </div>
      </div>
    </>
  )
}
