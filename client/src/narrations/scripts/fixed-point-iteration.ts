import type { NarrationScript } from '../types'

/**
 * 不动点迭代 - 口播稿件
 * 核心概念：反复代入、不动点 g(x)=x、蛛网图、收敛条件 |g'|<1
 * 目标受众：高中及以上
 */
export const fixedPointIterationNarration: NarrationScript = {
  id: 'fixed-point-iteration',
  title: '不动点迭代',
  subtitle: '蛛网图与收敛',
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
    '理解不动点迭代反复代入的过程',
    '掌握不动点 g(x)=x 的含义',
    '学会用蛛网图看迭代轨迹',
    '理解收敛条件 |g\'(x*)|<1',
  ],

  prerequisites: ['了解函数与图像', '了解斜率概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '拿出计算器，随便输一个数，反复按余弦键，你会发现结果慢慢稳定下来。' },
        { id: 'intro-2', text: '这种把上一步结果再代回同一个函数的做法，就叫不动点迭代。' },
        { id: 'intro-3', text: '今天我们就来看看，这个反复代入的过程藏着怎样的规律。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '什么是不动点',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '如果一个数代入函数后原地不动，也就是 g(x) 等于 x，我们就叫它不动点。' },
        { id: 'def-2', text: '不动点正是曲线 y 等于 g(x) 与对角线 y 等于 x 的交点。' },
        { id: 'def-3', text: '迭代如果收敛，它的极限一定是一个不动点。' },
      ],
    },
    {
      id: 'cobweb',
      type: 'concept',
      title: '蛛网图',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cob-1', text: '把每一步画出来：竖直走到曲线上，得到 g(x)。' },
        { id: 'cob-2', text: '再水平走到对角线，把这个值当作下一次的输入。' },
        { id: 'cob-3', text: '这样一竖一横反复画，就织出一张像蛛网的轨迹。' },
      ],
    },
    {
      id: 'converge',
      type: 'concept',
      title: '收敛条件',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conv-1', text: '蛛网是螺旋收进交点，还是越甩越远，取决于曲线的斜率。' },
        { id: 'conv-2', text: '当不动点处斜率的绝对值小于一，迭代收敛，蛛网向内盘旋。' },
        { id: 'conv-3', text: '一旦斜率太陡，比如 g(x) 等于 x 平方，蛛网就向外发散跑掉。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一个函数，或拖动步数，看蛛网怎样一步步逼近交点。' },
        { id: 'int-2', text: '对比收敛与发散的例子，感受斜率对命运的决定作用。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '不动点迭代靠反复代入逼近满足 g(x) 等于 x 的不动点。' },
        { id: 'sum-2', text: '蛛网图把这个过程画成一竖一横的轨迹，收敛条件是斜率绝对值小于一。' },
        { id: 'sum-3', text: '简单一个代入，却串起了求解方程的大智慧，我们下次再见！' },
      ],
    },
  ],
}
