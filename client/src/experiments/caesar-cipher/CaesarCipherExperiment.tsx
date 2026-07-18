import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { caesarCipherNarration } from '../../narrations/scripts/caesar-cipher'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { encrypt, crack, SHIFTS, SAMPLE_TEXT } from './caesarCipher'
import { drawCaesarCipher } from './draw'

const W = 600
const H = 480

export default function CaesarCipherExperiment() {
  const [shift, setShift] = useState(3)
  const [cracked, setCracked] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const cipher = encrypt(SAMPLE_TEXT, shift)
  const guess = crack(cipher)

  useEffect(() => {
    if (narration) narration.loadScript(caesarCipherNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawCaesarCipher(canvas, shift, cipher)
  }, [shift, cipher])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">凯撒密码</h1>
            <p className="text-gray-600">移位替换与频率分析</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">移位环 · 频率对比</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">移位量 shift = {shift}</h3>
              <div className="grid grid-cols-4 gap-2">
                {SHIFTS.map((s) => (
                  <button key={s} onClick={() => { setShift(s); setCracked(false) }}
                    className={`px-2 py-2 rounded-lg text-sm font-medium ${shift === s ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 break-all"><b>密文:</b> {cipher.slice(0, 48)}...</p>
              <button onClick={() => setCracked(true)} className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-rose-100 text-rose-700 hover:bg-rose-200">
                🔍 频率分析破解
              </button>
              {cracked && (
                <div className="mt-3 p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs">
                  <b>破解结果:</b> 最可能 shift = {guess.shift}
                  <br />明文: {guess.plaintext.slice(0, 40)}...
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 凯撒用它给<b>军事情报</b>加密，移位量就是密钥。</li>
                <li>• 密钥空间只有 <b>25</b> 种，暴力试遍即可。</li>
                <li>• 移位不改变字母的<b>频率分布</b>，这正是破绽。</li>
                <li>• 用<b>卡方统计</b>比对英文频率，一击命中真钥。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
