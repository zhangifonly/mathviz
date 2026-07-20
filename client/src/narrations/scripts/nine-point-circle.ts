import type { NarrationScript } from '../types'

/**
 * 九点圆 - 口播稿件
 * 核心概念：三角形中九个特殊点共圆
 * 目标受众：高中及以上
 */
export const ninePointCircleNarration: NarrationScript = {
  id: 'nine-point-circle',
  title: '九点圆',
  subtitle: '九个特殊点共圆',
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
    '认识三角形中九个特殊点',
    '理解它们共处同一个圆',
    '掌握九点圆的圆心与半径',
    '感受几何中隐藏的秩序之美',
  ],

  prerequisites: ['了解三角形的高与垂心', '了解外接圆'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '任意画一个三角形，它身上藏着一个惊人的定理。' },
        { id: 'intro-2', text: '有九个看似毫不相关的点，竟然全都落在同一个圆上。' },
        { id: 'intro-3', text: '这个圆就叫九点圆，它对每一个三角形都成立。' },
      ],
    },
    {
      id: 'mid',
      type: 'concept',
      title: '三边中点',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '先看最简单的三个：三条边各自的中点。' },
        { id: 'def-2', text: '它们把三角形的每条边一分为二，是最容易找到的三个点。' },
      ],
    },
    {
      id: 'foot',
      type: 'concept',
      title: '三高垂足',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-3', text: '再从每个顶点向对边作高，高与对边相交的点叫垂足。' },
        { id: 'def-4', text: '三条高交于一点,称为垂心,而三个垂足又是三个新点。' },
      ],
    },
    {
      id: 'ortho',
      type: 'concept',
      title: '垂心相关中点',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-5', text: '最后连接垂心与三个顶点，取这三条线段的中点。' },
        { id: 'def-6', text: '三个中点、三个垂足、三个边中点，一共正好九个点。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '九点共圆',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '奇妙的是,这九个点恰好都在同一个圆上,分毫不差。' },
        { id: 'int-2', text: '它的圆心是外心与垂心的中点，半径正是外接圆的一半。' },
        { id: 'int-3', text: '切换不同的三角形，你会看到九点圆始终稳稳地穿过它们。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '边中点、高垂足、垂心连线中点，九个点共处一圆。' },
        { id: 'sum-2', text: '无论三角形如何变化，这份优雅的秩序都不会改变。' },
        { id: 'sum-3', text: '这就是几何深处的和谐之美，我们下次再见！' },
      ],
    },
  ],
}
