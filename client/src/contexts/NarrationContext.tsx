import { createContext, useContext, useState, useRef, useCallback, useEffect, type ReactNode } from 'react'
import type { NarrationScript } from '../narrations/types'

// 语音类型
export type VoiceType = 'xiaoxiao' | 'yunxi'

// 动画动作类型
export type AnimationAction = {
  action: 'setWaveType' | 'setParams' | 'startAnimation' | 'stopAnimation' | 'highlight' | 'scrollTo' | 'reset'
  params?: Record<string, unknown>
  delay?: number
}

// 播放状态
interface PlaybackState {
  isNarrationMode: boolean      // 是否处于讲解模式
  isPresenterMode: boolean      // 是否处于全屏演示模式
  isPlaying: boolean            // 是否正在播放
  currentSectionIndex: number   // 当前段落索引
  currentLineIndex: number      // 当前行索引
  progress: number              // 当前行播放进度 (0-1)
  completedSections: Set<number> // 已完成的段落
}

// Context 值类型
interface NarrationContextValue {
  // 状态
  script: NarrationScript | null
  playbackState: PlaybackState
  voice: VoiceType
  playbackRate: number
  currentText: string
  totalDuration: number
  currentTime: number

  // 方法
  loadScript: (script: NarrationScript) => void
  startNarration: () => void
  exitNarration: () => void
  setPresenterMode: (enabled: boolean) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  nextLine: () => void
  prevLine: () => void
  jumpToSection: (sectionIndex: number) => void
  jumpToLine: (sectionIndex: number, lineIndex: number) => void
  setVoice: (voice: VoiceType) => void
  setPlaybackRate: (rate: number) => void

  // 动画回调注册
  onAnimationAction: (callback: (action: AnimationAction) => void) => () => void
}

const NarrationContext = createContext<NarrationContextValue | null>(null)

// 音频清单类型
interface AudioManifest {
  script_id: string
  voice: string
  voice_key?: string
  files: {
    section_id: string
    line_id: string
    path: string
    duration: number
    text: string
    filename?: string
  }[]
  total_duration: number
}

interface NarrationProviderProps {
  children: ReactNode
}

