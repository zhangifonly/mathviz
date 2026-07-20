import type { NarrationScript } from '../types'

/**
 * 对数螺线 - 口播稿件
 * 核心概念：r=a*e^(b*theta)、等角性质、自相似、指数增长对比线性
 * 目标受众：高中及以上
 */
export const logarithmSpiralNarration: NarrationScript = {
  id: 'logarithm-spiral',
  title: '对数螺线',
  subtitle: '自相似的等角螺线',
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
    '掌握对数螺线的极坐标方程 r=a*e^(b*theta)',
    '理解等角性质：切线与径向夹角恒定',
    '体会每转一圈固定倍数放大的自相似',
    '区分对数螺线与阿基米德螺线的增长方式',
  ],

  prerequisites: ['了解极坐标', '了解指数函数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '鹦鹉螺的壳，向日葵的种子，还有旋涡星系的巨臂。' },
        { id: 'intro-2', text: '它们身上都藏着同一条曲线，越转越大，却始终保持相同的形状。' },
        { id: 'intro-3', text: '这就是对数螺线，一条被大自然反复采用的优美螺线。' },
      ],
    },
    {
      id: 'equation',
      type: 'concept',
      title: '极坐标方程',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eq-1', text: '在极坐标里，它的方程写作 r 等于 a 乘以 e 的 b 乘 theta 次方。' },
        { id: 'eq-2', text: 'theta 是转过的角度，半径 r 随角度呈指数增长。' },
        { id: 'eq-3', text: '常数 a 定起点大小，常数 b 控制螺线的松紧。' },
      ],
    },
    {
      id: 'equiangular',
      type: 'concept',
      title: '等角性质',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ang-1', text: '在螺线的任意一点，切线和从中心引出的径向之间，都夹着同一个角。' },
        { id: 'ang-2', text: '这个定角等于 arctan 一比 b，与你走到哪里无关，所以它又叫等角螺线。' },
      ],
    },
    {
      id: 'selfsimilar',
      type: 'concept',
      title: '自相似',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'self-1', text: '每多转一整圈，半径就放大固定的倍数，等于 e 的 2 pi b 次方。' },
        { id: 'self-2', text: '于是把螺线放大或缩小，看上去和原来一模一样，这就是自相似。' },
        { id: 'self-3', text: '相比之下，阿基米德螺线 r 等于 a 加 b theta，半径是线性增长，圈距均匀。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整参数 b，看螺线在松散和紧致之间变化。' },
        { id: 'int-2', text: '再叠加阿基米德螺线做对比，感受指数与线性的不同。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '对数螺线由 r 等于 a e 的 b theta 次方描述，半径指数增长。' },
        { id: 'sum-2', text: '它处处等角，每转一圈按固定倍数放大，因而完美自相似。' },
        { id: 'sum-3', text: '从贝壳到星系，它把生长的秘密写进螺线，我们下次再见！' },
      ],
    },
  ],
}
