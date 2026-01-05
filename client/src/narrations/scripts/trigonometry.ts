/**
 * 三角函数讲解稿件
 * 适合初中生（12-15岁）
 */

import type { NarrationScript } from '../types'

export const trigonometryNarration: NarrationScript = {
  id: 'trigonometry',
  title: '三角函数',
  subtitle: '通过单位圆理解正弦、余弦和正切',
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
          text: '欢迎来到三角函数实验！今天我们要学习数学中非常重要的一类函数。',
        },
        {
          id: 'intro-2',
          text: '三角函数描述了角度与比值之间的关系，在物理、工程中有广泛应用。',
        },
        {
          id: 'intro-3',
          text: '声音的波形、交流电的变化、物体的振动，都可以用三角函数来描述。',
        },
      ],
    },
    {
      id: 'unit-circle',

      type: 'concept',

      title: '单位圆',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'unit-circle-1',
          text: '理解三角函数最好的方法是通过单位圆。单位圆是半径为 1 的圆。',
        },
        {
          id: 'unit-circle-2',
          text: '从原点出发，画一条射线与 x 轴正方向形成角度 θ，射线与单位圆的交点就是关键。',
        },
        {
          id: 'unit-circle-3',
          text: '这个交点的横坐标就是 cos θ，纵坐标就是 sin θ。',
        },
        {
          id: 'unit-circle-4',
          text: '图中蓝色的线段是半径，红色虚线是 sin θ，绿色虚线是 cos θ。',
        },
      ],
    },
    {
      id: 'sine-cosine',

      type: 'concept',

      title: '正弦和余弦',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'sine-cosine-1',
          text: '正弦函数 sin θ 表示角 θ 对应的纵坐标，取值范围是负 1 到 1。',
        },
        {
          id: 'sine-cosine-2',
          text: '余弦函数 cos θ 表示角 θ 对应的横坐标，取值范围也是负 1 到 1。',
        },
        {
          id: 'sine-cosine-3',
          text: '当 θ = 0° 时，sin θ = 0，cos θ = 1，点在 x 轴正方向。',
        },
        {
          id: 'sine-cosine-4',
          text: '当 θ = 90° 时，sin θ = 1，cos θ = 0，点在 y 轴正方向。',
        },
        {
          id: 'sine-cosine-5',
          text: '调整角度滑块，观察 sin 和 cos 值如何变化。',
        },
      ],
    },
    {
      id: 'tangent',

      type: 'concept',

      title: '正切函数',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'tangent-1',
          text: '正切函数 tan θ 等于 sin θ 除以 cos θ，也就是纵坐标除以横坐标。',
        },
        {
          id: 'tangent-2',
          text: '几何上，tan θ 表示射线的斜率，即直线的倾斜程度。',
        },
        {
          id: 'tangent-3',
          text: '当 θ = 45° 时，tan θ = 1，因为 sin 45° = cos 45°。',
        },
        {
          id: 'tangent-4',
          text: '当 θ 接近 90° 时，cos θ 接近 0，tan θ 趋向无穷大。',
        },
      ],
    },
    {
      id: 'identity',

      type: 'concept',

      title: '基本恒等式',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'identity-1',
          text: '三角函数有一个最重要的恒等式：sin²θ + cos²θ = 1。',
        },
        {
          id: 'identity-2',
          text: '这是因为单位圆上的点到原点距离为 1，根据勾股定理得到。',
        },
        {
          id: 'identity-3',
          text: '无论角度 θ 是多少，这个等式永远成立。',
        },
        {
          id: 'identity-4',
          text: '你可以用右侧显示的 sin 和 cos 值验证这个恒等式。',
        },
      ],
    },
    {
      id: 'wave',

      type: 'concept',

      title: '波形图',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'wave-1',
          text: '下方的图展示了正弦波和余弦波的形状。',
        },
        {
          id: 'wave-2',
          text: '红色曲线是正弦波 sin(x)，绿色曲线是余弦波 cos(x)。',
        },
        {
          id: 'wave-3',
          text: '它们的形状完全相同，只是相位不同，余弦波比正弦波提前了 90°。',
        },
        {
          id: 'wave-4',
          text: '你可以调整振幅、频率和相位参数，观察波形如何变化。',
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
          text: '点击"开始动画"按钮，可以看到角度自动增加的过程。',
        },
        {
          id: 'animation-2',
          text: '观察单位圆上的点如何绕圆周运动，同时 sin 和 cos 值如何周期性变化。',
        },
        {
          id: 'animation-3',
          text: '这就是三角函数周期性的直观体现，每转一圈，函数值重复一次。',
        },
      ],
    },
    {
      id: 'application',

      type: 'application',

      title: '实际应用',

      trigger: { type: 'auto' },

      lines: [
        {
          id: 'application-1',
          text: '三角函数在生活中有很多应用。',
        },
        {
          id: 'application-2',
          text: '声音是空气的振动，可以用正弦波来描述。音乐中的音调就是不同频率的正弦波。',
        },
        {
          id: 'application-3',
          text: '交流电的电压随时间按正弦规律变化，这就是为什么叫"交流"电。',
        },
        {
          id: 'application-4',
          text: '在测量和导航中，三角函数用于计算距离和角度。',
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
          text: '三角函数通过单位圆定义：cos θ 是横坐标，sin θ 是纵坐标，tan θ 是它们的比值。',
        },
        {
          id: 'summary-3',
          text: '基本恒等式 sin²θ + cos²θ = 1 永远成立。',
        },
        {
          id: 'summary-4',
          text: '三角函数是周期函数，在描述振动和波动现象中非常重要。',
        },
        {
          id: 'summary-5',
          text: '希望通过这个实验，你对三角函数有了更直观的理解！',
        },
      ],
    },
  ],
}
