import type { NarrationScript } from '../types'

/**
 * 圆的几何 - 口播稿件
 * 核心概念：周长与面积、弧长与扇形、弦长、圆周角定理
 * 目标受众：初中及以上
 */
export const circleGeometryNarration: NarrationScript = {
  id: 'circle-geometry',
  title: '圆的几何',
  subtitle: '从周长面积到圆周角定理',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '掌握圆的周长与面积公式',
    '理解弧长与扇形面积随圆心角的变化',
    '认识弦长与圆心角的关系',
    '理解圆周角定理',
  ],

  prerequisites: ['了解圆的基本概念', '了解角度与弧度'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '圆，是几何里最对称、最优美的图形，只要一个圆心和一段半径就能确定。' },
        { id: 'intro-2', text: '别看它简单，圆里藏着一连串漂亮的公式和定理，今天我们一起来揭开它们。' },
      ],
    },
    {
      id: 'circumference',
      type: 'concept',
      title: '周长与面积',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'circ-1', text: '先看周长。圆一圈的长度等于二乘以圆周率乘以半径，也就是二 π r。' },
        { id: 'circ-2', text: '再看面积。圆所围住的区域大小等于圆周率乘以半径的平方，也就是 π r 平方。' },
        { id: 'circ-3', text: '半径每增大一点，周长成正比增长，而面积却按平方增长，所以大圆会大得特别快。' },
      ],
    },
    {
      id: 'arc',
      type: 'concept',
      title: '弧长与扇形',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'arc-1', text: '如果只取圆的一部分，从圆心张开一个角，这个角叫圆心角。' },
        { id: 'arc-2', text: '这段弧的长度，等于半径乘以圆心角的弧度值，写作 r 乘 θ。' },
        { id: 'arc-3', text: '这块像扇子一样的区域叫扇形，它的面积等于二分之一乘以半径的平方再乘以圆心角。' },
      ],
    },
    {
      id: 'chord',
      type: 'concept',
      title: '弦与圆心角',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'chord-1', text: '连接圆上两点的线段叫弦，它把圆分成两段弧。' },
        { id: 'chord-2', text: '弦的长度等于二乘以半径再乘以圆心角一半的正弦值，圆心角越大，弦就越长。' },
      ],
    },
    {
      id: 'inscribed',
      type: 'concept',
      title: '圆周角定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'insc-1', text: '同一段弧，站在圆心看到的是圆心角，站在圆上另一点看到的是圆周角。' },
        { id: 'insc-2', text: '圆周角定理告诉我们，圆周角永远是圆心角的一半，无论顶点在弧上怎么移动都不变。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的主题，看看周长、弧长、弦长和圆周角是怎么随圆心角变化的。' },
        { id: 'int-2', text: '试着拉大圆心角，观察弧长和弦长同时变长，再验证圆周角始终是圆心角的一半。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '我们认识了圆的周长二 π r 和面积 π r 平方这两个核心公式。' },
        { id: 'sum-2', text: '又学会了弧长、扇形面积、弦长的算法，以及圆周角是圆心角一半的定理。' },
        { id: 'sum-3', text: '一个小小的圆，竟藏着这么多规律，我们下次继续探索数学之美！' },
      ],
    },
  ],
}
