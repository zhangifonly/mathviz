import type { NarrationScript } from '../types'

/**
 * 矩阵变换 - 口播稿件
 * 核心概念：线性变换、基向量、行列式、奇异矩阵
 * 目标受众：高中以上
 */
export const matrixTransformNarration: NarrationScript = {
  id: 'matrix-transform',
  title: '矩阵变换',
  subtitle: '看 2×2 矩阵如何把整个平面掰弯',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解矩阵是一种线性变换',
    '掌握矩阵的两列就是基向量的落点',
    '理解行列式表示面积缩放与方向',
    '认识行列式为零的奇异变换',
  ],

  prerequisites: ['了解平面坐标', '了解向量'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个矩阵看起来只是几个数字排成的方块，但它其实是一台变形机器。' },
        { id: 'intro-2', text: '给它一个平面，它就能把整个平面拉伸、旋转、错切，甚至压扁。' },
        { id: 'intro-3', text: '接下来，我们就用坐标网格，亲眼看看矩阵到底做了什么。' },
      ],
    },
    {
      id: 'columns',
      type: 'concept',
      title: '矩阵的两列',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'col-1', text: '平面上有两个基向量，i 指向右方，j 指向上方。' },
        { id: 'col-2', text: '矩阵的第一列，就是 i 变换之后落到的新位置。' },
        { id: 'col-3', text: '第二列，则是 j 变换之后的落点。知道这两列，整个变换就确定了。' },
      ],
    },
    {
      id: 'linearity',
      type: 'concept',
      title: '线性的含义',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'lin-1', text: '注意看，变换之后网格线依然保持笔直，而且彼此平行、间距相等。' },
        { id: 'lin-2', text: '原点也始终停在原地不动。这三条，正是线性变换的标志。' },
        { id: 'lin-3', text: '任何一个点的新位置，都可以用它的坐标乘上这两列向量算出来。' },
      ],
    },
    {
      id: 'determinant',
      type: 'concept',
      title: '行列式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'det-1', text: '看这个由 i 和 j 张成的单位正方形，变换后它变成了一个平行四边形。' },
        { id: 'det-2', text: '它的面积相对原来放大或缩小了多少倍，这个倍数就叫行列式。' },
        { id: 'det-3', text: '如果行列式变成负数，说明平面被翻转了，就像照镜子一样左右颠倒。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试试放大两倍，你会看到面积变成四倍，行列式正好等于四。' },
        { id: 'int-2', text: '再试试压扁这个变换，行列式变成零，整个平面被挤成了一条直线。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '矩阵就是线性变换，它的两列记录着基向量变换后的落点。' },
        { id: 'sum-2', text: '行列式告诉我们面积缩放了多少倍，负号则代表方向被翻转。' },
        { id: 'sum-3', text: '从此再看矩阵乘法，你看到的不再是数字，而是流动的空间。我们下次再见！' },
      ],
    },
  ],
}
