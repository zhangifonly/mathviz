import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { chuaAttractorNarration } from '../../narrations/scripts/chua-attractor'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawOrbit } from '../../lib/drawAttractor'
import { orbit, lyapunovExponent, divergence } from '../../lib/attractor3d'
import DiagnosticsCard from '../../lib/DiagnosticsCard'
import AttractorControls from '../../lib/AttractorControls'
import { chuaFieldAlpha, START, PRESETS } from './chuaAttractor'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS: Array<[string, string]> = [
  ['第一个物理混沌', '：1983 年蔡少棠用面包板做出来，打消了「混沌是数值假象」的质疑。'],
  ['分段线性二极管', '：内段斜率 −1.143，外段 −0.714，折点造就混沌。'],
  ['散度分段变号', '：内段 +1.23（膨胀）、外段 −5.46（收缩），交替形成双涡卷。'],
  ['三个平衡点', '：原点与两侧对称的一对，各带一个涡卷。'],
]

const W = 640
const H = 480

export default function ChuaAttractorExperiment() {
  const [alpha, setAlpha] = useState(15.6)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(chuaAttractorNarration)
  }, [narration])

  // 轨道与诊断都按参数缓存: RK4 跑上万步, 每帧重算会卡
  const { pts, lam, div } = useMemo(() => {
    const f = chuaFieldAlpha(alpha)
    return {
      pts: orbit(f, { start: START, dt: 0.005, steps: 16000, skip: 3000 }),
      lam: lyapunovExponent(f, START, 0.005, 8000),
      div: divergence(f, START),
    }
  }, [alpha])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawOrbit(canvas, pts, {
        title: '蔡氏电路吸引子',
        paramLabel: 'α = ' + alpha.toFixed(3),
        ramp: 'plasma',
        yaw: 0.6 + el * 0.2,
        progress: Math.min(1, el / 3),
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // alpha 也要进依赖: 它进了画面标签, 不然改参数后标签不刷新
  }, [pts, alpha])

  const tag = lam > 0.005 ? '混沌' : lam < -0.005 ? '收敛到不动点' : '临界(极限环附近)'
  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">蔡氏电路吸引子</h1>
            <p className="text-gray-600">面包板上做出来的混沌</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">轨道渐变着色 · 冷色为早期</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg" />
          </div>

          <div className="space-y-4">
            <AttractorControls
              label="α" value={alpha} min={8}
              max={20} step={0.1} onChange={setAlpha}
              presets={PRESETS} valueOf={(p) => p.alpha}
            />
            <DiagnosticsCard lam={lam} div={div} tag={tag} facts={FACTS} />
          </div>
        </div>
      </div>
    </>
  )
}
