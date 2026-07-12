import type { NarrationScript } from '../types'

/**
 * 沃罗诺伊图 - 口播稿件
 * 核心概念：最近邻划分、德劳内三角、自然界的细胞几何
 * 目标受众：高中及以上
 */
export const voronoiNarration: NarrationScript = {
  id: 'voronoi',
  title: '沃罗诺伊图',
  subtitle: '最近邻划分，自然界的细胞几何',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-06-23',
    updatedAt: '2026-06-23',
  },

  objectives: [
    '理解沃罗诺伊图的最近邻划分定义',
    '认识它在自然界与工程中的广泛存在',
    '了解与德劳内三角剖分的对偶关系',
    '感受简单规则生成的有机美感',
  ],

  prerequisites: ['了解距离概念', '了解平面坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '想象一片平原上散布着几座城市。' },
        { id: 'intro-2', text: '现在问：平原上每一点，离哪座城市最近？' },
        { id: 'intro-3', text: '把答案相同的点涂成一种颜色，平面就被划分成一块块区域。' },
        { id: 'intro-4', text: '这就是沃罗诺伊图，一种既数学又自然的优美结构。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '最近邻划分',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '每个站点拥有一块领地，里面所有点到它的距离，都比到其他站点更近。' },
        { id: 'def-2', text: '两块领地的边界，正好是两个站点连线的垂直平分线。' },
        { id: 'def-3', text: '站点越多，划分出的多边形就越细密。' },
      ],
    },
    {
      id: 'nature',
      type: 'concept',
      title: '自然界的身影',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'nat-1', text: '长颈鹿身上的花纹，蜻蜓翅膀的脉络，都接近沃罗诺伊结构。' },
        { id: 'nat-2', text: '蜂巢、肥皂泡、干裂的泥土，也都在用最经济的方式分割空间。' },
        { id: 'nat-3', text: '大自然反复选择这种结构，因为它高效而稳定。' },
      ],
    },
    {
      id: 'apply',
      type: 'concept',
      title: '工程应用',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'app-1', text: '手机基站的覆盖范围、最近超市的划分，都用沃罗诺伊图建模。' },
        { id: 'app-2', text: '它的对偶图叫德劳内三角剖分，是网格生成和地形建模的基石。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整站点数量，看分区如何从粗糙变得细密。' },
        { id: 'int-2', text: '点击重新随机，每一次都生成一幅独一无二的细胞图案。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '沃罗诺伊图按最近站点把平面划分成多边形领地。' },
        { id: 'sum-2', text: '它遍布自然与工程，对偶于德劳内三角剖分。' },
        { id: 'sum-3', text: '一个简单的最近原则，画出大自然的几何，我们下次再见！' },
      ],
    },
  ],
}
