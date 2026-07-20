import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { rsaCipherNarration } from '../../narrations/scripts/rsa-cipher'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { SAMPLE_PRIMES, generateKeys, encrypt, decrypt } from './rsaCipher'
import { drawRsaCipher } from './draw'

const W = 600
const H = 480

export default function RsaCipherExperiment() {
  const [pair, setPair] = useState<[number, number]>(SAMPLE_PRIMES[0])
  const [msg, setMsg] = useState(42)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(rsaCipherNarration)
  }, [narration])

  const keys = generateKeys(pair[0], pair[1])
  const m = ((msg % keys.n) + keys.n) % keys.n
  const cipher = encrypt(m, keys)
  const back = decrypt(cipher, keys)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawRsaCipher(canvas, pair[0], pair[1], msg, 2)
  }, [pair, msg])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">RSA加密</h1>
            <p className="text-gray-600">公钥密码与大数分解</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">n = {keys.n} · 公钥(e={keys.e}) · 私钥(d={keys.d})</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择素数对 (p, q)</h3>
              <div className="space-y-2">
                {SAMPLE_PRIMES.map(([p, q]) => (
                  <button
                    key={`${p}-${q}`}
                    onClick={() => setPair([p, q])}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${pair[0] === p && pair[1] === q ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    p={p}, q={q} → n={p * q}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">输入数字消息 m</h3>
              <input
                type="range" min={0} max={keys.n - 1} value={m}
                onChange={(e) => setMsg(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="mt-2 text-sm text-gray-700 space-y-1 font-mono">
                <div>明文 m = {m}</div>
                <div>密文 c = mᵉ mod n = {cipher}</div>
                <div>解密 cᵈ mod n = {back} {back === m ? '✓' : ''}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">应用与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 公钥可公开加密，只有私钥能解密。</li>
                <li>• 安全性建立在<b>大数分解</b>难题上。</li>
                <li>• 真实 RSA 用几百位的素数，n 大到无法分解。</li>
                <li>• 支撑着 HTTPS、数字签名与网银安全。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
