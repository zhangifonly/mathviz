import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { residueTheoremNarration } from '../../narrations/scripts/residue-theorem'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import {
  RESIDUE_SCENARIOS,
  contourIntegralTheoretical,
  contourIntegralNumerical,
} from './residueTheorem'
import { drawResidueTheorem } from './draw'

function fmt(n: number) {
  return Math.abs(n) < 1e-4 ? '0.000' : n.toFixed(3)
}

export default function ResidueTheoremExperiment() {
  const [scenarioKey, setScenarioKey] = useState(RESIDUE_SCENARIOS[0].key)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(residueTheoremNarration)
  }, [narration])

  const scenario = RESIDUE_SCENARIOS.find((s) => s.key === scenarioKey) ?? RESIDUE_SCENARIOS[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = { poles: scenario.poles, center: scenario.center, radius: scenario.radius }
    let raf = 0
    let progress = 0
    const tick = () => {
      progress = (progress + 0.006) % 1
      drawResidueTheorem(canvas, data, progress)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [scenario])

  const theo = contourIntegralTheoretical(scenario.poles, scenario.center, scenario.radius)
  const num = contourIntegralNumerical(scenario.poles, scenario.center, scenario.radius, 3000)

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">留数定理</h1>
            <p className="text-gray-600">复围道积分只由内部奇点的留数决定</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">{scenario.label}</h3>
            <canvas ref={canvasRef} width={600} height={560} className="w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择布局</h3>
              <div className="space-y-2">
                {RESIDUE_SCENARIOS.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => setScenarioKey(o.key)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${scenarioKey === o.key ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    <div>{o.label}</div>
                    <div className={`text-xs ${scenarioKey === o.key ? 'text-indigo-100' : 'text-indigo-400'}`}>{o.note}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">积分对比</h3>
              <div className="text-sm text-gray-600 space-y-1.5">
                <div>理论值 2πi·ΣRes：</div>
                <div className="font-mono text-indigo-700">{fmt(theo.re)} + {fmt(theo.im)} i</div>
                <div className="pt-1">数值围道积分：</div>
                <div className="font-mono text-emerald-700">{fmt(num.re)} + {fmt(num.im)} i</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">定理趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 闭曲线积分等于 <b>2πi</b> 乘以内部所有<b>留数</b>之和。</li>
                <li>• 只有落在围道<b>内部</b>的奇点才参与求和。</li>
                <li>• 围道内无奇点时积分为零，即<b>柯西定理</b>。</li>
                <li>• 留数把复杂积分浓缩成几个点上的简单数字。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
