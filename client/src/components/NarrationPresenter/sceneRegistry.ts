/**
 * 场景配置按需加载
 *
 * 300 个实验各有一份场景配置(约 1.1MB)。NarrationPresenter 被全部实验页引用,
 * 静态 import 会让 Vite 把它们全部提到共享 chunk, 每个实验页都要下载。
 * 这里改为 import.meta.glob + 动态 import, 只加载当前稿件用到的那一份。
 */

import type { SceneState, NarrationLineScene } from './types'
import { SCENE_FILES } from './sceneFiles'

export interface SceneConfigBundle {
  scenes: NarrationLineScene[]
  defaultState: SceneState
}

// 各场景文件的导出名不统一(fourierScenes / defaultFourierState 等),
// 因此按后缀约定从模块对象里挑: xxxScenes 取场景数组, defaultXxxState 取默认状态。
type SceneModule = Record<string, unknown>

const loaders = import.meta.glob<SceneModule>('./*Scenes.ts')

// 兜底默认状态: 场景配置尚未加载完成时使用, 避免首帧读 undefined
export const FALLBACK_SCENE_STATE: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 5,
  isAnimating: false,
  highlightedElements: [],
}

const cache = new Map<string, SceneConfigBundle>()

function pickExports(mod: SceneModule): SceneConfigBundle | null {
  let scenes: NarrationLineScene[] | null = null
  let defaultState: SceneState | null = null

  for (const [key, value] of Object.entries(mod)) {
    if (key.endsWith('Scenes') && Array.isArray(value)) {
      scenes = value as NarrationLineScene[]
    } else if (key.startsWith('default') && key.endsWith('State') && value) {
      defaultState = value as SceneState
    }
  }

  if (!scenes) return null
  return { scenes, defaultState: defaultState || FALLBACK_SCENE_STATE }
}

/**
 * 加载指定稿件的场景配置; 未登记或加载失败时回退到 fourier(与旧行为一致)。
 */
export async function loadSceneConfig(scriptId: string): Promise<SceneConfigBundle> {
  const cached = cache.get(scriptId)
  if (cached) return cached

  const fileName = SCENE_FILES[scriptId] || SCENE_FILES['fourier']
  const loader = loaders[`./${fileName}.ts`]

  if (!loader) {
    console.warn('未找到场景配置文件:', scriptId, fileName)
    return { scenes: [], defaultState: FALLBACK_SCENE_STATE }
  }

  try {
    const bundle = pickExports(await loader())
    if (!bundle) {
      console.warn('场景配置缺少 Scenes 导出:', fileName)
      return { scenes: [], defaultState: FALLBACK_SCENE_STATE }
    }
    cache.set(scriptId, bundle)
    return bundle
  } catch (err) {
    console.error('加载场景配置失败:', scriptId, err)
    return { scenes: [], defaultState: FALLBACK_SCENE_STATE }
  }
}
