import { useState, useEffect, useRef } from 'react'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { boxCountingDimensionNarration } from '../../narrations/scripts/box-counting-dimension'
import { usePresenterHistory } from '../../hooks/usePresenterHistory'
import { makeSierpinski, EPSILONS } from './boxCountingDimension'
import { drawFractal, drawLogLog } from './draw'

const W = 300
const H = 300

export default function BoxCountingDimensionExperiment() {
  const [epsilon, setEpsilon] = useState(32)
  const fractalRef = useRef<HTMLCanvasElement>(null)
  const plotRef = useRef<HTMLCanvasElement>(null)

  const narration = useNarrationOptional()
  const { showPresenter, openPresenter, handleExit } = usePresenterHistory(narration)

  useEffect(() => {
    if (narration) narration.loadScript(boxCountingDimensionNarration)
  }, [narration])

  useEffect(() => {
    const points = makeSierpinski(60000, 512, 1)
    if (fractalRef.current) drawFractal(fractalRef.current, points, epsilon)
    if (plotRef.current) drawLogLog(plotRef.current, points, EPSILONS)
  }, [epsilon])

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExit} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">盒维数</h1>
            <p className="text-gray-600">测量分形维数</p>
          </div>
          <button onClick={openPresenter} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" /></svg>
            <span>开始讲解</span>
          </button>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-2">谢尔宾斯基三角形 · ε={epsilon} 网格覆盖</h3>
            <div className="flex flex-wrap gap-3">
              <canvas ref={fractalRef} width={W} height={H} className="rounded-lg bg-slate-50 flex-1 min-w-[240px]" />
              <canvas ref={plotRef} width={W} height={H} className="rounded-lg bg-white border border-gray-100 flex-1 min-w-[240px]" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">覆盖网格尺度 ε</h3>
              <div className="grid grid-cols-3 gap-2">
                {EPSILONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEpsilon(e)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${epsilon === e ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">ε 越小，覆盖分形所需的非空格子 N(ε) 越多。</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">关于盒维数</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• 维数 D = log N(ε) / log(1/ε) 的极限。</li>
                <li>• 右图对多个尺度做 <b>log-log 线性拟合</b>，斜率即为 D。</li>
                <li>• 谢尔宾斯基三角形理论维数 = log3/log2 ≈ <b>1.585</b>，介于线与面之间。</li>
                <li>• 分形维数常是<b>分数</b>，这正是「分形」得名的原因。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
