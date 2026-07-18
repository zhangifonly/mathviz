import type { NarrationScript } from '../types'

/**
 * 拉普拉斯算子 - 口播稿件
 * 核心概念：二阶偏导之和、五点模板、邻域平均差、调和函数、热扩散
 * 目标受众：高中及以上
 */
export const laplacianNarration: NarrationScript = {
  id: 'laplacian',
  title: '拉普拉斯算子',
  subtitle: '偏离邻域平均的度量',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解拉普拉斯算子是二阶偏导之和',
    '掌握五点差分模板与邻域平均的关系',
    '认识调和函数 ∇²f=0 的意义',
    '理解热扩散如何抹平局部差异',
  ],

  prerequisites: ['了解偏导数', '了解二阶导数与凹凸'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '站在一片起伏的地形上，问一个简单问题：脚下这一点，比它四周高还是低？' },
        { id: 'intro-2', text: '如果比四周低，你正处在一个小凹坑里；比四周高，就站在一个小鼓包上。' },
        { id: 'intro-3', text: '把这种偏离邻域的程度量化出来，就是拉普拉斯算子。' },
      ],
    },
    {
      id: 'derive',
      type: 'concept',
      title: '二阶偏导之和',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '拉普拉斯算子写作 ∇²f，等于 f 对 x 的二阶偏导加上对 y 的二阶偏导。' },
        { id: 'def-2', text: '二阶导衡量弯曲方向：向上凹为正，向下凸为负。' },
        { id: 'def-3', text: '把两个方向的弯曲加起来，就得到这一点整体的凹凸倾向。' },
      ],
    },
    {
      id: 'stencil',
      type: 'concept',
      title: '五点模板',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sten-1', text: '在网格上用中心差分离散，∇²f 就变成四个邻居之和，减去中心值的四倍。' },
        { id: 'sten-2', text: '这个上下左右加中心的图案，叫做五点模板。' },
        { id: 'sten-3', text: '它还等于四倍的邻域平均减中心值，所以拉普拉斯本质是在问：你偏离周围平均多少。' },
      ],
    },
    {
      id: 'harmonic',
      type: 'concept',
      title: '调和函数与热扩散',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'harm-1', text: '如果处处 ∇²f 等于零，每一点都恰好等于邻域平均，这样的函数叫调和函数。' },
        { id: 'harm-2', text: '调和函数没有局部高峰和低谷，像绷紧的肥皂膜一样光滑。' },
        { id: 'harm-3', text: '热扩散方程 u 加上 α 乘 ∇²u，就是让每点不断向邻域平均靠拢，把差异慢慢抹平。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的函数，看左边的形状如何决定右边的拉普拉斯热力图。' },
        { id: 'int-2', text: '试试调和函数 x²减y²，你会看到右图几乎一片纯白，因为它处处等于邻域平均。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '拉普拉斯算子是二阶偏导之和，度量一点偏离邻域平均的程度。' },
        { id: 'sum-2', text: '五点模板让它可以在网格上计算，调和函数则是它恒为零的特例。' },
        { id: 'sum-3', text: '从热扩散到图像处理，它无处不在。感谢观看，我们下次再见！' },
      ],
    },
  ],
}