export function NarrationProvider({ children }: NarrationProviderProps) {
  // 状态
  const [script, setScript] = useState<NarrationScript | null>(null)
  const [manifest, setManifest] = useState<AudioManifest | null>(null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isNarrationMode: false,
    isPresenterMode: false,
    isPlaying: false,
    currentSectionIndex: 0,
    currentLineIndex: 0,
    progress: 0,
    completedSections: new Set(),
  })
  const [voice, setVoiceState] = useState<VoiceType>('yunxi')
  const [playbackRate, setPlaybackRateState] = useState(1.0)
  const [currentText, setCurrentText] = useState('')
  const [totalDuration, setTotalDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationCallbacksRef = useRef<Set<(action: AnimationAction) => void>>(new Set())

  // 获取音频路径 - 支持按声音切换
  const getAudioPath = useCallback((sectionId: string, lineId: string): string | null => {
    if (!manifest || !script) return null
    const file = manifest.files.find(f => f.section_id === sectionId && f.line_id === lineId)
    if (!file) return null

    const filename = file.filename || file.path.split('/').pop()

    // 根据当前选择的声音决定路径
    // xiaoxiao 在根目录，yunxi 在子目录
    if (voice === 'yunxi') {
      return `/audio/narrations/${script.id}/yunxi/${filename}`
    }
    return `/audio/narrations/${script.id}/${filename}`
  }, [manifest, script, voice])

  // 触发动画回调
  const triggerAnimation = useCallback((action: AnimationAction) => {
    animationCallbacksRef.current.forEach(callback => callback(action))
  }, [])

  // 用 ref 跟踪是否应该自动播放下一行
  const shouldAutoPlayRef = useRef(false)
  const playLineRef = useRef<((sectionIdx: number, lineIdx: number) => Promise<void>) | null>(null)

  // 播放指定行
  const playLine = useCallback(async (sectionIdx: number, lineIdx: number) => {
    if (!script || !manifest) return

    const section = script.sections[sectionIdx]
    if (!section) return

    const line = section.lines[lineIdx]
    if (!line) return

    // 更新字幕
    setCurrentText(line.text)

    // 触发动画
    if (line.animation) {
      const delay = line.animation.delay || 0
      setTimeout(() => {
        triggerAnimation(line.animation as AnimationAction)
      }, delay)
    }

    // 获取音频路径
    const audioPath = getAudioPath(section.id, line.id)
    console.log('尝试播放音频:', audioPath)
    if (!audioPath) {
      console.warn('音频文件未找到:', section.id, line.id)
      return
    }

    // 停止当前播放
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // 创建新音频
    const audio = new Audio(audioPath)
    audio.playbackRate = playbackRate
    audioRef.current = audio

    // 监听时间更新 - 更新当前播放时间
    audio.addEventListener('timeupdate', () => {
      if (manifest) {
        // 计算已播放的总时间
        let elapsed = 0
        for (let si = 0; si < sectionIdx; si++) {
          const sec = script.sections[si]
          for (const line of sec.lines) {
            const fileInfo = manifest.files.find(f => f.section_id === sec.id && f.line_id === line.id)
            if (fileInfo) elapsed += fileInfo.duration
          }
        }
        const currentSection = script.sections[sectionIdx]
        for (let li = 0; li < lineIdx; li++) {
          const line = currentSection.lines[li]
          const fileInfo = manifest.files.find(f => f.section_id === currentSection.id && f.line_id === line.id)
          if (fileInfo) elapsed += fileInfo.duration
        }
        elapsed += audio.currentTime
        setCurrentTime(elapsed)
      }
    })

    // 监听结束 - 自动播放下一行
    audio.addEventListener('ended', () => {
      if (!shouldAutoPlayRef.current) return

      const nextLineIdx = lineIdx + 1
      if (nextLineIdx < section.lines.length) {
        setPlaybackState(prev => ({
          ...prev,
          currentLineIndex: nextLineIdx,
          progress: 0,
        }))
        // 延迟播放下一行
        setTimeout(() => {
          if (playLineRef.current) {
            playLineRef.current(sectionIdx, nextLineIdx)
          }
        }, 100)
      } else {
        // 当前段落结束，播放下一段落
        const nextSectionIdx = sectionIdx + 1
        if (nextSectionIdx < script.sections.length) {
          setPlaybackState(prev => ({
            ...prev,
            currentSectionIndex: nextSectionIdx,
            currentLineIndex: 0,
            progress: 0,
            completedSections: new Set([...prev.completedSections, sectionIdx]),
          }))
          setTimeout(() => {
            if (playLineRef.current) {
              playLineRef.current(nextSectionIdx, 0)
            }
          }, 100)
        } else {
          // 全部播放完成
          setPlaybackState(prev => ({
            ...prev,
            isPlaying: false,
            completedSections: new Set([...prev.completedSections, sectionIdx]),
          }))
          shouldAutoPlayRef.current = false
        }
      }
    })

    // 监听加载错误 - 跳过并继续下一行
    audio.addEventListener('error', () => {
      console.error('音频加载失败:', audioPath)
      if (!shouldAutoPlayRef.current) return

      // 自动跳到下一行
      const nextLineIdx = lineIdx + 1
      if (nextLineIdx < section.lines.length) {
        setPlaybackState(prev => ({
          ...prev,
          currentLineIndex: nextLineIdx,
        }))
        setTimeout(() => {
          if (playLineRef.current) {
            playLineRef.current(sectionIdx, nextLineIdx)
          }
        }, 100)
      }
    })

    // 开始播放
    try {
      await audio.play()
    } catch (err) {
      console.error('播放失败:', err, audioPath)
    }
  }, [script, manifest, playbackRate, getAudioPath, triggerAnimation])

  // 更新 ref
  useEffect(() => {
    playLineRef.current = playLine
  }, [playLine])

  // 加载稿件
  const loadScript = useCallback(async (newScript: NarrationScript) => {
    setScript(newScript)

    // 加载音频清单
    try {
      const response = await fetch(`/audio/narrations/${newScript.id}/manifest.json`)
      if (response.ok) {
        const data = await response.json()
        setManifest(data)
        setTotalDuration(data.total_duration || 0)
      }
    } catch (err) {
      console.error('加载音频清单失败:', err)
    }
  }, [])

  // 开始讲解
  const startNarration = useCallback(() => {
    shouldAutoPlayRef.current = true
    setPlaybackState(prev => ({
      ...prev,
      isNarrationMode: true,
      isPlaying: true,
      currentSectionIndex: 0,
      currentLineIndex: 0,
      progress: 0,
      completedSections: new Set(),
    }))
    setCurrentTime(0)
    // 延迟播放，等待状态更新
    setTimeout(() => playLine(0, 0), 100)
  }, [playLine])

  // 退出讲解
  const exitNarration = useCallback(() => {
    shouldAutoPlayRef.current = false
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlaybackState(prev => ({
      ...prev,
      isNarrationMode: false,
      isPresenterMode: false,
      isPlaying: false,
    }))
    setCurrentText('')
  }, [])

  // 设置演示模式
  const setPresenterMode = useCallback((enabled: boolean) => {
    setPlaybackState(prev => ({
      ...prev,
      isPresenterMode: enabled,
    }))
  }, [])

  // 播放
  const play = useCallback(() => {
    if (!playbackState.isNarrationMode) return
    shouldAutoPlayRef.current = true
    setPlaybackState(prev => ({ ...prev, isPlaying: true }))
    playLine(playbackState.currentSectionIndex, playbackState.currentLineIndex)
  }, [playbackState.isNarrationMode, playbackState.currentSectionIndex, playbackState.currentLineIndex, playLine])

  // 暂停
  const pause = useCallback(() => {
    shouldAutoPlayRef.current = false
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setPlaybackState(prev => ({ ...prev, isPlaying: false }))
  }, [])

  // 切换播放/暂停
  const togglePlay = useCallback(() => {
    if (playbackState.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [playbackState.isPlaying, play, pause])

  // 下一行
  const nextLine = useCallback(() => {
    if (!script) return

    const section = script.sections[playbackState.currentSectionIndex]
    if (!section) return

    // 停止当前播放
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const nextLineIndex = playbackState.currentLineIndex + 1
    if (nextLineIndex < section.lines.length) {
      setPlaybackState(prev => ({ ...prev, currentLineIndex: nextLineIndex, progress: 0 }))
      if (playbackState.isPlaying) {
        setTimeout(() => playLine(playbackState.currentSectionIndex, nextLineIndex), 50)
      }
    } else {
      const nextSectionIndex = playbackState.currentSectionIndex + 1
      if (nextSectionIndex < script.sections.length) {
        setPlaybackState(prev => ({
          ...prev,
          currentSectionIndex: nextSectionIndex,
          currentLineIndex: 0,
          progress: 0,
          completedSections: new Set([...prev.completedSections, prev.currentSectionIndex]),
        }))
        if (playbackState.isPlaying) {
          setTimeout(() => playLine(nextSectionIndex, 0), 50)
        }
      }
    }
  }, [script, playbackState.currentSectionIndex, playbackState.currentLineIndex, playbackState.isPlaying, playLine])

  // 上一行
  const prevLine = useCallback(() => {
    if (!script) return

    // 停止当前播放
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    if (playbackState.currentLineIndex > 0) {
      const newLineIndex = playbackState.currentLineIndex - 1
      setPlaybackState(prev => ({ ...prev, currentLineIndex: newLineIndex, progress: 0 }))
      if (playbackState.isPlaying) {
        setTimeout(() => playLine(playbackState.currentSectionIndex, newLineIndex), 50)
      }
    } else if (playbackState.currentSectionIndex > 0) {
      const prevSectionIndex = playbackState.currentSectionIndex - 1
      const prevSection = script.sections[prevSectionIndex]
      const newLineIndex = prevSection.lines.length - 1
      setPlaybackState(prev => ({
        ...prev,
        currentSectionIndex: prevSectionIndex,
        currentLineIndex: newLineIndex,
        progress: 0,
      }))
      if (playbackState.isPlaying) {
        setTimeout(() => playLine(prevSectionIndex, newLineIndex), 50)
      }
    }
  }, [script, playbackState.currentSectionIndex, playbackState.currentLineIndex, playbackState.isPlaying, playLine])

  // 跳转到段落
  const jumpToSection = useCallback((sectionIndex: number) => {
    if (!script || sectionIndex < 0 || sectionIndex >= script.sections.length) return
    setPlaybackState(prev => ({
      ...prev,
      currentSectionIndex: sectionIndex,
      currentLineIndex: 0,
      progress: 0,
    }))
  }, [script])

  // 跳转到行
  const jumpToLine = useCallback((sectionIndex: number, lineIndex: number) => {
    if (!script) return
    const section = script.sections[sectionIndex]
    if (!section || lineIndex < 0 || lineIndex >= section.lines.length) return

    // 停止当前音频
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // 更新状态
    setPlaybackState(prev => ({
      ...prev,
      currentSectionIndex: sectionIndex,
      currentLineIndex: lineIndex,
      progress: 0,
    }))

    // 更新字幕
    const line = section.lines[lineIndex]
    if (line) {
      setCurrentText(line.text)
    }

    // 如果正在播放，播放新位置的音频
    if (playbackState.isPlaying) {
      setTimeout(() => playLine(sectionIndex, lineIndex), 50)
    }
  }, [script, playbackState.isPlaying, playLine])

  // 设置语音
  const setVoice = useCallback((newVoice: VoiceType) => {
    setVoiceState(newVoice)
  }, [])

  // 当语音变化时，如果正在播放则重新加载当前行
  const voiceRef = useRef(voice)
  useEffect(() => {
    if (voiceRef.current !== voice) {
      voiceRef.current = voice
      // 如果正在播放，重新加载当前行
      if (playbackState.isPlaying && audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
        // 使用 setTimeout 避免在 effect 中同步调用 setState
        setTimeout(() => {
          if (playLineRef.current) {
            playLineRef.current(playbackState.currentSectionIndex, playbackState.currentLineIndex)
          }
        }, 0)
      }
    }
  }, [voice, playbackState.isPlaying, playbackState.currentSectionIndex, playbackState.currentLineIndex])

  // 设置播放速度
  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate)
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }, [])

  // 注册动画回调
  const onAnimationAction = useCallback((callback: (action: AnimationAction) => void) => {
    animationCallbacksRef.current.add(callback)
    return () => {
      animationCallbacksRef.current.delete(callback)
    }
  }, [])

  const value: NarrationContextValue = {
    script,
    playbackState,
    voice,
    playbackRate,
    currentText,
    totalDuration,
    currentTime,
    loadScript,
    startNarration,
    exitNarration,
    setPresenterMode,
    play,
    pause,
    togglePlay,
    nextLine,
    prevLine,
    jumpToSection,
    jumpToLine,
    setVoice,
    setPlaybackRate,
    onAnimationAction,
  }

  return (
    <NarrationContext.Provider value={value}>
      {children}
    </NarrationContext.Provider>
  )
}

// Hooks
// eslint-disable-next-line react-refresh/only-export-components
export function useNarration() {
  const context = useContext(NarrationContext)
  if (!context) {
    throw new Error('useNarration must be used within a NarrationProvider')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNarrationOptional() {
  return useContext(NarrationContext)
}
