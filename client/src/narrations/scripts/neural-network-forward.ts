import type { NarrationScript } from '../types'

/**
 * 神经网络前向传播 - 口播稿件
 * 核心概念：加权求和、激活函数、逐层传播、非线性
 * 目标受众：高中及以上
 */
export const neuralNetworkForwardNarration: NarrationScript = {
  id: 'neural-network-forward',
  title: '神经网络前向传播',
  subtitle: '信号层层流动',
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
    '理解神经元的加权求和与激活',
    '掌握前向传播逐层计算的过程',
    '认识激活函数带来的非线性',
    '感受简单规则堆叠出的强大表达力',
  ],

  prerequisites: ['了解加权求和', '了解函数概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们的大脑靠上千亿个神经元互相传递信号来思考。' },
        { id: 'intro-2', text: '人工神经网络，正是对这套机制的一次大胆模仿。' },
        { id: 'intro-3', text: '今天我们就跟着一个信号，看它如何在网络里层层流动。' },
      ],
    },
    {
      id: 'neuron',
      type: 'concept',
      title: '一个神经元',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '每个神经元先把上一层的输入乘上各自的权重，再全部加起来。' },
        { id: 'def-2', text: '加上一个偏置后，得到一个总和，我们叫它加权和。' },
        { id: 'def-3', text: '这个和再经过激活函数，就成了这个神经元的输出。' },
      ],
    },
    {
      id: 'propagate',
      type: 'concept',
      title: '逐层传播',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'prop-1', text: '一层的输出，会成为下一层每个神经元的输入。' },
        { id: 'prop-2', text: '就这样从左到右，信号一层接一层地被重新加工。' },
        { id: 'prop-3', text: '走到最后的输出层，网络就给出了它的答案。' },
      ],
    },
    {
      id: 'activation',
      type: 'concept',
      title: '激活函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'act-1', text: 'sigmoid 把任何数都压进零到一之间，像一个平滑的开关。' },
        { id: 'act-2', text: '若只做加权求和，再多层也只是一条直线的组合。' },
        { id: 'act-3', text: '正是激活函数的非线性，让网络能拟合弯弯曲曲的复杂规律。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的输入，观察每个神经元的亮度如何变化。' },
        { id: 'int-2', text: '亮起的强弱，就是信号在这一层被放大或抑制的痕迹。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '神经元做加权求和加偏置，再过激活函数。' },
        { id: 'sum-2', text: '信号逐层前向传播，最终汇成网络的输出。' },
        { id: 'sum-3', text: '简单规则层层堆叠，就有了智能的雏形，我们下次再见！' },
      ],
    },
  ],
}
