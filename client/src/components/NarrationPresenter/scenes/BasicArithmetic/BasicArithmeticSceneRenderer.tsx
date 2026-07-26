/**
 * 加减乘除讲解场景渲染器
 * 根据场景配置渲染对应的动画内容
 */

import { useMemo } from 'react'
import type { NarrationLineScene } from '../../types'
import TitleScene from './TitleScene'
import BlocksScene from './BlocksScene'
import FormulaScene from './FormulaScene'
import ApplicationScene from './ApplicationScene'

interface Props {
  scene: NarrationLineScene | null
  /** 可选: NarrationPresenter 的特殊分支会显式传入。
   * 走 SceneRendererFactory 的 wrapper 时只有 scene/isInteractive,
   * 此时回退到从 scene.lineState.params 派生(否则读 state.num1 会崩)。 */
  state?: BasicArithmeticState
  onStateChange?: (updates: Partial<BasicArithmeticState>) => void
  isInteractive: boolean
}

export interface BasicArithmeticState {
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division'
  num1: number
  num2: number
  step: number
  showResult: boolean
}

const OPERATIONS = ['addition', 'subtraction', 'multiplication', 'division'] as const

function deriveState(scene: NarrationLineScene | null): BasicArithmeticState {
  const p = (scene?.lineState?.params ?? {}) as Record<string, unknown>
  const op = OPERATIONS.find((o) => o === p.operation) ?? 'addition'
  return {
    operation: op,
    num1: typeof p.num1 === 'number' ? p.num1 : 7,
    num2: typeof p.num2 === 'number' ? p.num2 : 5,
    step: 0,
    showResult: false,
  }
}

export default function BasicArithmeticSceneRenderer({
  scene,
  state: stateProp,
  isInteractive,
}: Props) {
  const state = stateProp ?? deriveState(scene)
  const { sectionId, scene: sceneConfig } = scene || {}

  // 根据 sectionId 和 sceneConfig.type 决定渲染什么
  const content = useMemo(() => {
    if (!scene || !sceneConfig) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-white/50 text-lg">加载中...</div>
        </div>
      )
    }

    // 标题场景
    if (sceneConfig.type === 'title') {
      return <TitleScene sectionId={sectionId || ''} sceneId={sceneConfig.id} />
    }

    // 应用场景
    if (sceneConfig.type === 'application') {
      return <ApplicationScene sceneId={sceneConfig.id} />
    }

    // 公式场景
    if (sceneConfig.type === 'formula') {
      return (
        <FormulaScene
          operation={state.operation}
          num1={state.num1}
          num2={state.num2}
        />
      )
    }

    // 动画/交互场景 - 方块演示
    // 优先使用 lineState.params 中的参数
    const lineParams = scene.lineState?.params
    const actualOperation = (lineParams?.operation as BasicArithmeticState['operation']) ?? state.operation
    const actualNum1 = (lineParams?.num1 as number) ?? state.num1
    const actualNum2 = (lineParams?.num2 as number) ?? state.num2

    return (
      <BlocksScene
        sceneId={sceneConfig.id}
        sectionId={sectionId || ''}
        operation={actualOperation}
        num1={actualNum1}
        num2={actualNum2}
        lineState={scene.lineState}
        isInteractive={isInteractive}
      />
    )
  }, [scene, state, isInteractive, sectionId, sceneConfig])

  return (
    <div className="w-full h-full">
      {content}
    </div>
  )
}
