import type { NarrationScript } from '../types'

/**
 * 傅里叶变换实验 - 口播稿件
 *
 * 核心概念：任何周期信号都可以分解为不同频率正弦波的叠加
 * 目标受众：大学本科生，有基础微积分和三角函数知识
 */
export const fourierNarration: NarrationScript = {
  id: 'fourier',
  title: '傅里叶变换',
  subtitle: '探索信号的时域与频域表示',
  difficulty: 'advanced',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-03',
    updatedAt: '2025-01-03',
  },

  objectives: [
    '理解傅里叶变换的核心思想：信号分解',
    '掌握时域和频域的概念及其关系',
    '观察傅里叶级数如何逼近不同波形',
    '理解吉布斯现象及其产生原因',
  ],

  prerequisites: [
    '三角函数基础（正弦、余弦）',
    '级数求和的概念',
    '基础微积分知识',
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
          text: '欢迎来到傅里叶变换实验。',
          animation: { action: 'reset' },
        },
        {
          id: 'intro-2',
          text: '你有没有想过，为什么我们能在嘈杂的音乐会现场，依然听清朋友说的话？',
        },
        {
          id: 'intro-3',
          text: '或者，手机里的均衡器是如何单独调节低音和高音的？',
        },
        {
          id: 'intro-4',
          text: '这背后的秘密，就是今天我们要探索的傅里叶变换。',
          animation: { action: 'highlight', params: { selector: '.time-domain-chart' } },
        },
      ],
    },

    // ========== 第二部分：核心概念 ==========
    {
      id: 'concept',
      type: 'concept',
      title: '核心概念',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'concept-1',
          text: '傅里叶变换的核心思想非常优美：任何复杂的周期信号，都可以分解成一系列简单正弦波的叠加。',
          animation: { action: 'setWaveType', params: { waveType: 'square' } },
        },
        {
          id: 'concept-2',
          text: '就像白光可以被棱镜分解成七色光谱一样，声音和其他信号也可以被"分解"成不同频率的成分。',
        },
        {
          id: 'concept-3',
          text: '我们把信号随时间变化的表示叫做"时域"，把信号按频率分解后的表示叫做"频域"。',
          highlight: '.time-domain-chart',
          animation: { action: 'highlight', params: { selector: '.time-domain-chart' } },
        },
        {
          id: 'concept-4',
          text: '傅里叶变换，就是连接时域和频域的桥梁。',
          animation: { action: 'highlight', params: { selector: '.spectrum-chart' } },
        },
      ],
    },

    // ========== 第三部分：公式解读 ==========
    {
      id: 'formula',
      type: 'formula',
      title: '公式解读',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'formula-1',
          text: '让我们看看傅里叶级数的数学表达式。',
          highlight: '.formula-card',
          animation: { action: 'highlight', params: { selector: '.formula-card' } },
        },
        {
          id: 'formula-2',
          text: '以方波为例，它的傅里叶级数展开式是：f(t) 等于 4A 除以 π，乘以一个无穷级数。',
          formula: 'f(t) = \\frac{4A}{\\pi} \\sum_{n=1,3,5,...}^{\\infty} \\frac{1}{n} \\sin(n\\omega t)',
        },
        {
          id: 'formula-3',
          text: '这个级数只包含奇数次谐波，也就是基频的1倍、3倍、5倍频率的正弦波。',
          animation: { action: 'setParams', params: { terms: 3 } },
        },
        {
          id: 'formula-4',
          text: '每一项的振幅是 1/n，这意味着高频成分的贡献越来越小。',
          animation: { action: 'setParams', params: { terms: 10 } },
        },
      ],
    },

    // ========== 第四部分：波形选择解说 ==========
    {
      id: 'wave-selection',
      type: 'interaction',
      title: '波形选择',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'wave-1',
          text: '现在，让我们选择不同的波形来观察它们的傅里叶分解。',
          highlight: '.wave-selector',
          animation: { action: 'highlight', params: { selector: '.wave-selector' } },
        },
        {
          id: 'wave-sine',
          text: '正弦波是最简单的情况，它本身就是一个纯净的单一频率，不需要分解。',
          animation: { action: 'setWaveType', params: { waveType: 'sine' } },
        },
        {
          id: 'wave-square',
          text: '方波看起来很简单，但它包含了无穷多个奇次谐波。这就是为什么方波听起来比正弦波更"尖锐"。',
          animation: { action: 'setWaveType', params: { waveType: 'square' } },
        },
        {
          id: 'wave-sawtooth',
          text: '锯齿波包含所有整数次谐波，所以它的频谱最丰富，声音也最"明亮"。',
          animation: { action: 'setWaveType', params: { waveType: 'sawtooth' } },
        },
        {
          id: 'wave-triangle',
          text: '三角波也只包含奇次谐波，但振幅衰减得更快，是 1/n² 而不是 1/n，所以听起来更"柔和"。',
          animation: { action: 'setWaveType', params: { waveType: 'triangle' } },
        },
      ],
    },

    // ========== 第五部分：动画解说 ==========
    {
      id: 'animation',
      type: 'animation',
      title: '动画演示',
      trigger: { type: 'animation', condition: 'isAnimating === true' },
      lines: [
        {
          id: 'anim-1',
          text: '现在点击播放按钮，观察傅里叶级数是如何逐步逼近原始波形的。',
          highlight: '.play-button',
          animation: { action: 'setWaveType', params: { waveType: 'square' } },
        },
        {
          id: 'anim-2',
          text: '蓝色实线是我们要逼近的目标波形。',
          animation: { action: 'setParams', params: { terms: 1 } },
        },
        {
          id: 'anim-3',
          text: '红色虚线是傅里叶级数的部分和，也就是我们用有限项正弦波叠加得到的结果。',
        },
        {
          id: 'anim-4',
          text: '观察！随着项数增加，红色虚线越来越接近蓝色实线。',
          animation: { action: 'startAnimation' },
        },
        {
          id: 'anim-5',
          text: '但是注意看方波的拐角处，即使项数很多，那里仍然有一些"过冲"。这就是著名的吉布斯现象。',
          animation: { action: 'setParams', params: { terms: 50 } },
        },
        {
          id: 'anim-6',
          text: '吉布斯现象告诉我们，用有限项傅里叶级数逼近不连续函数时，在跳变点附近总会有大约9%的过冲。',
          animation: { action: 'stopAnimation' },
        },
      ],
    },

    // ========== 第六部分：频谱解读 ==========
    {
      id: 'spectrum',
      type: 'concept',
      title: '频谱分析',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'spectrum-1',
          text: '现在让我们看看下方的频谱图。',
          highlight: '.spectrum-chart',
          animation: { action: 'scrollTo', params: { selector: '.spectrum-chart' } },
        },
        {
          id: 'spectrum-2',
          text: '频谱图显示了信号中各个频率成分的强度。横轴是频率，纵轴是振幅。',
          animation: { action: 'highlight', params: { selector: '.spectrum-chart' } },
        },
        {
          id: 'spectrum-3',
          text: '对于方波，你可以看到只有奇数倍频率处有能量，而且振幅随频率增加而递减。',
          animation: { action: 'setWaveType', params: { waveType: 'square' } },
        },
        {
          id: 'spectrum-4',
          text: '这就是傅里叶变换的威力：它让我们能够"看到"信号内部的频率结构。',
        },
      ],
    },

    // ========== 第七部分：参数互动 ==========
    {
      id: 'parameters',
      type: 'interaction',
      title: '参数探索',
      trigger: { type: 'parameter' },
      lines: [
        {
          id: 'param-1',
          text: '现在，让我们通过调整参数来深入理解傅里叶变换。',
          highlight: '.parameter-panel',
          animation: { action: 'highlight', params: { selector: '.parameter-panel' } },
        },
        {
          id: 'param-freq',
          text: '调整基频参数，观察波形如何被"压缩"或"拉伸"。频率越高，波形振荡越快。',
          animation: { action: 'setParams', params: { frequency: 2 }, delay: 500 },
        },
        {
          id: 'param-amp',
          text: '调整振幅参数，波形的高度会相应变化，但形状保持不变。',
          animation: { action: 'setParams', params: { amplitude: 1.5 }, delay: 500 },
        },
        {
          id: 'param-terms',
          text: '这是最关键的参数：傅里叶项数。增加项数，逼近效果越好。试着把它调到50，看看效果如何！',
          animation: { action: 'setParams', params: { terms: 50 }, delay: 1000 },
        },
      ],
    },

    // ========== 第八部分：实际应用 ==========
    {
      id: 'application',
      type: 'application',
      title: '实际应用',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'app-1',
          text: '傅里叶变换在现实世界中有着广泛的应用。',
          animation: { action: 'reset' },
        },
        {
          id: 'app-2',
          text: '在音频处理中，均衡器就是通过傅里叶变换将声音分解到频域，然后分别调节各频段的音量。',
        },
        {
          id: 'app-3',
          text: '在图像处理中，JPEG压缩算法使用离散余弦变换（傅里叶变换的近亲）来压缩图片。',
        },
        {
          id: 'app-4',
          text: '在通信领域，手机信号的调制解调、WiFi的OFDM技术，都离不开傅里叶变换。',
        },
        {
          id: 'app-5',
          text: '甚至在医学成像中，CT和MRI的图像重建也依赖傅里叶变换。',
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
          text: '让我们回顾一下今天学到的内容。',
          animation: { action: 'reset' },
        },
        {
          id: 'summary-2',
          text: '第一，傅里叶变换的核心思想是：任何周期信号都可以分解为正弦波的叠加。',
          animation: { action: 'setWaveType', params: { waveType: 'square' } },
        },
        {
          id: 'summary-3',
          text: '第二，时域描述信号随时间的变化，频域描述信号的频率组成。傅里叶变换是它们之间的桥梁。',
          animation: { action: 'highlight', params: { selector: '.time-domain-chart' } },
        },
        {
          id: 'summary-4',
          text: '第三，不同波形有不同的频谱特征：方波只有奇次谐波，锯齿波有所有谐波，三角波的谐波衰减更快。',
          animation: { action: 'setParams', params: { terms: 20 } },
        },
        {
          id: 'summary-5',
          text: '第四，吉布斯现象提醒我们，有限项傅里叶级数在不连续点处会有过冲。',
          animation: { action: 'setParams', params: { terms: 50 } },
        },
        {
          id: 'summary-6',
          text: '希望通过这个实验，你对傅里叶变换有了更直观的理解。继续探索其他实验，发现更多数学之美！',
        },
      ],
    },
  ],

  furtherReading: [
    {
      title: '傅里叶级数可视化',
      description: '用旋转的圆来可视化傅里叶级数的叠加过程',
      link: '/fourier-series',
    },
    {
      title: '傅里叶绘图',
      description: '用傅里叶级数绘制任意图形',
      link: '/fourier-drawing',
    },
    {
      title: '信号处理',
      description: '探索滤波器和频谱分析',
      link: '/signal-processing',
    },
  ],
}

export default fourierNarration
