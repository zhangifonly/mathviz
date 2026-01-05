/**
 * 插图场景组件
 *
 * 展示形象化的示例图片，帮助用户理解抽象概念
 */

interface IllustrationSceneProps {
  illustration: {
    src: string
    alt: string
    caption?: string
    style?: 'centered' | 'full' | 'side-by-side'
    secondarySrc?: string  // 用于 side-by-side 模式
    secondaryAlt?: string
    secondaryCaption?: string
  }
}

export function IllustrationScene({ illustration }: IllustrationSceneProps) {
  const {
    src,
    alt,
    caption,
    style = 'centered',
    secondarySrc,
    secondaryAlt,
    secondaryCaption,
  } = illustration

  // 全屏模式
  if (style === 'full') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="flex-1 flex items-center justify-center w-full">
          <img
            src={src}
            alt={alt}
            className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
          />
        </div>
        {caption && (
          <p className="mt-4 text-white/80 text-lg text-center max-w-2xl">
            {caption}
          </p>
        )}
      </div>
    )
  }

  // 并排对比模式
  if (style === 'side-by-side' && secondarySrc) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="flex-1 flex items-center justify-center gap-8 w-full">
          {/* 左侧图片 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <img
                src={src}
                alt={alt}
                className="max-h-[50vh] max-w-full object-contain rounded-xl"
              />
            </div>
            {caption && (
              <p className="mt-3 text-white/70 text-center">{caption}</p>
            )}
          </div>

          {/* 中间箭头 */}
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
              →
            </div>
          </div>

          {/* 右侧图片 */}
          <div className="flex-1 flex flex-col items-center">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <img
                src={secondarySrc}
                alt={secondaryAlt || ''}
                className="max-h-[50vh] max-w-full object-contain rounded-xl"
              />
            </div>
            {secondaryCaption && (
              <p className="mt-3 text-white/70 text-center">{secondaryCaption}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 居中模式（默认）
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="bg-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-2xl max-w-3xl">
        <img
          src={src}
          alt={alt}
          className="max-h-[55vh] max-w-full object-contain rounded-2xl mx-auto"
        />
      </div>
      {caption && (
        <div className="mt-6 bg-white/5 rounded-xl px-6 py-3 max-w-2xl">
          <p className="text-white/80 text-lg text-center leading-relaxed">
            {caption}
          </p>
        </div>
      )}
    </div>
  )
}
