import type { NarrationScript } from '../types'

/**
 * 决策树 - 口播稿件
 * 核心概念：信息熵、信息增益、贪心分裂、轴对齐区域
 * 目标受众：高中及以上
 */
export const decisionTreeNarration: NarrationScript = {
  id: 'decision-tree',
  title: '决策树',
  subtitle: '按信息增益分裂',
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
    '理解用信息熵衡量数据的混乱程度',
    '理解按信息增益选择最佳分裂',
    '认识决策树如何把平面切成轴对齐区域',
    '感受简单规则带来的可解释分类',
  ],

  prerequisites: ['了解概率与比例', '了解平面坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '猜一个东西，我们常常靠一连串的提问。' },
        { id: 'intro-2', text: '它在左边还是右边？在上边还是下边？' },
        { id: 'intro-3', text: '每问一个问题，可能的答案就少一批。' },
        { id: 'intro-4', text: '决策树，正是把这种层层提问自动化的分类方法。' },
      ],
    },
    {
      id: 'entropy',
      type: 'concept',
      title: '信息熵',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ent-1', text: '先要量一量：一堆数据到底有多混乱？' },
        { id: 'ent-2', text: '两类各占一半时最混乱，信息熵等于一。' },
        { id: 'ent-3', text: '全是同一类时最干净，信息熵等于零。' },
      ],
    },
    {
      id: 'gain',
      type: 'concept',
      title: '信息增益选分裂',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gain-1', text: '一次分裂，就是画一条横线或竖线，把点分成两边。' },
        { id: 'gain-2', text: '分裂前的熵，减去分裂后两边的加权熵，就是信息增益。' },
        { id: 'gain-3', text: '我们贪心地挑增益最大的那一刀，让两边尽量变纯。' },
      ],
    },
    {
      id: 'region',
      type: 'concept',
      title: '轴对齐区域',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'reg-1', text: '每一刀都平行于坐标轴，于是平面被切成一块块矩形。' },
        { id: 'reg-2', text: '每块矩形对应一个叶子，落进去就按里面的多数类预测。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调大树的深度，看区域怎样越切越细。' },
        { id: 'int-2', text: '太深会紧贴每个点，那就是过拟合的样子。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '决策树用信息熵度量混乱，用信息增益挑最佳分裂。' },
        { id: 'sum-2', text: '一刀刀轴对齐的切分，拼出可解释的分类区域。' },
        { id: 'sum-3', text: '简单的提问，串成聪明的判断，我们下次再见！' },
      ],
    },
  ],
}
