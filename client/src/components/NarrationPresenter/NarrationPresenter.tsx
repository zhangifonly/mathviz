/**
 * 讲解演示器组件
 *
 * 全屏 PPT 式讲解界面，每句讲解对应一个场景
 * 移动端优化：点击屏幕显示/隐藏控制栏，播放后自动隐藏
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNarration } from '../../contexts/NarrationContext'
import type { SceneState, NarrationLineScene } from './types'
import { fourierScenes, defaultFourierState } from './fourierScenes'
import { basicArithmeticScenes, defaultArithmeticState } from './basicArithmeticScenes'
import { fractionsScenes, defaultFractionsState } from './fractionsScenes'
import { geometryShapesScenes, defaultGeometryState } from './geometryShapesScenes'
import { numberTheoryScenes, defaultNumberTheoryState } from './numberTheoryScenes'
import { goldenRatioScenes, defaultGoldenRatioState } from './goldenRatioScenes'
import { setTheoryScenes, defaultSetTheoryState } from './setTheoryScenes'
import { probabilityScenes, defaultProbabilityState } from './probabilityScenes'
import { trigonometryScenes, defaultTrigonometryState } from './trigonometryScenes'
import { pythagoreanScenes, defaultPythagoreanState } from './pythagoreanScenes'
import { quadraticScenes, defaultQuadraticState } from './quadraticScenes'
import { linearScenes, defaultLinearState } from './linearScenes'
import { polarScenes, defaultPolarState } from './polarScenes'
import { bezierScenes, defaultBezierState } from './bezierScenes'
import { monteCarloScenes, defaultMonteCarloState } from './monteCarloScenes'
import { bayesScenes, defaultBayesState } from './bayesScenes'
import { calculusScenes, defaultCalculusState } from './calculusScenes'
import { cltScenes, defaultCltState } from './cltScenes'
import { complexScenes, defaultComplexState } from './complexScenes'
import { conicScenes, defaultConicState } from './conicScenes'
import { parametricScenes, defaultParametricState } from './parametricScenes'
import { regressionScenes, defaultRegressionState } from './regressionScenes'
import { taylorScenes, defaultTaylorState } from './taylorScenes'
// 新增21个高级实验场景
import { chaosScenes, defaultChaosState } from './chaosScenes'
import { fourierDrawingScenes, defaultFourierDrawingState } from './fourierDrawingScenes'
import { fourierSeriesScenes, defaultFourierSeriesState } from './fourierSeriesScenes'
import { fractalScenes, defaultFractalState } from './fractalScenes'
import { gameTheoryScenes, defaultGameTheoryState } from './gameTheoryScenes'
import { gradientDescentScenes, defaultGradientDescentState } from './gradientDescentScenes'
import { graphTheoryScenes, defaultGraphTheoryState } from './graphTheoryScenes'
import { heatEquationScenes, defaultHeatEquationState } from './heatEquationScenes'
import { interpolationScenes, defaultInterpolationState } from './interpolationScenes'
import { linearAlgebraScenes, defaultLinearAlgebraState } from './linearAlgebraScenes'
import { markovChainScenes, defaultMarkovChainState } from './markovChainScenes'
import { matrixDecompositionScenes, defaultMatrixDecompositionState } from './matrixDecompositionScenes'
import { newtonMethodScenes, defaultNewtonMethodState } from './newtonMethodScenes'
import { numericalIntegrationScenes, defaultNumericalIntegrationState } from './numericalIntegrationScenes'
import { odeScenes, defaultOdeState } from './odeScenes'
import { optimizationScenes, defaultOptimizationState } from './optimizationScenes'
import { pcaScenes, defaultPcaState } from './pcaScenes'
import { randomWalkScenes, defaultRandomWalkState } from './randomWalkScenes'
import { signalProcessingScenes, defaultSignalProcessingState } from './signalProcessingScenes'
import { vectorFieldScenes, defaultVectorFieldState } from './vectorFieldScenes'
import { waveEquationScenes, defaultWaveEquationState } from './waveEquationScenes'
// 新增4个高级实验场景
import { pdeScenes, defaultPdeState } from './pdeScenes'
import { differentialGeometryScenes, defaultDifferentialGeometryState } from './differentialGeometryScenes'
import { numericalAnalysisScenes, defaultNumericalAnalysisState } from './numericalAnalysisScenes'
import { cryptographyScenes, defaultCryptographyState } from './cryptographyScenes'
// 新增2个待完成课程场景
import { laplaceScenes, defaultLaplaceState } from './laplaceScenes'
import { permutationCombinationScenes, defaultPermutationCombinationState } from './permutationCombinationScenes'
import { gameOfLifeScenes, defaultGameOfLifeState } from './gameOfLifeScenes'
import { eulerIdentityScenes, defaultEulerIdentityState } from './eulerIdentityScenes'
import { threeBodyScenes, defaultThreeBodyState } from './threeBodyScenes'
import { reactionDiffusionScenes, defaultReactionDiffusionState } from './reactionDiffusionScenes'
import { mobiusScenes, defaultMobiusState } from './mobiusScenes'
import { WaveformScene } from './scenes/WaveformScene'
import { SpectrumScene } from './scenes/SpectrumScene'
import { FormulaScene } from './scenes/FormulaScene'
import { ComparisonScene } from './scenes/ComparisonScene'
import { TitleScene } from './scenes/TitleScene'
import { ApplicationScene } from './scenes/ApplicationScene'
import { IllustrationScene } from './scenes/IllustrationScene'
import { BasicArithmeticSceneRenderer } from './scenes/BasicArithmetic'
import type { BasicArithmeticState } from './scenes/BasicArithmetic/BasicArithmeticSceneRenderer'
import SceneRendererWrapper from './scenes/SceneRendererFactory'

interface NarrationPresenterProps {
  onExit: () => void
}

// 场景配置映射表
const sceneConfigMap: Record<string, {
  scenes: NarrationLineScene[]
  defaultState: SceneState
}> = {
  'fourier': { scenes: fourierScenes, defaultState: defaultFourierState },
  'basic-arithmetic': { scenes: basicArithmeticScenes, defaultState: defaultArithmeticState },
  'fractions': { scenes: fractionsScenes, defaultState: defaultFractionsState },
  'geometry-shapes': { scenes: geometryShapesScenes, defaultState: defaultGeometryState },
  'number-theory': { scenes: numberTheoryScenes, defaultState: defaultNumberTheoryState },
  'golden-ratio': { scenes: goldenRatioScenes, defaultState: defaultGoldenRatioState },
  'set-theory': { scenes: setTheoryScenes, defaultState: defaultSetTheoryState },
  'probability': { scenes: probabilityScenes, defaultState: defaultProbabilityState },
  'trigonometry': { scenes: trigonometryScenes, defaultState: defaultTrigonometryState },
  'pythagorean': { scenes: pythagoreanScenes, defaultState: defaultPythagoreanState },
  'quadratic-function': { scenes: quadraticScenes, defaultState: defaultQuadraticState },
  'linear-function': { scenes: linearScenes, defaultState: defaultLinearState },
  'polar': { scenes: polarScenes, defaultState: defaultPolarState },
  'bezier': { scenes: bezierScenes, defaultState: defaultBezierState },
  'monte-carlo': { scenes: monteCarloScenes, defaultState: defaultMonteCarloState },
  'bayes': { scenes: bayesScenes, defaultState: defaultBayesState },
  'calculus': { scenes: calculusScenes, defaultState: defaultCalculusState },
  'clt': { scenes: cltScenes, defaultState: defaultCltState },
  'complex': { scenes: complexScenes, defaultState: defaultComplexState },
  'conic-sections': { scenes: conicScenes, defaultState: defaultConicState },
  'parametric': { scenes: parametricScenes, defaultState: defaultParametricState },
  'regression': { scenes: regressionScenes, defaultState: defaultRegressionState },
  'taylor': { scenes: taylorScenes, defaultState: defaultTaylorState },
  // 新增21个高级实验
  'chaos': { scenes: chaosScenes, defaultState: defaultChaosState },
  'fourier-drawing': { scenes: fourierDrawingScenes, defaultState: defaultFourierDrawingState },
  'fourier-series': { scenes: fourierSeriesScenes, defaultState: defaultFourierSeriesState },
  'fractal': { scenes: fractalScenes, defaultState: defaultFractalState },
  'game-theory': { scenes: gameTheoryScenes, defaultState: defaultGameTheoryState },
  'gradient-descent': { scenes: gradientDescentScenes, defaultState: defaultGradientDescentState },
  'graph-theory': { scenes: graphTheoryScenes, defaultState: defaultGraphTheoryState },
  'heat-equation': { scenes: heatEquationScenes, defaultState: defaultHeatEquationState },
  'interpolation': { scenes: interpolationScenes, defaultState: defaultInterpolationState },
  'linear-algebra': { scenes: linearAlgebraScenes, defaultState: defaultLinearAlgebraState },
  'markov-chain': { scenes: markovChainScenes, defaultState: defaultMarkovChainState },
  'matrix-decomposition': { scenes: matrixDecompositionScenes, defaultState: defaultMatrixDecompositionState },
  'newton-method': { scenes: newtonMethodScenes, defaultState: defaultNewtonMethodState },
  'numerical-integration': { scenes: numericalIntegrationScenes, defaultState: defaultNumericalIntegrationState },
  'ode': { scenes: odeScenes, defaultState: defaultOdeState },
  'optimization': { scenes: optimizationScenes, defaultState: defaultOptimizationState },
  'pca': { scenes: pcaScenes, defaultState: defaultPcaState },
  'random-walk': { scenes: randomWalkScenes, defaultState: defaultRandomWalkState },
  'signal-processing': { scenes: signalProcessingScenes, defaultState: defaultSignalProcessingState },
  'vector-field': { scenes: vectorFieldScenes, defaultState: defaultVectorFieldState },
  'wave-equation': { scenes: waveEquationScenes, defaultState: defaultWaveEquationState },
  // 新增4个高级实验
  'pde': { scenes: pdeScenes, defaultState: defaultPdeState },
  'differential-geometry': { scenes: differentialGeometryScenes, defaultState: defaultDifferentialGeometryState },
  'numerical-analysis': { scenes: numericalAnalysisScenes, defaultState: defaultNumericalAnalysisState },
  'cryptography': { scenes: cryptographyScenes, defaultState: defaultCryptographyState },
  // 新增2个待完成课程
  'laplace': { scenes: laplaceScenes, defaultState: defaultLaplaceState },
  'permutation-combination': { scenes: permutationCombinationScenes, defaultState: defaultPermutationCombinationState },
  // 新增优美数学场景
  'game-of-life': { scenes: gameOfLifeScenes, defaultState: defaultGameOfLifeState },
  'euler-identity': { scenes: eulerIdentityScenes, defaultState: defaultEulerIdentityState },
  'three-body': { scenes: threeBodyScenes, defaultState: defaultThreeBodyState },
  'reaction-diffusion': { scenes: reactionDiffusionScenes, defaultState: defaultReactionDiffusionState },
  'mobius': { scenes: mobiusScenes, defaultState: defaultMobiusState },
}

// 检测是否为移动设备
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// 格式化时间 (秒 -> mm:ss)
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function NarrationPresenter({ onExit }: NarrationPresenterProps) {
  const {
    script,
    playbackState,
    voice,
    playbackRate,
    currentText,
    currentTime,
    totalDuration,
    togglePlay,
    nextLine,
    prevLine,
    jumpToLine,
    setVoice,
    setPlaybackRate,
    exitNarration,
  } = useNarration()

  // 获取当前稿件的场景配置
  const sceneConfig = useMemo(() => {
    const scriptId = script?.id || 'fourier'
    return sceneConfigMap[scriptId] || sceneConfigMap['fourier']
  }, [script?.id])

  // 场景状态 - 根据稿件类型初始化
  const [sceneState, setSceneState] = useState<SceneState>(defaultFourierState)

  // 当稿件变化时，重置场景状态
  useEffect(() => {
    setSceneState(sceneConfig.defaultState)
  }, [sceneConfig])

  // 移动端控制栏显示状态
  const isMobile = useIsMobile()
  const [controlsVisible, setControlsVisible] = useState(true)
  const hideTimerRef = useRef<number | null>(null)

  // 清除隐藏定时器
  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  // 启动隐藏定时器（3秒后隐藏）
  const startHideTimer = useCallback(() => {
    clearHideTimer()
    if (isMobile && playbackState.isPlaying) {
      hideTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false)
      }, 3000)
    }
  }, [isMobile, playbackState.isPlaying, clearHideTimer])

  // 播放状态变化时处理控制栏显示
  useEffect(() => {
    if (isMobile) {
      if (playbackState.isPlaying) {
        // 播放时启动隐藏定时器
        startHideTimer()
      } else {
        // 暂停时显示控制栏
        clearHideTimer()
        setControlsVisible(true)
      }
    }
  }, [isMobile, playbackState.isPlaying, startHideTimer, clearHideTimer])

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => clearHideTimer()
  }, [clearHideTimer])

  // 点击屏幕切换控制栏显示
  const handleScreenTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // 如果点击的是按钮或控制区域，不处理
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('select') || target.closest('.controls-area')) {
      return
    }

    if (isMobile) {
      setControlsVisible((prev) => {
        const newVisible = !prev
        if (newVisible && playbackState.isPlaying) {
          // 显示后启动隐藏定时器
          startHideTimer()
        }
        return newVisible
      })
    }
  }, [isMobile, playbackState.isPlaying, startHideTimer])

  // 获取当前场景配置
  const currentScene = useMemo((): NarrationLineScene | null => {
    if (!script) return null

    const section = script.sections[playbackState.currentSectionIndex]
    if (!section) return null

    const line = section.lines[playbackState.currentLineIndex]
    if (!line) return null

    return sceneConfig.scenes.find(
      (s) => s.sectionId === section.id && s.lineId === line.id
    ) || null
  }, [script, playbackState.currentSectionIndex, playbackState.currentLineIndex, sceneConfig.scenes])

  // 当场景变化时，更新状态
  useEffect(() => {
    if (currentScene?.scene.initialState) {
      setSceneState((prev) => ({
        ...prev,
        ...currentScene.scene.initialState,
      }))
    }
  }, [currentScene])

  // 更新场景状态
  const updateSceneState = useCallback((updates: Partial<SceneState>) => {
    setSceneState((prev) => ({ ...prev, ...updates }))
  }, [])

  // 处理退出
  const handleExit = useCallback(() => {
    exitNarration()
    onExit()
  }, [exitNarration, onExit])

  // 渲染场景内容
  const renderScene = () => {
    if (!currentScene) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-white/50 text-lg">加载中...</div>
        </div>
      )
    }

    const { scene } = currentScene
    const isInteractive = playbackState.isPlaying === false
    const scriptId = script?.id

    // 使用专属场景渲染器 - basic-arithmetic 有特殊处理
    if (scriptId === 'basic-arithmetic') {
      const arithmeticState: BasicArithmeticState = {
        operation: (sceneState as unknown as BasicArithmeticState).operation || 'addition',
        num1: (sceneState as unknown as BasicArithmeticState).num1 || 7,
        num2: (sceneState as unknown as BasicArithmeticState).num2 || 5,
        step: (sceneState as unknown as BasicArithmeticState).step || 0,
        showResult: (sceneState as unknown as BasicArithmeticState).showResult || false,
      }
      return (
        <BasicArithmeticSceneRenderer
          scene={currentScene}
          state={arithmeticState}
          onStateChange={(updates) => updateSceneState(updates as Partial<SceneState>)}
          isInteractive={isInteractive}
        />
      )
    }

    // 检查是否有专属场景渲染器（除了 fourier 使用默认渲染）
    const experimentsWithCustomRenderer = [
      'chaos', 'fractal', 'game-theory', 'taylor', 'calculus', 'bayes', 'clt',
      'complex', 'conic-sections', 'parametric', 'regression', 'fourier-drawing',
      'fourier-series', 'gradient-descent', 'graph-theory', 'heat-equation',
      'interpolation', 'linear-algebra', 'markov-chain', 'matrix-decomposition',
      'newton-method', 'numerical-integration', 'ode', 'optimization', 'pca',
      'random-walk', 'signal-processing', 'vector-field', 'wave-equation',
      'fractions', 'geometry-shapes', 'number-theory', 'golden-ratio', 'set-theory',
      'probability', 'trigonometry', 'pythagorean', 'quadratic-function',
      'linear-function', 'polar', 'bezier', 'monte-carlo',
      // 新增4个高级实验
      'pde', 'differential-geometry', 'numerical-analysis', 'cryptography',
      // 新增2个待完成课程
      'laplace', 'permutation-combination',
      // 新增优美数学场景
      'game-of-life', 'euler-identity', 'three-body', 'reaction-diffusion', 'mobius'
    ]

    if (scriptId && experimentsWithCustomRenderer.includes(scriptId)) {
      return (
        <SceneRendererWrapper
          experimentId={scriptId}
          scene={currentScene}
          isInteractive={isInteractive}
        />
      )
    }

    // 默认场景渲染（傅里叶等）
    switch (scene.type) {
      case 'title':
        return <TitleScene script={script} />

      case 'waveform':
      case 'animation':
      case 'interactive':
        return (
          <WaveformScene
            state={sceneState}
            onStateChange={updateSceneState}
            interactive={isInteractive ? scene.interactive : undefined}
            showAnimation={scene.type === 'animation'}
          />
        )

      case 'spectrum':
        return (
          <SpectrumScene
            state={sceneState}
            onStateChange={updateSceneState}
            interactive={isInteractive ? scene.interactive : undefined}
          />
        )

      case 'formula':
        return (
          <FormulaScene
            waveType={sceneState.waveType}
            terms={sceneState.terms}
          />
        )

      case 'comparison':
        return (
          <ComparisonScene
            state={sceneState}
            onStateChange={updateSceneState}
            interactive={isInteractive ? scene.interactive : undefined}
          />
        )

      case 'application':
        return (
          <ApplicationScene
            sceneId={scene.id}
          />
        )

      case 'illustration':
        if (scene.illustration) {
          return <IllustrationScene illustration={scene.illustration} />
        }
        return null

      case 'summary':
      case 'text':
      default:
        return (
          <WaveformScene
            state={sceneState}
            onStateChange={updateSceneState}
            interactive={isInteractive ? { allowWaveTypeChange: true, allowParamChange: true } : undefined}
          />
        )
    }
  }

  // 获取当前段落信息
  const currentSection = script?.sections[playbackState.currentSectionIndex]
  const totalLines = script?.sections.reduce((acc, s) => acc + s.lines.length, 0) || 0
  const currentLineNumber = (script?.sections
    .slice(0, playbackState.currentSectionIndex)
    .reduce((acc, s) => acc + s.lines.length, 0) || 0) + playbackState.currentLineIndex + 1

  // 控制栏显示/隐藏的样式类
  const controlsTransition = 'transition-all duration-300 ease-in-out'
  const controlsHiddenClass = isMobile && !controlsVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'

  // 下滑关闭手势
  const touchStartRef = useRef<{ y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches[0].clientY < window.innerHeight * 0.3) {
      touchStartRef.current = { y: e.touches[0].clientY }
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y
    touchStartRef.current = null
    if (deltaY > 120) handleExit()
  }, [handleExit])

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      onClick={handleScreenTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 移动端下滑指示条 */}
      <div className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 z-20 w-10 h-1 bg-white/30 rounded-full" />

      {/* 顶部信息栏 - 移动端可隐藏 */}
      <div
        className={`controls-area absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-gradient-to-b from-slate-900/95 to-transparent ${controlsTransition} ${controlsHiddenClass}`}
      >
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-base md:text-xl">📊</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm md:text-lg">{script?.title || '讲解模式'}</h1>
            <p className="text-white/50 text-xs md:text-sm hidden md:block">{currentSection?.title || ''}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* 进度指示 */}
          <div className="text-white/50 text-xs md:text-sm">
            {currentLineNumber} / {totalLines}
          </div>

          {/* 语音切换 - 移动端简化 */}
          <div className="hidden md:flex items-center gap-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setVoice('xiaoxiao')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                voice === 'xiaoxiao'
                  ? 'bg-pink-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              晓晓♀
            </button>
            <button
              onClick={() => setVoice('yunxi')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                voice === 'yunxi'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              云希♂
            </button>
          </div>

          {/* 移动端语音切换按钮 */}
          <button
            onClick={() => setVoice(voice === 'xiaoxiao' ? 'yunxi' : 'xiaoxiao')}
            className={`md:hidden px-2 py-1.5 rounded-lg text-xs font-medium ${
              voice === 'xiaoxiao' ? 'bg-pink-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {voice === 'xiaoxiao' ? '♀' : '♂'}
          </button>

          {/* 播放速度 - 移动端隐藏 */}
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(Number(e.target.value))}
            className="hidden md:block bg-white/10 text-white text-sm rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-indigo-500"
          >
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
          </select>

          {/* 退出按钮 */}
          <button
            onClick={handleExit}
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-all text-sm font-medium"
          >
            退出
          </button>
        </div>
      </div>

      {/* 主内容区 - 移动端全屏 */}
      <div className="absolute inset-0 flex flex-col">
        {/* 可视化区域 - 移动端占满屏幕 */}
        <div className="flex-1 md:m-6 md:mt-20 md:mb-4 md:rounded-2xl overflow-hidden bg-white/5">
          {renderScene()}
        </div>

        {/* 字幕区域 - 移动端底部悬浮，桌面端固定位置 */}
        <div
          className={`absolute left-0 right-0 ${isMobile ? 'bottom-24' : 'bottom-20'} mx-4 md:mx-6 bg-black/60 md:bg-white/10 backdrop-blur-sm rounded-xl px-4 md:px-6 py-3 md:py-4 ${controlsTransition} ${isMobile && !controlsVisible ? 'bottom-4' : ''}`}
        >
          {/* 进度条 */}
          <div className="mb-2">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span className="flex-1 text-center">{currentSection?.title}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
            <div
              className="h-1.5 bg-white/20 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percent = x / rect.width
                const targetLine = Math.floor(percent * totalLines)
                // 计算目标 section 和 line
                let count = 0
                for (let si = 0; si < (script?.sections.length || 0); si++) {
                  const section = script?.sections[si]
                  if (!section) continue
                  for (let li = 0; li < section.lines.length; li++) {
                    if (count === targetLine) {
                      jumpToLine(si, li)
                      return
                    }
                    count++
                  }
                }
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }}
              />
            </div>
          </div>
          <p className="text-white text-sm md:text-lg leading-relaxed text-center">
            {currentText || '准备开始...'}
          </p>
        </div>
      </div>

      {/* 底部控制栏 - 移动端可隐藏 */}
      <div
        className={`controls-area absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 md:gap-6 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-t from-slate-900/95 to-transparent ${controlsTransition} ${controlsHiddenClass}`}
      >
        {/* 上一句 */}
        <button
          onClick={prevLine}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        {/* 播放/暂停 */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center"
        >
          {playbackState.isPlaying ? (
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* 下一句 */}
        <button
          onClick={nextLine}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
        </button>

        {/* 移动端播放速度按钮 */}
        <button
          onClick={() => {
            const rates = [0.75, 1, 1.25, 1.5]
            const currentIndex = rates.indexOf(playbackRate)
            const nextIndex = (currentIndex + 1) % rates.length
            setPlaybackRate(rates[nextIndex])
          }}
          className="md:hidden w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center text-xs font-medium"
        >
          {playbackRate}x
        </button>
      </div>

      {/* 暂停时的交互提示 - 移动端调整位置 */}
      {!playbackState.isPlaying && currentScene?.scene.interactive && (
        <div className={`absolute ${isMobile ? 'bottom-40' : 'bottom-28'} left-1/2 -translate-x-1/2 bg-indigo-500/90 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm animate-pulse`}>
          暂停中 - 可以交互探索
        </div>
      )}

      {/* 移动端点击提示 - 仅在控制栏隐藏时显示 */}
      {isMobile && !controlsVisible && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none">
          点击屏幕显示控制
        </div>
      )}
    </div>
  )
}
