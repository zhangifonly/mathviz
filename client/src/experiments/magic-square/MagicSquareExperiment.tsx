import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { magicSquareNarration } from '../../narrations/scripts/magic-square'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { siameseMagicSquare, magicConstant, ORDERS, type LineKind } from './magicSquare'
import { drawMagicSquare } from './draw'

const W = 600
const H = 480

const LINES: { key: LineKind; label: string; index?: number }[] = [
  { key: 'row', label: '中间一行', index: 1 },
  { key: 'col', label: '中间一列', index: 1 },
  { key: 'diag', label: '主对角线' },
  { key: 'anti', label: '副对角线' },
]

export default function MagicSquareExperiment() {
  const [order, setOrder] = useState(5)
  const [line, setLine] = useState<{ key: LineKind; index?: number }>({ key: 'diag' })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(magicSquareNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const idx = line.index != null ? Math.min(line.index, order - 1) : undefined
    drawMagicSquare(canvas, siameseMagicSquare(order), { kind: line.key, index: idx })
  }, [order, line])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">幻方</h1>
            <p className="text-gray-600">行列对角和都相等的神奇矩阵</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{order} 阶幻方 · 幻常数 {magicConstant(order)}</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">方阵阶数</h3>
              <div className="space-y-2">
                {ORDERS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setOrder(n)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${order === n ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {n} 阶
                  </button>
                ))}
              </div>
              <h3 className="text-lg font-semibold mt-4 mb-3">高亮线</h3>
              <div className="grid grid-cols-2 gap-2">
                {LINES.map((l) => (
                  <button
                    key={l.key}
                    onClick={() => setLine({ key: l.key, index: l.index })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${line.key === l.key ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">知识卡</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 每行、每列、两条对角线之和都等于<b>幻常数</b>。</li>
                <li>• 幻常数公式 <b>M = n(n²+1)/2</b>。</li>
                <li>• 奇数阶用<b>暹罗法</b>（楼梯法）即可构造。</li>
                <li>• 最早的三阶幻方即中国古代的<b>洛书</b>。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
