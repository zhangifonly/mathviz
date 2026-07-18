import type { NarrationScript } from '../types'

/**
 * 中国剩余定理 - 口播稿件
 * 核心概念：同余方程组、模互质、扩展欧几里得构造解
 * 目标受众：高中及以上
 */
export const chineseRemainderNarration: NarrationScript = {
  id: 'chinese-remainder',
  title: '中国剩余定理',
  subtitle: '物不知数',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解同余方程组的含义',
    '掌握中国剩余定理的模互质前提',
    '了解用扩展欧几里得构造解的方法',
    '感受古算题背后的现代应用',
  ],

  prerequisites: ['了解整除与余数', '了解最大公约数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '韩信点兵，士兵三人一排余二，五人一排余三，七人一排余二。' },
        { id: 'intro-2', text: '不用逐个去数，就能算出队伍最少有多少人。' },
        { id: 'intro-3', text: '这道古老的物不知数问题，藏着一条优美的定理。' },
      ],
    },
    {
      id: 'concept',
      type: 'concept',
      title: '同余方程组',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '每个条件都是一个同余式：x 除以三余二，写作 x 同余于二，模三。' },
        { id: 'def-2', text: '三个条件放在一起，就构成一个同余方程组。' },
        { id: 'def-3', text: '我们要找的，是同时满足所有条件的那个数。' },
      ],
    },
    {
      id: 'coprime',
      type: 'concept',
      title: '模互质前提',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pre-1', text: '定理成立有个关键前提：所有的模必须两两互质。' },
        { id: 'pre-2', text: '三、五、七彼此互质，它们的乘积一百零五，就是解的周期。' },
        { id: 'pre-3', text: '在零到一百零五之间，满足全部条件的解恰好只有一个。' },
      ],
    },
    {
      id: 'construct',
      type: 'formula',
      title: '构造解',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '对每个模，先算出其余模的乘积，再用扩展欧几里得求它的逆元。' },
        { id: 'con-2', text: '把余数、乘积、逆元三者相乘再求和，对总积取模，就得到答案。' },
        { id: 'con-3', text: '这个数正是二十三，韩信的队伍最少二十三人。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块改变每个条件的余数，看数轴上的公共解如何移动。' },
        { id: 'int-2', text: '切换不同的经典问题，红点始终精准落在唯一的解上。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '中国剩余定理把一组同余条件，合并成一个唯一的解。' },
        { id: 'sum-2', text: '从古代点兵到现代密码，它跨越千年依然闪光。' },
        { id: 'sum-3', text: '一道物不知数，藏着数学的深邃与优雅，我们下次再见！' },
      ],
    },
  ],
}
