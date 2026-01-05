/**
 * 参数方程讲解稿件
 * 适合高中生（15-18岁）
 */

import type { NarrationScript } from '../types'

export const parametricNarration: NarrationScript = {
  id: 'parametric',
  title: '参数方程',
  subtitle: '用参数描述曲线的运动',
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
    '理解参数方程的概念和优势',
    '掌握常见曲线的参数方程表示',
    '了解参数的几何意义',
    '认识参数方程在动画中的应用',
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
          text: '欢迎来到参数方程实验！今天我们要学习描述曲线的另一种方式。',
        },
        {
          id: 'intro-2',
          text: '你已经熟悉了 y 等于 f(x) 这种函数形式。',
        },
        {
          id: 'intro-3',
          text: '但有些曲线，比如圆，用这种形式很难表示。参数方程就是解决方案。',
        },
      ],
    },
    {
      id: 'concept',
      type: 'concept',
      title: '参数方程的概念',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'concept-1',
          text: '参数方程用一个参数 t 来同时表示 x 和 y。',
        },
        {
          id: 'concept-2',
          text: '形式是 x 等于 f(t)，y 等于 g(t)，其中 t 在某个范围内变化。',
        },
        {
          id: 'concept-3',
          text: '当 t 变化时，点 (x, y) 就在平面上画出一条曲线。',
        },
        {
          id: 'concept-4',
          text: '参数 t 可以理解为时间，曲线就是点随时间运动的轨迹。',
        },
      ],
    },
    {
      id: 'circle',
      type: 'example',
      title: '圆的参数方程',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'circle-1',
          text: '最经典的例子是圆的参数方程。',
        },
        {
          id: 'circle-2',
          text: '圆心在原点、半径为 r 的圆：x 等于 r cos t，y 等于 r sin t。',
        },
        {
          id: 'circle-3',
          text: '参数 t 就是角度，从 0 到 2π 变化一周。',
        },
        {
          id: 'circle-4',
          text: '这比用 x 平方加 y 平方等于 r 平方来描述圆要方便得多。',
        },
      ],
    },
    {
      id: 'ellipse',
      type: 'example',
      title: '椭圆的参数方程',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'ellipse-1',
          text: '椭圆的参数方程是圆的推广。',
        },
        {
          id: 'ellipse-2',
          text: 'x 等于 a cos t，y 等于 b sin t，其中 a 和 b 是长短半轴。',
        },
        {
          id: 'ellipse-3',
          text: '当 a 等于 b 时，椭圆就退化为圆。',
        },
        {
          id: 'ellipse-4',
          text: '参数 t 不再是几何角度，但仍然从 0 到 2π 画完整个椭圆。',
        },
      ],
    },
    {
      id: 'cycloid',
      type: 'example',
      title: '摆线',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'cycloid-1',
          text: '摆线是一个有趣的曲线，它是圆在直线上滚动时圆周上一点的轨迹。',
        },
        {
          id: 'cycloid-2',
          text: '参数方程是 x 等于 r 乘以 t 减 sin t，y 等于 r 乘以 1 减 cos t。',
        },
        {
          id: 'cycloid-3',
          text: '摆线有一个神奇的性质：它是最速降线。',
        },
        {
          id: 'cycloid-4',
          text: '也就是说，小球沿摆线滑下比沿直线滑下更快到达终点。',
        },
      ],
    },
    {
      id: 'lissajous',
      type: 'animation',
      title: '利萨如图形',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'lissajous-1',
          text: '利萨如图形是两个简谐振动合成的轨迹。',
        },
        {
          id: 'lissajous-2',
          text: '参数方程是 x 等于 A sin(at 加 δ)，y 等于 B sin(bt)。',
        },
        {
          id: 'lissajous-3',
          text: '调整频率比 a 比 b 和相位差 δ，可以得到各种美丽的图案。',
        },
        {
          id: 'lissajous-4',
          text: '当 a 比 b 是简单整数比时，图形是闭合的。',
        },
      ],
    },
    {
      id: 'advantages',
      type: 'concept',
      title: '参数方程的优势',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'advantages-1',
          text: '参数方程有很多优势。',
        },
        {
          id: 'advantages-2',
          text: '第一，可以表示不是函数的曲线，比如圆。',
        },
        {
          id: 'advantages-3',
          text: '第二，自然地描述了点的运动过程，包括方向和速度。',
        },
        {
          id: 'advantages-4',
          text: '第三，在计算机图形学中，参数方程是绘制曲线的标准方法。',
        },
      ],
    },
    {
      id: 'applications',
      type: 'application',
      title: '实际应用',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'applications-1',
          text: '参数方程在很多领域都有应用。',
        },
        {
          id: 'applications-2',
          text: '计算机动画中，物体的运动轨迹通常用参数方程描述。',
        },
        {
          id: 'applications-3',
          text: '机器人学中，机械臂的运动路径规划使用参数曲线。',
        },
        {
          id: 'applications-4',
          text: '物理学中，抛体运动的轨迹就是参数方程的典型例子。',
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
          text: '参数方程用参数 t 同时表示 x 和 y，描述点的运动轨迹。',
        },
        {
          id: 'summary-3',
          text: '圆、椭圆、摆线、利萨如图形都可以用参数方程优雅地表示。',
        },
        {
          id: 'summary-4',
          text: '参数方程在动画和图形学中有广泛应用。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对参数方程有了更直观的理解！',
        },
      ],
    },
  ],
}
