import type { NarrationScript } from '../types'

/**
 * K 近邻分类 - 口播稿件
 * 核心概念：距离度量、最近 k 个邻居、多数投票、决策边界、k 的影响
 * 目标受众：高中及以上
 */
export const knnNarration: NarrationScript = {
  id: 'knn',
  title: 'K近邻分类',
  subtitle: '最近邻居投票',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解 KNN 用距离寻找最近邻的思想',
    '掌握多数投票如何决定类别',
    '认识 k 的取值如何改变决策边界',
    '体会惰性学习无需训练的特点',
  ],

  prerequisites: ['了解平面坐标', '了解距离概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '俗话说，物以类聚，人以群分。' },
        { id: 'intro-2', text: '想判断一个陌生人属于哪个圈子，看看他身边的朋友就大概知道了。' },
        { id: 'intro-3', text: '机器学习里最直白的分类器，正是用这个朴素的想法。' },
      ],
    },
    {
      id: 'distance',
      type: 'concept',
      title: '距离与最近邻',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'dist-1', text: '我们先把每个已知类别的样本，画在平面上，用颜色区分类别。' },
        { id: 'dist-2', text: '来了一个待分类的新点，就计算它到每个样本的距离。' },
        { id: 'dist-3', text: '挑出距离最近的 k 个样本，它们就是这个新点的邻居。' },
      ],
    },
    {
      id: 'vote',
      type: 'concept',
      title: '多数投票',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'vote-1', text: '接下来让这 k 个邻居投票，各自报出自己的类别。' },
        { id: 'vote-2', text: '哪个类别的票数最多，新点就归到哪一类。' },
        { id: 'vote-3', text: '整个过程不需要训练，只要记住全部样本，所以叫惰性学习。' },
      ],
    },
    {
      id: 'boundary',
      type: 'concept',
      title: 'k 的影响',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'bnd-1', text: '把平面上每一点都分类一遍，颜色的交界就是决策边界。' },
        { id: 'bnd-2', text: 'k 很小时边界锯齿分明，容易被个别噪声点带偏。' },
        { id: 'bnd-3', text: 'k 变大时投票更稳健，边界随之变得平滑。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着调整 k 的大小，观察决策边界怎样从破碎走向平滑。' },
        { id: 'int-2', text: '再移动那个查询点，看看它的 k 个邻居和预测类别如何变化。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'KNN 靠距离找出最近的 k 个邻居，再由多数投票定类别。' },
        { id: 'sum-2', text: 'k 越大边界越平滑，选择合适的 k 是使用它的关键。' },
        { id: 'sum-3', text: '简单却好用，这就是近邻的智慧，我们下次再见！' },
      ],
    },
  ],
}
