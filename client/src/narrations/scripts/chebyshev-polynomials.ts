import type { NarrationScript } from '../types'

/**
 * 切比雪夫多项式 - 口播稿件
 * 核心概念：极小化最大误差、递推生成、等幅振荡、切比雪夫节点
 * 目标受众：高中及以上
 */
export const chebyshevPolynomialsNarration: NarrationScript = {
  id: 'chebyshev-polynomials',
  title: '切比雪夫多项式',
  subtitle: '极小化最大误差',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解切比雪夫多项式的递推定义',
    '认识它在区间内的等幅振荡性质',
    '了解切比雪夫节点如何抑制龙格现象',
    '感受最优逼近背后的数学之美',
  ],

  prerequisites: ['了解多项式', '了解三角函数余弦'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们常想用简单的多项式去逼近复杂的曲线。' },
        { id: 'intro-2', text: '可问题是，怎样让逼近的最大误差尽可能地小？' },
        { id: 'intro-3', text: '答案藏在一族特别的多项式里，它叫切比雪夫多项式。' },
      ],
    },
    {
      id: 'recurrence',
      type: 'concept',
      title: '递推生成',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '它从最简单的两项出发：T0 恒等于一，T1 就是 x 本身。' },
        { id: 'def-2', text: '之后每一项都由前两项生成：T(n+1) 等于 2x 乘 Tn，再减去 T(n-1)。' },
        { id: 'def-3', text: '只用一个乘法和一个减法，就能层层递推出任意高阶。' },
      ],
    },
    {
      id: 'oscillation',
      type: 'concept',
      title: '等幅振荡',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'osc-1', text: '在负一到一之间，每条曲线都在正一和负一之间反复摆动。' },
        { id: 'osc-2', text: '波峰和波谷始终顶到正负一，幅度分毫不差，这就是等波动性质。' },
        { id: 'osc-3', text: '正是这种均匀的振荡，让它的最大偏离被压到理论上的最小。' },
      ],
    },
    {
      id: 'nodes',
      type: 'concept',
      title: '切比雪夫节点',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'node-1', text: '曲线穿过横轴的那些点，就是切比雪夫节点。' },
        { id: 'node-2', text: '它们的坐标是 cos((2k+1)π 除以 2n)，两端密、中间疏。' },
        { id: 'node-3', text: '拿它们做插值节点，能有效抑制高阶插值边缘剧烈抖动的龙格现象。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调节阶数，看曲线的振荡越来越密、根节点越来越多。' },
        { id: 'int-2', text: '留意黑点始终落在横轴上，且总是往两端聚拢。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '切比雪夫多项式由简洁的递推生成，在区间内等幅振荡。' },
        { id: 'sum-2', text: '它的节点两端加密，是抑制龙格现象、实现最优逼近的利器。' },
        { id: 'sum-3', text: '一个递推公式，托起了极小化最大误差的智慧，我们下次再见！' },
      ],
    },
  ],
}
