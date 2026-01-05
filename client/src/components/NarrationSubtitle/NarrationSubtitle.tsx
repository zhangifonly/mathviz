import { useNarrationOptional } from '../../contexts/NarrationContext'

interface NarrationSubtitleProps {
  className?: string
}

export default function NarrationSubtitle({ className = '' }: NarrationSubtitleProps) {
  const narration = useNarrationOptional()

  if (!narration?.playbackState.isNarrationMode || !narration.currentText) {
    return null
  }

  return (
    <div className={`bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden ${className}`}>
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-start gap-3">
          {/* 语音图标 */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 animate-pulse">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
          </div>

          {/* 字幕文字 */}
          <p className="text-white text-sm md:text-base leading-relaxed flex-1 animate-fade-in">
            {narration.currentText}
          </p>
        </div>

        {/* 进度指示 */}
        <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200"
            style={{ width: `${narration.playbackState.progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
