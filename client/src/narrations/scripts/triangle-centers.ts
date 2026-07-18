import type { NarrationScript } from '../types'

/**
 * 三角形四心 - 口播稿件
 * 核心概念：重心、外心、内心、垂心，以及欧拉线
 * 目标受众：初中及以上
 */
export const triangleCentersNarration: NarrationScript = {
  id: 'triangle-centers',
  title: '三角形四心',
  subtitle: '重心、外心、内心、垂心',
  difficulty: 'intermediate',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解重心、外心、内心、垂心的定义',
    '掌握每个心的几何构造方式',
    '认识外接圆与内切圆',
    '了解欧拉线上三心共线的关系',
  ],

  prerequisites: ['了解三角形基本性质', '了解中线、垂线与角平分线'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个普通的三角形，藏着好几个特别的点。' },
        { id: 'intro-2', text: '它们由不同的线交汇而成，各有各的脾气。' },
        { id: 'intro-3', text: '今天我们来认识其中最经典的四个：重心、外心、内心、垂心。' },
      ],
    },
    {
      id: 'centroid-circum',
      type: 'concept',
      title: '重心与外心',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cc-1', text: '重心是三条中线的交点，正好是三个顶点坐标的平均值。' },
        { id: 'cc-2', text: '它是三角形的平衡点，用手指顶住这里，纸板恰好不倒。' },
        { id: 'cc-3', text: '外心是三条边垂直平分线的交点，到三个顶点距离相等。' },
        { id: 'cc-4', text: '以外心为圆心，就能画出穿过三个顶点的外接圆。' },
      ],
    },
    {
      id: 'incenter-ortho',
      type: 'concept',
      title: '内心与垂心',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'io-1', text: '内心是三条角平分线的交点，到三条边的距离都相等。' },
        { id: 'io-2', text: '以内心为圆心，就能画出恰好贴着三条边的内切圆。' },
        { id: 'io-3', text: '垂心则是三条高线的交点，也就是从每个顶点向对边所作垂线的汇合处。' },
      ],
    },
    {
      id: 'euler',
      type: 'concept',
      title: '欧拉线',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eu-1', text: '奇妙的是，重心、外心、垂心这三个点，总是落在同一条直线上。' },
        { id: 'eu-2', text: '这条线叫欧拉线，而且重心恰好把外心到垂心的线段分成一比二。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同形状的三角形，看看四个心如何随之移动。' },
        { id: 'int-2', text: '注意钝角三角形里，外心和垂心会跑到三角形外面去。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '重心、外心、内心、垂心，分别由中线、垂直平分线、角平分线和高线相交而成。' },
        { id: 'sum-2', text: '外心配外接圆，内心配内切圆，而三心又共处欧拉线。' },
        { id: 'sum-3', text: '小小三角形里的大秩序，我们下次再见！' },
      ],
    },
  ],
}
