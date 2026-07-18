import type { NarrationScript } from '../types'

/**
 * 贝塞尔函数 - 口播稿件
 * 核心概念：圆膜振动、贝塞尔方程、J_n 幂级数、零点与节圆
 * 目标受众：大学及以上
 */
export const besselFunctionsNarration: NarrationScript = {
  id: 'bessel-functions',
  title: '贝塞尔函数',
  subtitle: '圆膜振动的解',
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
    '理解贝塞尔方程描述圆膜振动的来历',
    '掌握第一类贝塞尔函数的幂级数定义',
    '认识零点与鼓面节圆的对应关系',
    '感受特殊函数连接数学与物理的力量',
  ],

  prerequisites: ['了解二阶微分方程', '了解幂级数与三角函数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '敲一面鼓，鼓皮会怎样振动呢？' },
        { id: 'intro-2', text: '不像琴弦只在一条线上抖动，圆形鼓面是在整个平面上起伏。' },
        { id: 'intro-3', text: '要描述这种振动，正弦余弦不够用了，我们需要贝塞尔函数。' },
      ],
    },
    {
      id: 'equation',
      type: 'concept',
      title: '贝塞尔方程',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eq-1', text: '把波动方程放到极坐标里分离变量，径向部分就得到贝塞尔方程。' },
        { id: 'eq-2', text: '它写作 x 平方 y 双撇，加 x y 撇，再加 x 平方减 n 平方乘 y，等于零。' },
        { id: 'eq-3', text: '这里的 n 叫阶数，它的解就是第 n 阶贝塞尔函数。' },
      ],
    },
    {
      id: 'series',
      type: 'concept',
      title: '幂级数展开',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ser-1', text: 'J_n 没有初等表达式，但可以写成一条优美的幂级数。' },
        { id: 'ser-2', text: '它是对 k 求和，系数是负一的 k 次方，除以 k 阶乘乘 n 加 k 阶乘。' },
        { id: 'ser-3', text: '再乘上 x 的一半的 2k 加 n 次方，逐项相加就收敛出整条曲线。' },
      ],
    },
    {
      id: 'zeros',
      type: 'concept',
      title: '零点与节圆',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'zero-1', text: '贝塞尔函数像一条不断衰减的正弦波，反复穿过横轴。' },
        { id: 'zero-2', text: '每一个零点，对应鼓面上一圈始终不动的节圆。' },
        { id: 'zero-3', text: '零点的位置决定了鼓的振动模态，也决定了它的音高。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换阶数，看 J0、J1、J2 的曲线如何错落起伏。' },
        { id: 'int-2', text: '留意每条曲线穿过横轴的位置，那正是一圈圈节圆的半径。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '贝塞尔方程来自圆膜振动，它的解就是贝塞尔函数。' },
        { id: 'sum-2', text: '幂级数给出衰减振荡的曲线，零点标出鼓面的节圆。' },
        { id: 'sum-3', text: '从一面鼓看见特殊函数之美，我们下次再见！' },
      ],
    },
  ],
}
