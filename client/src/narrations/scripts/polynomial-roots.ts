import type { NarrationScript } from '../types'

/**
 * 多项式求根 - 口播稿件
 * 核心概念：曲线与x轴交点、代数基本定理、实根复根、数值求根
 * 目标受众：高中及以上
 */
export const polynomialRootsNarration: NarrationScript = {
  id: 'polynomial-roots',
  title: '多项式求根',
  subtitle: '实根复根与系数',
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
    '理解求根就是找曲线与x轴的交点',
    '认识代数基本定理与根的个数',
    '区分实根与复根',
    '了解二分法与牛顿法等数值求根思路',
  ],

  prerequisites: ['了解多项式', '了解平面坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '解一个方程，本质上是在问：什么样的x能让式子等于零。' },
        { id: 'intro-2', text: '把多项式画成一条曲线，方程的解就藏在图里。' },
        { id: 'intro-3', text: '曲线每一次穿过x轴的地方，就是一个实根。' },
      ],
    },
    {
      id: 'count',
      type: 'concept',
      title: '次数与根数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cnt-1', text: '代数基本定理告诉我们，n次多项式在复数范围恰好有n个根。' },
        { id: 'cnt-2', text: '二次方程有两个根，三次有三个，四次有四个，一个都不多不少。' },
        { id: 'cnt-3', text: '只不过这些根里，有的落在实数轴上，有的藏进了复数平面。' },
      ],
    },
    {
      id: 'complex',
      type: 'concept',
      title: '实根与复根',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cpx-1', text: '曲线与x轴的交点，就是我们能直接看到的实根。' },
        { id: 'cpx-2', text: '如果曲线悬在轴上方或下方不肯相交，那对应的就是一对共轭复根。' },
        { id: 'cpx-3', text: '实系数多项式的复根总是成对出现，就像一对影子。' },
      ],
    },
    {
      id: 'numeric',
      type: 'concept',
      title: '数值求根',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'num-1', text: '高于四次的方程没有通用求根公式，我们改用数值方法逼近。' },
        { id: 'num-2', text: '二分法盯住符号变化的区间，不断对半夹逼，把根越关越紧。' },
        { id: 'num-3', text: '牛顿法则借助切线，用导数指路，收敛得又快又准。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动系数滑块，看曲线怎样上下起伏、左右摆动。' },
        { id: 'int-2', text: '注意那些粉红色的根，如何随系数滑动、相遇甚至消失。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '求根就是找曲线与x轴的交点，n次多项式共有n个复根。' },
        { id: 'sum-2', text: '实根看得见，复根成对藏，数值方法帮我们把它们一一逼近。' },
        { id: 'sum-3', text: '系数一动，根就起舞，这就是代数与几何的默契，我们下次再见！' },
      ],
    },
  ],
}
