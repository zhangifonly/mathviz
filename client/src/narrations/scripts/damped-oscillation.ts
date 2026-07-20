import type { NarrationScript } from '../types'

/**
 * 阻尼振荡 - 口播稿件
 * 核心概念：阻尼弹簧振子、阻尼比、欠阻尼/临界/过阻尼三种情形
 * 目标受众：高中及以上
 */
export const dampedOscillationNarration: NarrationScript = {
  id: 'damped-oscillation',
  title: '阻尼振荡',
  subtitle: '欠阻尼 · 临界 · 过阻尼',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解阻尼弹簧振子的运动方程',
    '认识阻尼比 ζ 如何决定运动形态',
    '区分欠阻尼、临界阻尼与过阻尼三种情形',
    '感受同一方程在不同参数下的行为差异',
  ],

  prerequisites: ['了解简谐振动', '了解指数衰减'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '弹簧的振动',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '把一个物块挂在弹簧上，拉开再松手，它会来回振动。' },
        { id: 'intro-2', text: '但现实里没有永动，空气和摩擦会不断偷走能量。' },
        { id: 'intro-3', text: '这种带阻力的振动，就叫阻尼振荡。' },
      ],
    },
    {
      id: 'zeta',
      type: 'concept',
      title: '阻尼比',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '运动方程写成 m x撇撇 加 c x撇 加 k x 等于 0。' },
        { id: 'def-2', text: '我们定义阻尼比 ζ 等于 c 除以二倍根号 m k。' },
        { id: 'def-3', text: '一个 ζ 的取值，就决定了整个振动的命运。' },
      ],
    },
    {
      id: 'under',
      type: 'concept',
      title: '欠阻尼',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'und-1', text: '当 ζ 小于 1，阻力较弱，物块仍会来回穿越平衡点。' },
        { id: 'und-2', text: '但每一次摆幅都比上一次小，包络线是一条指数衰减曲线。' },
        { id: 'und-3', text: '这就是欠阻尼：振荡着，却慢慢平息下来。' },
      ],
    },
    {
      id: 'critover',
      type: 'concept',
      title: '临界与过阻尼',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'co-1', text: '当 ζ 恰好等于 1，是临界阻尼：不再振荡，且以最快速度回到平衡。' },
        { id: 'co-2', text: '当 ζ 大于 1，是过阻尼：同样不振荡，却因阻力过大而回得更慢。' },
        { id: 'co-3', text: '汽车悬挂追求临界附近，既不颠簸，又能迅速稳住。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '调阻尼比',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着切换不同的阻尼比，观察曲线形态的转变。' },
        { id: 'int-2', text: '看欠阻尼的波浪，如何在临界处被彻底抹平。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '同一个方程，靠阻尼比 ζ 分出三种截然不同的命运。' },
        { id: 'sum-2', text: '欠阻尼振荡衰减，临界最快回位，过阻尼缓慢归零。' },
        { id: 'sum-3', text: '一个参数掌控全局，这正是微分方程的魅力，我们下次再见！' },
      ],
    },
  ],
}
