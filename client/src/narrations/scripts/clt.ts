/**
 * 中心极限定理讲解稿件
 * 适合高中生（15-18岁）
 */

import type { NarrationScript } from '../types'

export const cltNarration: NarrationScript = {
  id: 'clt',
  title: '中心极限定理',
  subtitle: '为什么正态分布无处不在',
  targetAge: '高中 15-18岁',
  difficulty: 'intermediate',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-03',
    updatedAt: '2025-01-03',
  },

  objectives: [
    '理解中心极限定理的内容',
    '通过模拟直观感受定理的含义',
    '了解样本量对分布形状的影响',
    '认识中心极限定理的重要性',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到中心极限定理实验！这是统计学中最重要的定理之一。',
        },
        {
          id: 'intro-2',
          text: '你有没有注意到，很多自然现象都服从正态分布，也就是钟形曲线？',
        },
        {
          id: 'intro-3',
          text: '身高、考试成绩、测量误差……为什么都是这个形状？中心极限定理给出了答案。',
        },
      ],
    },
    {
      id: 'theorem',
      type: 'concept',
      title: '定理内容',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'theorem-1',
          text: '中心极限定理说：大量独立随机变量的和，近似服从正态分布。',
        },
        {
          id: 'theorem-2',
          text: '更准确地说，无论原始分布是什么形状，样本均值的分布都趋向正态分布。',
        },
        {
          id: 'theorem-3',
          text: '样本量越大，这个近似就越精确。',
        },
        {
          id: 'theorem-4',
          text: '这就解释了为什么正态分布在自然界中如此普遍。',
        },
      ],
    },
    {
      id: 'dice-example',
      type: 'example',
      title: '掷骰子实验',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'dice-example-1',
          text: '让我们用掷骰子来理解这个定理。',
        },
        {
          id: 'dice-example-2',
          text: '掷一个骰子，点数是 1 到 6 的均匀分布，不是正态分布。',
        },
        {
          id: 'dice-example-3',
          text: '但如果掷两个骰子求和，分布就开始有点像三角形了。',
        },
        {
          id: 'dice-example-4',
          text: '掷更多骰子求和，分布会越来越接近正态分布。',
        },
      ],
    },
    {
      id: 'simulation',
      type: 'animation',
      title: '模拟演示',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'simulation-1',
          text: '图中显示的是样本均值的分布。',
        },
        {
          id: 'simulation-2',
          text: '调整样本量 n，观察分布形状的变化。',
        },
        {
          id: 'simulation-3',
          text: '当 n 很小时，分布可能很不规则。',
        },
        {
          id: 'simulation-4',
          text: '随着 n 增大，分布越来越接近正态分布的钟形曲线。',
        },
      ],
    },
    {
      id: 'different-distributions',
      type: 'interaction',
      title: '不同原始分布',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'different-distributions-1',
          text: '中心极限定理的神奇之处在于，它对几乎任何原始分布都成立。',
        },
        {
          id: 'different-distributions-2',
          text: '选择不同的原始分布：均匀分布、指数分布、甚至双峰分布。',
        },
        {
          id: 'different-distributions-3',
          text: '无论原始分布多么奇怪，样本均值的分布都会趋向正态。',
        },
        {
          id: 'different-distributions-4',
          text: '这就是中心极限定理的普适性。',
        },
      ],
    },
    {
      id: 'parameters',
      type: 'formula',
      title: '均值和方差',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'parameters-1',
          text: '中心极限定理还告诉我们样本均值的参数。',
        },
        {
          id: 'parameters-2',
          text: '样本均值的期望等于总体均值 μ。',
        },
        {
          id: 'parameters-3',
          text: '样本均值的标准差等于总体标准差 σ 除以根号 n。',
        },
        {
          id: 'parameters-4',
          text: '这意味着样本量越大，样本均值的波动越小。',
        },
      ],
    },
    {
      id: 'sample-size',
      type: 'concept',
      title: '样本量的影响',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'sample-size-1',
          text: '样本量 n 对近似效果有重要影响。',
        },
        {
          id: 'sample-size-2',
          text: '一般来说，n 大于 30 时，正态近似就相当好了。',
        },
        {
          id: 'sample-size-3',
          text: '如果原始分布本身就接近正态，更小的 n 就足够了。',
        },
        {
          id: 'sample-size-4',
          text: '如果原始分布很偏斜，可能需要更大的 n。',
        },
      ],
    },
    {
      id: 'applications',
      type: 'application',
      title: '实际应用',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'applications-1',
          text: '中心极限定理是统计推断的基础。',
        },
        {
          id: 'applications-2',
          text: '它让我们可以用正态分布来构造置信区间和假设检验。',
        },
        {
          id: 'applications-3',
          text: '质量控制中，产品尺寸的平均值服从正态分布。',
        },
        {
          id: 'applications-4',
          text: '民意调查中，样本比例的分布也近似正态。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'summary-1',
          text: '让我们总结一下今天学到的内容。',
        },
        {
          id: 'summary-2',
          text: '中心极限定理说，样本均值的分布趋向正态分布。',
        },
        {
          id: 'summary-3',
          text: '这个结论与原始分布的形状无关，只要样本量足够大。',
        },
        {
          id: 'summary-4',
          text: '这解释了为什么正态分布在自然界中如此普遍。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对中心极限定理有了更直观的理解！',
        },
      ],
    },
  ],
}
