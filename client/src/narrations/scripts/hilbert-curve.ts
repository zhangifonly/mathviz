import type { NarrationScript } from '../types'

/**
 * 希尔伯特曲线 - 口播稿件
 * 核心概念：空间填充曲线、递归 U 形拼接、邻近保持、空间索引
 * 目标受众：高中及以上
 */
export const hilbertCurveNarration: NarrationScript = {
  id: 'hilbert-curve',
  title: '希尔伯特曲线',
  subtitle: '空间填充与邻近保持',
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
    '理解一维曲线如何连续填满二维平面',
    '认识希尔伯特曲线的递归 U 形拼接构造',
    '体会邻近保持这一关键性质',
    '了解它在图像与空间索引中的应用',
  ],

  prerequisites: ['了解平面坐标', '了解递归的基本思想'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一条一维的线，能不能填满整个二维的正方形？' },
        { id: 'intro-2', text: '直觉上不可能，可数学家希尔伯特给出了肯定的答案。' },
        { id: 'intro-3', text: '他画出一条连续的曲线，走遍网格里每一个格子而不重复。' },
      ],
    },
    {
      id: 'construct',
      type: 'concept',
      title: '递归 U 形拼接',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '最基础的一阶曲线，就是一个简单的 U 字形，连起四个格子。' },
        { id: 'con-2', text: '升一阶时，把正方形切成四块，每块放一条小 U 形。' },
        { id: 'con-3', text: '再把四条小曲线适当旋转翻转，首尾相接成一条大曲线。' },
      ],
    },
    {
      id: 'locality',
      type: 'concept',
      title: '邻近保持',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'loc-1', text: '这条曲线最迷人的性质，是它的邻近保持。' },
        { id: 'loc-2', text: '沿曲线走，位置相近的两点，在平面上几乎总是紧挨着。' },
        { id: 'loc-3', text: '于是二维的邻近关系，被巧妙地压进了一维的顺序里。' },
      ],
    },
    {
      id: 'apply',
      type: 'concept',
      title: '实际应用',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'app-1', text: '图像处理里，用它扫描像素能让相邻像素在数据流中也相邻。' },
        { id: 'app-2', text: '数据库和地理索引用它把二维坐标编码成一维键，加速范围查询。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整阶数，看曲线如何一层层加密，把正方形填得越来越满。' },
        { id: 'int-2', text: '打开折点，观察渐变色如何标出从起点到终点的遍历顺序。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '希尔伯特曲线用递归拼接，连续填满整个平面。' },
        { id: 'sum-2', text: '它的邻近保持让一维顺序忠实地记住二维的远近。' },
        { id: 'sum-3', text: '简单规则藏着深刻的空间智慧，我们下次再见！' },
      ],
    },
  ],
}
