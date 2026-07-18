import type { NarrationScript } from '../types'

/**
 * Stern-Brocot 树 - 口播稿件
 * 核心概念：中位数生成、既约分数唯一、连分数联系
 * 目标受众：高中及以上
 */
export const sternBrocotNarration: NarrationScript = {
  id: 'stern-brocot',
  title: 'Stern-Brocot树',
  subtitle: '生成所有既约分数',
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
    '理解用中位数在 0/1 与 1/0 之间递归生成分数',
    '认识每个既约分数在树中恰好出现一次',
    '了解树中路径与连分数展开的对应关系',
    '感受一条简单规则如何井然有序地排列所有分数',
  ],

  prerequisites: ['了解分数与既约', '了解二叉树的基本形状'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '所有的正分数，能不能一个不漏地排成一棵树？' },
        { id: 'intro-2', text: '答案是可以，这棵树叫做 Stern-Brocot 树。' },
        { id: 'intro-3', text: '它从两个最简单的边界出发：零分之一，和一分之零。' },
        { id: 'intro-4', text: '在它们之间，一条规则就长出了全部分数。' },
      ],
    },
    {
      id: 'mediant',
      type: 'concept',
      title: '中位数生成',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '两个分数的中位数，就是把分子相加、分母相加。' },
        { id: 'def-2', text: '零一和一零的中位数，是一分之一，正好落在它们中间，成为树根。' },
        { id: 'def-3', text: '再对左右两段各取中位数，就分出下一层，如此递归生长。' },
      ],
    },
    {
      id: 'reduced',
      type: 'concept',
      title: '既约且唯一',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'red-1', text: '神奇的是，这样生成的每个分数，天生就是既约的。' },
        { id: 'red-2', text: '分子分母永远互质，用不着再约分。' },
        { id: 'red-3', text: '而且每个正既约分数都恰好出现一次，不重复也不遗漏。' },
      ],
    },
    {
      id: 'cf',
      type: 'concept',
      title: '与连分数的联系',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cf-1', text: '从树根往下走，每一步只有向左或向右两种选择。' },
        { id: 'cf-2', text: '这串左右指令，恰好就是这个分数的连分数展开。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '展开更多层，看分数如何一层层细密地铺满数轴。' },
        { id: 'int-2', text: '注意每一层的分数，都被上一层的中位数整齐地隔开。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '中位数规则，把全部既约分数排成一棵有序的树。' },
        { id: 'sum-2', text: '每个分数唯一现身，路径又暗合连分数。' },
        { id: 'sum-3', text: '简单的相加，装下了无穷的分数世界，我们下次再见！' },
      ],
    },
  ],
}
