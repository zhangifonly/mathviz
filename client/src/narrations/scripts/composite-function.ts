import type { NarrationScript } from '../types'

/**
 * 复合函数 - 口播稿件
 * 核心概念：函数套函数、先内后外、次序不可交换
 * 目标受众：高中及以上
 */
export const compositeFunctionNarration: NarrationScript = {
  id: 'composite-function',
  title: '复合函数',
  subtitle: '函数的链式作用',
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
    '理解复合函数 f(g(x)) 的含义',
    '掌握先内层后外层的作用次序',
    '认识复合次序不可随意交换',
    '通过图象观察复合如何改变曲线',
  ],

  prerequisites: ['了解函数概念', '会读函数图象'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一台机器把苹果榨成汁，再来一台机器把汁装进瓶。' },
        { id: 'intro-2', text: '两台机器接力，苹果就一步步变成了瓶装果汁。' },
        { id: 'intro-3', text: '函数也能这样接力：一个的输出，正好是另一个的输入。' },
        { id: 'intro-4', text: '这种函数套函数的组合，就叫做复合函数。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '先内后外',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '复合函数记作 f 圈 g，读作 f 复合 g，写成 f(g(x))。' },
        { id: 'def-2', text: '计算时从里往外：先让内层 g 作用于 x，得到 g(x)。' },
        { id: 'def-3', text: '再把 g(x) 送进外层 f，最终得到 f(g(x))。' },
      ],
    },
    {
      id: 'graph',
      type: 'concept',
      title: '图象如何变化',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gra-1', text: '青色是内层 g，橙色是外层 f，粉色才是复合出的新曲线。' },
        { id: 'gra-2', text: '内层先把 x 弯折伸缩，外层再在此基础上二次塑形。' },
        { id: 'gra-3', text: '于是粉色曲线的形状，往往和单独任何一条都大不相同。' },
      ],
    },
    {
      id: 'order',
      type: 'concept',
      title: '次序很重要',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ord-1', text: '先平方再加一，和先加一再平方，结果并不一样。' },
        { id: 'ord-2', text: '一般来说 f 复合 g 不等于 g 复合 f，交换次序会得到不同的函数。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '选择不同的内层和外层函数，看粉色复合曲线怎样随之改变。' },
        { id: 'int-2', text: '点击演示，跟着箭头看某个 x 如何先经 g 再经 f 走完两步。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '复合函数把两个函数接力：f(g(x)) 先算内层再算外层。' },
        { id: 'sum-2', text: '次序不可随意交换，f 复合 g 通常不等于 g 复合 f。' },
        { id: 'sum-3', text: '学会拆解与组合函数，你就掌握了搭建复杂关系的积木，我们下次再见！' },
      ],
    },
  ],
}
