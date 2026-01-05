/**
 * 极坐标图形讲解稿件
 * 适合初中生（12-15岁）
 */

import type { NarrationScript } from '../types'

export const polarNarration: NarrationScript = {
  id: 'polar',
  title: '极坐标图形',
  subtitle: '探索极坐标系中的美丽曲线',
  targetAge: '初中 12-15岁',
  difficulty: 'elementary',
  voice: 'xiaoxiao',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-03',
    updatedAt: '2025-01-03',
  },

  objectives: [
    '理解核心概念',
    '掌握基本操作',
    '观察参数变化的影响',
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
          text: '欢迎来到极坐标图形实验！今天我们要探索一种不同的坐标系统。',
        },
        {
          id: 'intro-2',
          text: '在极坐标系中，我们用距离和角度来描述点的位置，而不是横纵坐标。',
        },
        {
          id: 'intro-3',
          text: '极坐标能画出很多美丽的曲线，比如玫瑰线、心形线、螺旋线等。',
        },
      ],
    },
    {
      id: 'polar-system',

      type: 'concept',

      title: '极坐标系',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'polar-system-1',
          text: '在极坐标系中，每个点用 (r, θ) 表示，r 是到原点的距离，θ 是与 x 轴正方向的夹角。',
        },
        {
          id: 'polar-system-2',
          text: '极坐标和直角坐标可以相互转换：x = r cos θ，y = r sin θ。',
        },
        {
          id: 'polar-system-3',
          text: '图中红色的线段就是半径 r，它从原点指向曲线上的点。',
        },
        {
          id: 'polar-system-4',
          text: '点击"开始绘制"，可以看到点如何随着角度变化在曲线上移动。',
        },
      ],
    },
    {
      id: 'rose',

      type: 'concept',

      title: '玫瑰线',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'rose-1',
          text: '玫瑰线的方程是 r = a cos(nθ)，它的形状像一朵花。',
        },
        {
          id: 'rose-2',
          text: '参数 n 决定了花瓣的数量：当 n 是奇数时有 n 瓣，当 n 是偶数时有 2n 瓣。',
        },
        {
          id: 'rose-3',
          text: '参数 a 决定了花瓣的大小，a 越大，花瓣越大。',
        },
        {
          id: 'rose-4',
          text: '试着调整 n 的值，看看花瓣数量如何变化。',
        },
      ],
    },
    {
      id: 'cardioid',

      type: 'concept',

      title: '心形线',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'cardioid-1',
          text: '心形线的方程是 r = a(1 + cos θ)，它的形状像一颗心。',
        },
        {
          id: 'cardioid-2',
          text: '心形线是蚶线的一种特殊情况，当两个参数相等时就得到心形。',
        },
        {
          id: 'cardioid-3',
          text: '心形线在数学和物理中有很多应用，比如麦克风的指向性图案。',
        },
      ],
    },
    {
      id: 'spiral',

      type: 'concept',

      title: '阿基米德螺线',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'spiral-1',
          text: '阿基米德螺线的方程是 r = a + bθ，它是一种等距螺旋。',
        },
        {
          id: 'spiral-2',
          text: '随着角度增加，半径均匀增大，每圈之间的间距相等。',
        },
        {
          id: 'spiral-3',
          text: '这种螺旋在自然界中很常见，比如蜗牛壳的形状。',
        },
        {
          id: 'spiral-4',
          text: '调整参数 b 可以改变螺旋的疏密程度。',
        },
      ],
    },
    {
      id: 'lemniscate',

      type: 'concept',

      title: '双纽线',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'lemniscate-1',
          text: '双纽线的方程是 r² = a² cos(2θ)，它的形状像数字 8 或无穷符号。',
        },
        {
          id: 'lemniscate-2',
          text: '双纽线关于原点对称，有两个"叶子"。',
        },
        {
          id: 'lemniscate-3',
          text: '这种曲线在数学史上很有名，是伯努利研究的重要曲线之一。',
        },
      ],
    },
    {
      id: 'limacon',

      type: 'concept',

      title: '蚶线',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'limacon-1',
          text: '蚶线的方程是 r = a + b cos θ，根据 a 和 b 的比值呈现不同形态。',
        },
        {
          id: 'limacon-2',
          text: '当 a = b 时，得到心形线；当 a > b 时，是凸的蚶线。',
        },
        {
          id: 'limacon-3',
          text: '当 a < b 时，蚶线会有一个内环，形成更复杂的形状。',
        },
        {
          id: 'limacon-4',
          text: '试着调整 a 和 b 的值，观察蚶线形态的变化。',
        },
      ],
    },
    {
      id: 'animation',

      type: 'animation',

      title: '动画演示',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'animation-1',
          text: '点击"开始绘制"按钮，可以看到曲线是如何一点一点画出来的。',
        },
        {
          id: 'animation-2',
          text: '红色的点和线段显示当前的位置和半径。',
        },
        {
          id: 'animation-3',
          text: '观察角度 θ 如何从 0 增加到最大值，曲线逐渐成形。',
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
          text: '极坐标用距离 r 和角度 θ 来描述点的位置，与直角坐标可以相互转换。',
        },
        {
          id: 'summary-3',
          text: '极坐标方程能画出很多美丽的曲线：玫瑰线、心形线、螺旋线、双纽线、蚶线等。',
        },
        {
          id: 'summary-4',
          text: '这些曲线不仅美观，在科学和工程中也有实际应用。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对极坐标有了更直观的理解！',
        },
      ],
    },
  ],
}
