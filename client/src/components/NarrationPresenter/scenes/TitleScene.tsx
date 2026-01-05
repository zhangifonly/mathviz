/**
 * 标题场景组件
 *
 * 显示讲解的标题和简介
 */

import type { NarrationScript } from '../../../narrations/types'

interface TitleSceneProps {
  script: NarrationScript | null
}

export function TitleScene({ script }: TitleSceneProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {/* 主标题 */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {script?.title || '傅里叶变换'}
        </h1>
        <p className="text-xl text-white/70">
          探索信号分解的奥秘
        </p>
      </div>

      {/* 装饰性波形动画 */}
      <div className="relative w-full max-w-2xl h-32 mb-8">
        <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          {/* 正弦波 */}
          <path
            d="M0,50 Q50,10 100,50 T200,50 T300,50 T400,50"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="3"
            className="animate-pulse"
          />
          {/* 方波叠加 */}
          <path
            d="M0,50 L50,50 L50,20 L100,20 L100,80 L150,80 L150,20 L200,20 L200,80 L250,80 L250,20 L300,20 L300,80 L350,80 L350,20 L400,20"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 章节预览 */}
      {script && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
          {script.sections.slice(0, 4).map((section, index) => (
            <div
              key={section.id}
              className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">{index + 1}</span>
              </div>
              <p className="text-white/80 text-sm">{section.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* 开始提示 */}
      <div className="mt-8 text-white/50 text-sm animate-bounce">
        点击播放开始讲解
      </div>
    </div>
  )
}
