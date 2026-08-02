import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sphericalTilingNarration } from '../../narrations/scripts/spherical-tiling'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawSphereScene, type SphericalPatch } from '../../lib/drawSphere'
import { rampColor } from '../../lib/proj3d'
import SidePanel from './SidePanel'
import {
  sphericalVertices, tilingFaces, totalArea, infoOf, type TilingKind,
} from './sphericalTiling'

const W = 640
const H = 480

export default function SphericalTilingExperiment() {
  const [kind, setKind] = useState<TilingKind>('dodecahedron')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sphericalTilingNarration)
  }, [narration])

  // 每个面一块 patch, 用配色带区分相邻面
  const patches = useMemo<SphericalPatch[]>(() => {
    const verts = sphericalVertices(kind)
    const faces = tilingFaces(kind)
    return faces.map((ring, i) => ({
      vertices: ring.map((vi) => verts[vi]),
      fill: rampColor(i / Math.max(1, faces.length - 1), 'viridis', 0.85),
    }))
  }, [kind])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      const el = (ts - t0) / 1000
      const info = infoOf(kind)
      drawSphereScene(canvas, {
        title: `${info.schlafli} ${info.label}`,
        // 边数从面表取, 不要用 schlafli[1] 那种字符串下标 —— 那只是碰巧对
        subtitle: `${info.F} 个球面正 ${tilingFaces(kind)[0].length} 边形 · ${info.note}`,
        patches,
        showGrid: false,
        showVertices: true,
        readout: `总面积 ${totalArea(kind).toFixed(4)} = 4π`,
        yaw: 0.6 + el * 0.2,
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [patches, kind])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">球面镶嵌</h1>
            <p className="text-gray-600">一个不等式划分三种几何</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">每个面一色，边是大圆弧</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel kind={kind} onKind={setKind} />
        </div>
      </div>
    </>
  )
}
