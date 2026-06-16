/**
 * 康威生命游戏场景渲染器
 * 在 PPT 讲解模式下渲染全屏可视化
 */

import { useEffect, useRef, useState } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import { nextGeneration, idx, type Grid } from '../../../../experiments/game-of-life/life'
import { PATTERNS, placePattern } from '../../../../experiments/game-of-life/patterns'
import { randomizeGrid } from '../../../../experiments/game-of-life/life'

const G_ROWS = 36
const G_COLS = 56

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '康威生命游戏', subtitle: 'Conway\'s Game of Life' },
    'intro-history': { title: '1970', subtitle: '约翰·康威 创造的数学宇宙' },
    'emg-turing': { title: '图灵完备', subtitle: '理论上能完成任何计算' },
    'sum-end': { title: '感谢观看', subtitle: '探索数学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '康威生命游戏', subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 公式场景
function FormulaScene({ sceneId }: { sceneId: string }) {
  const content: Record<string, { rule: string; desc: string; color: string }> = {
    'rules-survive': { rule: 'n ∈ {2, 3}', desc: '活细胞存活', color: '#10b981' },
    'rules-birth': { rule: 'n = 3', desc: '死细胞出生', color: '#f59e0b' },
  }
  const { rule, desc, color } = content[sceneId] || { rule: 'B3/S23', desc: '规则', color: '#6366f1' }
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-7xl font-mono font-bold" style={{ color }}>{rule}</div>
      <div className="text-2xl text-white/80">{desc}</div>
    </div>
  )
}

export default function GameOfLifeSceneRenderer({ scene }: SceneRendererProps) {
  return <SceneBody scene={scene} />
}

// 主网格演化场景
function GridScene({ pattern, showNeighbors }: { pattern?: string; showNeighbors?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [grid, setGrid] = useState<Grid>(() => initGrid(pattern))

  // 切换图案时重置
  useEffect(() => {
    setGrid(initGrid(pattern))
  }, [pattern])

  // 自动演化
  useEffect(() => {
    if (showNeighbors) return // 邻居讲解时静止
    const timer = setInterval(() => {
      setGrid((g) => nextGeneration(g, { rows: G_ROWS, cols: G_COLS }))
    }, 180)
    return () => clearInterval(timer)
  }, [showNeighbors])

  // 绘制
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cw = canvas.width / G_COLS
    const ch = canvas.height / G_ROWS
    ctx.fillStyle = '#0a0f1e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    for (let r = 0; r < G_ROWS; r++) {
      for (let c = 0; c < G_COLS; c++) {
        if (grid[idx(r, c, G_COLS)]) {
          const hue = 180 + ((r + c) * 3) % 140
          ctx.fillStyle = `hsl(${hue}, 85%, 62%)`
          ctx.fillRect(c * cw + 0.5, r * ch + 0.5, cw - 1, ch - 1)
        }
      }
    }
    // 邻居高亮示意：中心格 + 周围八格
    if (showNeighbors) {
      const cr = Math.floor(G_ROWS / 2)
      const cc = Math.floor(G_COLS / 2)
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const x = (cc + dc) * cw
          const y = (cr + dr) * ch
          ctx.strokeStyle = dr === 0 && dc === 0 ? '#ef4444' : '#f59e0b'
          ctx.strokeRect(x + 1, y + 1, cw - 2, ch - 2)
        }
      }
    }
  }, [grid, showNeighbors])

  return (
    <div className="flex items-center justify-center h-full">
      <canvas ref={canvasRef} width={G_COLS * 16} height={G_ROWS * 16} className="max-w-full max-h-full rounded-lg border border-white/10" style={{ imageRendering: 'pixelated' }} />
    </div>
  )
}

function initGrid(pattern?: string): Grid {
  if (pattern === 'random') return randomizeGrid(G_ROWS, G_COLS, 0.28)
  const p = PATTERNS.find((x) => x.name === pattern) ?? PATTERNS[0]
  return placePattern(G_ROWS, G_COLS, p)
}

// 应用场景
function ApplicationScene() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8">
      <h2 className="text-3xl font-bold text-white">自然界中的涌现</h2>
      <div className="grid grid-cols-3 gap-6 text-center">
        {[['🐜', '蚁群'], ['🧠', '大脑'], ['🌌', '星系']].map(([emoji, label]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="text-6xl">{emoji}</div>
            <div className="text-white/70 text-lg">{label}</div>
          </div>
        ))}
      </div>
      <p className="text-white/60 text-center max-w-lg">简单个体遵循局部规则，整体却展现出惊人的复杂秩序。</p>
    </div>
  )
}

// 总结场景
function SummaryScene({ sceneId }: { sceneId: string }) {
  const items: Record<string, string[]> = {
    'sum-rules': ['B3/S23 规则', '活细胞: 2~3 邻居存活', '死细胞: 恰好 3 邻居出生'],
    'sum-patterns': ['滑翔机：斜向爬行', '脉冲星：周期搏动', '滑翔机枪：持续发射'],
  }
  const list = items[sceneId] || []
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">回顾</h2>
      {list.map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}

// 场景分发
function SceneBody({ scene }: { scene: SceneRendererProps['scene'] }) {
  if (!scene) return <GridScene pattern="glider" />
  const id = scene.scene.id
  const type = scene.scene.type
  const pattern = scene.lineState?.params?.pattern as string | undefined
  const showNeighbors = Boolean(scene.lineState?.show?.neighbors)

  if (type === 'title') return <TitleScene sceneId={id} />
  if (type === 'formula') return <FormulaScene sceneId={id} />
  if (type === 'application') return <ApplicationScene />
  if (type === 'summary') return <SummaryScene sceneId={id} />
  return <GridScene pattern={pattern} showNeighbors={showNeighbors} />
}
