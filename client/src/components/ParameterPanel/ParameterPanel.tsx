interface SliderParam {
  key: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
}

interface ParameterPanelProps {
  title: string
  params: SliderParam[]
  onChange: (key: string, value: number) => void
  className?: string
}

export default function ParameterPanel({ title, params, onChange, className = '' }: ParameterPanelProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden transition-all duration-300 ${className}`}>
      {/* 标题栏 */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
      </div>

      {/* 参数列表 */}
      <div className="p-5 space-y-5">
        {params.map((param) => {
          const percentage = ((param.value - param.min) / (param.max - param.min)) * 100

          return (
            <div key={param.key} className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-600">{param.label}</label>
                <span className="px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg text-sm font-semibold text-indigo-600 tabular-nums">
                  {param.value.toFixed(param.step && param.step < 1 ? 2 : 0)}
                  {param.unit && <span className="text-indigo-400 ml-0.5">{param.unit}</span>}
                </span>
              </div>

              {/* 自定义滑块容器 */}
              <div className="relative h-6 flex items-center">
                {/* 轨道背景 */}
                <div className="absolute inset-x-0 h-2 bg-slate-100 rounded-full overflow-hidden">
                  {/* 填充进度 */}
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-150"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* 原生滑块（透明，用于交互） */}
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step || 1}
                  value={param.value}
                  onChange={(e) => onChange(param.key, parseFloat(e.target.value))}
                  className="relative w-full h-6 appearance-none bg-transparent cursor-pointer z-10"
                />
              </div>

              {/* 范围标签 */}
              <div className="flex justify-between mt-1.5 text-xs text-slate-400">
                <span>{param.min}{param.unit || ''}</span>
                <span>{param.max}{param.unit || ''}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
