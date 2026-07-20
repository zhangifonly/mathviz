import type { NarrationScript } from '../types'

/**
 * 克拉默法则 - 口播稿件
 * 核心概念：行列式之比求解线性方程组、替换列、面积比的几何解释
 * 目标受众：高中及以上
 */
export const cramersRuleNarration: NarrationScript = {
  id: 'cramers-rule',
  title: '克拉默法则',
  subtitle: '行列式之比解方程',
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
    '掌握用行列式之比求解线性方程组的方法',
    '理解替换列构造 A_i 的过程',
    '认识行列式作为面积的几何意义',
    '知道系数行列式为零时解的存在性',
  ],

  prerequisites: ['了解二元一次方程组', '了解行列式的定义'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '解方程组，我们习惯消元或者代入。' },
        { id: 'intro-2', text: '但还有一种优雅的方法，直接用行列式写出答案。' },
        { id: 'intro-3', text: '它就是克拉默法则，把解表示成两个行列式的比值。' },
      ],
    },
    {
      id: 'rule',
      type: 'concept',
      title: '克拉默法则',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rule-1', text: '对方程组 A 乘 x 等于 b，先算系数行列式 det A。' },
        { id: 'rule-2', text: '只要 det A 不为零，方程组就有唯一解。' },
        { id: 'rule-3', text: '每个未知数 x_i，等于一个新行列式除以 det A。' },
      ],
    },
    {
      id: 'replace',
      type: 'concept',
      title: '替换列',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rep-1', text: '这个新行列式怎么来？把 A 的第 i 列换成常数向量 b。' },
        { id: 'rep-2', text: '换列后的矩阵记作 A_i，它的行列式就是分子。' },
        { id: 'rep-3', text: '于是 x_i 等于 det A_i 除以 det A，简洁又对称。' },
      ],
    },
    {
      id: 'geometry',
      type: 'concept',
      title: '面积比的几何',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'geo-1', text: '行列式的绝对值，正是列向量张成的平行四边形面积。' },
        { id: 'geo-2', text: '替换一列，相当于把一条边换个方向，面积随之改变。' },
        { id: 'geo-3', text: '所以解的每个分量，本质上是两块面积的比值。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的方程组，看两条直线的交点如何移动。' },
        { id: 'int-2', text: '拖动首个系数，交点也就是解会随之滑动。' },
        { id: 'int-3', text: '当两线趋于平行，det A 趋近零，解也随之失控。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '克拉默法则用行列式之比，直接写出方程组的解。' },
        { id: 'sum-2', text: '替换列构造分子，系数行列式作分母，几何上是面积比。' },
        { id: 'sum-3', text: '一个行列式的比值，藏着方程的答案，我们下次再见！' },
      ],
    },
  ],
}
