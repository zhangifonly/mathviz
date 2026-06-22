import { useState, useCallback, useEffect } from 'react'

interface NarrationLike {
  startNarration: () => void
  setPresenterMode: (mode: boolean) => void
}

/**
 * 管理讲解播放器的显示状态 + 浏览器历史集成
 * - 打开播放器时 push history，iOS 划屏返回可关闭播放器
 * - 提供统一的 open/close 接口
 */
export function usePresenterHistory(narration: NarrationLike | null) {
  const [showPresenter, setShowPresenter] = useState(false)

  const closePresenter = useCallback(() => {
    if (narration) narration.setPresenterMode(false)
    setShowPresenter(false)
  }, [narration])

  const openPresenter = useCallback(() => {
    if (!narration) return
    narration.startNarration()
    narration.setPresenterMode(true)
    setShowPresenter(true)
    window.history.pushState({ presenter: true }, '')
  }, [narration])

  // 浏览器返回时关闭播放器
  useEffect(() => {
    if (!showPresenter) return
    const handlePopState = () => closePresenter()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [showPresenter, closePresenter])

  // 按钮关闭：先关闭再 history.back() 消除 push 的条目
  const handleExit = useCallback(() => {
    if (!showPresenter) return
    closePresenter()
    window.history.back()
  }, [showPresenter, closePresenter])

  return { showPresenter, openPresenter, handleExit }
}
