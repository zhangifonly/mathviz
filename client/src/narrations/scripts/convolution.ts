import type { NarrationScript } from '../types'

/**
 * 卷积 - 口播稿件
 * 核心概念：翻转滑动求重叠、滤波、平滑与边缘
 * 目标受众：高中及以上
 */
export const convolutionNarration: NarrationScript = {
  id: 'convolution',
  title: '卷积',
  subtitle: '翻转滑动求重叠',
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
    '理解卷积是翻转、滑动、相乘、求和的过程',
    '认识卷积核如何决定滤波效果',
    '区分平滑核与边缘检测核',
    '感受卷积在信号与图像处理中的威力',
  ],

  prerequisites: ['了解数列', '了解加权平均'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '给你一段有噪声的信号，怎样把它变得平滑，或者找出它的边缘？' },
        { id: 'intro-2', text: '答案是滤波，而滤波的本质，就是一次次卷积运算。' },
        { id: 'intro-3', text: '卷积用一个小小的核，去扫过整段信号，重新塑造它的形状。' },
      ],
    },
    {
      id: 'flip',
      type: 'concept',
      title: '翻转核',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'flip-1', text: '卷积的第一步，是把卷积核左右翻转过来。' },
        { id: 'flip-2', text: '翻转让运算满足交换律，也是卷积区别于相关的关键一笔。' },
        { id: 'flip-3', text: '对称的核翻转后不变，但不对称的核，翻转的效果一目了然。' },
      ],
    },
    {
      id: 'slide',
      type: 'concept',
      title: '滑动相乘求和',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'slide-1', text: '把翻转后的核对齐到信号的某一点，让它们逐位相乘。' },
        { id: 'slide-2', text: '把这些乘积全部加起来，就得到输出在这一点的值。' },
        { id: 'slide-3', text: '核向右滑动一格，重复相乘求和，输出就一点一点生成了。' },
      ],
    },
    {
      id: 'kernels',
      type: 'concept',
      title: '不同核的效果',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ker-1', text: '移动平均和高斯核，把邻居加权平均，信号变得平滑，噪声被压下去。' },
        { id: 'ker-2', text: '而边缘检测核是一组差分，在信号突变的台阶处输出高峰。' },
        { id: 'ker-3', text: '同一段信号，换一个核，就能得到截然不同的结果。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '选择不同的卷积核，观察输出如何被平滑或被凸显。' },
        { id: 'int-2', text: '拖动滑块，跟着翻转核一格一格地走完整个卷积过程。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '卷积就是翻转核、滑动、逐点相乘、再求和。' },
        { id: 'sum-2', text: '换一个核，就换一种滤波，平滑与边缘尽在掌握。' },
        { id: 'sum-3', text: '从数字信号到卷积神经网络，它无处不在，我们下次再见！' },
      ],
    },
  ],
}
