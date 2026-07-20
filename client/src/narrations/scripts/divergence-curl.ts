import type { NarrationScript } from '../types'

/**
 * 散度与旋度 - 口播稿件
 * 核心概念：向量场的源与涡、数值微分度量流动
 * 目标受众：高中及以上
 */
export const divergenceCurlNarration: NarrationScript = {
  id: 'divergence-curl',
  title: '散度与旋度',
  subtitle: '向量场的源与涡',
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
    '理解向量场散度作为源与汇的度量',
    '理解旋度作为旋转强度的度量',
    '认识几种典型向量场的散度旋度特征',
    '感受向量分析描述流动的直观美感',
  ],

  prerequisites: ['了解向量概念', '了解偏导数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '想象一阵风吹过平原，每一点都有一个方向和快慢。' },
        { id: 'intro-2', text: '把每点的风画成一支箭头，就得到一个向量场。' },
        { id: 'intro-3', text: '我们想问：这片风是在往外喷，还是在打旋？' },
      ],
    },
    {
      id: 'divergence',
      type: 'concept',
      title: '散度：源与汇',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'div-1', text: '散度衡量一点是往外发散还是向内汇聚。' },
        { id: 'div-2', text: '散度为正，箭头向四周射出，这里像个源，我们标成红色。' },
        { id: 'div-3', text: '散度为负，箭头向中心涌入，这里像个汇，标成蓝色。' },
      ],
    },
    {
      id: 'curl',
      type: 'concept',
      title: '旋度：涡旋',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'curl-1', text: '旋度衡量一点附近的流动有多爱打转。' },
        { id: 'curl-2', text: '旋度为正是逆时针涡旋，为负则是顺时针。' },
        { id: 'curl-3', text: '放一片小叶子进去，它自转的快慢就是旋度。' },
      ],
    },
    {
      id: 'fields',
      type: 'concept',
      title: '几种典型场',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'field-1', text: '源场只发散不打转，散度正而旋度为零。' },
        { id: 'field-2', text: '旋转场只打转不发散，旋度不零而散度为零。' },
        { id: 'field-3', text: '剪切场看似平直，却藏着一份隐蔽的旋度。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的场，观察标注点的散度与旋度如何变化。' },
        { id: 'int-2', text: '加密网格，箭头越细就越能看清流动的走向。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '散度看源与汇，旋度看涡旋，两者刻画向量场的本质。' },
        { id: 'sum-2', text: '它们是电磁、流体等物理定律的通用语言。' },
        { id: 'sum-3', text: '一喷一转之间，藏着流动世界的秩序，我们下次再见！' },
      ],
    },
  ],
}
