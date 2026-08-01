import { useState, useEffect } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { boySurfaceNarration } from '../../narrations/scripts/boy-surface'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import Surface3DPlot from '../../lib/Surface3DPlot'
import {
  boySurface, U_RANGE, antipodalGap, threefoldRadiusGap, IMMERSIONS,
} from './boySurface'

// 知识卡条目。抽成常量而不是内联 JSX, 免得组件超过 100 行
const FACTS: Array<[string, string]> = [
  ['0 个分支点', '，三种射影平面浸入里唯一处处光滑的一个。'],
  ['博伊 1901', ' 年为推翻希尔伯特的猜测而造出的反例。'],
  ['自交但光滑', '：曲面确实穿过自己，但没有被捏出尖点。'],
  ['根号五', ' 让分母六个根落在正二十面体对称位置，同时带来三重对称。'],
]

export default function BoySurfaceExperiment() {
  const [detail, setDetail] = useState(36)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(boySurfaceNarration)
  }, [narration])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">博伊曲面</h1>
            <p className="text-gray-600">没有分支点的射影平面浸入</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">3D 视图（可拖动旋转，建议俯视看三重对称）</h3>
            <Surface3DPlot
              fn={(t, r) => boySurface(t, r)}
              uRange={U_RANGE}
              vRange={[0, 0.999]}
              uSteps={detail * 3}
              vSteps={detail}
              colorscale="Viridis"
              aspect="data"
              deps={[detail]}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">网格精度：{detail}</h3>
              <input
                type="range" min={16} max={64} step={2} value={detail}
                onChange={(e) => setDetail(Number(e.target.value))}
                className="w-full" aria-label="网格精度"
              />
              <p className="text-xs text-gray-500 mt-2">
                精度越高自交处越清晰，但采样点数按平方增长。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">实时验证</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 对径点粘合偏差 <b>{antipodalGap(1.1).toExponential(1)}</b>（≈0 即为射影平面）</li>
                <li>• 三重对称半径差 <b>{threefoldRadiusGap(0.7, 0.6).toExponential(1)}</b>（转 120° 后不变）</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">三种浸入对比</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {IMMERSIONS.map((m) => (
                  <li key={m.name}>
                    • <b>{m.name}</b>：分支点 {m.branch} 个，三重点 {m.triple} 个（{m.note}）
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">概念与趣闻</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {FACTS.map(([head, tail]) => (
                  <li key={head}>• <b>{head}</b>{tail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
