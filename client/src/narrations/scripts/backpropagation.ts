import type { NarrationScript } from '../types'

/**
 * 反向传播 - 口播稿件
 * 核心概念：前向传播、损失、链式法则、梯度下降
 * 目标受众：高中及以上
 */
export const backpropagationNarration: NarrationScript = {
  id: 'backpropagation',
  title: '反向传播',
  subtitle: '链式法则求梯度',
  difficulty: 'expert',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解神经网络的前向传播过程',
    '理解损失函数如何衡量预测误差',
    '掌握用链式法则反向求各权重梯度',
    '感受梯度下降如何让损失逐步下降',
  ],

  prerequisites: ['了解导数与偏导', '了解复合函数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个神经网络刚出生时，权重是随机的，几乎什么都不会。' },
        { id: 'intro-2', text: '它却能通过看大量例子，一点点学会识别图像、翻译语言。' },
        { id: 'intro-3', text: '让它学会的核心算法，就是今天的主角：反向传播。' },
      ],
    },
    {
      id: 'forward',
      type: 'concept',
      title: '前向传播',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fwd-1', text: '先看前向传播。输入从左边进来，逐层加权求和再经激活函数。' },
        { id: 'fwd-2', text: '信号一路向右流动，最后在输出层得到网络的预测值。' },
        { id: 'fwd-3', text: '这里我们用一个小小的二二一网络，来学习异或这样的模式。' },
      ],
    },
    {
      id: 'loss',
      type: 'concept',
      title: '衡量误差',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'loss-1', text: '预测出来了，可它对不对呢？我们用损失函数来衡量。' },
        { id: 'loss-2', text: '损失就是预测值和真实目标之间差距的平方，越小说明学得越好。' },
        { id: 'loss-3', text: '训练的目标，就是想办法把这个损失一步步降到最低。' },
      ],
    },
    {
      id: 'backward',
      type: 'concept',
      title: '链式法则反向求梯度',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'back-1', text: '关键问题是：每个权重该往哪个方向、调多少，才能减小损失？' },
        { id: 'back-2', text: '答案是求损失对每个权重的偏导数，也就是梯度。' },
        { id: 'back-3', text: '用链式法则，把输出端的误差沿着连线一层层反向乘回去。' },
        { id: 'back-4', text: '于是误差从右向左流动，每条连线都算出自己那份梯度。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手训练',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点单步训练，观察红蓝箭头标出的梯度，权重沿负梯度更新一次。' },
        { id: 'int-2', text: '再看下方的损失曲线，随着一次次迭代，它稳稳地向下走。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '前向传播算出预测，损失衡量它离目标有多远。' },
        { id: 'sum-2', text: '反向传播用链式法则求出梯度，梯度下降据此更新权重。' },
        { id: 'sum-3', text: '这一前一后的循环，就是深度学习的引擎，我们下次再见！' },
      ],
    },
  ],
}
