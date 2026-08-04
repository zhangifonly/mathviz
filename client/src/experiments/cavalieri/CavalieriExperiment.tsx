import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { cavalieriNarration } from '../../narrations/scripts/cavalieri'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawCavalieri } from './draw'
import SidePanel from './SidePanel'
import { sceneOf, type SceneId } from './cavalieri'

const W = 640
const H = 470

export default function CavalieriExperiment() {
  const [sceneId, setSceneId] = useState<SceneId>('sphere')
  const [h, setH] = useState(0.35)
  const [exploded, setExploded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(cavalieriNarration)
  }, [narration])

  const sc = useMemo(() => sceneOf(sceneId, 1), [sceneId])
  // 换场景时高度上限会变。直接在渲染时夹，不用 effect + setState ——
  // 那样会触发级联渲染（eslint 的 react-hooks/set-state-in-effect 会拦）。
  const clampedH = Math.min(h, sc.left.height * 0.999)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCavalieri(canvas, {
      left: sc.left, right: sc.right, h: clampedH, exploded,
      title: sc.label,
      subtitle: sc.claim,
    })
  }, [sc, clampedH, exploded])

  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cavalieri 原理</h1>
            <p className="text-gray-600">截面积处处相等，体积就相等</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">
              拖动滑块，两片黄色截面的面积始终相等
            </h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <SidePanel
            sceneId={sceneId} h={clampedH} exploded={exploded}
            onScene={setSceneId} onH={setH}
            onToggleExploded={() => setExploded((v) => !v)}
          />
        </div>
      </div>
    </>
  )
}
