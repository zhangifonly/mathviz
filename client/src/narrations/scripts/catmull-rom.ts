import type { NarrationScript } from '../types'

/**
 * Catmull-Rom 样条 - 口播稿件
 * 核心概念：插值样条、中心差分切线、Catmull-Rom 基、与 B 样条对比
 * 目标受众：高中及以上
 */
export const catmullRomNarration: NarrationScript = {
  id: 'catmull-rom',
  title: 'Catmull-Rom样条',
  subtitle: '过控制点的插值曲线',
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
    '理解插值样条：曲线必须穿过每个控制点',
    '掌握用中心差分估计切线的思路',
    '认识 Catmull-Rom 基与 Hermite 插值的联系',
    '分清插值(过点)与逼近(不过点)的区别',
  ],

  prerequisites: ['了解坐标与向量', '了解曲线的切线概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '给你一串散落的点，想画一条光滑曲线把它们连起来。' },
        { id: 'intro-2', text: '而且这条曲线必须刚好穿过每一个点，一个都不能漏。' },
        { id: 'intro-3', text: '这正是 Catmull-Rom 样条要解决的问题：过点又平滑。' },
      ],
    },
    {
      id: 'tangent',
      type: 'concept',
      title: '切线估计',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tan-1', text: '要在两点之间平滑过渡，关键是知道曲线经过每个点时的方向。' },
        { id: 'tan-2', text: 'Catmull-Rom 用一个巧妙的办法：某点的切线，等于它前后两点连线的方向。' },
        { id: 'tan-3', text: '写成公式就是切线等于 P(i+1) 减 P(i-1) 再除以二。' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: 'Catmull-Rom 公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'form-1', text: '有了两端的位置和切线，就能用三次多项式在中间插值。' },
        { id: 'form-2', text: '这四个条件对应一个固定的基矩阵，把四个相邻控制点加权混合。' },
        { id: 'form-3', text: '参数 t 从零走到一，曲线就从当前点平滑滑到下一个点。' },
      ],
    },
    {
      id: 'compare',
      type: 'concept',
      title: '与 B 样条对比',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cmp-1', text: '同样一串控制点，B 样条只是被它们拉扯，并不真的穿过。' },
        { id: 'cmp-2', text: '这叫逼近；而 Catmull-Rom 老老实实过每个点，叫插值。' },
        { id: 'cmp-3', text: '要精确经过路标就用插值，要更柔顺的整体形状就用逼近。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着拖动任意一个黑点，曲线会立刻跟过去并保持穿过它。' },
        { id: 'int-2', text: '打开橙色的 B 样条对比，看两条曲线在同样点上有多不同。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'Catmull-Rom 用相邻点估计切线，让曲线光滑地穿过每个控制点。' },
        { id: 'sum-2', text: '它是插值样条的代表，简单实用，动画路径里随处可见。' },
        { id: 'sum-3', text: '记住插值过点、逼近不过点这条分界线，我们下次再见！' },
      ],
    },
  ],
}
