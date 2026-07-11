import type { NarrationScript } from '../types'

/**
 * 拉格朗日乘数法 - 口播稿件
 * 核心概念：约束极值、梯度平行、乘数 λ
 * 目标受众：大学以上
 */
export const lagrangeMultiplierNarration: NarrationScript = {
  id: 'lagrange-multiplier',
  title: '拉格朗日乘数',
  subtitle: '在约束下寻找极值的优雅方法',
  difficulty: 'advanced',
  targetAge: '大学以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解带约束的极值问题',
    '掌握极值点处两个梯度平行的几何直觉',
    '理解乘数 λ 的含义与作用',
    '会用拉格朗日条件求解典型问题',
  ],

  prerequisites: ['了解偏导数与梯度', '了解等高线'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '很多现实问题不是自由地求最大值，而是要在一个限制条件下求最优。' },
        { id: 'intro-2', text: '比如预算固定时利润最大，或者只能沿着一条曲线走时高度最高。' },
        { id: 'intro-3', text: '拉格朗日乘数法，就是解决这类带约束极值问题的一把钥匙。' },
      ],
    },
    {
      id: 'setup',
      type: 'concept',
      title: '约束与等高线',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'setup-1', text: '我们要最大化目标函数 f，同时被限制在约束曲线 g 等于零上移动。' },
        { id: 'setup-2', text: '把目标 f 画成一族等高线，每条线上 f 的取值都相同。' },
        { id: 'setup-3', text: '现在的任务，就是沿着约束曲线走，找到能碰到的最高那条等高线。' },
      ],
    },
    {
      id: 'parallel',
      type: 'concept',
      title: '梯度平行',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'parallel-1', text: '沿约束移动时，只要还能穿过等高线，f 的值就还能继续变大。' },
        { id: 'parallel-2', text: '直到约束曲线恰好和某条等高线相切，这时才到达极值。' },
        { id: 'parallel-3', text: '相切意味着，目标的梯度和约束的梯度指向同一条直线，也就是互相平行。' },
      ],
    },
    {
      id: 'lambda',
      type: 'formula',
      title: '乘数登场',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'lambda-1', text: '两个梯度平行，就可以写成 f 的梯度等于 λ 乘以 g 的梯度。' },
        { id: 'lambda-2', text: '这个 λ 就是拉格朗日乘数，它把方向相同的两个向量按比例连接起来。' },
        { id: 'lambda-3', text: '把这个方程和约束条件联立，就能一次解出极值点和 λ 的值。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一个目标函数，看看切点如何随梯度方向移动到新的位置。' },
        { id: 'int-2', text: '注意粉色和绿色两个梯度箭头，它们在切点处始终保持平行。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '带约束的极值，出现在约束曲线与等高线相切之处。' },
        { id: 'sum-2', text: '相切的代数表达，就是 f 的梯度等于 λ 乘以 g 的梯度。' },
        { id: 'sum-3', text: '一个简单的乘数，串起了几何直觉与代数求解，我们下次再见！' },
      ],
    },
  ],
}
