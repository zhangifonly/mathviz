import type { NarrationScript } from '../types'

/**
 * 戈斯珀曲线 - 口播稿件
 * 核心概念：L 系统重写、60 度转向、自相似铺砌、填充曲线
 * 目标受众：高中及以上
 */
export const gosperCurveNarration: NarrationScript = {
  id: 'gosper-curve',
  title: '戈斯珀曲线',
  subtitle: '六边形流水曲线',
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
    '理解 L 系统如何用字符串重写生成分形',
    '掌握戈斯珀曲线的重写规则与 60 度转向',
    '认识填充曲线自相似铺砌平面的特性',
    '感受简单规则生成复杂有机图案的魅力',
  ],

  prerequisites: ['了解角度与方向', '了解坐标与递归思想'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有没有一条曲线，能不重叠地填满整片平面？' },
        { id: 'intro-2', text: '戈斯珀曲线就是这样一条神奇的曲线，弯弯绕绕铺满每个角落。' },
        { id: 'intro-3', text: '它的邻域是一块块六边形，像流水一样自然衔接。' },
      ],
    },
    {
      id: 'rule',
      type: 'concept',
      title: 'L 系统重写规则',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '我们从一个字母 A 出发，这叫公理。' },
        { id: 'def-2', text: '每次把 A 换成 A-B--B+A++AA+B，把 B 换成一串对应的指令。' },
        { id: 'def-3', text: '这种字符串重写的生成方式，就是所谓的 L 系统。' },
      ],
    },
    {
      id: 'turn',
      type: 'concept',
      title: '六十度转向',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'turn-1', text: '把字符串当作画笔指令：字母表示向前一步。' },
        { id: 'turn-2', text: '加号左转六十度，减号右转六十度，正是六边形的内角关系。' },
        { id: 'turn-3', text: '一笔一画走下来，曲线就自动拐出六边形的轮廓。' },
      ],
    },
    {
      id: 'tiling',
      type: 'concept',
      title: '自相似铺砌',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tile-1', text: '每迭代一次，前进步数就变成原来的七倍。' },
        { id: 'tile-2', text: '放大局部，你会看到和整体一模一样的形状，这就是自相似。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整迭代阶数，看曲线从粗糙的折线长成致密的填充图案。' },
        { id: 'int-2', text: '阶数越高，六边形的流水感越强，越贴近铺满平面。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '戈斯珀曲线用 L 系统重写规则，加上六十度转向生成。' },
        { id: 'sum-2', text: '它自相似地铺砌平面，是分形几何的经典范例。' },
        { id: 'sum-3', text: '简单规则孕育无穷复杂，这就是数学之美，我们下次再见！' },
      ],
    },
  ],
}
