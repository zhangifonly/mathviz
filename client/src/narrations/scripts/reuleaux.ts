import type { NarrationScript } from '../types'

/**
 * 等宽曲线 - 口播稿件
 * 核心概念：勒洛三角形、恒定宽度、巴比尔定理、钻方孔与硬币应用
 * 目标受众：初中及以上
 */
export const reuleauxNarration: NarrationScript = {
  id: 'reuleaux',
  title: '等宽曲线',
  subtitle: '勒洛三角形 — 不是圆，却处处等宽',
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
    '理解"等宽曲线"的定义与勒洛三角形的构造',
    '认识周长恒为 π 乘宽度的巴比尔定理',
    '了解等宽却不能当轮子的原因（形心颠簸）',
    '认识钻方孔、异形硬币等实际应用',
  ],

  prerequisites: ['了解圆与正多边形', '了解圆弧的概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '要让形状滚动时高度不变，你大概只会想到圆。' },
        { id: 'intro-2', text: '可是除了圆，还有一大类曲线也能做到处处等宽。' },
        { id: 'intro-3', text: '其中最著名的，是一个鼓起肚子的三角形。' },
      ],
    },
    {
      id: 'construct',
      type: 'concept',
      title: '勒洛三角形的构造',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '取一个正三角形，以每个顶点为圆心，边长为半径画弧。' },
        { id: 'def-2', text: '三段圆弧首尾相接，就围成了鼓起的勒洛三角形。' },
        { id: 'def-3', text: '同样的办法用在正五边形、正七边形上，也能得到等宽曲线。' },
      ],
    },
    {
      id: 'width',
      type: 'concept',
      title: '宽度为何恒定',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'wid-1', text: '用两条平行线把它夹住，一条切着弧，一条正好压着对面的顶点。' },
        { id: 'wid-2', text: '这个距离刚好等于半径，无论你从哪个方向去夹，都一模一样。' },
        { id: 'wid-3', text: '巴比尔定理还告诉我们，它的周长恒等于圆周率乘以宽度。' },
      ],
    },
    {
      id: 'roll',
      type: 'concept',
      title: '能滚却不稳',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'roll-1', text: '让它在两条平行线间滚动，顶部始终贴着上线，高度纹丝不动。' },
        { id: 'roll-2', text: '可它的形心却在上下颠簸，所以做车轮会让人晃得难受。' },
        { id: 'roll-3', text: '但反过来，这份等宽让钻头能钻出近似方形的孔，硬币也能等宽异形。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换三、五、七条边，看不同的勒洛多边形如何都保持等宽。' },
        { id: 'int-2', text: '点开滚动动画，盯住顶端和中心，感受高度不变而形心起伏。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '等宽曲线在任何方向上被夹住的宽度都相同，圆只是其中一员。' },
        { id: 'sum-2', text: '勒洛三角形由三段圆弧拼成，周长恒为圆周率乘宽度。' },
        { id: 'sum-3', text: '简单的圆弧，藏着钻方孔的巧思，我们下次再见！' },
      ],
    },
  ],
}
