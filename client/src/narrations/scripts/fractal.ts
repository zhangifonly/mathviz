import type { NarrationScript } from '../types'

/**
 * 分形几何实验 - 口播稿件
 *
 * 核心概念：自相似性与无限复杂性
 * 目标受众：高中生及以上，有基础几何知识
 */
export const fractalNarration: NarrationScript = {
  id: 'fractal',
  title: '分形几何',
  subtitle: '探索自然界中的无限复杂性',
  difficulty: 'intermediate',
  targetAge: '高中及以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解分形的自相似性特征',
    '掌握分形维数的概念',
    '观察曼德博集合的美丽结构',
    '了解分形在自然界中的体现',
  ],

  prerequisites: [
    '基础几何知识',
    '复数的基本概念',
    '迭代的概念',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到分形几何实验。',
        },
        {
          id: 'intro-2',
          text: '你有没有注意过，海岸线的形状在不同尺度下看起来都很相似？',
        },
        {
          id: 'intro-3',
          text: '或者树枝的分叉方式，与整棵树的形状惊人地相似？',
        },
        {
          id: 'intro-4',
          text: '这种自相似性，正是分形几何研究的核心。',
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
          text: '分形是一种具有自相似性的几何图形，无论放大多少倍，都能看到相似的结构。',
        },
        {
          id: 'concept-2',
          text: '与传统几何不同，分形的维数可以是非整数，比如1.26维或2.58维。',
        },
        {
          id: 'concept-3',
          text: '这个概念由数学家曼德博在1975年提出，彻底改变了我们对几何的理解。',
        },
        {
          id: 'concept-4',
          text: '让我们从最简单的分形开始探索。',
        },
      ],
    },
    {
      id: 'koch',
      type: 'animation',
      title: '科赫雪花',
      lines: [
        {
          id: 'koch-1',
          text: '科赫雪花是最经典的分形之一。',
        },
        {
          id: 'koch-2',
          text: '它的构造很简单：取一条线段，将中间三分之一替换成等边三角形的两边。',
        },
        {
          id: 'koch-3',
          text: '然后对每条新线段重复这个过程，无限次。',
        },
        {
          id: 'koch-4',
          text: '神奇的是，科赫雪花的周长是无限的，但面积却是有限的。',
        },
      ],
    },
    {
      id: 'mandelbrot',
      type: 'animation',
      title: '曼德博集合',
      lines: [
        {
          id: 'mandel-1',
          text: '现在让我们欣赏分形世界中最著名的图形：曼德博集合。',
        },
        {
          id: 'mandel-2',
          text: '它由一个简单的迭代公式生成：z等于z的平方加c。',
        },
        {
          id: 'mandel-3',
          text: '黑色区域是使迭代保持有界的复数c的集合。',
        },
        {
          id: 'mandel-4',
          text: '放大边界，你会发现无穷无尽的精细结构，每一处都蕴含着整体的影子。',
        },
      ],
    },
    {
      id: 'nature',
      type: 'application',
      title: '自然中的分形',
      lines: [
        {
          id: 'nature-1',
          text: '分形不仅是数学抽象，它们无处不在于自然界中。',
        },
        {
          id: 'nature-2',
          text: '树木的分枝、河流的支流、血管的网络，都呈现分形结构。',
        },
        {
          id: 'nature-3',
          text: '闪电的路径、山脉的轮廓、云朵的形状，也都是分形。',
        },
        {
          id: 'nature-4',
          text: '大自然似乎偏爱用分形来构建复杂的结构。',
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
          text: '今天我们探索了分形几何的奇妙世界。',
        },
        {
          id: 'sum-2',
          text: '分形告诉我们，简单的规则可以创造出无限复杂的美。',
        },
        {
          id: 'sum-3',
          text: '它们连接了数学与自然，揭示了隐藏在复杂性背后的秩序。',
        },
        {
          id: 'sum-4',
          text: '希望你能继续探索这个迷人的数学领域。',
        },
      ],
    },
  ],
}
