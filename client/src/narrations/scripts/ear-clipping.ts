import type { NarrationScript } from '../types'

/**
 * 耳切三角剖分 - 口播稿件
 * 核心概念：简单多边形三角化、耳朵定义、反复切耳、n-2 个三角形
 * 目标受众：高中及以上
 */
export const earClippingNarration: NarrationScript = {
  id: 'ear-clipping',
  title: '耳切三角剖分',
  subtitle: '把简单多边形切成三角形',
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
    '理解简单多边形三角化的意义',
    '掌握"耳朵"的几何定义',
    '理解反复切耳得到 n-2 个三角形',
    '感受贪心算法的直观美感',
  ],

  prerequisites: ['了解多边形与凹凸顶点', '了解三角形'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '计算机眼里，最好处理的图形是三角形。' },
        { id: 'intro-2', text: '可现实中的图形往往是复杂的多边形，甚至带着凹进去的角。' },
        { id: 'intro-3', text: '于是我们想：能不能把任意简单多边形，切成若干个三角形？' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '什么是耳朵',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '关键是找到多边形上的"耳朵"。' },
        { id: 'def-2', text: '一只耳朵，是一个凸出去的顶点，它和相邻两点连成的三角形，内部不含任何其他顶点。' },
        { id: 'def-3', text: '这样的三角形可以放心切下，不会切到多边形外面去。' },
      ],
    },
    {
      id: 'clip',
      type: 'concept',
      title: '反复切耳',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'clip-1', text: '切下一只耳朵，多边形就少了一个顶点，剩下的仍是简单多边形。' },
        { id: 'clip-2', text: '在剩下的图形上继续找耳朵、继续切，像削苹果皮一样一步步进行。' },
        { id: 'clip-3', text: '直到最后只剩一个三角形，整个多边形就被完全剖分了。' },
      ],
    },
    {
      id: 'count',
      type: 'concept',
      title: '三角形的数量',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cnt-1', text: '数学上可以证明，任何简单多边形都至少有两只耳朵。' },
        { id: 'cnt-2', text: '一个 n 条边的多边形，最终恰好被切成 n 减 2 个三角形。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手切耳',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击单步按钮，每按一次就切下一只耳朵，看三角形逐个出现。' },
        { id: 'int-2', text: '换成五角星试试，凹角会让某些顶点暂时当不了耳朵。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '耳切法用一个简单的贪心规则，把复杂多边形化整为零。' },
        { id: 'sum-2', text: '它是计算机图形学里三角化的经典算法，简单又可靠。' },
        { id: 'sum-3', text: '从一只耳朵到满屏三角，这就是几何的巧思，我们下次再见！' },
      ],
    },
  ],
}
