import type { NarrationScript } from '../types'

/**
 * 连分数 - 口播稿件
 * 核心概念：连分数展开、渐近分数、最佳有理逼近
 * 目标受众：高中以上
 */
export const continuedFractionNarration: NarrationScript = {
  id: 'continued-fraction',
  title: '连分数',
  subtitle: '用无穷嵌套的分数逼近每一个实数',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解连分数的嵌套分数结构',
    '掌握渐近分数的递推计算',
    '认识连分数是最佳有理逼近',
    '感受黄金比例与圆周率背后的数论之美',
  ],

  prerequisites: ['了解分数与除法', '了解有理数与无理数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们习惯用小数来写一个数，但小数并不是唯一的方式。' },
        { id: 'intro-2', text: '还有一种更深刻的写法，叫做连分数。' },
        { id: 'intro-3', text: '它能揭示一个数最本质的算术结构，甚至告诉我们它有多难被逼近。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '什么是连分数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '连分数把一个数写成：整数部分，加上一分之一，而这个一里又嵌套着下一层。' },
        { id: 'def-2', text: '每一步都取出当前数的整数部分，再对剩下的小数取倒数，继续展开。' },
        { id: 'def-3', text: '有理数会在有限步内精确终止，无理数则会无穷无尽地展开下去。' },
      ],
    },
    {
      id: 'convergent',
      type: 'concept',
      title: '渐近分数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conv-1', text: '每展开到某一层就截断，就得到一个普通分数，叫做渐近分数。' },
        { id: 'conv-2', text: '它们的分子分母遵循一个简洁的递推：新的一项等于系数乘以前一项，再加上前前一项。' },
        { id: 'conv-3', text: '渐近分数会交替地从大于和小于两侧，一步步逼近真实的值。' },
      ],
    },
    {
      id: 'approx',
      type: 'concept',
      title: '最佳逼近',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'apx-1', text: '连分数的渐近分数有一个惊人的性质：在同样大小的分母下，它是最精确的有理逼近。' },
        { id: 'apx-2', text: '圆周率的连分数就给出了二十二分之七，还有精度极高的三百五十五分之一百一十三。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换不同的数试试，看它们的系数序列和逼近速度有多不一样。' },
        { id: 'int-2', text: '黄金比例的系数全是一，所以它收敛最慢，是最难被有理数逼近的数。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '连分数把任意实数写成层层嵌套的分数，展现它的算术骨架。' },
        { id: 'sum-2', text: '渐近分数用最小的分母，给出最好的有理逼近。' },
        { id: 'sum-3', text: '从圆周率到黄金比例，连分数让我们看清数的本性，我们下次再见！' },
      ],
    },
  ],
}
