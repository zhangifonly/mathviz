import type { NarrationScript } from '../types'

/**
 * 基础几何图形实验 - 口播稿件
 *
 * 核心概念：学习常见几何图形的面积和周长计算
 * 目标受众：小学生（6-12岁），数学入门
 */
export const geometryShapesNarration: NarrationScript = {
  id: 'geometry-shapes',
  title: '基础几何图形',
  subtitle: '学习常见几何图形的面积和周长计算',
  difficulty: 'beginner',
  targetAge: '小学 6-12岁',
  voice: 'xiaoxiao',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-01-03',
    updatedAt: '2026-01-03',
  },

  objectives: [
    '认识常见的几何图形：三角形、长方形、正方形、圆、平行四边形、梯形',
    '理解面积和周长的概念',
    '掌握各种图形的面积和周长公式',
    '学会用公式计算面积和周长',
  ],

  prerequisites: [
    '认识基本图形',
    '会做简单的乘法和除法',
    '理解"平方"的概念',
  ],

  sections: [
    // ========== 第一部分：开场引入 ==========
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        {
          id: 'intro-1',
          text: '小朋友们好！欢迎来到基础几何图形实验。',
          animation: { action: 'reset' },
        },
        {
          id: 'intro-2',
          text: '你有没有注意过，我们身边到处都是几何图形？',
        },
        {
          id: 'intro-3',
          text: '窗户是长方形，钟表是圆形，三明治切开是三角形。',
        },
        {
          id: 'intro-4',
          text: '今天，我们要学习这些图形的面积和周长怎么计算。准备好了吗？',
        },
      ],
    },

    // ========== 第二部分：面积和周长概念 ==========
    {
      id: 'concept',
      type: 'concept',
      title: '面积和周长',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'concept-1',
          text: '首先，我们来认识两个重要的概念：面积和周长。',
        },
        {
          id: 'concept-2',
          text: '面积是图形所占的平面大小。想象一下，给图形涂颜色，涂满需要多少颜料。',
        },
        {
          id: 'concept-3',
          text: '周长是图形边界的总长度。想象一只蚂蚁沿着图形的边走一圈，走了多远。',
        },
        {
          id: 'concept-4',
          text: '面积的单位是"平方单位"，比如平方厘米、平方米。周长的单位是"长度单位"，比如厘米、米。',
        },
      ],
    },

    // ========== 第三部分：三角形 ==========
    {
      id: 'triangle',
      type: 'concept',
      title: '三角形',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'tri-1',
          text: '先来看三角形。三角形有三条边和三个角。',
          animation: { action: 'setParams', params: { shape: 'triangle' } },
        },
        {
          id: 'tri-2',
          text: '三角形的面积公式是：底乘以高除以2。',
        },
        {
          id: 'tri-3',
          text: '为什么要除以2呢？因为三角形是长方形的一半！',
        },
        {
          id: 'tri-4',
          text: '把两个相同的三角形拼在一起，就变成了一个长方形。',
        },
        {
          id: 'tri-5',
          text: '周长就是三条边加起来的总长度。',
        },
      ],
    },

    // ========== 第四部分：长方形和正方形 ==========
    {
      id: 'rectangle',
      type: 'concept',
      title: '长方形和正方形',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'rect-1',
          text: '长方形有四条边，对边相等，四个角都是直角。',
          animation: { action: 'setParams', params: { shape: 'rectangle' } },
        },
        {
          id: 'rect-2',
          text: '长方形的面积公式最简单：长乘以宽。',
        },
        {
          id: 'rect-3',
          text: '周长是四条边加起来，也就是2乘以长加宽。',
        },
        {
          id: 'rect-4',
          text: '正方形是特殊的长方形，四条边都相等。',
          animation: { action: 'setParams', params: { shape: 'square' } },
        },
        {
          id: 'rect-5',
          text: '正方形的面积是边长乘以边长，也叫边长的平方。周长是4乘以边长。',
        },
      ],
    },

    // ========== 第五部分：圆 ==========
    {
      id: 'circle',
      type: 'concept',
      title: '圆',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'circle-1',
          text: '圆是一个特别的图形，它没有角，边是弯曲的。',
          animation: { action: 'setParams', params: { shape: 'circle' } },
        },
        {
          id: 'circle-2',
          text: '圆的大小由半径决定。半径是从圆心到边上任意一点的距离。',
        },
        {
          id: 'circle-3',
          text: '圆的面积公式是：派乘以半径的平方。派约等于3.14。',
        },
        {
          id: 'circle-4',
          text: '圆的周长叫做圆周，公式是：2乘以派乘以半径。',
        },
        {
          id: 'circle-5',
          text: '派是一个神奇的数字，它是圆周长和直径的比值，永远不变！',
        },
      ],
    },

    // ========== 第六部分：平行四边形和梯形 ==========
    {
      id: 'parallelogram',
      type: 'concept',
      title: '平行四边形和梯形',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'para-1',
          text: '平行四边形的两组对边分别平行且相等。',
          animation: { action: 'setParams', params: { shape: 'parallelogram' } },
        },
        {
          id: 'para-2',
          text: '平行四边形的面积公式和长方形一样：底乘以高。',
        },
        {
          id: 'para-3',
          text: '注意！这里的高是垂直于底边的高度，不是斜边的长度。',
        },
        {
          id: 'para-4',
          text: '梯形只有一组对边平行，叫做上底和下底。',
          animation: { action: 'setParams', params: { shape: 'trapezoid' } },
        },
        {
          id: 'para-5',
          text: '梯形的面积公式是：上底加下底，乘以高，再除以2。',
        },
      ],
    },

    // ========== 第七部分：参数互动 ==========
    {
      id: 'parameters',
      type: 'interaction',
      title: '自己试试',
      trigger: { type: 'parameter' },
      lines: [
        {
          id: 'param-1',
          text: '现在轮到你来试试了！',
        },
        {
          id: 'param-2',
          text: '在右边的控制面板，你可以选择不同的图形。',
        },
        {
          id: 'param-3',
          text: '拖动滑块可以改变图形的大小。看看面积和周长会怎么变化？',
        },
        {
          id: 'param-4',
          text: '试试把边长变大一倍，面积会变成几倍？',
        },
        {
          id: 'param-5',
          text: '你可以打开或关闭网格和标注，更清楚地观察图形。',
        },
      ],
    },

    // ========== 第八部分：实际应用 ==========
    {
      id: 'application',
      type: 'application',
      title: '生活中的应用',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'app-1',
          text: '几何图形的计算在生活中非常有用！',
        },
        {
          id: 'app-2',
          text: '装修房间时，要计算地板的面积，才知道买多少地砖。',
        },
        {
          id: 'app-3',
          text: '给花园围栅栏，要计算周长，才知道买多长的栅栏。',
        },
        {
          id: 'app-4',
          text: '做披萨时，圆形披萨的大小就是用面积来衡量的。',
        },
        {
          id: 'app-5',
          text: '学好几何，你就能解决很多实际问题啦！',
        },
      ],
    },

    // ========== 第九部分：总结 ==========
    {
      id: 'summary',
      type: 'summary',
      title: '总结回顾',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'summary-1',
          text: '今天我们学习了六种几何图形，让我们来回顾一下。',
          animation: { action: 'reset' },
        },
        {
          id: 'summary-2',
          text: '三角形面积等于底乘高除以2。',
        },
        {
          id: 'summary-3',
          text: '长方形面积等于长乘宽，正方形面积等于边长的平方。',
        },
        {
          id: 'summary-4',
          text: '圆的面积等于派乘半径的平方，周长等于2派r。',
        },
        {
          id: 'summary-5',
          text: '平行四边形面积等于底乘高，梯形面积等于上底加下底乘高除以2。',
        },
        {
          id: 'summary-6',
          text: '太棒了！你已经掌握了基础几何图形的知识。继续探索其他实验，发现更多数学的乐趣吧！',
        },
      ],
    },
  ],

  furtherReading: [
    {
      title: '勾股定理',
      description: '学习直角三角形的特殊性质',
      link: '/pythagorean',
    },
    {
      title: '圆锥曲线',
      description: '探索椭圆、双曲线等高级图形',
      link: '/conic-sections',
    },
  ],
}

export default geometryShapesNarration
