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
  state: BasicArithmeticState
  onStateChange: (updates: Partial<BasicArithmeticState>) => void
  isInteractive: boolean
}

export interface BasicArithmeticState {
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division'
  num1: number
  num2: number
  step: number
  showResult: boolean
}

export default function BasicArithmeticSceneRenderer({
  scene,
  state,
  onStateChange,
  isInteractive,
}: Props) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 根据 sectionId 和 sceneConfig.type 决定渲染什么
  const content = useMemo(() => {
    // 标题场景
    if (sceneConfig.type === 'title') {
      return <TitleScene sectionId={sectionId} sceneId={sceneConfig.id} />
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
        sectionId={sectionId}
        operation={actualOperation}
        num1={actualNum1}
        num2={actualNum2}
        lineState={scene.lineState}
        isInteractive={isInteractive}
      />
    )
  }, [scene, state, isInteractive, onStateChange, sectionId, sceneConfig])

  return (
    <div className="w-full h-full">
      {content}
    </div>
  )
}
