import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { romanNumeralsNarration } from '../../narrations/scripts/roman-numerals'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { decompose, isValidRoman, fromRoman, ROMAN_OPTIONS } from './romanNumerals'
import { drawRomanNumerals } from './draw'

export default function RomanNumeralsExperiment() {
  const [value, setValue] = useState(2024)
  const [input, setInput] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(romanNumeralsNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = decompose(value)
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawRomanNumerals(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  const data = decompose(value)
  const trimmed = input.trim().toUpperCase()
  const decodeOk = trimmed.length > 0 && isValidRoman(trimmed)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🏛️ 罗马数字</h1>
            <p className="text-gray-600">用七个字母写出千位以内的任意整数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{value} = {data.roman}</h3>
            <canvas ref={canvasRef} width={600} height={400} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">拖动选择数字</h3>
              <input
                type="range"
                min={1}
                max={3999}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-2 text-center text-2xl font-bold text-indigo-600">{data.roman}</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">经典例子</h3>
              <div className="space-y-2">
                {ROMAN_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setValue(o.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${value === o.value ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.value} = {decompose(o.value).roman}</div>
                    <div className={`text-xs ${value === o.value ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">反向解码</h3>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入罗马数字，如 MMXXIV"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm uppercase"
              />
              <div className="mt-2 text-sm">
                {trimmed.length === 0 ? (
                  <span className="text-gray-400">等待输入…</span>
                ) : decodeOk ? (
                  <span className="text-emerald-600">= {fromRoman(trimmed)}</span>
                ) : (
                  <span className="text-rose-500">不是规范的罗马数字</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
