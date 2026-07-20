import type { NarrationScript } from '../types'

/**
 * 割线法 - 口播稿件
 * 核心概念：免导数求根、割线代替切线、两点交 x 轴、超线性收敛
 * 目标受众：高中及以上
 */
export const secantMethodNarration: NarrationScript = {
  id: 'secant-method',
  title: '割线法',
  subtitle: '无需导数的求根',
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
    '理解割线法作为牛顿法免导数版本的思路',
    '掌握用割线交 x 轴迭代求根的过程',
    '认识超线性收敛（阶约 1.618）的高效',
    '学会单步观察估计值如何逼近真根',
  ],

  prerequisites: ['了解函数图像', '了解方程求根的含义'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '牛顿法求根很快，但它有个前提：你得会算函数的导数。' },
        { id: 'intro-2', text: '可现实中，很多函数的导数又复杂又难求，甚至根本写不出来。' },
        { id: 'intro-3', text: '割线法就是牛顿法的免导数版本，只用函数值就能逼近根。' },
      ],
    },
    {
      id: 'secant',
      type: 'concept',
      title: '割线代替切线',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sec-1', text: '牛顿法在一点画切线，而切线的斜率正是导数。' },
        { id: 'sec-2', text: '割线法换个思路：取最近的两个点，用它们的连线来近似切线。' },
        { id: 'sec-3', text: '两点越靠近，这条割线就越接近真正的切线。' },
      ],
    },
    {
      id: 'cross',
      type: 'concept',
      title: '交点作新估计',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cross-1', text: '让这条割线延长，与横轴相交，交点就是新的根估计。' },
        { id: 'cross-2', text: '再拿最新的两个点重复：连线、延长、取交点。' },
        { id: 'cross-3', text: '估计值就这样一步步地滑向曲线与横轴的交点，也就是方程的根。' },
      ],
    },
    {
      id: 'converge',
      type: 'concept',
      title: '超线性收敛',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conv-1', text: '割线法的收敛阶约为一点六一八，正是黄金比例。' },
        { id: 'conv-2', text: '它比二分法快得多，虽略逊于牛顿法，却省下了求导的代价。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击单步，看每一步的割线如何与横轴相交。' },
        { id: 'int-2', text: '留意下方的误差，短短几步它就迅速缩小到极小。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '割线法用两点割线代替切线，无需导数即可求根。' },
        { id: 'sum-2', text: '割线交横轴得新估计，反复迭代，超线性地逼近真根。' },
        { id: 'sum-3', text: '简单一条割线，也能高效逼近方程的答案，我们下次再见！' },
      ],
    },
  ],
}
