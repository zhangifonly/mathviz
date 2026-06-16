import type { NarrationScript } from '../types'

/**
 * 反应扩散与图灵斑图 - 口播稿件
 * 核心概念：Gray-Scott 模型，化学反应自组织成图案
 * 目标受众：高中及以上
 */
export const reactionDiffusionNarration: NarrationScript = {
  id: 'reaction-diffusion',
  title: '反应扩散与图灵斑图',
  subtitle: '化学反应如何自组织出动物花纹',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-06-17',
    updatedAt: '2026-06-17',
  },

  objectives: [
    '理解反应扩散系统的基本思想',
    '认识 Gray-Scott 模型的两个方程',
    '理解 feed/kill 参数如何决定图案',
    '了解图灵斑图与生物形态发生',
  ],

  prerequisites: [
    '了解导数与偏导数',
    '了解扩散现象',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '豹子身上的斑点、斑马身上的条纹、热带鱼身上的花纹，它们从何而来？' },
        { id: 'intro-2', text: '1952 年，计算机科学之父图灵提出了一个惊人的猜想：这些花纹源自简单的化学反应。' },
        { id: 'intro-3', text: '只要两种化学物质一边扩散、一边反应，就能自发地组织出复杂而稳定的图案。' },
        { id: 'intro-4', text: '今天我们用 Gray-Scott 模型，亲眼见证花纹从一片混沌中生长出来。' },
      ],
    },
    {
      id: 'model',
      type: 'formula',
      title: '反应扩散方程',
      trigger: { type: 'auto' },
      lines: [
        { id: 'model-1', text: '想象网格上有两种化学物：U 和 V。它们都会向四周扩散，就像墨水在水中散开。', formula: 'D_u \\nabla^2 u,\\quad D_v \\nabla^2 v' },
        { id: 'model-2', text: '同时它们发生反应：一个 U 和两个 V 相遇，会变成三个 V。也就是说 V 能催化自己增殖。', formula: 'U + 2V \\rightarrow 3V' },
        { id: 'model-3', text: '系统还不断补给 U，并按一定速率移除 V，这两个速率叫做 feed 和 kill。', formula: '+f(1-u),\\quad -(f+k)v' },
        { id: 'model-4', text: '把扩散、反应、补给、移除合起来，就是这两个偏微分方程，它们完全决定了图案的命运。' },
      ],
    },
    {
      id: 'patterns',
      type: 'animation',
      title: '图案的诞生',
      trigger: { type: 'auto' },
      lines: [
        { id: 'pat-1', text: '看，中心的一点点扰动，正在向外蔓延、分裂、繁殖，像活的一样。' },
        { id: 'pat-2', text: '这组参数下，V 不断分裂出新的斑块，最终长成珊瑚般的枝状结构。' },
        { id: 'pat-3', text: '只要把 feed 和 kill 微调一点点，同样的方程就会长出完全不同的花纹。' },
        { id: 'pat-4', text: '有的变成豹纹般的斑点，有的变成斑马般的条纹，还有的变成蜿蜒的迷宫。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '动手探索',
      trigger: { type: 'auto' },
      lines: [
        { id: 'int-1', text: '现在你可以切换不同的图案类型，看看珊瑚、斑点、条纹、迷宫各自如何生长。' },
        { id: 'int-2', text: '点击重新生长，每一次随机种子都会演化出独一无二、却又似曾相识的图案。' },
        { id: 'int-3', text: '试着体会：相同的规律，不同的初值，造就了大自然里没有两只完全相同的斑马。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结回顾',
      trigger: { type: 'auto' },
      lines: [
        { id: 'sum-1', text: '我们看到，扩散加上反应这两件简单的事，就能凭空生出秩序井然的花纹。' },
        { id: 'sum-2', text: '图灵的洞见跨越了数学、化学与生物学，至今仍在解释贝壳、皮毛乃至胚胎的形成。' },
        { id: 'sum-3', text: '简单规则，无穷之美。这正是数学最迷人的地方。继续探索吧！' },
      ],
    },
  ],
}
