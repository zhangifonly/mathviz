import { useState, useEffect, useRef, useCallback } from 'react'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { gameOfLifeNarration } from '../../narrations/scripts/game-of-life'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { nextGeneration, countAlive, randomizeGrid, createGrid, idx, type Grid } from './life'
import { PATTERNS, placePattern } from './patterns'

const ROWS = 50
const COLS = 80
const CELL = 11

export default function GameOfLifeExperiment() {
  const [grid, setGrid] = useState<Grid>(() => placePattern(ROWS, COLS, PATTERNS[0]))
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(10)
  const [generation, setGeneration] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit: handleExitPresenter } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(gameOfLifeNarration)
  }, [narration])

  // 演化循环
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setGrid((g) => nextGeneration(g, { rows: ROWS, cols: COLS }))
      setGeneration((n) => n + 1)
    }, 1000 / speed)
    return () => clearInterval(interval)
  }, [running, speed])

  // 绘制网格
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (grid[idx(r, c, COLS)]) {
          const hue = 180 + ((r + c) * 2) % 120
          ctx.fillStyle = `hsl(${hue}, 80%, 60%)`
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 1, CELL - 1)
        }
      }
    }
  }, [grid])

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const c = Math.floor(((e.clientX - rect.left) / rect.width) * COLS)
    const r = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS)
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return
    setGrid((g) => {
      const ng = g.slice() as Grid
      ng[idx(r, c, COLS)] = ng[idx(r, c, COLS)] ? 0 : 1
      return ng
    })
  }, [])

  const aliveCount = countAlive(grid)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExitPresenter} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">康威生命游戏</h1>
            <p className="text-gray-600">简单规则涌现复杂生命</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">生命演化网格</h3>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>第 <span className="font-mono font-bold text-indigo-600">{generation}</span> 代</span>
                <span>存活 <span className="font-mono font-bold text-emerald-600">{aliveCount}</span></span>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              width={COLS * CELL}
              height={ROWS * CELL}
              onClick={handleCanvasClick}
              className="w-full rounded border border-gray-300 cursor-pointer bg-slate-900"
              style={{ imageRendering: 'pixelated' }}
            />
            <p className="text-xs text-gray-500 mt-2">点击格子可手动切换细胞生死</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">控制</h3>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setRunning((r) => !r)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium text-white ${running ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {running ? '⏸ 暂停' : '▶ 开始'}
                </button>
                <button
                  onClick={() => { setGrid((g) => nextGeneration(g, { rows: ROWS, cols: COLS })); setGeneration((n) => n + 1) }}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600"
                >下一代</button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setGrid(createGrid(ROWS, COLS)); setGeneration(0); setRunning(false) }}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >清空</button>
                <button
                  onClick={() => { setGrid(randomizeGrid(ROWS, COLS, 0.3)); setGeneration(0) }}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-amber-400 text-white hover:bg-amber-500"
                >随机</button>
              </div>
              <div className="mt-3">
                <label className="text-sm text-gray-600">速度: {speed} 代/秒</label>
                <input type="range" min="1" max="30" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">经典图案</h3>
              <div className="grid grid-cols-2 gap-2">
                {PATTERNS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => { setGrid(placePattern(ROWS, COLS, p)); setGeneration(0); setRunning(false) }}
                    className="px-2 py-2 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100"
                  >{p.label}</button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">演化规则 B3/S23</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <MathFormula formula="\text{存活}: n \in \{2, 3\}" />
                <MathFormula formula="\text{出生}: n = 3" />
                <p className="mt-2">每个细胞根据周围 8 个邻居的存活数 n 决定下一刻的生死。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
