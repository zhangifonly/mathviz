import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { diffieHellmanNarration } from '../../narrations/scripts/diffie-hellman'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE, PRIVATE_KEYS, dhExchange } from './diffieHellman'
import { drawDiffieHellman } from './draw'

const W = 600
const H = 480

export default function DiffieHellmanExperiment() {
  const [a, setA] = useState(6)
  const [b, setB] = useState(9)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(diffieHellmanNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDiffieHellman(canvas, SAMPLE.p, SAMPLE.g, a, b)
  }, [a, b])

  const result = dhExchange(SAMPLE.p, SAMPLE.g, a, b)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">迪菲-赫尔曼密钥交换</h1>
            <p className="text-gray-600">公开信道协商密钥</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">共享密钥 = g^(ab) mod p = {result.sharedAlice}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">Alice 私钥 a</h3>
              <div className="grid grid-cols-5 gap-2">
                {PRIVATE_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setA(k)}
                    className={`px-2 py-2 rounded-lg text-sm font-medium ${a === k ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">Bob 私钥 b</h3>
              <div className="grid grid-cols-5 gap-2">
                {PRIVATE_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => setB(k)}
                    className={`px-2 py-2 rounded-lg text-sm font-medium ${b === k ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">原理与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 公开 p、g、A、B，私钥 a、b <b>永不传输</b>。</li>
                <li>• 双方各算 B^a 与 A^b，都等于 <b>g^(ab) mod p</b>。</li>
                <li>• 窃听者面对<b>离散对数难题</b>，无法反推私钥。</li>
                <li>• HTTPS、VPN 的密钥协商都基于它。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
