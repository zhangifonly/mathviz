/**
 * 信号处理场景渲染器
 * 可视化时域信号、频域频谱和滤波效果
 */

import { useMemo, useState } from 'react'
import Plot from 'react-plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../MathFormula/MathFormula'

// 信号类型
type SignalType = 'sine' | 'square' | 'sawtooth' | 'triangle' | 'noise' | 'composite'

// 滤波器类型
type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'bandstop'

// 生成时域信号
function generateSignal(
  type: SignalType,
  frequency: number,
  amplitude: number,
  sampleRate: number,
  duration: number
): { t: number[]; signal: number[] } {
  const numSamples = Math.floor(sampleRate * duration)
  const t: number[] = []
  const signal: number[] = []

  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate
    t.push(time)

    let value = 0
    switch (type) {
      case 'sine':
        value = amplitude * Math.sin(2 * Math.PI * frequency * time)
        break
      case 'square':
        value = amplitude * Math.sign(Math.sin(2 * Math.PI * frequency * time))
        break
      case 'sawtooth':
        value = amplitude * (2 * ((frequency * time) % 1) - 1)
        break
      case 'triangle': {
        const phase = (frequency * time) % 1
        value = amplitude * (phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase)
        break
      }
      case 'noise':
        value = amplitude * (Math.random() * 2 - 1)
        break
      case 'composite':
        // 多个频率的叠加
        value = amplitude * (
          Math.sin(2 * Math.PI * frequency * time) +
          0.5 * Math.sin(2 * Math.PI * frequency * 3 * time) +
          0.3 * Math.sin(2 * Math.PI * frequency * 5 * time)
        )
        break
    }
    signal.push(value)
  }

  return { t, signal }
}

// 计算快速傅里叶变换（简化版）
function computeFFT(signal: number[], sampleRate: number): { freq: number[]; magnitude: number[] } {
  const N = signal.length
  const freq: number[] = []
  const magnitude: number[] = []

  // 只计算正频率部分
  const halfN = Math.floor(N / 2)

  for (let k = 0; k < halfN; k++) {
    let re = 0
    let im = 0

    for (let n = 0; n < N; n++) {
      const angle = (-2 * Math.PI * k * n) / N
      re += signal[n] * Math.cos(angle)
      im += signal[n] * Math.sin(angle)
    }

    const mag = Math.sqrt(re * re + im * im) / N
    freq.push((k * sampleRate) / N)
    magnitude.push(mag)
  }

  return { freq, magnitude }
}

