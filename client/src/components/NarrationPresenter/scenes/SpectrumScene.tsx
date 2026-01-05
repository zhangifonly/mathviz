/**
 * 频谱场景组件
 *
 * 显示频域频谱图
 */

import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import type { SceneState } from '../types'

interface SpectrumSceneProps {
  state: SceneState
  onStateChange: (updates: Partial<SceneState>) => void
  interactive?: {
    allowWaveTypeChange?: boolean
    allowParamChange?: boolean
  }
}

export function SpectrumScene({
  state,
  onStateChange,
  interactive,
}: SpectrumSceneProps) {
  // 计算频谱数据
  const frequencyData = useMemo(() => {
    const freqBins: number[] = []
    const magnitudes: number[] = []

    for (let n = 1; n <= 15; n++) {
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

  // 生成颜色
  const colors = frequencyData.freqBins.map((_, i) => {
    const hasEnergy = frequencyData.magnitudes[i] > 0.01
    return hasEnergy ? `rgba(139, 92, 246, ${0.6 + i * 0.02})` : 'rgba(200, 200, 200, 0.3)'
  })

  return (
    <div className="h-full flex flex-col p-4">
      {/* 图表 */}
      <div className="flex-1 bg-white rounded-xl overflow-hidden">
        <Plot
          data={[
            {
              x: frequencyData.freqBins,
              y: frequencyData.magnitudes,
              type: 'bar',
              marker: {
                color: colors,
              },
              text: frequencyData.magnitudes.map((m) => m > 0.01 ? m.toFixed(2) : ''),
              textposition: 'outside',
            },
          ]}
          layout={{
            autosize: true,
            margin: { t: 40, r: 40, b: 60, l: 60 },
            xaxis: {
              title: '频率 (Hz)',
              gridcolor: '#f1f5f9',
              dtick: state.frequency,
            },
            yaxis: {
              title: '幅度',
              gridcolor: '#f1f5f9',
              range: [0, 1.5],
            },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            font: { size: 14 },
            title: {
              text: `${waveTypeNames[state.waveType]}的频谱`,
              font: { size: 18 },
            },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* 说明文字 */}
      <div className="mt-4 text-center">
        <p className="text-white/70 text-sm">
          {state.waveType === 'sine' && '正弦波只有单一频率成分'}
          {state.waveType === 'square' && '方波只包含奇数次谐波 (1, 3, 5, 7...)，振幅按 1/n 递减'}
          {state.waveType === 'sawtooth' && '锯齿波包含所有整数次谐波，振幅按 1/n 递减'}
          {state.waveType === 'triangle' && '三角波只包含奇数次谐波，振幅按 1/n² 递减（衰减更快）'}
        </p>
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
                  ? 'bg-violet-500 text-white'
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
