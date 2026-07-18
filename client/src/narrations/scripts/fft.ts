import type { NarrationScript } from '../types'

/**
 * 快速傅里叶变换 - 口播稿件
 * 核心概念：分治、奇偶分解、蝶形运算、n log n 加速
 * 目标受众：高中及以上
 */
export const fftNarration: NarrationScript = {
  id: 'fft',
  title: '快速傅里叶变换',
  subtitle: '分治的 n log n 算法',
  difficulty: 'expert',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解 DFT 为什么慢',
    '掌握 FFT 按奇偶下标分治的思想',
    '认识蝶形运算如何合并子问题',
    '体会 n log n 相对 n 平方的巨大加速',
  ],

  prerequisites: ['了解正弦波与频率', '了解复数与三角函数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '任何信号，都能拆成一堆不同频率正弦波的叠加。' },
        { id: 'intro-2', text: '把信号还原成频率成分的运算，叫做离散傅里叶变换，简称 DFT。' },
        { id: 'intro-3', text: '可是朴素 DFT 要做 n 平方次运算，采样点一多就慢得让人绝望。' },
      ],
    },
    {
      id: 'divide',
      type: 'concept',
      title: '奇偶分治',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'div-1', text: '一九六五年，库利和图基想到一招：把序列按下标的奇偶拆成两半。' },
        { id: 'div-2', text: '偶数位一组，奇数位一组，各自再做一次规模减半的傅里叶变换。' },
        { id: 'div-3', text: '这正是分治：大问题不断对半劈开，直到只剩一个点。' },
      ],
    },
    {
      id: 'butterfly',
      type: 'concept',
      title: '蝶形运算',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'bf-1', text: '两个子问题的结果要合并，靠的是所谓的蝶形运算。' },
        { id: 'bf-2', text: '给奇数组乘上一个旋转因子，再和偶数组做一次加法、一次减法。' },
        { id: 'bf-3', text: '一上一下两条连线,画出来像蝴蝶的翅膀,名字由此而来。' },
      ],
    },
    {
      id: 'speed',
      type: 'concept',
      title: 'n log n 加速',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'spd-1', text: '每层合并只花线性时间，而对半劈开一共只有 log n 层。' },
        { id: 'spd-2', text: '于是总代价从 n 平方降到 n 乘 log n。' },
        { id: 'spd-3', text: '当 n 是一百万时,这意味着快了整整五万倍。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的合成信号，看幅度谱上的粉色峰跳到哪个频率。' },
        { id: 'int-2', text: '加大采样点数，留意朴素 DFT 与 FFT 的运算次数越拉越开。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'FFT 用奇偶分治加蝶形运算，把 DFT 从 n 平方压到 n log n。' },
        { id: 'sum-2', text: '它是音频、图像、通信背后无处不在的引擎。' },
        { id: 'sum-3', text: '一次巧妙的分治，让频谱瞬间浮现，我们下次再见！' },
      ],
    },
  ],
}
