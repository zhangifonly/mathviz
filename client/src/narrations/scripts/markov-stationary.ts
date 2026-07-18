import type { NarrationScript } from '../types'

/**
 * 马氏链稳态 - 口播稿件
 * 核心概念：行随机转移矩阵、分布迭代、收敛到唯一稳态分布
 * 目标受众：高中及以上
 */
export const markovStationaryNarration: NarrationScript = {
  id: 'markov-stationary',
  title: '马氏链稳态',
  subtitle: '转移矩阵的收敛分布',
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
    '理解行随机转移矩阵的含义',
    '掌握分布随迭代演化的规律',
    '认识稳态分布是特征值 1 对应的分布',
    '体会不同初始分布殊途同归',
  ],

  prerequisites: ['了解概率与百分比', '了解矩阵乘法概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '天气会在晴、阴、雨之间来回切换。' },
        { id: 'intro-2', text: '如果观察足够多天，晴天大约占多少比例？' },
        { id: 'intro-3', text: '这个长期占比，正是马氏链的稳态分布。' },
      ],
    },
    {
      id: 'matrix',
      type: 'concept',
      title: '转移矩阵',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mat-1', text: '把每天转到下一天的概率排成一张表，就是转移矩阵。' },
        { id: 'mat-2', text: '它的每一行之和都是一，因为明天总要落到某个状态。' },
        { id: 'mat-3', text: '比如今天晴，明天有七成继续晴，两成转阴，一成下雨。' },
      ],
    },
    {
      id: 'iterate',
      type: 'concept',
      title: '分布迭代',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'iter-1', text: '把今天的分布左乘转移矩阵，就得到明天的分布。' },
        { id: 'iter-2', text: '反复相乘，分布就一天天向前演化。' },
        { id: 'iter-3', text: '看柱状图，各状态的比例在逐步调整。' },
      ],
    },
    {
      id: 'converge',
      type: 'concept',
      title: '收敛到稳态',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conv-1', text: '迭代几步后，柱状高度几乎不再变化。' },
        { id: 'conv-2', text: '此时分布满足自己乘矩阵还等于自己，这就是稳态。' },
        { id: 'conv-3', text: '它是转移矩阵特征值为一的那个特殊分布，红色虚线标出了它。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一个初始分布，比如从纯雨天出发。' },
        { id: 'int-2', text: '你会发现，无论起点如何，最终都汇聚到同一条虚线。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '行随机矩阵反复作用，分布收敛到唯一的稳态。' },
        { id: 'sum-2', text: '稳态由矩阵本身决定，与出发点无关。' },
        { id: 'sum-3', text: '一张概率表就锁定了长期命运，我们下次再见！' },
      ],
    },
  ],
}
