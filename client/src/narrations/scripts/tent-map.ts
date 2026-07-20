import type { NarrationScript } from '../types'

/**
 * 帐篷映射 - 口播稿件
 * 核心概念：分段线性映射、拉伸与折叠、满混沌、对初值的敏感依赖
 * 目标受众：高中及以上
 */
export const tentMapNarration: NarrationScript = {
  id: 'tent-map',
  title: '帐篷映射',
  subtitle: '分段线性的混沌',
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
    '理解帐篷映射的分段线性定义',
    '认识拉伸与折叠如何制造混沌',
    '理解满混沌参数 mu=2 的特殊地位',
    '感受对初值的敏感依赖',
  ],

  prerequisites: ['了解函数迭代', '了解区间与坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '混沌听起来很高深，但它可以诞生于最简单的规则。' },
        { id: 'intro-2', text: '今天的主角，是一条只由两段直线拼成的折线。' },
        { id: 'intro-3', text: '它的图像像一顶帐篷，所以叫做帐篷映射。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '帐篷函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '在区间零到一上，前半段向上爬，后半段对称地落下。' },
        { id: 'def-2', text: '写成公式：x 小于一半时等于 mu 乘 x，否则等于 mu 乘一减 x。' },
        { id: 'def-3', text: '参数 mu 就是帐篷的高度，决定了折线有多陡。' },
      ],
    },
    {
      id: 'fold',
      type: 'concept',
      title: '拉伸与折叠',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fold-1', text: '每迭代一次，区间先被拉长，再从中间对折回去。' },
        { id: 'fold-2', text: '拉伸让邻近的点迅速分开，折叠又把它们重新混在一起。' },
        { id: 'fold-3', text: '正是这一拉一折，反复揉捏，酿出了混沌。' },
      ],
    },
    {
      id: 'full',
      type: 'concept',
      title: '满混沌',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'full-1', text: '当 mu 等于二，帐篷顶端恰好顶到最高处。' },
        { id: 'full-2', text: '此时整个区间被均匀地拉伸两倍再折叠，进入满混沌。' },
        { id: 'full-3', text: '轨迹永不重复，几乎填满整个区间。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动 mu，看蛛网从收敛到一点，逐渐变得杂乱无章。' },
        { id: 'int-2', text: '再把起点挪动一丁点，观察时间序列如何面目全非。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '帐篷映射用两段直线，演示了拉伸与折叠的混沌机制。' },
        { id: 'sum-2', text: 'mu 等于二时达到满混沌，对初值极其敏感。' },
        { id: 'sum-3', text: '最简单的折线里藏着最深的混沌，我们下次再见！' },
      ],
    },
  ],
}
