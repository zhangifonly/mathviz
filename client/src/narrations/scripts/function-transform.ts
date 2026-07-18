import type { NarrationScript } from '../types'

/**
 * 函数图象变换 - 口播稿件
 * 核心概念：g(x)=a·f(b(x-h))+k 的平移、伸缩、翻折
 * 目标受众：初中及以上
 */
export const functionTransformNarration: NarrationScript = {
  id: 'function-transform',
  title: '函数图象变换',
  subtitle: '平移伸缩翻折',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解统一变换式 a·f(b(x-h))+k 的结构',
    '掌握 h、k 对应的平移方向',
    '掌握 a、b 对应的伸缩与翻折',
    '会由基函数推出变换后函数的图象',
  ],

  prerequisites: ['了解函数与坐标系', '会读函数图象'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一条抛物线，其实有一大家子亲戚。' },
        { id: 'intro-2', text: '它们形状相似，只是被挪动、拉伸或者翻转了。' },
        { id: 'intro-3', text: '只要一个公式，就能把整个家族写清楚。' },
      ],
    },
    {
      id: 'translate',
      type: 'concept',
      title: '平移 h 与 k',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '把 x 换成 x 减 h，图象就整体向右平移 h 个单位。' },
        { id: 'def-2', text: '在末尾加上 k，图象就整体向上平移 k 个单位。' },
        { id: 'def-3', text: 'h 管左右，k 管上下，平移不改变曲线的形状。' },
      ],
    },
    {
      id: 'scale',
      type: 'concept',
      title: '伸缩 a 与 b',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'scl-1', text: '乘上系数 a，图象在竖直方向被拉伸或压扁。' },
        { id: 'scl-2', text: '在 x 前面乘 b，图象在水平方向被压缩或拉宽。' },
        { id: 'scl-3', text: 'a 越大越瘦高，b 越大左右越紧凑。' },
      ],
    },
    {
      id: 'flip',
      type: 'concept',
      title: '翻折的负号',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'flp-1', text: '当 a 取负，整条曲线沿 x 轴翻个身，上下颠倒。' },
        { id: 'flp-2', text: '当 b 取负，曲线沿 y 轴镜像，左右对调。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动四个滑块，看灰色基线如何变成彩色的新曲线。' },
        { id: 'int-2', text: '每调一个参数，屏幕都会告诉你它带来的效果。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'h 和 k 负责平移，a 和 b 负责伸缩。' },
        { id: 'sum-2', text: '负号带来翻折，四个参数合起来掌控整个家族。' },
        { id: 'sum-3', text: '记住这个公式，你就握住了函数变形的钥匙，我们下次再见！' },
      ],
    },
  ],
}
