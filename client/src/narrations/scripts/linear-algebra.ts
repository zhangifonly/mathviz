import type { NarrationScript } from '../types'

/**
 * 线性代数实验 - 口播稿件
 *
 * 核心概念：向量空间与线性变换
 * 目标受众：大学本科生，有基础数学知识
 */
export const linearAlgebraNarration: NarrationScript = {
  id: 'linear-algebra',
  title: '线性代数',
  subtitle: '探索向量空间与线性变换',
  difficulty: 'intermediate',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解向量和向量空间的概念',
    '掌握矩阵作为线性变换的几何意义',
    '观察特征值和特征向量的作用',
    '了解线性代数在实际中的应用',
  ],

  prerequisites: [
    '基础代数知识',
    '平面几何基础',
    '函数的概念',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到线性代数实验。',
        },
        {
          id: 'intro-2',
          text: '你有没有想过，3D游戏中的物体是如何旋转和缩放的？',
        },
        {
          id: 'intro-3',
          text: '或者搜索引擎是如何理解网页之间的关系？',
        },
        {
          id: 'intro-4',
          text: '这些问题的答案都与线性代数密切相关。',
        },
      ],
    },
    {
      id: 'concept',
      type: 'concept',
      title: '核心概念',
      lines: [
        {
          id: 'concept-1',
          text: '向量是既有大小又有方向的量，可以表示位移、速度等物理量。',
        },
        {
          id: 'concept-2',
          text: '向量空间是向量的集合，满足加法和数乘的封闭性。',
        },
        {
          id: 'concept-3',
          text: '矩阵可以看作是向量空间之间的线性变换。',
        },
        {
          id: 'concept-4',
          text: '让我们通过可视化来理解这些抽象概念。',
        },
      ],
    },
    {
      id: 'transformation',
      type: 'animation',
      title: '线性变换',
      lines: [
        {
          id: 'trans-1',
          text: '线性变换保持直线和原点不变。',
        },
        {
          id: 'trans-2',
          text: '旋转、缩放、剪切都是线性变换的例子。',
        },
        {
          id: 'trans-3',
          text: '每个线性变换都可以用一个矩阵来表示。',
        },
        {
          id: 'trans-4',
          text: '观察网格如何在变换下发生形变。',
        },
      ],
    },
    {
      id: 'eigen',
      type: 'concept',
      title: '特征值与特征向量',
      lines: [
        {
          id: 'eigen-1',
          text: '特征向量是在变换下只改变长度不改变方向的向量。',
        },
        {
          id: 'eigen-2',
          text: '特征值表示特征向量被拉伸或压缩的倍数。',
        },
        {
          id: 'eigen-3',
          text: '它们揭示了变换的本质特性。',
        },
        {
          id: 'eigen-4',
          text: '在数据分析中，特征值分解是降维的关键工具。',
        },
      ],
    },
    {
      id: 'application',
      type: 'application',
      title: '实际应用',
      lines: [
        {
          id: 'app-1',
          text: '线性代数是现代科技的数学基础。',
        },
        {
          id: 'app-2',
          text: '计算机图形学用矩阵来实现3D渲染和动画。',
        },
        {
          id: 'app-3',
          text: '机器学习中的神经网络本质上是一系列线性变换。',
        },
        {
          id: 'app-4',
          text: '量子力学用线性代数来描述量子态的演化。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      lines: [
        {
          id: 'sum-1',
          text: '今天我们探索了线性代数的核心概念。',
        },
        {
          id: 'sum-2',
          text: '向量和矩阵是描述空间变换的强大工具。',
        },
        {
          id: 'sum-3',
          text: '特征值和特征向量揭示了变换的内在结构。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你建立对线性代数的几何直觉。',
        },
      ],
    },
  ],
}
