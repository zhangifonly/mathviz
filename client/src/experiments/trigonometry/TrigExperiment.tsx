import { useState, useEffect, useRef, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import ParameterPanel from '../../components/ParameterPanel/ParameterPanel'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { trigonometryNarration } from '../../narrations/scripts/trigonometry'

export default function TrigExperiment() {
  const [params, setParams] = useState({
    angle: 45,
    amplitude: 1,
    frequency: 1,
    phase: 0,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | null>(null)
  const [showPresenter, setShowPresenter] = useState(false)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(trigonometryNarration)
    }
  }, [narration])

  // 开始讲解 - 进入全屏 PPT 模式
  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  // 退出讲解
  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        setParams((prev) => ({
          ...prev,
          angle: (prev.angle + 2) % 360,
        }))
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isAnimating])

  const angleRad = (params.angle * Math.PI) / 180
  const sinValue = Math.sin(angleRad)
  const cosValue = Math.cos(angleRad)
  const tanValue = Math.tan(angleRad)

  const circleTheta = Array.from({ length: 100 }, (_, i) => (i / 99) * 2 * Math.PI)
  const circleX = circleTheta.map(Math.cos)
  const circleY = circleTheta.map(Math.sin)

  const t = Array.from({ length: 200 }, (_, i) => (i / 199) * 4 * Math.PI)
  const sinWave = t.map((x) => params.amplitude * Math.sin(params.frequency * x + (params.phase * Math.PI) / 180))
  const cosWave = t.map((x) => params.amplitude * Math.cos(params.frequency * x + (params.phase * Math.PI) / 180))

  return (
    <>
      {/* 全屏 PPT 讲解模式 */}
      {showPresenter && (
        <NarrationPresenter onExit={handleExitPresenter} />
      )}

      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">三角函数</h1>
            <p className="text-gray-600">通过单位圆理解正弦、余弦和正切</p>
          </div>
          <button
            onClick={handleStartNarration}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">单位圆</h3>
              <Plot
                data={[
                  { x: circleX, y: circleY, type: 'scatter' as const, mode: 'lines' as const, name: '单位圆', line: { color: '#94a3b8', width: 2 } },
                  { x: [-1.2, 1.2], y: [0, 0], type: 'scatter' as const, mode: 'lines' as const, showlegend: false, line: { color: '#cbd5e1', width: 1 } },
                  { x: [0, 0], y: [-1.2, 1.2], type: 'scatter' as const, mode: 'lines' as const, showlegend: false, line: { color: '#cbd5e1', width: 1 } },
                  { x: [0, cosValue], y: [0, sinValue], type: 'scatter' as const, mode: 'lines' as const, name: '半径', line: { color: '#3b82f6', width: 3 } },
                  { x: [cosValue, cosValue], y: [0, sinValue], type: 'scatter' as const, mode: 'lines' as const, name: 'sin θ', line: { color: '#ef4444', width: 2, dash: 'dash' as const } },
                  { x: [0, cosValue], y: [0, 0], type: 'scatter' as const, mode: 'lines' as const, name: 'cos θ', line: { color: '#22c55e', width: 2, dash: 'dash' as const } },
                  { x: [cosValue], y: [sinValue], type: 'scatter' as const, mode: 'markers' as const, name: '点', marker: { color: '#3b82f6', size: 10 } },
                ]}
                layout={{
                  autosize: true,
                  height: 300,
                  margin: { t: 20, r: 20, b: 20, l: 20 },
                  xaxis: { range: [-1.5, 1.5], scaleanchor: 'y', scaleratio: 1, showgrid: false, zeroline: false },
                  yaxis: { range: [-1.5, 1.5], showgrid: false, zeroline: false },
                  showlegend: false,
                }}
                config={{ responsive: true, displaylogo: false }}
                className="w-full"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">三角函数值</h3>
              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">角度 θ</span>
                  <span className="font-mono font-bold text-lg">{params.angle}° ({(angleRad).toFixed(3)} rad)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600">sin θ</span>
                  <span className="font-mono font-bold text-lg text-red-700">{sinValue.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">cos θ</span>
                  <span className="font-mono font-bold text-lg text-green-700">{cosValue.toFixed(4)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-600">tan θ</span>
                  <span className="font-mono font-bold text-lg text-purple-700">
                    {Math.abs(tanValue) > 1000 ? '∞' : tanValue.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">正弦与余弦波形</h3>
            <Plot
              data={[
                { x: t, y: sinWave, type: 'scatter' as const, mode: 'lines' as const, name: 'sin(x)', line: { color: '#ef4444', width: 2 } as const },
                { x: t, y: cosWave, type: 'scatter' as const, mode: 'lines' as const, name: 'cos(x)', line: { color: '#22c55e', width: 2 } as const },
              ]}
              layout={{
                autosize: true,
                height: 250,
                margin: { t: 30, r: 30, b: 40, l: 50 },
                xaxis: { title: { text: 'x (rad)' } },
                yaxis: { title: { text: 'y' } },
                legend: { orientation: 'h', y: -0.2 },
              }}
              config={{ responsive: true, displaylogo: false }}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">动画控制</h3>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isAnimating
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isAnimating ? '停止动画' : '开始动画'}
            </button>
          </div>

          <ParameterPanel
            title="参数控制"
            params={[
              { key: 'angle', label: '角度', value: params.angle, min: 0, max: 360, step: 1, unit: '°' },
              { key: 'amplitude', label: '振幅', value: params.amplitude, min: 0.1, max: 2, step: 0.1 },
              { key: 'frequency', label: '频率', value: params.frequency, min: 0.5, max: 5, step: 0.5 },
              { key: 'phase', label: '相位', value: params.phase, min: 0, max: 360, step: 15, unit: '°' },
            ]}
            onChange={handleParamChange}
          />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-3">基本公式</h3>
            <div className="space-y-3">
              <MathFormula formula="\sin^2\theta + \cos^2\theta = 1" />
              <MathFormula formula="\tan\theta = \frac{\sin\theta}{\cos\theta}" />
              <MathFormula formula="\sin(A+B) = \sin A \cos B + \cos A \sin B" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
