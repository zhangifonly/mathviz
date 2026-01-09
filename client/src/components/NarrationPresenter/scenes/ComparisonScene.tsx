/**
 * 对比场景组件
 *
 * 并排显示时域和频域
 */

import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import type { SceneState } from '../types'

interface ComparisonSceneProps {
  state: SceneState
  onStateChange: (updates: Partial<SceneState>) => void
  interactive?: {
    allowWaveTypeChange?: boolean
    allowParamChange?: boolean
  }
}

export function ComparisonScene({
  state,
  onStateChange,
  interactive,
}: ComparisonSceneProps) {
  // 计算时域数据
  const timeData = useMemo(() => {
    const N = 256
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

    return { t, original, approx }
  }, [state])

  // 计算频域数据
  const freqData = useMemo(() => {
    const freqBins: number[] = []
    const magnitudes: number[] = []

    for (let n = 1; n <= 10; n++) {
      freqBins.push(n * state.frequency)
      let mag = 0
      if (state.waveType === 'square' && n % 2 === 1) {
        mag = (4 / Math.PI) * (1 / n)
      } else if (state.waveType === 'sawtooth') {
        mag = (2 / Math.PI) * (1 / n)
      } else if (state.waveType === 'triangle' && n % 2 === 1) {
        mag = (8 / (Math.PI * Math.PI)) * (1 / (n * n))
      } else if (state.waveType === 'sine' && n === 1) {
        mag = 1
      }
      magnitudes.push(mag * state.amplitude)
    }

    return { freqBins, magnitudes }
  }, [state])

  const waveTypeNames = {
    sine: '正弦波',
    square: '方波',
    sawtooth: '锯齿波',
    triangle: '三角波',
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* 双图表并排 */}
      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* 时域 */}
        <div className="bg-white rounded-xl overflow-hidden flex flex-col">
          <div className="bg-indigo-500 text-white text-center py-2 font-bold">
            时域 (Time Domain)
          </div>
          <div className="flex-1">
            <Plot
              data={[
                {
                  x: timeData.t,
                  y: timeData.original,
                  type: 'scatter',
                  mode: 'lines',
                  name: '原始信号',
                  line: { color: '#6366f1', width: 2 },
                },
                {
                  x: timeData.t,
                  y: timeData.approx,
                  type: 'scatter',
                  mode: 'lines',
                  name: '傅里叶逼近',
                  line: { color: '#f43f5e', width: 2, dash: 'dash' },
                },
              ]}
              layout={{
                autosize: true,
                margin: { t: 20, r: 20, b: 40, l: 40 },
                xaxis: { title: { text: '时间 t' }, gridcolor: '#f1f5f9' },
                yaxis: { title: { text: '振幅' }, gridcolor: '#f1f5f9', range: [-1.5, 1.5] },
                legend: { orientation: 'h', y: -0.2 },
                paper_bgcolor: 'white',
                plot_bgcolor: 'white',
              }}
              config={{ responsive: true, displayModeBar: false, displaylogo: false }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>

        {/* 频域 */}
        <div className="bg-white rounded-xl overflow-hidden flex flex-col">
          <div className="bg-violet-500 text-white text-center py-2 font-bold">
            频域 (Frequency Domain)
          </div>
          <div className="flex-1">
            <Plot
              data={[
                {
                  x: freqData.freqBins,
                  y: freqData.magnitudes,
                  type: 'bar',
                  marker: {
                    color: freqData.magnitudes.map((m) =>
                      m > 0.01 ? 'rgba(139, 92, 246, 0.8)' : 'rgba(200, 200, 200, 0.3)'
                    ),
                  },
                },
              ]}
              layout={{
                autosize: true,
                margin: { t: 20, r: 20, b: 40, l: 40 },
                xaxis: { title: { text: '频率 (Hz)' }, gridcolor: '#f1f5f9' },
                yaxis: { title: { text: '幅度' }, gridcolor: '#f1f5f9', range: [0, 1.5] },
                paper_bgcolor: 'white',
                plot_bgcolor: 'white',
              }}
              config={{ responsive: true, displayModeBar: false, displaylogo: false }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* 中间的转换箭头 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          傅里叶变换 ⟷
        </div>
      </div>

      {/* 交互控制 */}
      {interactive?.allowWaveTypeChange && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-white/70 text-sm">切换波形:</span>
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
      )}
    </div>
  )
}
