/**
 * 波形场景组件
 *
 * 显示时域波形图，支持动画和交互
 */

import { useMemo, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import type { SceneState } from '../types'

interface WaveformSceneProps {
  state: SceneState
  onStateChange: (updates: Partial<SceneState>) => void
  interactive?: {
    allowWaveTypeChange?: boolean
    allowParamChange?: boolean
    allowAnimation?: boolean
  }
  showAnimation?: boolean
}

export function WaveformScene({
  state,
  onStateChange,
  interactive,
  showAnimation,
}: WaveformSceneProps) {
  const animationRef = useRef<number | null>(null)

  // 动画效果
  useEffect(() => {
    if (!showAnimation || !state.isAnimating) return

    const animate = () => {
      onStateChange({
        terms: Math.min(state.terms + 1, 50),
      })

      if (state.terms < 50) {
        animationRef.current = window.setTimeout(() => {
          animationRef.current = requestAnimationFrame(animate) as unknown as number
        }, 150)
      } else {
        onStateChange({ isAnimating: false })
      }
    }

    animationRef.current = requestAnimationFrame(animate) as unknown as number

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        clearTimeout(animationRef.current)
      }
    }
  }, [showAnimation, state.isAnimating, state.terms, onStateChange])

  // 计算波形数据
  const { timeData, fourierApprox } = useMemo(() => {
    const N = 512
    const t: number[] = []
    const original: number[] = []
    const approx: number[] = []

    for (let i = 0; i < N; i++) {
      const x = (i / N) * 2 * Math.PI
      t.push(x)

      let y = 0
      if (state.waveType === 'sine') {
        y = state.amplitude * Math.sin(state.frequency * x)
      } else if (state.waveType === 'square') {
        y = state.amplitude * Math.sign(Math.sin(state.frequency * x))
      } else if (state.waveType === 'sawtooth') {
        y = state.amplitude * (2 * ((state.frequency * x / (2 * Math.PI)) % 1) - 1)
      } else if (state.waveType === 'triangle') {
        y = state.amplitude * (2 * Math.abs(2 * ((state.frequency * x / (2 * Math.PI)) % 1) - 1) - 1)
      }
      original.push(y)

      let fourierSum = 0
      for (let n = 1; n <= state.terms; n++) {
        if (state.waveType === 'sine') {
          fourierSum = state.amplitude * Math.sin(state.frequency * x)
          break
        } else if (state.waveType === 'square') {
          const k = 2 * n - 1
          fourierSum += (4 / Math.PI) * (1 / k) * Math.sin(k * state.frequency * x)
        } else if (state.waveType === 'sawtooth') {
          fourierSum += (2 / Math.PI) * (Math.pow(-1, n + 1) / n) * Math.sin(n * state.frequency * x)
        } else if (state.waveType === 'triangle') {
          const k = 2 * n - 1
          fourierSum += (8 / (Math.PI * Math.PI)) * (Math.pow(-1, n + 1) / (k * k)) * Math.sin(k * state.frequency * x)
        }
      }
      approx.push(fourierSum * state.amplitude)
    }

    return {
      timeData: { t, original },
      fourierApprox: approx,
    }
  }, [state])

  const waveTypeNames = {
    sine: '正弦波',
    square: '方波',
    sawtooth: '锯齿波',
    triangle: '三角波',
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* 图表 */}
      <div className="flex-1 bg-white rounded-xl overflow-hidden">
        <Plot
          data={[
            {
              x: timeData.t,
              y: timeData.original,
              type: 'scatter',
              mode: 'lines',
              name: `原始${waveTypeNames[state.waveType]}`,
              line: { color: '#6366f1', width: 3 },
            },
            {
              x: timeData.t,
              y: fourierApprox,
              type: 'scatter',
              mode: 'lines',
              name: `傅里叶逼近 (${state.terms}项)`,
              line: { color: '#f43f5e', width: 2, dash: 'dash' },
            },
          ]}
          layout={{
            autosize: true,
            margin: { t: 40, r: 40, b: 60, l: 60 },
            xaxis: {
              title: '时间 t',
              gridcolor: '#f1f5f9',
              zerolinecolor: '#e2e8f0',
            },
            yaxis: {
              title: '振幅',
              gridcolor: '#f1f5f9',
              zerolinecolor: '#e2e8f0',
              range: [-2, 2],
            },
            legend: {
              orientation: 'h',
              y: 1.1,
              x: 0.5,
              xanchor: 'center',
            },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            font: { size: 14 },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* 交互控制 */}
      {interactive && (
        <div className="mt-4 flex items-center justify-center gap-6">
          {/* 波形选择 */}
          {interactive.allowWaveTypeChange && (
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm">波形:</span>
              <div className="flex gap-1">
                {(['sine', 'square', 'sawtooth', 'triangle'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => onStateChange({ waveType: type })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      state.waveType === type
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {waveTypeNames[type]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 项数控制 */}
          {interactive.allowParamChange && (
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm">项数: {state.terms}</span>
              <input
                type="range"
                min={1}
                max={50}
                value={state.terms}
                onChange={(e) => onStateChange({ terms: Number(e.target.value) })}
                className="w-32 accent-indigo-500"
              />
            </div>
          )}

          {/* 动画控制 */}
          {interactive.allowAnimation && (
            <button
              onClick={() => {
                if (state.isAnimating) {
                  onStateChange({ isAnimating: false })
                } else {
                  onStateChange({ terms: 1, isAnimating: true })
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                state.isAnimating
                  ? 'bg-rose-500 text-white'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {state.isAnimating ? '停止动画' : '播放动画'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
