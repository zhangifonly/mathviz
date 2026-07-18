import type { NarrationScript } from '../types'

/**
 * 最大似然估计 - 口播稿件
 * 核心概念：似然函数、对数似然、最大化求 MLE、正态均值闭式解
 * 目标受众：高中及以上
 */
export const maxLikelihoodNarration: NarrationScript = {
  id: 'max-likelihood',
  title: '最大似然估计',
  subtitle: '最可能的参数',
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
    '理解似然函数衡量参数生成数据的可能性',
    '掌握对数似然把连乘化为连加的作用',
    '知道最大化对数似然即得最大似然估计',
    '记住正态均值的 MLE 就是样本均值',
  ],

  prerequisites: ['了解正态分布', '了解对数运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '桌上有一把观测数据，它们像是从某个正态分布里抽出来的。' },
        { id: 'intro-2', text: '可我们并不知道这个分布的均值到底是多少。' },
        { id: 'intro-3', text: '于是要问：哪一个均值参数，最可能生成眼前这批数据？' },
      ],
    },
    {
      id: 'likelihood',
      type: 'concept',
      title: '似然函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'lik-1', text: '固定参数，把每个数据点的概率密度都算出来，再乘到一起。' },
        { id: 'lik-2', text: '这个乘积就是似然，它衡量在该参数下看到这批数据的可能性。' },
        { id: 'lik-3', text: '参数选得越贴合数据，似然值就越大。' },
      ],
    },
    {
      id: 'loglik',
      type: 'concept',
      title: '对数似然',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'log-1', text: '很多小于一的密度连乘，会小到计算机都难以表示。' },
        { id: 'log-2', text: '取对数后，连乘变成连加，数值稳定又好算。' },
        { id: 'log-3', text: '对数是单调递增的，所以峰值的位置丝毫不变。' },
      ],
    },
    {
      id: 'maximize',
      type: 'concept',
      title: '最大化即 MLE',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'max-1', text: '让对数似然最大的那个参数，就是最大似然估计，记作 MLE。' },
        { id: 'max-2', text: '对正态分布的均值求导并令其为零，答案正好是样本均值。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块改变试探的均值，看曲线上的点如何滑离峰顶。' },
        { id: 'int-2', text: '换一个数据集，峰顶会移到新的样本均值那里。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '似然衡量参数生成数据的可能性，取对数便于计算。' },
        { id: 'sum-2', text: '最大化对数似然得到 MLE，正态均值的 MLE 就是样本均值。' },
        { id: 'sum-3', text: '让数据自己说出最可能的参数，这就是最大似然的智慧，我们下次再见！' },
      ],
    },
  ],
}
