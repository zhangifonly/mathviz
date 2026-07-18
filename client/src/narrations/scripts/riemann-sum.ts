import type { NarrationScript } from '../types'

/**
 * 黎曼和 - 口播稿件
 * 核心概念：矩形逼近曲线下面积、左/右/中点取样、极限即定积分
 * 目标受众：高中及以上
 */
export const riemannSumNarration: NarrationScript = {
  id: 'riemann-sum',
  title: '黎曼和',
  subtitle: '矩形逼近曲线下面积',
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
    '理解用矩形逼近曲线下面积的思想',
    '区分左端点、右端点、中点三种取样方式',
    '认识分段越多逼近越精确，极限即定积分',
    '在交互中感受黎曼和收敛的过程',
  ],

  prerequisites: ['了解函数图像', '了解面积概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一条曲线和横轴之间，围出了一块弯弯的面积。' },
        { id: 'intro-2', text: '它不是规则的矩形或三角形，怎么算出这块面积呢？' },
        { id: 'intro-3', text: '古老而聪明的办法，是用许多小矩形去把它拼出来。' },
      ],
    },
    {
      id: 'split',
      type: 'concept',
      title: '分割成矩形',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '把区间平均切成 n 段，每一段配一个细长的矩形。' },
        { id: 'def-2', text: '矩形的宽都相同，高则取决于曲线在这一段的取样值。' },
        { id: 'def-3', text: '把所有矩形的面积加起来，就得到一个近似值，这就是黎曼和。' },
      ],
    },
    {
      id: 'sample',
      type: 'concept',
      title: '取样点的选择',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'samp-1', text: '高取在每段的左端点，叫左黎曼和；取在右端点，叫右黎曼和。' },
        { id: 'samp-2', text: '对递增的曲线，左和偏小、右和偏大，一个低估一个高估。' },
        { id: 'samp-3', text: '取在中点的中点和，往往最接近真实面积，误差最小。' },
      ],
    },
    {
      id: 'limit',
      type: 'concept',
      title: '越分越准',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'lim-1', text: '矩形越窄，顶端就越贴合曲线，遗漏和多出的部分都在缩小。' },
        { id: 'lim-2', text: '当分段数趋于无穷，黎曼和收敛到一个确定的值。' },
        { id: 'lim-3', text: '这个极限，正是曲线下面积的准确度量，也就是定积分。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '增大分段数 n，看误差一步步减小,矩形一点点贴紧曲线。' },
        { id: 'int-2', text: '切换左、右、中点三种取样，对比它们逼近真实积分的快慢。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '黎曼和用一排矩形逼近曲线下的面积。' },
        { id: 'sum-2', text: '分得越细越精确，取样方式决定高估还是低估。' },
        { id: 'sum-3', text: '分割到无穷,黎曼和便化作定积分,我们下次再见！' },
      ],
    },
  ],
}
