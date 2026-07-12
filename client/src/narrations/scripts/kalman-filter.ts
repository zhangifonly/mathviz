import type { NarrationScript } from '../types'

/**
 * 卡尔曼滤波 - 口播稿件
 * 核心概念：预测与测量融合、卡尔曼增益、不确定度加权
 * 目标受众：大学以上
 */
export const kalmanFilterNarration: NarrationScript = {
  id: 'kalman-filter',
  title: '卡尔曼滤波',
  subtitle: '在噪声里追踪真相的最优估计',
  difficulty: 'advanced',
  targetAge: '大学以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解卡尔曼滤波如何融合预测与测量',
    '理解卡尔曼增益随不确定度的调节作用',
    '观察置信带随迭代收缩的过程',
    '体会最优估计在工程中的价值',
  ],

  prerequisites: ['了解均值与方差', '了解正态分布'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '想象你在用一个廉价传感器追踪一个移动的物体。' },
        { id: 'intro-2', text: '每次读数都带着噪声，忽高忽低，画出来是一片抖动的散点。' },
        { id: 'intro-3', text: '卡尔曼滤波能从这团噪声里，估计出一条平滑又准确的轨迹。' },
      ],
    },
    {
      id: 'predict',
      type: 'concept',
      title: '预测这一步',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'predict-1', text: '滤波器先根据上一时刻的估计，预测这一时刻物体会在哪里。' },
        { id: 'predict-2', text: '但预测不是免费的，随着时间推移，我们的把握会下降。' },
        { id: 'predict-3', text: '所以预测的不确定度，也就是方差，会加上一份过程噪声而变大。' },
      ],
    },
    {
      id: 'update',
      type: 'concept',
      title: '用测量修正',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'update-1', text: '这时新的测量到了，它虽然带噪声，却包含了真实信息。' },
        { id: 'update-2', text: '滤波器计算预测和测量的差值，也就是新息，再决定该采信多少。' },
        { id: 'update-3', text: '最终的估计，是预测和测量按各自可信度的加权平均。' },
      ],
    },
    {
      id: 'gain',
      type: 'concept',
      title: '卡尔曼增益',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gain-1', text: '这个权重就叫卡尔曼增益，它始终落在零到一之间。' },
        { id: 'gain-2', text: '测量越可靠，增益越接近一，估计就更贴近测量。' },
        { id: 'gain-3', text: '融合之后不确定度必然缩小，所以你会看到置信带一步步收窄。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手调参',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着把过程噪声调小，估计会变得非常平滑，但对突变反应迟钝。' },
        { id: 'int-2', text: '再把它调大，估计会紧紧咬住测量，却也跟着一起抖动。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '卡尔曼滤波用一句话概括，就是按不确定度融合预测与测量。' },
        { id: 'sum-2', text: '预测走一步，测量拉一把，方差不断收缩逼近真值。' },
        { id: 'sum-3', text: '从导航到雷达再到金融，它无处不在，我们下次再见！' },
      ],
    },
  ],
}
