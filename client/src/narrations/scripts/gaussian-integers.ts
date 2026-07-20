import type { NarrationScript } from '../types'

/**
 * 高斯整数 - 口播稿件
 * 核心概念：复平面格点、范数、高斯素数、有理素数的分裂
 * 目标受众：高中及以上
 */
export const gaussianIntegersNarration: NarrationScript = {
  id: 'gaussian-integers',
  title: '高斯整数',
  subtitle: '复平面上的整数',
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
    '理解高斯整数 a+bi 与复平面格点的对应',
    '掌握范数的定义与几何意义',
    '认识高斯素数的判定规则与对称分布',
    '了解有理素数在高斯整数中的分裂现象',
  ],

  prerequisites: ['了解复数', '了解素数与整除'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们熟悉的整数排在一条数轴上，但如果把它们搬进复平面呢？' },
        { id: 'intro-2', text: '高斯把整数推广成 a 加 b 乘 i 的形式，其中 a、b 都是普通整数。' },
        { id: 'intro-3', text: '于是无数个点整齐地铺满复平面，排成一张方格点阵。' },
      ],
    },
    {
      id: 'norm',
      type: 'concept',
      title: '范数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '每个高斯整数都有一个范数，等于 a 的平方加 b 的平方。' },
        { id: 'def-2', text: '它正好是这个点到原点距离的平方，把复数的大小变回了整数。' },
        { id: 'def-3', text: '范数是乘法的好帮手：两数相乘，范数也相乘。' },
      ],
    },
    {
      id: 'prime',
      type: 'concept',
      title: '高斯素数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gp-1', text: '有些高斯整数无法再拆成更小的因子，它们就是高斯素数。' },
        { id: 'gp-2', text: '若点落在坐标轴上，只有绝对值是 4k+3 型素数的才算高斯素数。' },
        { id: 'gp-3', text: '若点不在轴上，则当它的范数是普通素数时，它就是高斯素数。' },
      ],
    },
    {
      id: 'split',
      type: 'concept',
      title: '素数的分裂',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sp-1', text: '把普通素数放进高斯整数，会发生奇妙的变化。' },
        { id: 'sp-2', text: '像 5、13 这样 4k+1 型的素数会分裂成一对共轭高斯素数。' },
        { id: 'sp-3', text: '而 3、7 这样 4k+3 型的素数依然坚守素性，2 则发生分歧。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '缩放显示范围，看高斯素数在复平面上铺开的花瓣图案。' },
        { id: 'int-2', text: '你会发现它关于两条轴、还关于对角线，呈现完美的八重对称。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '高斯整数把整数搬上复平面，范数衡量它们的大小。' },
        { id: 'sum-2', text: '高斯素数按简单规则判定，分布对称而优美。' },
        { id: 'sum-3', text: '一次到二维的推广，让素数世界焕然一新，我们下次再见！' },
      ],
    },
  ],
}
