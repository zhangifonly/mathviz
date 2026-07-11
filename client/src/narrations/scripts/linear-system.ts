import type { NarrationScript } from '../types'

/**
 * 二元一次方程组 - 口播稿件
 * 核心概念：两条直线、交点即解、唯一解 / 无解 / 无穷多解
 * 目标受众：初中及以上
 */
export const linearSystemNarration: NarrationScript = {
  id: 'linear-system',
  title: '二元一次方程组',
  subtitle: '两条直线的相遇',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解二元一次方程组的含义',
    '知道每个方程对应一条直线',
    '明白交点就是方程组的解',
    '区分唯一解、无解和无穷多解三种情况',
  ],

  prerequisites: ['了解一元一次方程', '了解平面直角坐标系'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个方程里有两个未知数，只有它一个，我们没法确定唯一的答案。' },
        { id: 'intro-2', text: '但如果同时有两个这样的方程，情况就完全不同了。' },
        { id: 'intro-3', text: '这就是二元一次方程组，今天我们用几何的眼光把它看清楚。' },
      ],
    },
    {
      id: 'line-meaning',
      type: 'concept',
      title: '每个方程是一条直线',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'line-1', text: '像 a 乘 x 加 b 乘 y 等于 c 这样的方程，画在坐标系里就是一条直线。' },
        { id: 'line-2', text: '直线上的每一个点，横坐标和纵坐标都满足这个方程。' },
        { id: 'line-3', text: '所以一个方程，其实代表着无穷多组解。' },
      ],
    },
    {
      id: 'intersection',
      type: 'concept',
      title: '交点就是解',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'inter-1', text: '现在把两个方程的两条直线画在同一张图上。' },
        { id: 'inter-2', text: '它们的交点，同时落在两条直线上，所以同时满足两个方程。' },
        { id: 'inter-3', text: '这个交点的坐标，就是方程组唯一的解。' },
      ],
    },
    {
      id: 'three-cases',
      type: 'concept',
      title: '三种情况',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'case-1', text: '两条直线相交于一点，方程组有唯一解。' },
        { id: 'case-2', text: '如果两条直线平行，永远碰不到一起，方程组就无解。' },
        { id: 'case-3', text: '要是两条直线完全重合，那它们有无穷多个公共点，解也就无穷多。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的方程组，看看两条直线的位置怎样变化。' },
        { id: 'int-2', text: '注意观察，交点的坐标恰好就是我们算出来的那组解。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '二元一次方程组的每个方程是一条直线，交点就是解。' },
        { id: 'sum-2', text: '相交有唯一解，平行没有解，重合有无穷多解。' },
        { id: 'sum-3', text: '把代数问题变成几何图形，一切就清晰了，我们下次再见！' },
      ],
    },
  ],
}
