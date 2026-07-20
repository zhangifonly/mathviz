import type { NarrationScript } from '../types'

/**
 * 旋转体体积 - 口播稿件
 * 核心概念：圆盘法、壳层法、旋转体、数值积分
 * 目标受众：高中及以上
 */
export const solidOfRevolutionNarration: NarrationScript = {
  id: 'solid-of-revolution',
  title: '旋转体体积',
  subtitle: '圆盘法与壳层法',
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
    '理解旋转体是平面区域绕轴旋转形成的立体',
    '掌握圆盘法用积分求体积',
    '掌握壳层法的另一种切分视角',
    '体会两种方法殊途同归',
  ],

  prerequisites: ['了解定积分', '了解圆的面积'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '取一条曲线 y 等于 f(x)，让它绕着 x 轴转一整圈。' },
        { id: 'intro-2', text: '曲线扫过的空间，就围出了一个立体，我们叫它旋转体。' },
        { id: 'intro-3', text: '问题来了：这个立体的体积，该怎么算？' },
      ],
    },
    {
      id: 'disk',
      type: 'concept',
      title: '圆盘法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '把立体沿 x 方向切成许多薄薄的圆盘。' },
        { id: 'def-2', text: '每个圆盘的半径正好是 f(x)，面积就是 π 乘 f(x) 的平方。' },
        { id: 'def-3', text: '再乘上薄薄的厚度，就是一片圆盘的体积。' },
      ],
    },
    {
      id: 'integral',
      type: 'concept',
      title: '体积积分',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '把所有圆盘的体积加起来，让厚度趋于零，求和就变成了积分。' },
        { id: 'int-2', text: '于是体积等于从 a 到 b，对 π f(x) 平方求定积分。' },
        { id: 'int-3', text: '计算机用辛普森法做数值积分，能精确地逼近这个值。' },
      ],
    },
    {
      id: 'shell',
      type: 'concept',
      title: '壳层法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'shl-1', text: '换个视角，我们也能沿 y 方向，把立体套成一层层薄圆筒。' },
        { id: 'shl-2', text: '每层圆筒的体积是 2π 乘半径 y，再乘它的高与厚度。' },
        { id: 'shl-3', text: '这就是壳层法，它和圆盘法算的是同一个立体，结果必然相等。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ita-1', text: '换一条曲线，或者拖动积分区间，看看体积如何随之改变。' },
        { id: 'ita-2', text: '注意屏幕上圆盘法与壳层法给出的数字，始终紧紧咬合。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '旋转体的体积，可以切成圆盘,也可以套成壳层。' },
        { id: 'sum-2', text: '两条思路都用积分把无数薄片累加成整体，答案完全一致。' },
        { id: 'sum-3', text: '一样的立体，两种视角，这就是微积分的美妙，我们下次再见！' },
      ],
    },
  ],
}
