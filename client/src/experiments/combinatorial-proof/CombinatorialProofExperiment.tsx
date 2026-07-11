import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { combinatorialProofNarration } from '../../narrations/scripts/combinatorial-proof'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { IDENTITY_OPTIONS, sumIdentity, symmetryPairs, pascalRule, hockeyStick } from './combinatorialProof'
import type { IdentityOption } from './combinatorialProof'
import { drawCombinatorialProof } from './draw'
import type { DrawData } from './draw'

const ROWS = 9

function verifyText(id: IdentityOption['id'], n: number, k: number): string {
  if (id === 'sum') {
    const r = sumIdentity(n)
    return `第 ${n} 行之和 = ${r.sum}，而 2^${n} = ${r.power}，${r.equal ? '相等 ✓' : '不等'}`
  }
  if (id === 'symmetry') {
    const p = symmetryPairs(n)[k]
    return `C(${n},${k}) = ${p.left}，C(${n},${n - k}) = ${p.right}，${p.equal ? '相等 ✓' : '不等'}`
  }
  if (id === 'pascal') {
    const r = pascalRule(n, k)
    return `C(${n},${k}) = ${r.value} = ${r.upperLeft} + ${r.upperRight}，${r.equal ? '成立 ✓' : '不成立'}`
  }
  const r = hockeyStick(k, n)
  return `斜线累加 = ${r.sum}，C(${n + 1},${k + 1}) = ${r.closed}，${r.equal ? '相等 ✓' : '不等'}`
}

export default function CombinatorialProofExperiment() {
  const [identity, setIdentity] = useState<IdentityOption['id']>('sum')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  const n = 6
  const k = 2

  useEffect(() => {
    if (narration) narration.loadScript(combinatorialProofNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data: DrawData = { identity, n, k, rows: ROWS }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = Math.min(1, progress + 0.03)
      drawCombinatorialProof(canvas, data, progress)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [identity])

  const info = IDENTITY_OPTIONS.find((o) => o.id === identity)!

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">组合恒等式</h1>
            <p className="text-gray-600">用数格子的方式证明二项式恒等式</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{info.label} · {info.formula}</h3>
            <canvas ref={canvasRef} width={600} height={540} className="w-full rounded-lg" />
            <p className="mt-3 text-sm text-gray-600">{verifyText(identity, n, k)}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择恒等式</h3>
              <div className="space-y-2">
                {IDENTITY_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setIdentity(o.id)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${identity === o.id ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${identity === o.id ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">组合证明趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 组合数 C(n,k) 数的是<b>从 n 个里选 k 个</b>的方法数。</li>
                <li>• 恒等式两边其实在<b>数同一样东西</b>，只是数法不同。</li>
                <li>• <b>帕斯卡法则</b>按是否包含某元素把选法分成两类。</li>
                <li>• <b>曲棍球棒</b>把一条斜线累加，落点正好是拐弯下方那个数。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
