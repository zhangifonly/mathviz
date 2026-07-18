import type { NarrationScript } from '../types'

/**
 * 幂迭代 - 口播稿件
 * 核心概念：反复乘矩阵、归一化、主特征向量、瑞利商
 * 目标受众：高中及以上
 */
export const powerIterationNarration: NarrationScript = {
  id: 'power-iteration',
  title: '幂迭代',
  subtitle: '反复乘矩阵求主特征向量',
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
    '理解主特征值与主特征向量的含义',
    '掌握幂迭代反复乘矩阵再归一化的流程',
    '理解归一化为何不可或缺',
    '用瑞利商估计主特征值',
  ],

  prerequisites: ['了解矩阵乘向量', '了解向量与单位向量'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个矩阵作用在向量上，会把它拉伸并转向某个方向。' },
        { id: 'intro-2', text: '其中有一个最强的方向，对应绝对值最大的特征值。' },
        { id: 'intro-3', text: '我们想找到它，却又不想去解复杂的特征方程。' },
        { id: 'intro-4', text: '幂迭代给出一个惊人简单的办法：只管反复乘就好。' },
      ],
    },
    {
      id: 'multiply',
      type: 'concept',
      title: '反复乘矩阵',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mul-1', text: '取任意一个起始向量，用矩阵去乘它，得到一个新向量。' },
        { id: 'mul-2', text: '再乘一次，再乘一次，主方向的分量每次都被放大得最多。' },
        { id: 'mul-3', text: '于是向量会越来越偏向那个最强的主特征向量。' },
      ],
    },
    {
      id: 'normalize',
      type: 'concept',
      title: '归一化',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'norm-1', text: '光是相乘，向量长度会爆炸增长或缩到极小。' },
        { id: 'norm-2', text: '所以每一步都把它除以自身长度，重新缩回单位圆上。' },
        { id: 'norm-3', text: '这样我们只关心方向，方向才是真正收敛的东西。' },
      ],
    },
    {
      id: 'converge',
      type: 'concept',
      title: '收敛与瑞利商',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conv-1', text: '几步之后，箭头几乎不再转动，就锁定在了主特征向量方向。' },
        { id: 'conv-2', text: '此时用瑞利商，向量点乘矩阵乘向量再除以自身点积，得到主特征值。' },
        { id: 'conv-3', text: '主特征值越突出，收敛就越快。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击单步迭代，看箭头一步步转向主方向。' },
        { id: 'int-2', text: '换一个矩阵，观察收敛速度和最终方向如何变化。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '幂迭代反复乘矩阵再归一化，让向量收敛到主特征向量。' },
        { id: 'sum-2', text: '瑞利商顺带给出主特征值，谷歌的网页排名正是它的大规模应用。' },
        { id: 'sum-3', text: '简单的一乘再乘，问出了矩阵最强的方向，我们下次再见！' },
      ],
    },
  ],
}
