import type { NarrationScript } from '../types'

/**
 * 高斯混合模型 - 口播稿件
 * 核心概念：混合模型、EM 算法、责任度、迭代收敛
 * 目标受众：大学及以上
 */
export const gaussianMixtureNarration: NarrationScript = {
  id: 'gaussian-mixture',
  title: '高斯混合模型',
  subtitle: 'EM算法分离簇',
  difficulty: 'expert',
  targetAge: '大学以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解高斯混合模型如何用多个高斯描述数据',
    '掌握 EM 算法的 E 步与 M 步',
    '认识责任度作为软分配的含义',
    '观察迭代如何逐步收敛到真实簇',
  ],

  prerequisites: ['了解正态分布', '了解概率密度'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '看这堆数据的直方图，它并不像单一的钟形曲线。' },
        { id: 'intro-2', text: '仔细看，里面似乎藏着好几个不同的群。' },
        { id: 'intro-3', text: '可我们只看到混在一起的点，并不知道谁属于哪一群。' },
      ],
    },
    {
      id: 'model',
      type: 'concept',
      title: '混合模型',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '高斯混合模型假设，数据由几个高斯分布按权重混合生成。' },
        { id: 'def-2', text: '每个分量有自己的均值、标准差和一份权重。' },
        { id: 'def-3', text: '把它们加权叠加，就得到那条拟合整体数据的混合曲线。' },
      ],
    },
    {
      id: 'em',
      type: 'concept',
      title: 'EM 算法',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'em-1', text: '难点在于：既不知道分量参数，也不知道每点的归属。' },
        { id: 'em-2', text: 'E 步先假定参数，算出每个点属于各分量的概率，叫做责任度。' },
        { id: 'em-3', text: 'M 步再用责任度加权，重新估计每个分量的均值方差和权重。' },
      ],
    },
    {
      id: 'converge',
      type: 'concept',
      title: '迭代收敛',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conv-1', text: '两步交替进行，对数似然每一轮都不会下降。' },
        { id: 'conv-2', text: '分量像磁铁一样，慢慢滑向数据中各自的簇。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击单步 EM，看每一次迭代分量如何移动、如何收窄。' },
        { id: 'int-2', text: '换一个数据种子，再看算法从零把簇重新分离出来。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '高斯混合模型用若干高斯的加权和刻画复杂数据。' },
        { id: 'sum-2', text: 'EM 算法在 E 步算责任、M 步更新参数间交替逼近。' },
        { id: 'sum-3', text: '简单两步，就让隐藏的簇浮现出来，我们下次再见！' },
      ],
    },
  ],
}
