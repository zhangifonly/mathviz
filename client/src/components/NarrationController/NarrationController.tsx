import { useNarration } from '../../contexts/NarrationContext'

export default function NarrationController() {
  const {
    playbackState,
    voice,
    playbackRate,
    currentText,
    totalDuration,
    currentTime,
    togglePlay,
    nextLine,
    prevLine,
    setVoice,
    setPlaybackRate,
    exitNarration,
  } = useNarration()

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 播放速度选项
  const speedOptions = [0.75, 1, 1.25, 1.5]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-t border-slate-700/50">
      {/* 字幕区域 */}
      <div className="px-4 py-2 bg-black/20 border-b border-slate-700/30">
        <p className="text-center text-sm md:text-base text-slate-200 truncate max-w-4xl mx-auto">
          {currentText || '准备开始讲解...'}
        </p>
      </div>

      {/* 控制区域 */}
      <div className="px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3 md:gap-6">
          {/* 播放控制 */}
          <div className="flex items-center gap-2">
            {/* 上一句 */}
            <button
              onClick={prevLine}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="上一句"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>

            {/* 播放/暂停 */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
              title={playbackState.isPlaying ? '暂停' : '播放'}
            >
              {playbackState.isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* 下一句 */}
            <button
              onClick={nextLine}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="下一句"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
              </svg>
            </button>
          </div>

          {/* 进度条 */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200"
                style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 w-10">{formatTime(totalDuration)}</span>
          </div>

          {/* 语音切换 */}
          <div className="hidden md:flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setVoice('xiaoxiao')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                voice === 'xiaoxiao'
                  ? 'bg-pink-500 text-white'
                  : 'text-slate-300 hover:bg-slate-600'
              }`}
            >
              晓晓♀
            </button>
            <button
              onClick={() => setVoice('yunxi')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                voice === 'yunxi'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-300 hover:bg-slate-600'
              }`}
            >
              云希♂
            </button>
          </div>

          {/* 播放速度 */}
          <div className="hidden md:flex items-center gap-1 bg-slate-700/50 rounded-lg p-1">
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackRate(speed)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  playbackRate === speed
                    ? 'bg-indigo-500 text-white'
                    : 'text-slate-300 hover:bg-slate-600'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* 退出按钮 */}
          <button
            onClick={exitNarration}
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
            title="退出讲解"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
