import { useState, useEffect, useMemo, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { lorenzAtmosphereNarration } from '../../narrations/scripts/lorenz-atmosphere'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { drawOrbit } from '../../lib/drawAttractor'
import { orbit, lyapunovExponent, divergence } from '../../lib/attractor3d'
import DiagnosticsCard from '../../lib/DiagnosticsCard'
import AttractorControls from '../../lib/AttractorControls'
import { l84FieldF, START, SEASONS } from './lorenzAtmosphere'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS: Array<[string, string]> = [
  ['变量有气象含义', '：X 是西风急流强度，Y/Z 是涡旋波的两个相位分量。'],
  ['波流相互作用', '：−(Y²+Z²) 表示涡旋消耗西风动能，X·Y 与 X·Z 表示西风驱动涡旋。'],
  ['散度依赖西风强弱', '：临界 X=(a+2)/2=1.125，两侧异号，混沌来自膨胀收缩交替。'],
  ['混沌非单调', '：F=6→λ₁≈0.002，F=8→0.142，但 F=9 反而转负，强迫过大会锁定到规则解。'],
]

const W = 640
const H = 480

export default function LorenzAtmosphereExperiment() {
  const [F, setF] = useState(8)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(lorenzAtmosphereNarration)
  }, [narration])

  // 轨道与诊断都按参数缓存: RK4 跑上万步, 每帧重算会卡。
  // ⚠️ 向量场变量名用 vf 而非 f: 参数名可能就叫 f(相泽吸引子), 撞名会自引用
  const { pts, lam, div } = useMemo(() => {
    const vf = l84FieldF(F)
    return {
      pts: orbit(vf, { start: START, dt: 0.01, steps: 20000, skip: 4000 }),
      lam: lyapunovExponent(vf, START, 0.01, 8000),
      div: divergence(vf, START),
    }
  }, [F])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let start = 0
    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) / 1000
      drawOrbit(canvas, pts, {
        title: '洛伦兹84大气模型',
        paramLabel: '季节强迫 F = ' + F.toFixed(3),
        ramp: 'coolwarm',
        yaw: 0.6 + el * 0.2,
        progress: Math.min(1, el / 3),
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // F 也要进依赖: 它进了画面标签, 不然改参数后标签不刷新
  }, [pts, F])

  const tag = lam > 0.005 ? '混沌' : lam < -0.005 ? '收敛到不动点' : '临界(极限环附近)'
  return (
    <>{showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">洛伦兹84大气模型</h1>
            <p className="text-gray-600">天气为什么只能预报一周</p>
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
              label="季节强迫 F" value={F} min={5}
              max={9} step={0.05} onChange={setF}
              presets={SEASONS} valueOf={(p) => p.F}
            />
            <DiagnosticsCard lam={lam} div={div} tag={tag} facts={FACTS} />
          </div>
        </div>
      </div>
    </>
  )
}
