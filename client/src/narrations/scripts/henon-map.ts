import type { NarrationScript } from '../types'

/**
 * 埃农映射 - 口播稿件
 * 核心概念：二维离散动力系统、混沌、分形吸引子、自相似
 * 目标受众：高中及以上
 */
export const henonMapNarration: NarrationScript = {
  id: 'henon-map',
  title: '埃农映射',
  subtitle: '二维混沌吸引子',
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
    '理解埃农映射的二维迭代公式',
    '认识轨道如何收敛到奇异吸引子',
    '观察吸引子的自相似分形结构',
    '体会简单规则孕育复杂混沌',
  ],

  prerequisites: ['了解平面坐标', '了解迭代与函数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有些最简单的式子，却能画出最复杂的图案。' },
        { id: 'intro-2', text: '一条抛物线加一点点收缩，反复迭代，会发生什么？' },
        { id: 'intro-3', text: '答案是一片既杂乱又有序的点云，这就是埃农吸引子。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '埃农映射',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '埃农映射用两条公式把平面上的一点送到新位置。' },
        { id: 'def-2', text: '新的横坐标是一减去 a 乘以 x 的平方，再加上 y。' },
        { id: 'def-3', text: '新的纵坐标则是 b 乘以旧的横坐标，经典取 a 等于一点四，b 等于零点三。' },
      ],
    },
    {
      id: 'attractor',
      type: 'concept',
      title: '收敛到吸引子',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'att-1', text: '从任意一点出发，前几步会四处游荡，这叫暂态。' },
        { id: 'att-2', text: '丢掉暂态后，所有轨道都被吸进同一个形状里，无论从哪出发。' },
        { id: 'att-3', text: '这个逃不出去的形状，就叫做吸引子。' },
      ],
    },
    {
      id: 'fractal',
      type: 'concept',
      title: '分形结构',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'frac-1', text: '放大吸引子的任意一条曲线，会发现它其实由更多细线组成。' },
        { id: 'frac-2', text: '再放大，细线里还有细线，这种自我重复就是分形。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整参数 a，看吸引子如何被拉伸或折叠。' },
        { id: 'int-2', text: '改变参数 b，观察点云从聚拢到散开的变化。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '埃农映射用两条简单公式反复迭代平面上的点。' },
        { id: 'sum-2', text: '轨道收敛到一个自相似的分形吸引子。' },
        { id: 'sum-3', text: '简单孕育复杂，这正是混沌之美，我们下次再见！' },
      ],
    },
  ],
}
