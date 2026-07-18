import type { NarrationScript } from '../types'

/**
 * 逻辑回归 - 口播稿件
 * 核心概念：sigmoid、对数损失、梯度下降训练、决策边界
 * 目标受众：高中及以上
 */
export const logisticRegressionNarration: NarrationScript = {
  id: 'logistic-regression',
  title: '逻辑回归',
  subtitle: 'S形函数分类',
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
    '理解逻辑回归如何输出分类概率',
    '认识 sigmoid 函数的形状与作用',
    '了解对数损失作为训练目标',
    '看懂梯度下降如何移动决策边界',
  ],

  prerequisites: ['了解线性函数', '了解概率与坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '给你一堆点，蓝色一类、红色一类，你能画一条线把它们分开吗？' },
        { id: 'intro-2', text: '更进一步，我们不只想说是或否，还想说这个点有多大概率属于红类。' },
        { id: 'intro-3', text: '逻辑回归就是这样一个从数据里学出概率的分类模型。' },
      ],
    },
    {
      id: 'sigmoid',
      type: 'concept',
      title: 'sigmoid 函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sig-1', text: '先算一个线性得分：把坐标乘上权重再相加，得到一个实数。' },
        { id: 'sig-2', text: '再把它送进 sigmoid 函数，这条 S 形曲线会把任意实数压到 0 到 1 之间。' },
        { id: 'sig-3', text: '得分为零时概率恰好是 0.5，这就是分界处。' },
      ],
    },
    {
      id: 'loss',
      type: 'formula',
      title: '对数损失',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'loss-1', text: '怎么衡量预测得好不好？我们用对数损失，也叫交叉熵。' },
        { id: 'loss-2', text: '预测越接近真实标签，损失越小；把红点判成蓝点，就会付出很大代价。' },
      ],
    },
    {
      id: 'gradient',
      type: 'concept',
      title: '梯度下降训练',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'grad-1', text: '训练就是不断调整权重，让总损失一点点变小。' },
        { id: 'grad-2', text: '每一步都沿着梯度反方向走，权重更新等于误差乘以特征再取平均。' },
        { id: 'grad-3', text: '随着权重改变，那条决策边界也在画面上缓缓移动、逐渐摆正。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击单步训练，看背景的概率梯度和黑色边界如何一步步调整。' },
        { id: 'int-2', text: '一直训练到收敛，两类点就被干净利落地分到边界两侧了。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '逻辑回归用 sigmoid 把线性得分变成分类概率。' },
        { id: 'sum-2', text: '以对数损失为目标，靠梯度下降学出最佳的决策边界。' },
        { id: 'sum-3', text: '简单却强大，它是机器学习分类的基石，我们下次再见！' },
      ],
    },
  ],
}
