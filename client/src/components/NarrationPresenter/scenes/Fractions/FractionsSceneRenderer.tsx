/**
 * 分数讲解场景渲染器
 */

import type { NarrationLineScene } from '../../types'
import type { SceneRendererProps } from '../SceneRendererFactory'
import TitleScene from './TitleScene'
import PieScene from './PieScene'
import CompareScene from './CompareScene'
import OperationScene from './OperationScene'

export interface FractionsState {
  numerator1: number
  denominator1: number
  numerator2: number
  denominator2: number
  visualization: 'pie' | 'bar' | 'grid'
  operation: 'show' | 'compare' | 'add' | 'multiply' | 'simplify'
}

const DEFAULT_STATE: FractionsState = {
  numerator1: 1,
  denominator1: 4,
  numerator2: 2,
  denominator2: 3,
  visualization: 'pie',
  operation: 'show',
}

/** 从场景配置的 lineState.params 派生分数状态。
 *
 * fractions 走 SceneRendererWrapper, 而 wrapper 只传 scene/isInteractive,
 * 不传 state —— 之前这里把 state 声明成必需 prop, 运行时是 undefined,
 * 一进 concept 段落就抛 "Cannot read properties of undefined (reading 'numerator1')"。
 */
function deriveState(scene: NarrationLineScene): FractionsState {
  const p = (scene.lineState?.params ?? {}) as Record<string, unknown>
  const num = (key: string, fallback: number) =>
    typeof p[key] === 'number' ? (p[key] as number) : fallback
  const viz = p.visualization
  return {
    numerator1: num('num1', DEFAULT_STATE.numerator1),
    denominator1: num('den1', DEFAULT_STATE.denominator1),
    numerator2: num('num2', DEFAULT_STATE.numerator2),
    denominator2: num('den2', DEFAULT_STATE.denominator2),
    visualization:
      viz === 'pie' || viz === 'bar' || viz === 'grid' ? viz : DEFAULT_STATE.visualization,
    operation: DEFAULT_STATE.operation,
  }
}

export default function FractionsSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene
  const state = deriveState(scene)

  // 标题场景
  if (sceneConfig.type === 'title') {
    return <TitleScene sectionId={sectionId} />
  }

  // 根据段落选择场景
  switch (sectionId) {
    case 'intro':
    case 'concept':
    case 'visualization':
      return (
        <PieScene
          numerator={state.numerator1}
          denominator={state.denominator1}
          visualization={state.visualization}
          sectionId={sectionId}
        />
      )

    case 'compare':
      return (
        <CompareScene
          n1={state.numerator1}
          d1={state.denominator1}
          n2={state.numerator2}
          d2={state.denominator2}
        />
      )

    case 'addition':
    case 'multiplication':
    case 'simplify':
      return (
        <OperationScene
          n1={state.numerator1}
          d1={state.denominator1}
          n2={state.numerator2}
          d2={state.denominator2}
          operation={sectionId === 'addition' ? 'add' : sectionId === 'multiplication' ? 'multiply' : 'simplify'}
        />
      )

    default:
      return (
        <PieScene
          numerator={state.numerator1}
          denominator={state.denominator1}
          visualization={state.visualization}
          sectionId={sectionId}
        />
      )
  }
}