// 应用滤波器
function applyFilter(
  signal: number[],
  filterType: FilterType,
  cutoffFreq: number,
  sampleRate: number
): number[] {
  // 简化的滤波器实现（理想滤波器）
  const fft = computeFFT(signal, sampleRate)
  const N = signal.length
  const filtered: number[] = new Array(N).fill(0)

  // 根据滤波器类型修改频谱
  for (let k = 0; k < fft.freq.length; k++) {
    const f = fft.freq[k]
    let gain = 0

    switch (filterType) {
      case 'lowpass':
        gain = f <= cutoffFreq ? 1 : 0
        break
      case 'highpass':
        gain = f >= cutoffFreq ? 1 : 0
        break
      case 'bandpass':
        gain = f >= cutoffFreq * 0.5 && f <= cutoffFreq * 1.5 ? 1 : 0
        break
      case 'bandstop':
        gain = f < cutoffFreq * 0.5 || f > cutoffFreq * 1.5 ? 1 : 0
        break
    }

    // 简化的逆变换（仅用于演示）
    if (gain > 0) {
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N
        filtered[n] += fft.magnitude[k] * Math.cos(angle) * gain
      }
    }
  }

  return filtered
}

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '信号处理', subtitle: '探索时域与频域的奥秘' },
    'summary-intro': { title: '总结回顾', subtitle: '信号处理的核心概念' },
    'summary-end': { title: '感谢观看', subtitle: '信号处理的应用无处不在' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '信号处理', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 时域信号场景
function TimeDomainScene({
  signalType = 'sine',
  frequency = 5,
  amplitude = 1,
  interactive = false
}: {
  signalType?: SignalType
  frequency?: number
  amplitude?: number
  interactive?: boolean
}) {
  const [freq, setFreq] = useState(frequency)
  const [amp, setAmp] = useState(amplitude)
  const [type, setType] = useState(signalType)

  const sampleRate = 1000
  const duration = 1

  const plotData = useMemo(() => {
    return generateSignal(type, freq, amp, sampleRate, duration)
  }, [type, freq, amp])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: plotData.t,
            y: plotData.signal,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#3b82f6', width: 2 },
            name: '时域信号',
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          title: {
            text: '时域波形',
            font: { color: 'white', size: 18 },
          },
          xaxis: {
            title: { text: '时间 (s)' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: '幅度' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />

      {interactive && (
        <div className="w-full max-w-md px-4 space-y-3">
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm w-24">信号类型:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as SignalType)}
              className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1"
            >
              <option value="sine">正弦波</option>
              <option value="square">方波</option>
              <option value="sawtooth">锯齿波</option>
              <option value="triangle">三角波</option>
              <option value="composite">复合信号</option>
            </select>
          </div>
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm w-24">频率: {freq} Hz</label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={freq}
              onChange={(e) => setFreq(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm w-24">幅度: {amp.toFixed(1)}</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={amp}
              onChange={(e) => setAmp(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// 频域频谱场景
function FrequencyDomainScene({
  signalType = 'sine',
  frequency = 5,
  amplitude = 1
}: {
  signalType?: SignalType
  frequency?: number
  amplitude?: number
}) {
  const sampleRate = 1000
  const duration = 1

  const plotData = useMemo(() => {
    const { signal } = generateSignal(signalType, frequency, amplitude, sampleRate, duration)
    return computeFFT(signal, sampleRate)
  }, [signalType, frequency, amplitude])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={[
          {
            x: plotData.freq,
            y: plotData.magnitude,
            type: 'scatter',
            mode: 'lines',
            line: { color: '#22c55e', width: 2 },
            fill: 'tozeroy',
            fillcolor: 'rgba(34, 197, 94, 0.3)',
            name: '频谱',
          },
        ]}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 30, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          title: {
            text: '频域频谱',
            font: { color: 'white', size: 18 },
          },
          xaxis: {
            title: { text: '频率 (Hz)' },
            range: [0, 100],
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          yaxis: {
            title: { text: '幅度' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
          },
          showlegend: false,
        }}
        config={{ responsive: true, displayModeBar: false, displaylogo: false }}
        className="w-full"
      />
    </div>
  )
}

// 滤波效果场景
function FilterScene({
  filterType = 'lowpass',
  cutoffFreq = 10,
  interactive = false
}: {
  filterType?: FilterType
  cutoffFreq?: number
  interactive?: boolean
}) {
  const [filter, setFilter] = useState(filterType)
  const [cutoff, setCutoff] = useState(cutoffFreq)

  const sampleRate = 1000
  const duration = 1

  const plotData = useMemo(() => {
    // 生成复合信号（多个频率）
    const { t, signal } = generateSignal('composite', 5, 1, sampleRate, duration)
    const filtered = applyFilter(signal, filter, cutoff, sampleRate)

    return { t, original: signal, filtered }
  }, [filter, cutoff])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
        {/* 原始信号 */}
        <div>
          <Plot
            data={[
              {
                x: plotData.t,
                y: plotData.original,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#3b82f6', width: 2 },
                name: '原始信号',
              },
            ]}
            layout={{
              autosize: true,
              height: 250,
              margin: { t: 30, r: 20, b: 40, l: 50 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'rgba(255,255,255,0.05)',
              title: { text: '原始信号', font: { color: 'white', size: 14 } },
              xaxis: {
                title: { text: '时间 (s)' },
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)',
              },
              yaxis: {
                title: { text: '幅度' },
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)',
              },
              showlegend: false,
            }}
            config={{ responsive: true, displayModeBar: false, displaylogo: false }}
            className="w-full"
          />
        </div>

        {/* 滤波后信号 */}
        <div>
          <Plot
            data={[
              {
                x: plotData.t,
                y: plotData.filtered,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#22c55e', width: 2 },
                name: '滤波后信号',
              },
            ]}
            layout={{
              autosize: true,
              height: 250,
              margin: { t: 30, r: 20, b: 40, l: 50 },
              paper_bgcolor: 'transparent',
              plot_bgcolor: 'rgba(255,255,255,0.05)',
              title: { text: '滤波后信号', font: { color: 'white', size: 14 } },
              xaxis: {
                title: { text: '时间 (s)' },
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)',
              },
              yaxis: {
                title: { text: '幅度' },
                color: 'white',
                gridcolor: 'rgba(255,255,255,0.1)',
              },
              showlegend: false,
            }}
            config={{ responsive: true, displayModeBar: false, displaylogo: false }}
            className="w-full"
          />
        </div>
      </div>

      {interactive && (
        <div className="w-full max-w-md px-4 space-y-3">
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm w-24">滤波器:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1"
            >
              <option value="lowpass">低通滤波器</option>
              <option value="highpass">高通滤波器</option>
              <option value="bandpass">带通滤波器</option>
              <option value="bandstop">带阻滤波器</option>
            </select>
          </div>
          <div className="flex items-center gap-4 text-white">
            <label className="text-sm w-24">截止频率: {cutoff} Hz</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={cutoff}
              onChange={(e) => setCutoff(parseFloat(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// 时域频域对比场景
function ComparisonScene({ signalType = 'sine', frequency = 5 }: { signalType?: SignalType; frequency?: number }) {
  const sampleRate = 1000
  const duration = 1

  const plotData = useMemo(() => {
    const { t, signal } = generateSignal(signalType, frequency, 1, sampleRate, duration)
    const fft = computeFFT(signal, sampleRate)
    return { t, signal, freq: fft.freq, magnitude: fft.magnitude }
  }, [signalType, frequency])

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* 时域 */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-white/70 text-sm">时域波形</p>
        <Plot
          data={[
            {
              x: plotData.t,
              y: plotData.signal,
              type: 'scatter',
              mode: 'lines',
              line: { color: '#3b82f6', width: 2 },
            },
          ]}
          layout={{
            autosize: true,
            height: 300,
            margin: { t: 20, r: 20, b: 40, l: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'rgba(255,255,255,0.05)',
            xaxis: {
              title: { text: '时间 (s)' },
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            yaxis: {
              title: { text: '幅度' },
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            showlegend: false,
          }}
          config={{ responsive: true, displayModeBar: false, displaylogo: false }}
          className="w-full"
        />
      </div>

      {/* 频域 */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-white/70 text-sm">频域频谱</p>
        <Plot
          data={[
            {
              x: plotData.freq,
              y: plotData.magnitude,
              type: 'scatter',
              mode: 'lines',
              line: { color: '#22c55e', width: 2 },
              fill: 'tozeroy',
              fillcolor: 'rgba(34, 197, 94, 0.3)',
            },
          ]}
          layout={{
            autosize: true,
            height: 300,
            margin: { t: 20, r: 20, b: 40, l: 50 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'rgba(255,255,255,0.05)',
            xaxis: {
              title: { text: '频率 (Hz)' },
              range: [0, 100],
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            yaxis: {
              title: { text: '幅度' },
              color: 'white',
              gridcolor: 'rgba(255,255,255,0.1)',
            },
            showlegend: false,
          }}
          config={{ responsive: true, displayModeBar: false, displaylogo: false }}
          className="w-full"
        />
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'fourier-transform': {
      formula: 'X(f) = \\int_{-\\infty}^{\\infty} x(t) e^{-i 2\\pi f t} dt',
      description: '傅里叶变换 - 将时域信号转换为频域',
    },
    'inverse-fourier': {
      formula: 'x(t) = \\int_{-\\infty}^{\\infty} X(f) e^{i 2\\pi f t} df',
      description: '逆傅里叶变换 - 将频域信号转换为时域',
    },
    'sampling-theorem': {
      formula: 'f_s \\geq 2f_{max}',
      description: '采样定理 - 采样频率必须大于信号最高频率的两倍',
    },
    'convolution': {
      formula: 'y(t) = x(t) * h(t) = \\int_{-\\infty}^{\\infty} x(\\tau) h(t-\\tau) d\\tau',
      description: '卷积定理 - 时域卷积等于频域相乘',
    },
    'dft': {
      formula: 'X[k] = \\sum_{n=0}^{N-1} x[n] e^{-i 2\\pi k n / N}',
      description: '离散傅里叶变换 (DFT) - 数字信号的频域表示',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['fourier-transform']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg text-center max-w-2xl px-4">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-intro': {
      title: '信号处理的应用',
      items: ['音频处理', '图像处理', '通信系统', '医学诊断'],
      icon: '📡',
    },
    'app-audio': {
      title: '音频处理',
      items: ['音乐均衡器', '降噪处理', '语音识别', '音频压缩'],
      icon: '🎵',
    },
    'app-image': {
      title: '图像处理',
      items: ['图像滤波', '边缘检测', '图像压缩', '特征提取'],
      icon: '🖼️',
    },
    'app-communication': {
      title: '通信系统',
      items: ['调制解调', '信道编码', '频谱分析', '信号检测'],
      icon: '📶',
    },
  }

  const app = apps[sceneId] || apps['app-intro']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function SignalProcessingSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig, lineState } = scene

  // 标题场景
  if (sceneConfig.type === 'title') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 公式场景
  if (sceneConfig.type === 'formula') {
    if (sceneConfig.id.includes('fourier-transform')) {
      return <FormulaScene formulaType="fourier-transform" />
    }
    if (sceneConfig.id.includes('inverse')) {
      return <FormulaScene formulaType="inverse-fourier" />
    }
    if (sceneConfig.id.includes('sampling')) {
      return <FormulaScene formulaType="sampling-theorem" />
    }
    if (sceneConfig.id.includes('convolution')) {
      return <FormulaScene formulaType="convolution" />
    }
    if (sceneConfig.id.includes('dft')) {
      return <FormulaScene formulaType="dft" />
    }
    return <FormulaScene formulaType="fourier-transform" />
  }

  // 对比场景
  if (sceneConfig.type === 'comparison') {
    const signalType = (lineState?.params?.signalType as SignalType) || 'sine'
    const frequency = (lineState?.params?.frequency as number) || 5
    return <ComparisonScene signalType={signalType} frequency={frequency} />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('welcome')) {
        return <TitleScene sceneId="intro-welcome" />
      }
      return <TimeDomainScene signalType="sine" frequency={5} amplitude={1} />

    case 'time-domain': {
      const signalType = (lineState?.params?.signalType as SignalType) || 'sine'
      const frequency = (lineState?.params?.frequency as number) || 5
      const amplitude = (lineState?.params?.amplitude as number) || 1
      return <TimeDomainScene signalType={signalType} frequency={frequency} amplitude={amplitude} interactive={false} />
    }

    case 'frequency-domain': {
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="fourier-transform" />
      }
      const freqSignalType = (lineState?.params?.signalType as SignalType) || 'sine'
      const freqFrequency = (lineState?.params?.frequency as number) || 5
      return <FrequencyDomainScene signalType={freqSignalType} frequency={freqFrequency} amplitude={1} />
    }

    case 'comparison': {
      const compSignalType = (lineState?.params?.signalType as SignalType) || 'sine'
      const compFrequency = (lineState?.params?.frequency as number) || 5
      return <ComparisonScene signalType={compSignalType} frequency={compFrequency} />
    }

    case 'filter': {
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="convolution" />
      }
      const filterType = (lineState?.params?.filterType as FilterType) || 'lowpass'
      const cutoffFreq = (lineState?.params?.cutoffFreq as number) || 10
      return <FilterScene filterType={filterType} cutoffFreq={cutoffFreq} interactive={false} />
    }

    case 'sampling':
      if (sceneConfig.id.includes('theorem')) {
        return <FormulaScene formulaType="sampling-theorem" />
      }
      return <TimeDomainScene signalType="sine" frequency={10} amplitude={1} />

    case 'dft':
      if (sceneConfig.id.includes('formula')) {
        return <FormulaScene formulaType="dft" />
      }
      return <FrequencyDomainScene signalType="composite" frequency={5} amplitude={1} />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('time-freq')) {
        return <ComparisonScene signalType="sine" frequency={5} />
      }
      if (sceneConfig.id.includes('filter')) {
        return <FilterScene filterType="lowpass" cutoffFreq={10} />
      }
      if (sceneConfig.id.includes('end')) {
        return <TitleScene sceneId="summary-end" />
      }
      return <TitleScene sceneId="summary-intro" />

    default:
      return <TimeDomainScene signalType="sine" frequency={5} amplitude={1} />
  }
}
