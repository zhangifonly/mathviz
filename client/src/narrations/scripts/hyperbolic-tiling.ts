import type { NarrationScript } from '../types'

/**
 * 双曲镶嵌 - 口播稿件
 * 核心概念：庞加莱圆盘、{p,q} 正则镶嵌、圆反演、等大瓦片
 * 目标受众：高中及以上
 */
export const hyperbolicTilingNarration: NarrationScript = {
  id: 'hyperbolic-tiling',
  title: '双曲镶嵌',
  subtitle: '庞加莱圆盘上的正多边形铺砌',
  difficulty: 'expert',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '认识双曲平面与庞加莱圆盘模型',
    '理解 {p,q} 正则镶嵌的条件',
    '体会越靠边界越小、却处处等大的双曲几何',
    '感受圆反演如何铺满整个圆盘',
  ],

  prerequisites: ['了解正多边形', '了解圆与角度'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '画家埃舍尔有一幅《极限圆》，无数天使与魔鬼向圆的边缘越缩越小。' },
        { id: 'intro-2', text: '这幅画背后，藏着一个奇妙的世界，叫做双曲平面。' },
        { id: 'intro-3', text: '今天我们就在圆盘里，亲手铺满这种停不下来的镶嵌。' },
      ],
    },
    {
      id: 'plane',
      type: 'concept',
      title: '双曲平面',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '我们把整个双曲平面，装进一个单位圆盘里，这就是庞加莱圆盘模型。' },
        { id: 'def-2', text: '圆盘的边界代表无穷远，任何图形靠近它，看起来都会无限缩小。' },
        { id: 'def-3', text: '这里的直线不再笔直，而是垂直于边界圆的一段段圆弧。' },
      ],
    },
    {
      id: 'tiling',
      type: 'concept',
      title: '{p,q} 镶嵌',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pq-1', text: '记号 {p,q} 表示：用正 p 边形铺砌，每个顶点处恰好聚拢 q 个多边形。' },
        { id: 'pq-2', text: '在平坦的纸面上，只有正三角、正方、正六边形能无缝铺满。' },
        { id: 'pq-3', text: '而在双曲平面里，只要 p 减二乘以 q 减二大于四，就能镶嵌，方案有无穷多种。' },
      ],
    },
    {
      id: 'equal',
      type: 'concept',
      title: '处处等大',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eq-1', text: '看上去中心的瓦片很大，靠边的瓦片越来越小，仿佛大小不一。' },
        { id: 'eq-2', text: '但在双曲的尺度下，每一块瓦片的形状和面积其实完全相同。' },
        { id: 'eq-3', text: '缩小只是圆盘投影的错觉，相邻瓦片都由圆反演精确翻折而来。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换 {5,4} 与 {7,3}，看不同的正多边形如何各自铺满圆盘。' },
        { id: 'int-2', text: '增加翻折层数，瓦片就一圈圈涌向边界，永远也填不到尽头。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '庞加莱圆盘把无限的双曲平面，收进一个有限的圆里。' },
        { id: 'sum-2', text: '{p,q} 镶嵌用等大的正多边形，靠圆反演铺满整个圆盘。' },
        { id: 'sum-3', text: '有限中藏着无限，这正是双曲几何的浪漫，我们下次再见！' },
      ],
    },
  ],
}
