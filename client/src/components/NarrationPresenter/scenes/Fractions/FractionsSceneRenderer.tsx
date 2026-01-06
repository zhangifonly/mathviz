/**
 * 分数讲解场景渲染器
 */

import type { NarrationLineScene } from '../../types'
import TitleScene from './TitleScene'
import PieScene from './PieScene'
import CompareScene from './CompareScene'
import OperationScene from './OperationScene'

interface Props {
  scene: NarrationLineScene | null
  state: FractionsState
  onStateChange: (updates: Partial<FractionsState>) => void
  isInteractive: boolean
}

export interface FractionsState {
  numerator1: number
  denominator1: number
  numerator2: number
  denominator2: number
  visualization: 'pie' | 'bar' | 'grid'
  operation: 'show' | 'compare' | 'add' | 'multiply' | 'simplify'
}

export default function FractionsSceneRenderer({
  scene,
  state,
}: Props) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

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
