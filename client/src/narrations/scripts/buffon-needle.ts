import type { NarrationScript } from '../types'

/**
 * 蒲丰投针 - 口播稿件
 * 核心概念：几何概率、相交概率 2/pi、频率估计圆周率
 * 目标受众：高中及以上
 */
export const buffonNeedleNarration: NarrationScript = {
  id: 'buffon-needle',
  title: '蒲丰投针',
  subtitle: '投针估计圆周率',
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
    '理解蒲丰投针的几何概率模型',
    '推导针长等于线距时相交概率为 2/pi',
    '掌握用相交频率反推圆周率的方法',
    '感受随机实验逼近确定常数的魅力',
  ],

  prerequisites: ['了解概率与频率', '了解圆周率与三角函数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '十八世纪，蒲丰提出一个奇妙的问题：随手扔针，也能算出圆周率。' },
        { id: 'intro-2', text: '在地板上画满等距的平行线，把一根针随意抛下去。' },
        { id: 'intro-3', text: '只要数一数针压线的次数，就能逼近那个神秘的 π。' },
      ],
    },
    {
      id: 'setup',
      type: 'concept',
      title: '平行线与针',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '设平行线之间的距离等于针的长度，这是最经典的设定。' },
        { id: 'def-2', text: '每根针的落点，由中心的位置和倾斜的角度共同决定。' },
        { id: 'def-3', text: '如果针的两端跨过了同一条线，我们就说它相交，标成红色。' },
      ],
    },
    {
      id: 'prob',
      type: 'concept',
      title: '相交概率',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'prob-1', text: '对中心位置和角度做积分，可以算出相交的概率恰好是 2 除以 π。' },
        { id: 'prob-2', text: '这个式子里藏着圆周率，正是因为角度在半圆里均匀分布。' },
        { id: 'prob-3', text: '概率里出现 π，为反过来估计 π 埋下了伏笔。' },
      ],
    },
    {
      id: 'estimate',
      type: 'concept',
      title: '频率估计',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'est-1', text: '投针足够多时，相交的频率会稳稳靠近真实概率 2 比 π。' },
        { id: 'est-2', text: '于是把公式倒过来：π 约等于 2 倍投针数除以相交数。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '增加投针的数量，看估计值如何一步步向 3.14159 收敛。' },
        { id: 'int-2', text: '点击重新投一次，每一轮随机都会给出略微不同的答案。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '蒲丰投针用几何概率把随机的针，连到了确定的 π。' },
        { id: 'sum-2', text: '针长等于线距时，相交概率是 2 除以 π。' },
        { id: 'sum-3', text: '随机之中藏着秩序，投针也能量出圆周率，我们下次再见！' },
      ],
    },
  ],
}
