import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { sphericalHarmonicsNarration } from '../../narrations/scripts/spherical-harmonics'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawHarmonic } from './draw'
import { nodalLines, laplaceEigenvalue, innerProduct, ORBITALS } from './sphericalHarmonics'

const W = 640
const H = 480

export default function SphericalHarmonicsExperiment() {
  const [l, setL] = useState(2)
  const [m, setM] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(sphericalHarmonicsNarration)
  }, [narration])

  // 用 Canvas 而非 Plotly: 要按 Y 的正负分色, surface 只能按 z 上色
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawHarmonic(canvas, { l, m, showInfo: true, yaw: 0.6 + el * 0.26 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [l, m])

  const nodes = nodalLines(l, m)
  const selfIp = innerProduct(l, m, l, m, 60)
  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">球谐函数</h1>
            <p className="text-gray-600">球面上的振动模态</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">Y(l={l}, m={m}) · 红为正叶，蓝为负叶</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">角量子数 l：{l}</h3>
              <input
                type="range" min={0} max={6} step={1} value={l}
                onChange={(e) => {
                  const nl = Number(e.target.value)
                  // |m| 不能超过 l, 否则球谐恒为零
                  setL(nl)
                  if (Math.abs(m) > nl) setM(0)
                }}
                className="w-full" aria-label="角量子数"
              />
              <h3 className="text-lg font-semibold mb-2 mt-3">磁量子数 m：{m}</h3>
              <input
                type="range" min={-l} max={l} step={1} value={m}
                onChange={(e) => setM(Number(e.target.value))}
                className="w-full" aria-label="磁量子数"
              />
              <div className="mt-3 space-y-2">
                {ORBITALS.map((o) => (
                  <button
                    key={o.label} onClick={() => { setL(o.l); setM(o.m) }}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${l === o.l && m === o.m ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <span>{o.label}</span><span className="text-xs opacity-70">{o.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">实时验证与要点</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 节线：纬向 <b>{nodes.latitudinal}</b> 条，经向 <b>{nodes.longitudinal}</b> 条（相加恒为 l）</li>
                <li>• 自身内积 <b>{selfIp.toFixed(4)}</b>（归一性要求等于 1）</li>
                <li>• 拉普拉斯特征值 <b>{laplaceEigenvalue(l)}</b>，即 −l(l+1)</li>
                <li>• <b>正交归一基</b>：任何球面函数都能按球谐展开，这是球面版的傅里叶级数。</li>
                <li>• <b>应用极广</b>：原子轨道、地球重力场、宇宙微波背景辐射功率谱。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
