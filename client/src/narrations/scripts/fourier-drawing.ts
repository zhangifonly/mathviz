import type { NarrationScript } from '../types'

/**
 * 傅里叶绘图实验 - 口播稿件
 *
 * 核心概念：用傅里叶级数绘制任意图形
 * 目标受众：高中生及以上，有基础三角函数知识
 */
export const fourierDrawingNarration: NarrationScript = {
  id: 'fourier-drawing',
  title: '傅里叶绘图',
  subtitle: '用圆周运动绘制任意图形',
  difficulty: 'intermediate',
  targetAge: '高中及以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解傅里叶级数的几何意义',
    '观察圆周运动如何叠加成复杂曲线',
    '体验用数学绘制艺术图形',
    '了解傅里叶变换的应用',
  ],

  prerequisites: [
    '三角函数基础',
    '复数的基本概念',
    '参数方程的理解',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到傅里叶绘图实验。',
        },
        {
          id: 'intro-2',
          text: '你能想象用一系列旋转的圆来画出任何图形吗？',
        },
        {
          id: 'intro-3',
          text: '这听起来像魔法，但它背后是严谨的数学：傅里叶级数。',
        },
        {
          id: 'intro-4',
          text: '今天我们将亲眼见证这个神奇的过程。',
        },
      ],
    },
    {
      id: 'concept',
      type: 'concept',
      title: '核心概念',
      lines: [
        {
          id: 'concept-1',
          text: '傅里叶级数告诉我们，任何周期函数都可以分解为正弦波的叠加。',
        },
        {
          id: 'concept-2',
          text: '在复平面上，正弦波对应于匀速圆周运动。',
        },
        {
          id: 'concept-3',
          text: '把多个圆周运动首尾相连，末端的轨迹就是我们要画的图形。',
        },
        {
          id: 'concept-4',
          text: '圆的半径和转速由傅里叶系数决定。',
        },
      ],
    },
    {
      id: 'visualization',
      type: 'animation',
      title: '绘图演示',
      lines: [
        {
          id: 'vis-1',
          text: '让我们从一个简单的例子开始：画一个正方形。',
        },
        {
          id: 'vis-2',
          text: '观察这些旋转的圆是如何连接在一起的。',
        },
        {
          id: 'vis-3',
          text: '最后一个圆的圆心画出的轨迹，就是我们的目标图形。',
        },
        {
          id: 'vis-4',
          text: '增加圆的数量，图形会越来越精确。',
        },
      ],
    },
    {
      id: 'complex',
      type: 'animation',
      title: '复杂图形',
      lines: [
        {
          id: 'comp-1',
          text: '现在让我们尝试更复杂的图形。',
        },
        {
          id: 'comp-2',
          text: '理论上，任何闭合曲线都可以用这种方法绘制。',
        },
        {
          id: 'comp-3',
          text: '签名、卡通人物、甚至汉字都可以。',
        },
        {
          id: 'comp-4',
          text: '这展示了傅里叶分析的强大表达能力。',
        },
      ],
    },
    {
      id: 'application',
      type: 'application',
      title: '实际应用',
      lines: [
        {
          id: 'app-1',
          text: '傅里叶绘图不仅是数学艺术，还有实际应用。',
        },
        {
          id: 'app-2',
          text: '矢量图形的压缩可以用傅里叶描述符。',
        },
        {
          id: 'app-3',
          text: '形状识别和匹配也常用这种方法。',
        },
        {
          id: 'app-4',
          text: '它帮助我们理解信号处理和图像分析的本质。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      lines: [
        {
          id: 'sum-1',
          text: '今天我们见证了傅里叶级数的神奇力量。',
        },
        {
          id: 'sum-2',
          text: '简单的圆周运动叠加，可以创造出任意复杂的图形。',
        },
        {
          id: 'sum-3',
          text: '这是数学之美的完美体现。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能激发你对傅里叶分析的兴趣。',
        },
      ],
    },
  ],
}
