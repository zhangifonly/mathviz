import type { NarrationScript } from '../types'

/**
 * 曼德博集与朱利亚集 - 口播稿件
 * 核心概念：复迭代 z^2+c、逃逸时间、曼德博集与朱利亚集的对偶关系、自相似分形
 * 目标受众：研究生以上
 */
export const mandelbrotJuliaNarration: NarrationScript = {
  id: 'mandelbrot-julia',
  title: '曼德博与朱利亚集',
  subtitle: '一个平方迭代里生长出的无穷宇宙',
  difficulty: 'expert',
  targetAge: '研究生以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解复迭代 z 平方加 c 的动力学',
    '掌握逃逸时间判据与集合边界的关系',
    '理解曼德博集作为朱利亚集连通性的参数索引',
    '感受分形边界的无穷精细与自相似',
  ],

  prerequisites: ['复数的乘法与模', '迭代与收敛的基本概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '这幅无穷复杂的图案，来自一个短得不能再短的公式。' },
        { id: 'intro-2', text: '取一个复数 z，把它平方，再加上一个常数 c，如此反复。' },
        { id: 'intro-3', text: '就这么一句迭代规则，却生长出数学中最著名的分形。' },
      ],
    },
    {
      id: 'escape',
      type: 'concept',
      title: '逃逸时间',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'escape-1', text: '从零开始迭代，如果这个数列的模始终有界，我们就说 c 属于曼德博集。' },
        { id: 'escape-2', text: '如果模冲破了二，它就会一路奔向无穷，我们记下它逃逸所用的步数。' },
        { id: 'escape-3', text: '把逃逸步数映射成颜色，边界附近便燃起层层叠叠的火焰。' },
      ],
    },
    {
      id: 'julia',
      type: 'concept',
      title: '朱利亚集',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'julia-1', text: '现在反过来，把常数 c 固定住，让初始的 z 扫过整个平面。' },
        { id: 'julia-2', text: '不逃逸的那些初值组成的图案，就是这个 c 对应的朱利亚集。' },
        { id: 'julia-3', text: '每选一个 c，就得到一幅独一无二的朱利亚集。' },
      ],
    },
    {
      id: 'duality',
      type: 'concept',
      title: '深刻的对偶',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'duality-1', text: '曼德博集其实是朱利亚集的一张地图。' },
        { id: 'duality-2', text: '当 c 落在曼德博集内部，朱利亚集是连成一片的；落在外部，它就碎成尘埃。' },
        { id: 'duality-3', text: '所以曼德博集的每一个点，都在诉说另一个世界的连通与否。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的参数 c，看朱利亚集在树枝、螺旋与尘埃之间变形。' },
        { id: 'int-2', text: '不断放大边界，你会发现无穷小处仍藏着完整的自己。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '一条平方迭代，逃逸时间染色，画出了曼德博与朱利亚集。' },
        { id: 'sum-2', text: '曼德博集索引着所有朱利亚集的连通性，简单孕育无穷。' },
        { id: 'sum-3', text: '这就是复动力系统的分形之美，我们下次再见。' },
      ],
    },
  ],
}
