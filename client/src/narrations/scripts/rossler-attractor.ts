import type { NarrationScript } from '../types'

/**
 * Rössler 吸引子 - 口播稿件
 * 核心概念：极简混沌方程、螺旋盘绕与折叠、单卷奇怪吸引子
 * 目标受众：高中及以上
 */
export const rosslerAttractorNarration: NarrationScript = {
  id: 'rossler-attractor',
  title: 'Rössler吸引子',
  subtitle: '螺旋混沌',
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
    '理解 Rössler 系统三条方程的极简结构',
    '认识螺旋盘绕与折叠如何造出混沌',
    '感受单卷奇怪吸引子的几何形态',
    '了解参数如何驱动从周期到混沌的分岔',
  ],

  prerequisites: ['了解微分方程概念', '了解三维坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '提到混沌，很多人先想到洛伦兹那对蝴蝶翅膀。' },
        { id: 'intro-2', text: '但混沌不一定要那么复杂，可以更简洁。' },
        { id: 'intro-3', text: '1976 年，Rössler 写下一组更朴素的方程，同样孕育出混沌。' },
      ],
    },
    {
      id: 'equation',
      type: 'concept',
      title: 'Rössler 方程',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '它只有三行：x 的变化等于负 y 减 z。' },
        { id: 'def-2', text: 'y 的变化等于 x 加上 a 倍的 y，缓缓把轨迹推着旋转。' },
        { id: 'def-3', text: 'z 的变化里藏着唯一的非线性项，z 乘以 x 减 c，是折叠的开关。' },
      ],
    },
    {
      id: 'fold',
      type: 'concept',
      title: '螺旋与折叠',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fold-1', text: '大部分时间，轨迹在平面上一圈圈螺旋外扩，看起来很温顺。' },
        { id: 'fold-2', text: '一旦 x 越过阈值 c，z 猛然窜高，把轨迹从平面折叠拉起。' },
        { id: 'fold-3', text: '拉伸再折叠，反复揉捏，正是混沌诞生的几何机制。' },
      ],
    },
    {
      id: 'attractor',
      type: 'concept',
      title: '混沌吸引子',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'att-1', text: '所有轨迹都被吸向同一个单卷的奇怪吸引子。' },
        { id: 'att-2', text: '它有界却永不闭合，初值相差一丝，长期走向就截然不同。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调小参数 c，你会看到轨迹收成规整的周期环。' },
        { id: 'int-2', text: '再调大 c，环一次次倍化，最终散成混沌的螺旋盘。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'Rössler 用最少的非线性，演示了混沌的核心配方。' },
        { id: 'sum-2', text: '螺旋负责拉伸，折叠负责搅乱，二者相乘便是混沌。' },
        { id: 'sum-3', text: '极简中藏着无穷，这正是数学的迷人之处，我们下次再见！' },
      ],
    },
  ],
}
