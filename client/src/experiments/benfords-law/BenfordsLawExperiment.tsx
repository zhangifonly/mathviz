import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { benfordsLawNarration } from '../../narrations/scripts/benfords-law'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { DATASETS, SAMPLE_COUNT, type DatasetType } from './benfordsLaw'
import { drawBenfordsLaw } from './draw'

const W = 600
const H = 480

const LABELS: Record<DatasetType, string> = {
  powers2: '2 的幂（1,2,4,8…）',
  fibonacci: '斐波那契数列',
  random: '均匀随机数（反例）',
}

export default function BenfordsLawExperiment() {
  const [dataset, setDataset] = useState<DatasetType>('powers2')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(benfordsLawNarration)
  }, [narration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawBenfordsLaw(canvas, dataset, SAMPLE_COUNT)
  }, [dataset])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">本福特定律</h1>
            <p className="text-gray-600">首位数字的分布</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">首位分布 · 蓝柱=实际 · 红线=本福特理论</h3>
            <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg bg-slate-50" />
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">选择数据集</h3>
              <div className="space-y-2">
                {DATASETS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setDataset(t)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left ${dataset === t ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">要点与应用</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 首位为 d 的概率 = <b>log₁₀(1 + 1/d)</b>。</li>
                <li>• 首位是 1 的约占 <b>30%</b>，是 9 的仅约 4.6%。</li>
                <li>• 跨数量级的自然数据大多服从此律。</li>
                <li>• 税务、选举、财报<b>反欺诈</b>用它筛查造假。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
