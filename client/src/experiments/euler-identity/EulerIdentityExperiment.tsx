import { useState, useEffect, useRef, useMemo } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { eulerIdentityNarration } from '../../narrations/scripts/euler-identity'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { eulerPoint, unitCirclePoints, arcPoints } from './euler'

interface XY { x: number[]; y: number[] }

// 复平面可视化卡片
function ComplexPlaneCard({ unitCircle, arc, re, im, theta }: {
  unitCircle: XY; arc: XY; re: number; im: number; theta: number
}) {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-2">复平面单位圆 · e^(iθ)</h3>
      <Plot
        data={[
          { x: unitCircle.x, y: unitCircle.y, type: 'scatter', mode: 'lines', line: { color: '#cbd5e1', width: 1.5 }, name: '单位圆', hoverinfo: 'skip' },
          { x: arc.x, y: arc.y, type: 'scatter', mode: 'lines', line: { color: '#8b5cf6', width: 3 }, name: '已扫过的弧', hoverinfo: 'skip' },
          { x: [0, re], y: [0, im], type: 'scatter', mode: 'lines+markers', line: { color: '#ef4444', width: 2.5 }, marker: { size: [4, 12], color: '#ef4444' }, name: 'e^(iθ)' },
          { x: [re], y: [0], type: 'scatter', mode: 'markers', marker: { size: 8, color: '#10b981' }, name: 'cosθ (实部)' },
          { x: [0], y: [im], type: 'scatter', mode: 'markers', marker: { size: 8, color: '#f59e0b' }, name: 'sinθ (虚部)' },
        ]}
        layout={{
          autosize: true, height: 460,
          margin: { t: 10, r: 10, b: 30, l: 30 },
          xaxis: { range: [-1.4, 1.4], zeroline: true, scaleanchor: 'y', scaleratio: 1, title: { text: '实轴 Re' } },
          yaxis: { range: [-1.4, 1.4], zeroline: true, title: { text: '虚轴 Im' } },
          legend: { orientation: 'h', y: -0.12 },
          annotations: [{ x: re, y: im, text: `θ=${theta.toFixed(2)}`, showarrow: true, arrowhead: 2, ax: 30, ay: -30, font: { color: '#ef4444' } }],
        }}
        config={{ responsive: true, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// 侧边公式与控制面板
function SidePanel({ theta, setTheta, isAnimating, setIsAnimating, re, im }: {
  theta: number; setTheta: (n: number) => void
  isAnimating: boolean; setIsAnimating: (b: boolean) => void
  re: number; im: number
}) {
  const isPi = Math.abs(theta - Math.PI) < 0.05
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">欧拉公式</h3>
        <div className="p-3 bg-indigo-50 rounded-lg space-y-2">
          <MathFormula formula="e^{i\theta} = \cos\theta + i\sin\theta" />
        </div>
        <div className="mt-3 p-3 bg-rose-50 rounded-lg text-center">
          <MathFormula formula="e^{i\pi} + 1 = 0" />
          <p className="text-xs text-rose-600 mt-2">当 θ = π 时的特例</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">当前值</h3>
        <div className="space-y-1 font-mono text-sm">
          <div>θ = {theta.toFixed(4)} rad</div>
          <div className="text-emerald-600">cosθ = {re.toFixed(4)}</div>
          <div className="text-amber-600">sinθ = {im.toFixed(4)}</div>
          <div className={isPi ? 'text-rose-600 font-bold' : 'text-gray-700'}>
            e^(iθ) = {re.toFixed(3)} {im >= 0 ? '+' : '−'} {Math.abs(im).toFixed(3)}i
          </div>
        </div>
        {isPi && <div className="mt-2 text-xs text-rose-600">≈ −1，恰好抵达实轴负方向！</div>}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-3">控制</h3>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-white mb-3 ${isAnimating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >{isAnimating ? '⏸ 暂停旋转' : '▶ 播放旋转'}</button>
        <label className="text-sm text-gray-600">角度 θ: {(theta / Math.PI).toFixed(2)}π</label>
        <input type="range" min="0" max={(Math.PI * 2).toFixed(3)} step="0.01" value={theta} onChange={(e) => { setIsAnimating(false); setTheta(parseFloat(e.target.value)) }} className="w-full" />
        <div className="flex gap-2 mt-2">
          {[0, 0.5, 1, 1.5].map((m) => (
            <button key={m} onClick={() => { setIsAnimating(false); setTheta(m * Math.PI) }} className="flex-1 px-1 py-1 text-xs rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100">{m === 0 ? '0' : `${m}π`}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-2">五大常数</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <b>e</b> 自然对数底 ≈ 2.718</li>
          <li>• <b>i</b> 虚数单位，i² = −1</li>
          <li>• <b>π</b> 圆周率 ≈ 3.14159</li>
          <li>• <b>1</b> 乘法单位元</li>
          <li>• <b>0</b> 加法单位元</li>
        </ul>
      </div>
    </div>
  )
}

export default function EulerIdentityExperiment() {
  const [theta, setTheta] = useState(Math.PI) // 当前角度，默认 π
  const [isAnimating, setIsAnimating] = useState(false)
  const animRef = useRef<number | null>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit: handleExitPresenter } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(eulerIdentityNarration)
  }, [narration])

  // 旋转动画
  useEffect(() => {
    if (!isAnimating) return
    const animate = () => {
      setTheta((t) => {
        const next = t + 0.02
        return next > Math.PI * 2 ? 0 : next
      })
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [isAnimating])

  // 单位圆
  const unitCircle = useMemo(() => unitCirclePoints(100), [])

  // 当前点 e^(iθ) = cosθ + i·sinθ
  const { re, im } = eulerPoint(theta)

  // 走过的弧
  const arc = useMemo(() => arcPoints(theta, 100), [theta])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExitPresenter} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">欧拉恒等式</h1>
            <p className="text-gray-600">最美的数学公式 e^(iπ) + 1 = 0</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ComplexPlaneCard unitCircle={unitCircle} arc={arc} re={re} im={im} theta={theta} />
          <SidePanel
            theta={theta} setTheta={setTheta}
            isAnimating={isAnimating} setIsAnimating={setIsAnimating}
            re={re} im={im}
          />
        </div>
      </div>
    </>
  )
}
