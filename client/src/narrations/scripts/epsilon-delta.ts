import type { NarrationScript } from '../types'

/**
 * ε-δ 极限定义 - 口播稿件
 * 核心概念：极限的严格刻画、ε 挑战与 δ 回应、任意 ε 都有 δ
 * 目标受众：高中及以上
 */
export const epsilonDeltaNarration: NarrationScript = {
  id: 'epsilon-delta',
  title: 'ε-δ极限定义',
  subtitle: '极限的严格刻画',
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
    '理解极限的 ε-δ 严格定义',
    '看懂 ε 挑战与 δ 回应的博弈',
    '认识到任意 ε 都能找到 δ 是关键',
    '感受 ε 收缩时 δ 随之收缩',
  ],

  prerequisites: ['了解函数与函数值', '了解绝对值表示距离'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们常说，当 x 趋近 a 时，f(x) 趋近极限 L。' },
        { id: 'intro-2', text: '可是趋近到底是什么意思？多近才算近？' },
        { id: 'intro-3', text: '数学家用一对希腊字母 ε 和 δ，把这句直觉说得一清二楚。' },
      ],
    },
    {
      id: 'challenge',
      type: 'concept',
      title: 'ε 的挑战',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'chal-1', text: '先由一个挑战者出场，他给出一个很小的正数 ε。' },
        { id: 'chal-2', text: 'ε 划出一条水平带，要求 f(x) 必须落在 L 上下不超过 ε 的范围内。' },
        { id: 'chal-3', text: 'ε 越小，这条水平带越窄，要求就越苛刻。' },
      ],
    },
    {
      id: 'response',
      type: 'concept',
      title: 'δ 的回应',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'resp-1', text: '我们的回应是找出一个 δ，划出一条竖直带，宽度是 a 左右各 δ。' },
        { id: 'resp-2', text: '只要 x 落在这条竖直带内，f(x) 就一定落在那条水平带内。' },
        { id: 'resp-3', text: '图中绿色虚框，正是竖直带与水平带交出的安全区。' },
      ],
    },
    {
      id: 'forall',
      type: 'concept',
      title: '任意 ε 都有 δ',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'all-1', text: '关键在于，无论挑战者把 ε 压得多小，我们都能拿出对应的 δ。' },
        { id: 'all-2', text: '这个对任意 ε 都成立的承诺，才是极限等于 L 的真正含义。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '把 ε 一档一档调小，观察粉色竖带如何跟着收缩。' },
        { id: 'int-2', text: '换一个更弯的函数，看看 δ 的回应又会怎样变化。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '极限的严格定义，就是对任意 ε 都存在 δ 的一场博弈。' },
        { id: 'sum-2', text: 'ε 管纵向的接近，δ 管横向的接近，一一对应。' },
        { id: 'sum-3', text: '把趋近说得滴水不漏，这就是分析的严谨之美，我们下次再见！' },
      ],
    },
  ],
}
