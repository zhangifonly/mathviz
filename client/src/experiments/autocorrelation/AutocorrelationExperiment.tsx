import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { autocorrelationNarration } from '../../narrations/scripts/autocorrelation'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makeSignal, SIGNAL_PRESETS } from './autocorrelation'
import { drawAutocorrelation } from './draw'

const W = 600
const H = 480
const N = 320

export default function AutocorrelationExperiment() {
  const [presetKey, setPresetKey] = useState(SIGNAL_PRESETS[0].key)
  const [seed, setSeed] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(autocorrelationNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const preset = SIGNAL_PRESETS.find((p) => p.key === presetKey) ?? SIGNAL_PRESETS[0]
    const signal = makeSignal(N, preset.period, preset.noise, seed)
    drawAutocorrelation(canvas, signal)
  }, [presetKey, seed])

  const active = SIGNAL_PRESETS.find((p) => p.key === presetKey) ?? SIGNAL_PRESETS[0]

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">自相关</h1>
            <p className="text-gray-600">检测信号周期</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{active.label} · 自相关峰值提取周期</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择信号</h3>
              <div className="space-y-2">
                {SIGNAL_PRESETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPresetKey(p.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${presetKey === p.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <button onClick={() => setSeed((s) => s + 1)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-200">
                🎲 重新生成噪声
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 自相关把信号与自己延迟后的版本<b>相乘求和</b>。</li>
                <li>• 周期信号在延迟等于<b>周期倍数</b>处出现峰值。</li>
                <li>• 语音的<b>基频提取</b>（音高）常用自相关实现。</li>
                <li>• 它能在强噪声里挖出肉眼看不见的隐藏周期。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
