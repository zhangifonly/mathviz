import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { vigenereCipherNarration } from '../../narrations/scripts/vigenere-cipher'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { normalize, encrypt, SAMPLE } from './vigenereCipher'
import { drawVigenereCipher } from './draw'

const W = 600
const H = 480

export default function VigenereCipherExperiment() {
  const [text, setText] = useState(SAMPLE.plaintext)
  const [key, setKey] = useState(SAMPLE.key)
  const [col, setCol] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(vigenereCipherNarration)
  }, [narration])

  const len = normalize(text).length
  const cipher = encrypt(text, key)
  const focus = len > 0 ? col % len : -1

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawVigenereCipher(canvas, text, key, focus)
  }, [text, key, focus])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">维吉尼亚密码</h1>
            <p className="text-gray-600">多表移位加密</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">维吉尼亚方阵 · 逐列加密</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">输入</h3>
              <label className="block text-sm text-gray-600 mb-1">明文</label>
              <input value={text} onChange={(e) => { setText(e.target.value); setCol(0) }}
                className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300 text-sm font-mono" />
              <label className="block text-sm text-gray-600 mb-1">密钥</label>
              <input value={key} onChange={(e) => { setKey(e.target.value); setCol(0) }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-mono" />
              <button onClick={() => setCol((c) => c + 1)} disabled={len === 0}
                className="w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40">
                下一个字母 ▶
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-2">密文</h3>
              <p className="text-sm font-mono break-all text-red-600 mb-3">{cipher || '(空)'}</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 密文<b>[i] = (明文[i] + 密钥[i]) mod 26</b>，密钥循环对齐。</li>
                <li>• 每个位置用<b>不同的移位表</b>，故称多表加密。</li>
                <li>• 曾被誉为<b>不可破译的密码</b>，抵御频率分析。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
