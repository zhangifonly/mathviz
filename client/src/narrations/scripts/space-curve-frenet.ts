/**
 * 空间曲线与活动标架 讲解稿
 */
import type { NarrationScript } from '../types'

export const spaceCurveFrenetNarration: NarrationScript = {
  id: 'space-curve-frenet',
  title: '空间曲线与活动标架',
  subtitle: '两个数决定一条曲线',
  difficulty: 'advanced',
  targetAge: '大学本科',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解曲线论基本定理的含义',
    '掌握曲率与挠率的几何意义',
    '认识 Frenet-Serret 公式描述标架转动',
    '会用挠率判断曲线是否平面',
  ],
  prerequisites: ['向量微积分', '空间曲线', '叉积'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '一条曲线要多少信息',
      lines: [
        {
          id: 'intro-1',
          text: '描述一条空间曲线，直觉上需要三个坐标函数。但换个角度想：曲线的形状与它摆在空间哪个位置无关。',
        },
        {
          id: 'intro-2',
          text: '去掉位置和朝向这些无关信息，剩下的纯粹形状信息有多少？答案出人意料地少，只需要两个标量函数。',
        },
        {
          id: 'intro-3',
          text: '这两个函数就是曲率和挠率。曲线论基本定理说：给定它们，曲线的形状被唯一确定，差一个刚体运动。',
        },
      ],
    },
    {
      id: 'frame',
      type: 'concept',
      title: '沿曲线滚动的坐标系',
      lines: [
        {
          id: 'fr-1',
          text: '要定义这两个量，先要在曲线每一点上立一个坐标系。第一个轴取切线方向，叫 T。',
        },
        {
          id: 'fr-2',
          text: '第二个轴取曲线弯曲的方向，叫主法向量 N。第三个轴由前两个叉乘得到，叫副法向量 B。',
        },
        {
          id: 'fr-3',
          text: '这三个向量两两垂直、都是单位长，构成一个随曲线滚动的正交坐标系，叫 Frenet 标架。屏幕上绿红蓝三根轴就是它。',
        },
      ],
    },
    {
      id: 'kappa',
      type: 'formula',
      title: '弯多少与扭多少',
      lines: [
        {
          id: 'kp-1',
          text: '曲率衡量曲线弯得有多急。对半径为 r 的圆，曲率恰好是 r 的倒数：圆越小弯得越急。',
        },
        {
          id: 'kp-2',
          text: '挠率衡量曲线扭出平面的程度。它的关键性质是：挠率恒为零，等价于曲线落在一个平面内。',
        },
        {
          id: 'kp-3',
          text: '所以圆的挠率是零，而螺旋线的挠率是个非零常数。屏幕上可以对照这两个读数。',
        },
      ],
    },
    {
      id: 'serret',
      type: 'formula',
      title: '标架怎么转',
      lines: [
        {
          id: 'sr-1',
          text: 'Frenet 与 Serret 给出了三条公式，精确描述标架沿曲线如何转动。这是整个曲线论的核心。',
        },
        {
          id: 'sr-2',
          text: '切向量的变化率等于曲率乘以主法向量。主法向量的变化率是负曲率乘切向量，加上挠率乘副法向量。',
        },
        {
          id: 'sr-3',
          text: '副法向量的变化率是负挠率乘主法向量。三条公式在屏幕上都用数值导数验证过，误差在十的负四次方量级。',
        },
      ],
    },
    {
      id: 'gallery',
      type: 'interaction',
      title: '四种典型组合',
      lines: [
        {
          id: 'gl-1',
          text: '请依次切换四条曲线。直线的曲率和挠率都是零，最简单的情形。',
        },
        {
          id: 'gl-2',
          text: '圆的曲率是常数、挠率为零，是平面曲线。螺旋线两个量都是非零常数，匀速弯匀速扭。',
        },
        {
          id: 'gl-3',
          text: '三叶结两个量都随参数变化。注意观察副法向量：平面曲线的它固定不动，空间曲线的它一直在转。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '回顾',
      lines: [
        {
          id: 'sum-1',
          text: '第一，曲率与挠率两个标量函数完全决定空间曲线的形状，差一个刚体运动。',
        },
        {
          id: 'sum-2',
          text: '第二，Frenet 标架由切向量、主法向量、副法向量构成，沿曲线滚动。',
        },
        {
          id: 'sum-3',
          text: '第三，挠率恒为零等价于曲线是平面曲线，此时副法向量固定不动。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
