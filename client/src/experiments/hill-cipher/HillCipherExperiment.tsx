import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { hillCipherNarration } from '../../narrations/scripts/hill-cipher'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { encrypt, decrypt, cleanText, KEY_MATRIX, SAMPLE } from './hillCipher'
import { drawHillCipher } from './draw'

const W = 600
const H = 480

export default function HillCipherExperiment() {
  const [text, setText] = useState(SAMPLE)
  const [block, setBlock] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const clean = cleanText(text)
  const blocks = Math.max(1, clean.length / 2)
  const bi = Math.min(block, blocks - 1)
  const cipher = encrypt(text, KEY_MATRIX)
  const back = decrypt(cipher, KEY_MATRIX)

  useEffect(() => {
    if (narration) narration.loadScript(hillCipherNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawHillCipher(canvas, text, KEY_MATRIX, bi)
  }, [text, bi])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">希尔密码</h1>
            <p className="text-gray-600">矩阵加密字母块</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">密钥矩阵 × 明文向量 = 密文</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">输入明文</h3>
              <input
                value={text}
                onChange={(e) => { setText(e.target.value); setBlock(0) }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="输入英文字母"
              />
              <div className="mt-3 text-sm space-y-1 font-mono">
                <div className="text-sky-600">明文 {clean}</div>
                <div className="text-pink-600">密文 {cipher}</div>
                <div className="text-emerald-600">解密 {back}</div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setBlock((b) => Math.max(0, b - 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100">上一块</button>
                <button onClick={() => setBlock((b) => Math.min(blocks - 1, b + 1))} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600">下一块</button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 密钥矩阵 [[3,3],[2,5]]，行列式 9 与 26 <b>互质</b>可逆。</li>
                <li>• 每两字母合成一个<b>二维向量</b>参与运算。</li>
                <li>• 解密靠密钥矩阵的<b>模 26 逆矩阵</b>还原。</li>
                <li>• 1929 年 Hill 提出，是<b>多字母代换</b>密码的里程碑。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
