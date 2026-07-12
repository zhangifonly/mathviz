import type { NarrationScript } from '../types'

/**
 * 指数与对数 - 口播稿件
 * 核心概念：指数增长、对数、互为反函数、关于 y=x 对称、换底公式
 * 目标受众：高中以上
 */
export const exponentialLogNarration: NarrationScript = {
  id: 'exponential-log',
  title: '指数与对数',
  subtitle: '互为反函数的一对孪生曲线',
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
    '理解指数函数的爆炸式增长',
    '理解对数是指数的逆运算',
    '观察两条曲线关于直线 y 等于 x 对称',
    '掌握换底公式与对数的实际意义',
  ],

  prerequisites: ['了解乘方运算', '了解函数图像'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有一种增长快得惊人，一张纸对折二十次，厚度就能超过一百米。' },
        { id: 'intro-2', text: '这背后是指数函数，每一步都在成倍地放大。' },
        { id: 'intro-3', text: '而它还有一个形影不离的伙伴，叫做对数，专门用来把这种疯狂增长拉回人类的尺度。' },
      ],
    },
    {
      id: 'exp-concept',
      type: 'concept',
      title: '指数函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'exp-1', text: '指数函数写作 y 等于 a 的 x 次方，这里的 a 叫底数。' },
        { id: 'exp-2', text: '当底数大于一，x 每增加一，y 就乘上一个固定的倍数，曲线一路陡峭上扬。' },
        { id: 'exp-3', text: '如果底数小于一，比如二分之一，曲线就反过来一路衰减，这正是放射性衰变的样子。' },
      ],
    },
    {
      id: 'log-concept',
      type: 'concept',
      title: '对数与反函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'log-1', text: '对数问的是一个逆问题：底数的几次方才能得到某个数。' },
        { id: 'log-2', text: '所以对数正是指数的反函数，把它们画在一起，两条曲线关于直线 y 等于 x 完美对称。' },
        { id: 'log-3', text: '这条对称轴就像一面镜子，指数曲线上的每个点，都能在对数曲线上找到镜像。' },
        { id: 'log-4', text: '换底公式告诉我们，任何底数的对数，都可以用自然对数相除来计算。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的底数，看看曲线的陡峭程度如何随之改变。' },
        { id: 'int-2', text: '打开对称轴，盯住任意一点，感受指数与对数互为镜像的关系。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '指数函数刻画成倍的增长或衰减，对数则是它的逆运算。' },
        { id: 'sum-2', text: '两者关于直线 y 等于 x 对称，是一对互为反函数的孪生曲线。' },
        { id: 'sum-3', text: '从复利到分贝，从地震到 pH 值，它们无处不在，我们下次再见！' },
      ],
    },
  ],
}
