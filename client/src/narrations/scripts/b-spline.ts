import type { NarrationScript } from '../types'

/**
 * B样条曲线 - 口播稿件
 * 核心概念：控制点、Cox-de Boor 基函数、局部支撑、与贝塞尔对比
 * 目标受众：高中及以上
 */
export const bSplineNarration: NarrationScript = {
  id: 'b-spline',
  title: 'B样条曲线',
  subtitle: '控制点与基函数',
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
    '理解 B 样条如何由控制点生成光滑曲线',
    '认识 Cox-de Boor 基函数与单位分解',
    '掌握局部支撑这一核心特性',
    '理解 B 样条相比贝塞尔曲线的优势',
  ],

  prerequisites: ['了解平面坐标', '了解函数与加权平均'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '设计字体、汽车曲面、动画路径，都需要又光滑又好控制的曲线。' },
        { id: 'intro-2', text: '如果直接连点，线条会有生硬的折角，并不好看。' },
        { id: 'intro-3', text: '数学家给出的答案之一，就是今天的主角——B 样条曲线。' },
      ],
    },
    {
      id: 'control',
      type: 'concept',
      title: '控制点',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ctrl-1', text: '我们先放下几个控制点，用虚线把它们连成控制多边形。' },
        { id: 'ctrl-2', text: '曲线并不穿过这些控制点，而是被它们像磁铁一样柔和地吸引。' },
        { id: 'ctrl-3', text: '控制点决定曲线的大致走向，曲线却始终保持顺滑。' },
      ],
    },
    {
      id: 'basis',
      type: 'concept',
      title: '基函数与局部支撑',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'basis-1', text: '每个控制点都配一条基函数，作为它在各处的权重。' },
        { id: 'basis-2', text: '这些基函数处处非负，且在每一点上求和恒等于一。' },
        { id: 'basis-3', text: '关键在于：每条基函数只在一小段区间里不为零，这叫局部支撑。' },
      ],
    },
    {
      id: 'compare',
      type: 'concept',
      title: '与贝塞尔对比',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cmp-1', text: '贝塞尔曲线里，动一个控制点，整条曲线都会跟着变。' },
        { id: 'cmp-2', text: '而 B 样条有局部支撑，改一个点只影响附近，远处纹丝不动。' },
        { id: 'cmp-3', text: '这让 B 样条在处理很多控制点的复杂形状时得心应手。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '用鼠标拖动任意一个控制点，看曲线如何随之变形。' },
        { id: 'int-2', text: '注意远端的曲线保持不动，这正是局部支撑的直观体现。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'B 样条用控制点和基函数，拼出一条光滑可控的曲线。' },
        { id: 'sum-2', text: '局部支撑让它比贝塞尔更灵活，是几何设计的基石。' },
        { id: 'sum-3', text: '从字体到曲面，处处都有它的身影，我们下次再见！' },
      ],
    },
  ],
}
