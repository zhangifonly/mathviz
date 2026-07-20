/**
 * 隐马尔可夫模型核心算法（纯函数，便于测试）
 * 隐状态按马尔可夫链转移（天气 晴/雨），每个隐状态按发射概率吐出观测符号
 * （活动 散步/购物/打扫）。观测可见，隐状态不可见，维特比用动态规划反推路径。
 */

export interface HMMModel {
  name: string
  states: string[] // 隐状态名，如 ['晴', '雨']
  symbols: string[] // 观测符号名
  initial: number[] // 初始分布 π；transition[i][j]=P(j|i)；emission[i][k]=P(观测k|状态i)
  transition: number[][]
  emission: number[][]
}

export interface Sequence {
  hidden: number[] // 真实隐状态索引序列
  observed: number[] // 观测符号索引序列
}

/** 线性同余伪随机，保证可复现 */
function makeRand(seed: number): () => number {
  let s = seed & 0x7fffffff
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

/** 按离散分布 probs 采样一个索引 */
export function sampleIndex(probs: number[], r: number): number {
  let acc = 0
  for (let i = 0; i < probs.length; i++) {
    acc += probs[i]
    if (r < acc) return i
  }
  return probs.length - 1
}

/** 生成长度为 length 的隐状态链与观测序列 */
export function generateSequence(model: HMMModel, length: number, seed = 1): Sequence {
  const rand = makeRand(seed)
  const hidden: number[] = []
  const observed: number[] = []
  let state = sampleIndex(model.initial, rand())
  for (let t = 0; t < length; t++) {
    hidden.push(state)
    observed.push(sampleIndex(model.emission[state], rand()))
    state = sampleIndex(model.transition[state], rand())
  }
  return { hidden, observed }
}

/** 维特比：给定观测返回最可能隐状态路径。对数概率防下溢，delta 存最优值 psi 存回溯指针 */
export function viterbi(observed: number[], model: HMMModel): number[] {
  const N = model.states.length
  const T = observed.length
  if (T === 0) return []
  const ln = (x: number) => (x > 0 ? Math.log(x) : -Infinity)
  const delta: number[][] = Array.from({ length: T }, () => new Array(N).fill(-Infinity))
  const psi: number[][] = Array.from({ length: T }, () => new Array(N).fill(0))

  for (let i = 0; i < N; i++) {
    delta[0][i] = ln(model.initial[i]) + ln(model.emission[i][observed[0]])
  }
  for (let t = 1; t < T; t++) {
    for (let j = 0; j < N; j++) {
      let best = -Infinity
      let arg = 0
      for (let i = 0; i < N; i++) {
        const p = delta[t - 1][i] + ln(model.transition[i][j])
        if (p > best) {
          best = p
          arg = i
        }
      }
      delta[t][j] = best + ln(model.emission[j][observed[t]])
      psi[t][j] = arg
    }
  }

  let last = 0
  for (let i = 1; i < N; i++) if (delta[T - 1][i] > delta[T - 1][last]) last = i
  const path = new Array(T).fill(0)
  path[T - 1] = last
  for (let t = T - 2; t >= 0; t--) path[t] = psi[t + 1][path[t + 1]]
  return path
}

const WEATHER: HMMModel = {
  name: '天气与活动',
  states: ['晴', '雨'],
  symbols: ['散步', '购物', '打扫'],
  initial: [0.6, 0.4],
  transition: [[0.7, 0.3], [0.4, 0.6]],
  emission: [[0.6, 0.3, 0.1], [0.1, 0.4, 0.5]],
}

export const MODELS: HMMModel[] = [WEATHER]
export const SEQ_LENGTHS = [12, 20, 30]
