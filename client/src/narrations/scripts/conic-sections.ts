/**
 * 圆锥曲线讲解稿件
 * 适合高中生（15-18岁）
 */

import type { NarrationScript } from '../types'

export const conicSectionsNarration: NarrationScript = {
  id: 'conic-sections',
  title: '圆锥曲线',
  subtitle: '探索椭圆、双曲线和抛物线',
  targetAge: '高中 15-18岁',
  difficulty: 'intermediate',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-03',
    updatedAt: '2025-01-03',
  },

  objectives: [
    '理解圆锥曲线的几何定义',
    '掌握椭圆、双曲线、抛物线的标准方程',
    '了解离心率的概念和意义',
    '认识圆锥曲线在天文学中的应用',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到圆锥曲线实验！今天我们要探索三种美丽的曲线。',
        },
        {
          id: 'intro-2',
          text: '椭圆、双曲线和抛物线，它们有一个共同的名字：圆锥曲线。',
        },
        {
          id: 'intro-3',
          text: '为什么叫圆锥曲线？因为它们都可以通过切割圆锥得到。',
        },
      ],
    },
    {
      id: 'cone-cutting',
      type: 'concept',
      title: '圆锥的切割',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'cone-cutting-1',
          text: '想象一个双圆锥，就是两个圆锥顶点对顶点连在一起。',
        },
        {
          id: 'cone-cutting-2',
          text: '用一个平面去切割它，根据切割角度的不同，会得到不同的曲线。',
        },
        {
          id: 'cone-cutting-3',
          text: '水平切割得到圆，倾斜切割得到椭圆。',
        },
        {
          id: 'cone-cutting-4',
          text: '平行于母线切割得到抛物线，更陡的角度切割得到双曲线。',
        },
      ],
    },
    {
      id: 'ellipse',
      type: 'concept',
      title: '椭圆',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'ellipse-1',
          text: '椭圆是到两个定点距离之和为常数的点的轨迹。',
        },
        {
          id: 'ellipse-2',
          text: '这两个定点叫做焦点，用 F1 和 F2 表示。',
        },
        {
          id: 'ellipse-3',
          text: '椭圆的标准方程是 x 平方除以 a 平方加 y 平方除以 b 平方等于 1。',
        },
        {
          id: 'ellipse-4',
          text: '其中 a 是长半轴，b 是短半轴，焦距 c 满足 c 平方等于 a 平方减 b 平方。',
        },
      ],
    },
    {
      id: 'ellipse-demo',
      type: 'animation',
      title: '椭圆演示',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'ellipse-demo-1',
          text: '图中显示的是一个椭圆，两个红点是焦点。',
        },
        {
          id: 'ellipse-demo-2',
          text: '拖动椭圆上的点，观察它到两个焦点的距离之和。',
        },
        {
          id: 'ellipse-demo-3',
          text: '无论点在椭圆上的什么位置，这个距离之和始终不变。',
        },
        {
          id: 'ellipse-demo-4',
          text: '调整参数 a 和 b，观察椭圆形状的变化。',
        },
      ],
    },
    {
      id: 'hyperbola',
      type: 'concept',
      title: '双曲线',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'hyperbola-1',
          text: '双曲线是到两个定点距离之差的绝对值为常数的点的轨迹。',
        },
        {
          id: 'hyperbola-2',
          text: '注意是距离之"差"，而椭圆是距离之"和"。',
        },
        {
          id: 'hyperbola-3',
          text: '双曲线有两支，分别在两个焦点的两侧。',
        },
        {
          id: 'hyperbola-4',
          text: '双曲线还有两条渐近线，曲线会无限接近但永远不会碰到它们。',
        },
      ],
    },
    {
      id: 'parabola',
      type: 'concept',
      title: '抛物线',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'parabola-1',
          text: '抛物线是到一个定点和一条定直线距离相等的点的轨迹。',
        },
        {
          id: 'parabola-2',
          text: '这个定点叫做焦点，定直线叫做准线。',
        },
        {
          id: 'parabola-3',
          text: '抛物线的标准方程是 y 平方等于 2px，其中 p 是焦点到准线的距离。',
        },
        {
          id: 'parabola-4',
          text: '抛物线只有一支，向一个方向无限延伸。',
        },
      ],
    },
    {
      id: 'eccentricity',
      type: 'concept',
      title: '离心率',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'eccentricity-1',
          text: '离心率是描述圆锥曲线形状的重要参数，用 e 表示。',
        },
        {
          id: 'eccentricity-2',
          text: '对于椭圆，e 等于 c 除以 a，取值在 0 到 1 之间。',
        },
        {
          id: 'eccentricity-3',
          text: 'e 越接近 0，椭圆越接近圆；e 越接近 1，椭圆越扁。',
        },
        {
          id: 'eccentricity-4',
          text: '抛物线的离心率恰好等于 1，双曲线的离心率大于 1。',
        },
      ],
    },
    {
      id: 'applications',
      type: 'application',
      title: '天文应用',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'applications-1',
          text: '圆锥曲线在天文学中有重要应用。',
        },
        {
          id: 'applications-2',
          text: '开普勒发现，行星绑着太阳运动的轨道是椭圆，太阳在一个焦点上。',
        },
        {
          id: 'applications-3',
          text: '彗星的轨道可能是椭圆、抛物线或双曲线。',
        },
        {
          id: 'applications-4',
          text: '抛物面天线利用抛物线的反射性质来聚焦信号。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'summary-1',
          text: '让我们总结一下今天学到的内容。',
        },
        {
          id: 'summary-2',
          text: '圆锥曲线包括椭圆、双曲线和抛物线，都可以通过切割圆锥得到。',
        },
        {
          id: 'summary-3',
          text: '它们都可以用焦点和距离关系来定义。',
        },
        {
          id: 'summary-4',
          text: '离心率描述了曲线的形状，在天文学中有重要应用。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对圆锥曲线有了更直观的理解！',
        },
      ],
    },
  ],
}
