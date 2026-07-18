import type { NarrationScript } from '../types'

/**
 * 椭圆曲线 - 口播稿件
 * 核心概念：曲线方程、弦切法几何加法、无穷远点、点加法群
 * 目标受众：大学及以上
 */
export const ellipticCurveNarration: NarrationScript = {
  id: 'elliptic-curve',
  title: '椭圆曲线',
  subtitle: '曲线上点的加法群',
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
    '理解椭圆曲线方程 y²=x³+ax+b 的形状',
    '掌握弦切法定义的几何加法',
    '认识无穷远点作为群的单位元',
    '感受曲线上点构成交换群的奇妙结构',
  ],

  prerequisites: ['了解平面坐标与直线', '了解群的基本概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '今天我们来看一种奇特的加法。' },
        { id: 'intro-2', text: '它不是数字相加，而是把曲线上的两个点加在一起。' },
        { id: 'intro-3', text: '两个点相加，竟然又落回同一条曲线上。' },
        { id: 'intro-4', text: '这就是椭圆曲线，现代密码学的基石之一。' },
      ],
    },
    {
      id: 'equation',
      type: 'concept',
      title: '椭圆曲线方程',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '椭圆曲线的方程是 y 的平方等于 x 的立方加 a x 加 b。' },
        { id: 'def-2', text: '它关于 x 轴对称，常常呈现一条主干和一个孤立的环。' },
        { id: 'def-3', text: '只要判别式不为零，曲线就光滑无尖点，我们才能在上面做加法。' },
      ],
    },
    {
      id: 'geometry',
      type: 'concept',
      title: '弦切法加法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'geo-1', text: '要计算 P 加 Q，先过这两点画一条直线。' },
        { id: 'geo-2', text: '这条直线一定会与曲线相交于第三个点。' },
        { id: 'geo-3', text: '把第三点关于 x 轴翻折，得到的点就定义为 P 加 Q。' },
      ],
    },
    {
      id: 'infinity',
      type: 'concept',
      title: '无穷远点',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'inf-1', text: '如果两点上下对称，连线竖直，直线似乎交不到第三点。' },
        { id: 'inf-2', text: '数学家约定，此时它们相交于一个无穷远点 O。' },
        { id: 'inf-3', text: 'O 就是这个群的单位元，任何点加 O 还是它自己。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块选择 P 和 Q 的位置，看割线如何找出第三点。' },
        { id: 'int-2', text: '观察绿色的 P 加 Q，它始终乖乖落在曲线上。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '椭圆曲线上的点，用弦切法定义加法，构成一个交换群。' },
        { id: 'sum-2', text: '无穷远点是单位元，翻折给出每个点的负元。' },
        { id: 'sum-3', text: '这套优雅的几何规则守护着今天的信息安全，我们下次再见！' },
      ],
    },
  ],
}
