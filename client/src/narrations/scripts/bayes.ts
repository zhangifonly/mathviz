/**
 * 贝叶斯定理讲解稿件
 * 适合高中生（15-18岁）
 */

import type { NarrationScript } from '../types'

export const bayesNarration: NarrationScript = {
  id: 'bayes',
  title: '贝叶斯定理',
  subtitle: '用证据更新信念',
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
    '理解条件概率的概念',
    '掌握贝叶斯定理的公式和含义',
    '学会用贝叶斯定理解决实际问题',
    '了解贝叶斯思维在决策中的应用',
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
          text: '欢迎来到贝叶斯定理实验！今天我们要学习一种强大的推理方法。',
        },
        {
          id: 'intro-2',
          text: '想象你是一名医生，病人的检测结果呈阳性，他真的患病的概率是多少？',
        },
        {
          id: 'intro-3',
          text: '答案可能会让你惊讶。贝叶斯定理帮助我们正确地思考这类问题。',
        },
      ],
    },
    {
      id: 'conditional-prob',
      type: 'concept',
      title: '条件概率',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'conditional-prob-1',
          text: '首先我们要理解条件概率。',
        },
        {
          id: 'conditional-prob-2',
          text: 'P(A|B) 表示在 B 发生的条件下，A 发生的概率。',
        },
        {
          id: 'conditional-prob-3',
          text: '例如，P(患病|阳性) 表示检测阳性的人中，真正患病的比例。',
        },
        {
          id: 'conditional-prob-4',
          text: '注意，P(A|B) 和 P(B|A) 通常是不同的！',
        },
      ],
    },
    {
      id: 'bayes-formula',
      type: 'formula',
      title: '贝叶斯公式',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'bayes-formula-1',
          text: '贝叶斯定理给出了条件概率的计算公式。',
        },
        {
          id: 'bayes-formula-2',
          text: 'P(A|B) 等于 P(B|A) 乘以 P(A) 除以 P(B)。',
        },
        {
          id: 'bayes-formula-3',
          text: 'P(A) 叫做先验概率，是我们在看到证据之前对 A 的信念。',
        },
        {
          id: 'bayes-formula-4',
          text: 'P(A|B) 叫做后验概率，是看到证据 B 之后更新的信念。',
        },
      ],
    },
    {
      id: 'medical-test',
      type: 'example',
      title: '医学检测例子',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'medical-test-1',
          text: '让我们用一个医学检测的例子来理解贝叶斯定理。',
        },
        {
          id: 'medical-test-2',
          text: '假设某种疾病的患病率是 1%，检测的准确率是 99%。',
        },
        {
          id: 'medical-test-3',
          text: '如果你检测呈阳性，你真正患病的概率是多少？',
        },
        {
          id: 'medical-test-4',
          text: '很多人会说 99%，但正确答案大约只有 50%！',
        },
      ],
    },
    {
      id: 'calculation',
      type: 'animation',
      title: '计算演示',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'calculation-1',
          text: '让我们用贝叶斯定理来计算。',
        },
        {
          id: 'calculation-2',
          text: '在 1000 人中，大约 10 人患病，990 人健康。',
        },
        {
          id: 'calculation-3',
          text: '10 个患病者中，约 10 人检测阳性。990 个健康者中，约 10 人假阳性。',
        },
        {
          id: 'calculation-4',
          text: '所以 20 个阳性中只有 10 个真正患病，概率是 50%。',
        },
      ],
    },
    {
      id: 'base-rate',
      type: 'concept',
      title: '基础率的重要性',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'base-rate-1',
          text: '这个例子说明了基础率的重要性。',
        },
        {
          id: 'base-rate-2',
          text: '因为患病率很低，即使检测很准确，假阳性的绝对数量也可能很大。',
        },
        {
          id: 'base-rate-3',
          text: '忽视基础率是人们常犯的推理错误，叫做基础率谬误。',
        },
        {
          id: 'base-rate-4',
          text: '贝叶斯定理帮助我们避免这种错误。',
        },
      ],
    },
    {
      id: 'interactive',
      type: 'interaction',
      title: '交互探索',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'interactive-1',
          text: '调整图中的参数，观察后验概率如何变化。',
        },
        {
          id: 'interactive-2',
          text: '增加患病率，后验概率会上升。',
        },
        {
          id: 'interactive-3',
          text: '提高检测准确率，后验概率也会上升。',
        },
        {
          id: 'interactive-4',
          text: '但只有当两者都足够高时，阳性结果才真正可靠。',
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
          text: '贝叶斯定理有广泛的应用。',
        },
        {
          id: 'applications-2',
          text: '垃圾邮件过滤器用贝叶斯方法判断邮件是否是垃圾邮件。',
        },
        {
          id: 'applications-3',
          text: '机器学习中，贝叶斯分类器是重要的算法。',
        },
        {
          id: 'applications-4',
          text: '法庭上，DNA 证据的解读也需要贝叶斯推理。',
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
          text: '贝叶斯定理告诉我们如何用新证据更新概率。',
        },
        {
          id: 'summary-3',
          text: '先验概率加上似然比，得到后验概率。',
        },
        {
          id: 'summary-4',
          text: '基础率很重要，不能只看检测准确率。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对贝叶斯定理有了更直观的理解！',
        },
      ],
    },
  ],
}
