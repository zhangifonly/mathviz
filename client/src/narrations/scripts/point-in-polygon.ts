import type { NarrationScript } from '../types'

/**
 * 点在多边形内 - 口播稿件
 * 核心概念：射线法（偶奇规则）、环绕数（非零规则）、自交多边形的差异
 * 目标受众：高中及以上
 */
export const pointInPolygonNarration: NarrationScript = {
  id: 'point-in-polygon',
  title: '点在多边形内',
  subtitle: '射线法与环绕数',
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
    '理解射线法用交点奇偶判定点的内外',
    '理解环绕数用旋转圈数判定内外',
    '认识自交多边形下两种规则的差异',
    '了解它在图形与地理信息中的应用',
  ],

  prerequisites: ['了解多边形与坐标', '了解奇偶概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '给你一个多边形，再给一个点，它到底在里面还是外面？' },
        { id: 'intro-2', text: '对人眼很直观，可计算机没有眼睛，得靠一条明确的规则。' },
        { id: 'intro-3', text: '数学家想出两种漂亮的办法：射线法和环绕数。' },
      ],
    },
    {
      id: 'ray',
      type: 'concept',
      title: '射线法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ray-1', text: '从这个点向右画一条射线，一直伸到无穷远。' },
        { id: 'ray-2', text: '数一数它穿过了多边形的几条边。' },
        { id: 'ray-3', text: '穿越奇数次说明点在里面，偶数次则在外面，这叫偶奇规则。' },
      ],
    },
    {
      id: 'winding',
      type: 'concept',
      title: '环绕数法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'wind-1', text: '换个视角：站在这个点上，盯着边界走一圈。' },
        { id: 'wind-2', text: '边界绕着你转了几整圈，这个整数就是环绕数。' },
        { id: 'wind-3', text: '环绕数不为零就在里面，为零就在外面，这叫非零规则。' },
      ],
    },
    {
      id: 'concave',
      type: 'concept',
      title: '凹与自交',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '对凸多边形，两种规则永远给出相同答案。' },
        { id: 'con-2', text: '可一旦多边形自己交叉，比如一笔画成的五角星，就不一样了。' },
        { id: 'con-3', text: '星星中心被绕了两圈，非零规则算它在内，偶奇规则却算它在外。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同多边形，看采样点被染成里外两种样子。' },
        { id: 'int-2', text: '再切换规则，观察五角星的星芯如何在两法之间反转结论。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '射线法数交点奇偶，环绕数看旋转圈数，都能判定内外。' },
        { id: 'sum-2', text: '它们撑起了游戏碰撞、地图落区和图形填充的底层判断。' },
        { id: 'sum-3', text: '同一个问题，两种视角，希望你也爱上这份严谨，我们下次再见！' },
      ],
    },
  ],
}
