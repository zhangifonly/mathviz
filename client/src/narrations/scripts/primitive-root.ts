import type { NarrationScript } from '../types'

/**
 * 原根 - 口播稿件
 * 核心概念：乘法循环群的生成元、幂的循环、离散对数
 * 目标受众：高中及以上
 */
export const primitiveRootNarration: NarrationScript = {
  id: 'primitive-root',
  title: '原根',
  subtitle: '模 p 的生成元',
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
    '理解模 p 非零余数在乘法下构成循环群',
    '掌握原根作为生成元的定义',
    '认识幂序列的循环结构',
    '了解离散对数与原根的关系',
  ],

  prerequisites: ['了解取模运算', '了解素数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '取一个素数 p，把 1 到 p 减 1 这些余数排成一圈。' },
        { id: 'intro-2', text: '选一个底数 g，不断乘以 g 再取模，会在圈上不停跳跃。' },
        { id: 'intro-3', text: '有的 g 能跳遍每一个余数，有的却只在几个点里打转。' },
      ],
    },
    {
      id: 'cycle',
      type: 'concept',
      title: '幂的循环',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cyc-1', text: 'g 的幂 g 的 0 次、1 次、2 次方模 p，一定会周期性重复。' },
        { id: 'cyc-2', text: '由费马小定理，g 的 p 减 1 次方模 p 总是等于 1，回到起点。' },
        { id: 'cyc-3', text: '这条轨迹的长度，就是 g 在乘法群里的阶。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '原根的定义',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '如果 g 的幂恰好遍历全部 p 减 1 个非零余数，就称 g 是模 p 的原根。' },
        { id: 'def-2', text: '原根是这个乘法循环群的生成元，一个 g 就能生成整个群。' },
        { id: 'def-3', text: '非原根只能覆盖一个更小的子群，在圈上留下大片空白。' },
      ],
    },
    {
      id: 'dlog',
      type: 'concept',
      title: '离散对数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'dlog-1', text: '既然原根能生成一切，任何余数都能写成 g 的某个幂。' },
        { id: 'dlog-2', text: '这个幂指数就叫离散对数，它难以反算，正是许多密码学的基石。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一个素数 p，再挑不同的底数 g，观察轨迹是布满还是缩进子群。' },
        { id: 'int-2', text: '蓝色轨迹遍历全圈就是原根，红色只圈住一小群就不是。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '原根是模 p 乘法循环群的生成元，幂能遍历所有非零余数。' },
        { id: 'sum-2', text: '它连接着费马小定理、离散对数与现代密码学。' },
        { id: 'sum-3', text: '小小的一圈余数，藏着深邃的数论之美，我们下次再见！' },
      ],
    },
  ],
}
