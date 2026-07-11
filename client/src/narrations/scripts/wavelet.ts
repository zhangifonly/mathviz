import type { NarrationScript } from '../types'

/**
 * 小波变换 - 口播稿件
 * 核心概念：时频局部化、母小波的平移与伸缩、尺度图、Haar 多分辨率分析
 * 目标受众：研究生以上
 */
export const waveletNarration: NarrationScript = {
  id: 'wavelet',
  title: '小波变换',
  subtitle: '同时看见时间与频率',
  difficulty: 'expert',
  targetAge: '研究生以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解傅里叶变换在时间定位上的缺陷',
    '掌握母小波通过平移与伸缩匹配信号的思想',
    '读懂尺度图所表达的时频信息',
    '认识 Haar 小波的多分辨率分解与完美重构',
  ],

  prerequisites: ['熟悉傅里叶变换', '了解积分与内积', '了解正交基'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '傅里叶变换能告诉我们信号里有哪些频率，却说不清这些频率出现在什么时刻。' },
        { id: 'intro-2', text: '因为它用的是从负无穷延伸到正无穷的正弦波，天生没有时间的概念。' },
        { id: 'intro-3', text: '小波变换换了一种基函数，一个又短又会迅速衰减的小波，于是时间和频率可以被同时看见。' },
      ],
    },
    {
      id: 'concept-mother',
      type: 'concept',
      title: '母小波的平移与伸缩',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mother-1', text: '一切从一个母小波开始，它形状固定，均值为零，能量集中在很小的一段区间内。' },
        { id: 'mother-2', text: '我们把它沿时间轴平移，去对齐信号的不同位置，这决定了在什么时刻分析。' },
        { id: 'mother-3', text: '再把它横向伸缩，尺度越小小波越窄对应高频，尺度越大小波越宽对应低频。' },
        { id: 'mother-4', text: '小波与信号的每一次内积，就是一个小波系数，衡量此时此频与信号的匹配程度。' },
      ],
    },
    {
      id: 'concept-scaleogram',
      type: 'concept',
      title: '读懂尺度图',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'scale-1', text: '把所有位置和所有尺度的系数铺成一张图，横轴是时间，纵轴是尺度，这就是尺度图。' },
        { id: 'scale-2', text: '颜色越亮，代表该时刻该尺度上的能量越强，信号的结构一目了然。' },
        { id: 'scale-3', text: '一个突然出现的尖峰，会在高频那一侧留下一条清晰的竖线，精确指出它发生的时刻。' },
      ],
    },
    {
      id: 'concept-haar',
      type: 'concept',
      title: 'Haar 多分辨率分解',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'haar-1', text: '最简单的小波是 Haar 小波，它把相邻两个样本取平均得到近似，取差得到细节。' },
        { id: 'haar-2', text: '对近似部分反复做同样的操作，信号就被拆成从粗到细的多个分辨率层次。' },
        { id: 'haar-3', text: '由于这是一组正交基，整个过程能量守恒，并且可以完美地重构出原始信号。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换上啁啾信号，它的频率随时间不断升高，尺度图上会出现一条漂亮的斜带。' },
        { id: 'int-2', text: '再试试双频突变信号，注意小波如何精准地标出前后两段频率的切换时刻。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '小波用平移定位时间，用伸缩选择频率，突破了傅里叶只见频率不见时间的局限。' },
        { id: 'sum-2', text: '从图像压缩到地震分析，小波已经成为处理非平稳信号的有力工具。' },
        { id: 'sum-3', text: '在时间与频率之间自由穿梭，这正是小波变换的魅力，我们下次再见。' },
      ],
    },
  ],
}
