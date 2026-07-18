import type { NarrationScript } from '../types'

/**
 * 霍普夫纤维化 - 口播稿件
 * 核心概念：S3 到 S2 的映射、每点对应一个圆、纤维互相环绕、纤维丛
 * 目标受众：大学及以上
 */
export const hopfFibrationNarration: NarrationScript = {
  id: 'hopf-fibration',
  title: '霍普夫纤维化',
  subtitle: 'S3 到 S2 的圆纤维',
  difficulty: 'expert',
  targetAge: '大学以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解霍普夫映射把三维球面映到二维球面',
    '认识 S2 上每个点的原像是 S3 中的一个圆',
    '感受纤维互相环绕、永不相交的拓扑结构',
    '初识纤维丛这一现代几何的核心概念',
  ],

  prerequisites: ['了解复数', '了解高维空间与投影'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有些美，藏在我们看不见的高维空间里。' },
        { id: 'intro-2', text: '霍普夫纤维化，就是一场四维空间中的优雅纠缠。' },
        { id: 'intro-3', text: '它把一个三维球面，精巧地缠绕成一个二维球面。' },
      ],
    },
    {
      id: 'spheres',
      type: 'concept',
      title: 'S3 与 S2',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: 'S3 是四维空间里的球面，S2 是我们熟悉的普通球面。' },
        { id: 'def-2', text: '霍普夫映射把 S3 上每个点，送到 S2 上的一个点。' },
        { id: 'def-3', text: '把复数对当作坐标，这个映射就有了简洁的代数形式。' },
      ],
    },
    {
      id: 'fiber',
      type: 'concept',
      title: '每点对应一个圆',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fib-1', text: '关键在于：S2 上任意一个点，它的原像不是一个点。' },
        { id: 'fib-2', text: '而是 S3 中一整个圆，我们把它叫做纤维。' },
        { id: 'fib-3', text: '经过球极投影，这个圆就落进我们眼前的三维空间。' },
      ],
    },
    {
      id: 'link',
      type: 'concept',
      title: '纤维互相环绕',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'link-1', text: '最奇妙的是，任意两条纤维都互相环扣，却从不相交。' },
        { id: 'link-2', text: '它们像链条一样彼此穿过，这些圆叫维拉索圆。' },
        { id: 'link-3', text: '整个 S3，就由这些环环相扣的圆严丝合缝地铺满。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '增加纤维数量，看更多圆如何彼此环绕。' },
        { id: 'int-2', text: '让画面旋转起来，从各个角度感受它们的环扣。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '霍普夫纤维化把 S3 映到 S2，每点对应一个圆纤维。' },
        { id: 'sum-2', text: '纤维互相环绕不交，是纤维丛最经典的非平凡例子。' },
        { id: 'sum-3', text: '高维之美，在投影中向我们显现，我们下次再见！' },
      ],
    },
  ],
}
