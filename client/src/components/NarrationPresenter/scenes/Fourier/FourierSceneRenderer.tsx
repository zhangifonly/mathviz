/**
 * 傅里叶变换场景渲染器
 */

import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'

export default function FourierSceneRenderer({ scene }: SceneRendererProps) {
  // 根据场景生成波形数据
  const params = scene?.lineState?.params as Record<string, unknown> | undefined
  const waveType = (params?.waveType as string) || 'square'
  const terms = (params?.terms as number) || 10
  const frequency = (params?.frequency as number) || 1
  const amplitude = (params?.amplitude as number) || 1

  // 生成时域数据
  const timeData = useMemo(() => {
    const n = 500
    const t: number[] = []
    const original: number[] = []
    const approximation: number[] = []

    for (let i = 0; i < n; i++) {
      const x = (i / n) * 4 * Math.PI
      t.push(x)

      // 原始波形
      let y = 0
      switch (waveType) {
        case 'sine':
          y = amplitude * Math.sin(frequency * x)
          break
        case 'square':
          y = amplitude * Math.sign(Math.sin(frequency * x))
          break
        case 'sawtooth':
          y = amplitude * (2 * ((frequency * x / (2 * Math.PI)) % 1) - 1)
          break
        case 'triangle':
          y = amplitude * (2 * Math.abs(2 * ((frequency * x / (2 * Math.PI)) % 1) - 1) - 1)
          break
        default:
          y = amplitude * Math.sign(Math.sin(frequency * x))
      }
      original.push(y)

      // 傅里叶级数逼近
      let approx = 0
      if (waveType === 'sine') {
        approx = amplitude * Math.sin(frequency * x)
      } else if (waveType === 'square') {
        for (let k = 1; k <= terms; k++) {
          const n_k = 2 * k - 1
          approx += (4 * amplitude / (Math.PI * n_k)) * Math.sin(n_k * frequency * x)
        }
      } else if (waveType === 'sawtooth') {
        for (let k = 1; k <= terms; k++) {
          approx += (2 * amplitude / (Math.PI * k)) * Math.pow(-1, k + 1) * Math.sin(k * frequency * x)
        }
      } else if (waveType === 'triangle') {
        for (let k = 0; k < terms; k++) {
          const n_k = 2 * k + 1
          approx += (8 * amplitude / (Math.PI * Math.PI * n_k * n_k)) * Math.pow(-1, k) * Math.sin(n_k * frequency * x)
        }
      }
      approximation.push(approx)
    }

    return { t, original, approximation }
  }, [waveType, terms, frequency, amplitude])

  // 生成频谱数据
  const spectrumData = useMemo(() => {
    const frequencies: number[] = []
    const amplitudes: number[] = []

    if (waveType === 'sine') {
      frequencies.push(frequency)
      amplitudes.push(amplitude)
    } else if (waveType === 'square') {
      for (let k = 1; k <= terms; k++) {
        const n_k = 2 * k - 1
        frequencies.push(n_k * frequency)
        amplitudes.push(4 * amplitude / (Math.PI * n_k))
      }
    } else if (waveType === 'sawtooth') {
      for (let k = 1; k <= terms; k++) {
        frequencies.push(k * frequency)
        amplitudes.push(2 * amplitude / (Math.PI * k))
      }
    } else if (waveType === 'triangle') {
      for (let k = 0; k < terms; k++) {
        const n_k = 2 * k + 1
        frequencies.push(n_k * frequency)
        amplitudes.push(8 * amplitude / (Math.PI * Math.PI * n_k * n_k))
      }
    }

    return { frequencies, amplitudes }
  }, [waveType, terms, frequency, amplitude])

  const waveNames: Record<string, string> = {
    sine: '正弦波',
    square: '方波',
    sawtooth: '锯齿波',
    triangle: '三角波',
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          傅里叶变换 - {waveNames[waveType] || '方波'}
        </h2>
        <p className="text-white/70">
          傅里叶项数: {terms} | 频率: {frequency} | 振幅: {amplitude}
        </p>
      </div>

      {/* 时域图 */}
      <div className="flex-1 min-h-0">
        <Plot
          data={[
            {
              x: timeData.t,
              y: timeData.original,
              type: 'scatter',
              mode: 'lines',
              name: '原始波形',
              line: { color: '#3b82f6', width: 2 },
            },
            {
              x: timeData.t,
              y: timeData.approximation,
              type: 'scatter',
              mode: 'lines',
              name: '傅里叶逼近',
              line: { color: '#ef4444', width: 2, dash: 'dash' },
            },
          ]}
          layout={{
            autosize: true,
            margin: { t: 40, r: 20, b: 40, l: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'rgba(255,255,255,0.05)',
            title: {
              text: '时域波形',
              font: { color: 'white', size: 16 },
            },
            xaxis: {
              title: { text: '时间 t', font: { color: 'white' } },
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            yaxis: {
              title: { text: '振幅', font: { color: 'white' } },
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            legend: {
              font: { color: 'white' },
              bgcolor: 'transparent',
            },
          }}
          config={{ responsive: true, displaylogo: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* 频谱图 */}
      <div className="flex-1 min-h-0">
        <Plot
          data={[
            {
              x: spectrumData.frequencies,
              y: spectrumData.amplitudes,
              type: 'bar',
              name: '频谱',
              marker: { color: '#22c55e' },
            },
          ]}
          layout={{
            autosize: true,
            margin: { t: 40, r: 20, b: 40, l: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'rgba(255,255,255,0.05)',
            title: {
              text: '频谱',
              font: { color: 'white', size: 16 },
            },
            xaxis: {
              title: { text: '频率', font: { color: 'white' } },
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            yaxis: {
              title: { text: '振幅', font: { color: 'white' } },
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            legend: {
              font: { color: 'white' },
              bgcolor: 'transparent',
            },
          }}
          config={{ responsive: true, displaylogo: false }}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  )
}
