import type { NarrationScript } from '../types'

/**
 * 抛体运动 - 口播稿件
 * 核心概念：水平竖直分解、抛物线轨迹、45度射程最远
 * 目标受众：初中及以上
 */
export const projectileMotionNarration: NarrationScript = {
  id: 'projectile-motion',
  title: '抛体运动',
  subtitle: '抛物线轨迹',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解抛体运动可分解为水平匀速与竖直匀变速',
    '认识轨迹是一条抛物线',
    '掌握射程公式与45度射程最远的结论',
    '感受初速与发射角对轨迹的影响',
  ],

  prerequisites: ['了解速度概念', '了解重力加速度'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一门大炮向远处开火，炮弹划出一道优美的弧线。' },
        { id: 'intro-2', text: '投篮、喷泉、扔石头，这些抛出去的物体走的都是同一种曲线。' },
        { id: 'intro-3', text: '这种运动叫抛体运动，今天我们就来揭开它的秘密。' },
      ],
    },
    {
      id: 'decompose',
      type: 'concept',
      title: '水平与竖直分解',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '关键一招：把运动拆成水平和竖直两个方向来看。' },
        { id: 'def-2', text: '水平方向没有外力，速度不变，做匀速直线运动。' },
        { id: 'def-3', text: '竖直方向只受重力，先减速上升再加速下落。' },
      ],
    },
    {
      id: 'parabola',
      type: 'concept',
      title: '抛物线',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'par-1', text: '水平匀速配上竖直匀变速，合起来正好画出一条抛物线。' },
        { id: 'par-2', text: '飞得越高，落地用的时间就越久，这就是飞行时间。' },
        { id: 'par-3', text: '轨迹左右对称，上升和下落用时完全相同。' },
      ],
    },
    {
      id: 'range',
      type: 'concept',
      title: '45度射程最远',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rng-1', text: '射程等于 v0 的平方乘以 sin 二倍角，再除以重力加速度。' },
        { id: 'rng-2', text: '当发射角是 45 度时，sin 二倍角取到最大值，射程最远。' },
        { id: 'rng-3', text: '有趣的是，30 度和 60 度这对互补角，射程完全一样。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整初速度，看所有轨迹一起变高变远。' },
        { id: 'int-2', text: '对比三个角度，橙色的 45 度总是落得最远。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '抛体运动能拆成水平匀速与竖直匀变速两部分。' },
        { id: 'sum-2', text: '合成的轨迹是抛物线，45 度发射时射程最远。' },
        { id: 'sum-3', text: '一道弧线里藏着简单的规律，我们下次再见！' },
      ],
    },
  ],
}
