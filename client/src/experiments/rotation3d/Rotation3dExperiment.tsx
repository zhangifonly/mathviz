import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { rotation3dNarration } from '../../narrations/scripts/rotation3d'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawRotation3d } from './draw'

const W = 600
const H = 480

const SLIDERS: { key: 'ax' | 'ay' | 'az'; label: string; color: string }[] = [
  { key: 'ax', label: '绕 X 轴（红）', color: 'text-red-600' },
  { key: 'ay', label: '绕 Y 轴（绿）', color: 'text-green-600' },
  { key: 'az', label: '绕 Z 轴（蓝）', color: 'text-blue-600' },
]

export default function Rotation3dExperiment() {
  const [angles, setAngles] = useState({ ax: 25, ay: 35, az: 0 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(rotation3dNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawRotation3d(canvas, angles.ax, angles.ay, angles.az)
  }, [angles])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">三维旋转矩阵</h1>
            <p className="text-gray-600">欧拉角与旋转</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">立方体线框 · 正交投影</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">欧拉角</h3>
              <div className="space-y-3">
                {SLIDERS.map((s) => (
                  <div key={s.key}>
                    <label className={`flex justify-between text-sm font-medium ${s.color}`}>
                      <span>{s.label}</span><span>{angles[s.key]}°</span>
                    </label>
                    <input
                      type="range" min={0} max={360} step={1} value={angles[s.key]}
                      onChange={(e) => setAngles((a) => ({ ...a, [s.key]: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => setAngles({ ax: 0, ay: 0, az: 0 })} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                ↺ 复位到零角度
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 旋转矩阵<b>正交</b>，保持长度与夹角。</li>
                <li>• 组合顺序不可交换：先转 X 再转 Y ≠ 反过来。</li>
                <li>• 三角度都非零时可能出现<b>万向锁</b>。</li>
                <li>• 游戏、机器人、航天姿态都靠它描述朝向。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
