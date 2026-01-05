import { useNarration } from '../../contexts/NarrationContext'

interface NarrationOutlineProps {
  className?: string
}

export default function NarrationOutline({ className = '' }: NarrationOutlineProps) {
  const { script, playbackState, jumpToSection } = useNarration()

  if (!script) return null

  return (
    <div className={`bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden ${className}`}>
      {/* 头部 */}
      <div className="px-4 md:px-5 py-3 md:py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-800">讲解目录</h3>
            <p className="text-xs text-slate-400">
              {playbackState.currentSectionIndex + 1} / {script.sections.length} 段落
            </p>
          </div>
        </div>
      </div>

      {/* 目录列表 */}
      <div className="max-h-[400px] overflow-y-auto">
        {script.sections.map((section, index) => {
          const isCompleted = playbackState.completedSections.has(index)
          const isCurrent = index === playbackState.currentSectionIndex

          return (
            <button
              key={section.id}
              onClick={() => jumpToSection(index)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-all border-b border-slate-100 last:border-b-0 ${
                isCurrent
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50'
                  : 'hover:bg-slate-50'
              }`}
            >
              {/* 状态图标 */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-indigo-500 text-white animate-pulse'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : isCurrent ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>

              {/* 段落信息 */}
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-medium truncate ${
                    isCurrent ? 'text-indigo-700' : isCompleted ? 'text-slate-600' : 'text-slate-700'
                  }`}
                >
                  {section.title}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {section.lines.length} 条讲解
                </p>
              </div>

              {/* 当前指示 */}
              {isCurrent && (
                <span className="text-xs font-medium text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full">
                  当前
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
