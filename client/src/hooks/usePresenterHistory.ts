import { useCallback, useState } from 'react'

type NarrationControls = {
  setPresenterMode: (enabled: boolean) => void
} | null | undefined

export function usePresenterHistory(narration?: NarrationControls) {
  const [showPresenter, setShowPresenter] = useState(false)

  const openPresenter = useCallback(() => {
    narration?.setPresenterMode(true)
    setShowPresenter(true)
  }, [narration])

  const handleExit = useCallback(() => {
    narration?.setPresenterMode(false)
    setShowPresenter(false)
  }, [narration])

  return {
    showPresenter,
    openPresenter,
    handleExit,
  }
}

export default usePresenterHistory