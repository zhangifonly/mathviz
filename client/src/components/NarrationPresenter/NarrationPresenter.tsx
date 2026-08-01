/**
 * 讲解演示器组件
 *
 * 全屏 PPT 式讲解界面，每句讲解对应一个场景
 * 移动端优化：点击屏幕显示/隐藏控制栏，播放后自动隐藏
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNarration } from '../../contexts/NarrationContext'
import type { SceneState, NarrationLineScene } from './types'
import { loadSceneConfig, FALLBACK_SCENE_STATE, type SceneConfigBundle } from './sceneRegistry'
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

  // 当前稿件的场景配置(按需动态加载, 见 sceneRegistry)
  const [sceneConfig, setSceneConfig] = useState<SceneConfigBundle>({
    scenes: [],
    defaultState: FALLBACK_SCENE_STATE,
  })

  // 场景状态 - 场景配置加载完成后按其默认值重置
  const [sceneState, setSceneState] = useState<SceneState>(FALLBACK_SCENE_STATE)

  // 稿件变化时加载对应场景配置; 用 cancelled 标记避免快速切换时旧结果覆盖新结果
  useEffect(() => {
    const scriptId = script?.id || 'fourier'
    let cancelled = false
    loadSceneConfig(scriptId).then(bundle => {
      if (cancelled) return
      setSceneConfig(bundle)
      setSceneState(bundle.defaultState)
    })
    return () => { cancelled = true }
  }, [script?.id])

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
  // 这里是把「音频播放」这一外部状态同步到控制栏 UI: 播放中自动隐藏, 暂停立即显示。
  // 播放状态由 NarrationContext 管理(键盘/控制条/自动推进都会改), 无法在单一事件里处理;
  // 每次播放/暂停只触发一次, 额外渲染可忽略, 故豁免 set-state-in-effect。
  useEffect(() => {
    if (isMobile) {
      if (playbackState.isPlaying) {
        // 播放时启动隐藏定时器
        startHideTimer()
      } else {
        // 暂停时显示控制栏
        clearHideTimer()
        // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // 讲解推进到新场景时, 把该场景的 initialState 合并进当前场景状态。
  // 不能改成派生状态: sceneState 之后还要接受用户交互修改(updateSceneState),
  // 且这里是 merge 而非替换, 需要保留用户在其他字段上的调整。
  // 每句讲解只触发一次, 故豁免 set-state-in-effect。
  useEffect(() => {
    if (currentScene?.scene.initialState) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      'game-of-life', 'euler-identity', 'three-body', 'reaction-diffusion', 'mobius', 'cycloid', 'lissajous', 'ulam-spiral', 'pascal-triangle', 'voronoi', 'l-system', 'even-odd', 'roman-numerals', 'symmetry', 'tangram', 'clock-angles', 'inequalities', 'linear-system', 'similar-triangles', 'circle-geometry', 'stats-basics', 'absolute-value', 'sequences', 'exponential-log', 'matrix-transform', 'dot-cross-product', 'parabola-optics', 'sine-superposition', 'combinatorial-proof', 'modular-arithmetic', 'continued-fraction', 'epidemic-sir', 'eigen-visualization', 'svd', 'gram-schmidt', 'lagrange-multiplier', 'green-theorem', 'residue-theorem', 'power-series', 'gaussian-process', 'kalman-filter', 'simulated-annealing', 'mandelbrot-julia', 'double-pendulum', 'lorenz-attractor', 'nbody-simulation', 'percolation', 'cellular-automata', 'knot-theory', 'wavelet', 'sieve-eratosthenes', 'magic-square', 'tower-of-hanoi', 'pigeonhole', 'triangle-centers', 'number-bases', 'pythagoras-tree', 'tessellation', 'perfect-numbers', 'collatz', 'prime-factorization', 'fibonacci-nature', 'dice-probability', 'nine-point-circle', 'euler-line', 'inversive-geometry', 'poincare-disk', 'spherical-geometry', 'convex-hull', 'delaunay-triangulation', 'apollonian-gasket', 'pick-theorem', 'reuleaux', 'circle-packing', 'steiner-chain', 'polynomial-roots', 'vieta-formulas', 'binomial-theorem', 'inverse-function', 'composite-function', 'partial-fractions', 'rational-asymptotes', 'piecewise-function', 'logarithm-spiral', 'function-transform', 'euclidean-algorithm', 'chinese-remainder', 'quadratic-residue', 'gaussian-integers', 'integer-partition', 'pell-equation', 'prime-counting', 'digital-root', 'epsilon-delta', 'mean-value-theorem', 'riemann-sum', 'solid-of-revolution', 'arc-length-curvature', 'series-convergence', 'improper-integral', 'determinant-geometry', 'kernel-image', 'orthogonal-projection', 'least-squares', 'quadratic-form', 'spectral-theorem', 'law-large-numbers', 'poisson-process', 'brownian-motion', 'monty-hall', 'birthday-paradox', 'hypothesis-testing', 'confidence-interval', 'max-likelihood', 'gaussian-mixture', 'hidden-markov', 'multiple-integral', 'line-integral', 'divergence-curl', 'stokes-theorem', 'partial-derivative', 'directional-derivative', 'jacobian', 'vector-calculus-field', 'laplacian', 'dijkstra', 'network-flow', 'graph-coloring', 'euler-hamilton-path', 'sorting-algorithms', 'bfs-dfs', 'dynamic-programming', 'divide-conquer', 'huffman-coding', 'catalan-numbers', 'generating-functions', 'minimum-spanning-tree', 'logistic-bifurcation', 'phase-portrait', 'limit-cycle', 'lotka-volterra', 'pendulum-phase', 'kepler-orbit', 'vibrating-string', 'poincare-section', 'euler-characteristic', 'torus-klein', 'perceptron', 'kmeans', 'neural-network-forward', 'koch-snowflake', 'sierpinski-triangle', 'sierpinski-carpet', 'dragon-curve', 'barnsley-fern', 'hilbert-curve', 'peano-curve', 'gosper-curve', 'levy-c-curve', 'newton-fractal', 'burning-ship', 'box-counting-dimension', 'cantor-set', 'quadtree', 'kd-tree', 'marching-squares', 'point-in-polygon', 'line-clipping', 'rotating-calipers', 'ear-clipping', 'a-star', 'stereographic-projection', 'hopf-fibration', 'hyperbolic-tiling', 'spirograph', 'euler-totient', 'mobius-function', 'farey-sequence', 'stern-brocot', 'primitive-root', 'fermat-little', 'wilson-theorem', 'fast-exponentiation', 'pythagorean-triples', 'sum-of-squares', 'happy-numbers', 'kaprekar', 'lucas-numbers', 'triangular-numbers', 'frobenius-coin', 'caesar-cipher', 'vigenere-cipher', 'rsa-cipher', 'diffie-hellman', 'one-time-pad', 'elliptic-curve', 'josephus-problem', 'gray-code', 'look-and-say', 'hill-cipher', 'lu-decomposition', 'qr-decomposition', 'cholesky', 'power-iteration', 'pagerank', 'markov-stationary', 'cramers-rule', 'rotation3d', 'gibbs-phenomenon', 'chebyshev-polynomials', 'legendre-polynomials', 'bessel-functions', 'gamma-function', 'fixed-point-iteration', 'secant-method', 'bisection-method', 'fft', 'aliasing', 'autocorrelation', 'convolution', 'nyquist-sampling', 'windowing', 'b-spline', 'catmull-rom', 'discrete-cosine-transform', 'stirling-numbers', 'bell-numbers', 'derangements', 'inclusion-exclusion', 'latin-square', 'benfords-law', 'buffon-needle', 'galton-board', 'gamblers-ruin', 'coupon-collector', 'decision-tree', 'knn', 'naive-bayes', 'logistic-regression', 'backpropagation', 'softmax', 'genetic-algorithm', 'particle-swarm', 'henon-map', 'rossler-attractor', 'tent-map', 'projectile-motion', 'damped-oscillation', 'catenary', 'brachistochrone',
      'helicoid-catenoid',
      'pseudosphere',
      'enneper-surface', 'dini-surface',
      'roman-surface', 'cross-cap',
      'boy-surface',
      'hyperbolic-paraboloid',
      'quadric-surfaces',
      'supertoroid', 'superquadric',
      'ruled-surfaces', 'surface-revolution',
      'tube-surface', 'monkey-saddle',
      'seashell-surface', 'whitney-umbrella',
      'spherical-harmonics',
      'gaussian-curvature',
      'trefoil-surface',
      'developable-surface',
      'torus-knot-surface',
      'klein-bottle-figure8',
      'mean-curvature-flow',
      'costa-surface',
      'chua-attractor', 'halvorsen-attractor', 'thomas-attractor',
      'aizawa-attractor', 'sprott-attractor', 'lorenz-atmosphere',
      'space-curve-frenet', 'viviani-curve', 'conical-spiral', 'spherical-spiral',
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

  // 按全局序号(从 0 开始)跳转到对应的 section/line。
  // 进度条的点击和键盘操作共用这一份换算, 避免两套逻辑走偏。
  const jumpToGlobalLine = useCallback((target: number) => {
    if (!script) return
    const clamped = Math.max(0, Math.min(target, totalLines - 1))
    let count = 0
    for (let si = 0; si < script.sections.length; si++) {
      const section = script.sections[si]
      if (clamped < count + section.lines.length) {
        jumpToLine(si, clamped - count)
        return
      }
      count += section.lines.length
    }
  }, [script, totalLines, jumpToLine])

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
            aria-label={`当前配音 ${voice === 'xiaoxiao' ? '晓晓（女声）' : '云希（男声）'}，点击切换`}
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
            aria-label="播放速度"
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
              role="slider"
              tabIndex={0}
              aria-label="讲解进度"
              aria-valuemin={1}
              aria-valuemax={totalLines}
              aria-valuenow={currentLineNumber}
              aria-valuetext={`第 ${currentLineNumber} 句，共 ${totalLines} 句`}
              className="h-1.5 bg-white/20 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const percent = (e.clientX - rect.left) / rect.width
                jumpToGlobalLine(Math.floor(percent * totalLines))
              }}
              onKeyDown={(e) => {
                // 键盘用户没法点进度条, 用方向键/Home/End 逐句或跳到首尾
                const current = currentLineNumber - 1
                if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                  e.preventDefault()
                  jumpToGlobalLine(current - 1)
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                  e.preventDefault()
                  jumpToGlobalLine(current + 1)
                } else if (e.key === 'Home') {
                  e.preventDefault()
                  jumpToGlobalLine(0)
                } else if (e.key === 'End') {
                  e.preventDefault()
                  jumpToGlobalLine(totalLines - 1)
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
          aria-label="上一句"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
          </svg>
        </button>

        {/* 播放/暂停 */}
        <button
          onClick={togglePlay}
          aria-label={playbackState.isPlaying ? '暂停' : '播放'}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center"
        >
          {playbackState.isPlaying ? (
            <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-7 h-7 md:w-8 md:h-8 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* 下一句 */}
        <button
          onClick={nextLine}
          aria-label="下一句"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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
          aria-label={`播放速度 ${playbackRate} 倍，点击切换`}
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
