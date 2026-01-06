import type { NarrationScript } from '../types'

/**
 * 信号处理实验 - 口播稿件
 *
 * 核心概念：信号分析与滤波
 * 目标受众：大学本科生，有基础数学知识
 */
export const signalProcessingNarration: NarrationScript = {
  id: 'signal-processing',
  title: '信号处理',
  subtitle: '探索信号分析与滤波',
  difficulty: 'advanced',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解信号的时域和频域表示',
    '掌握采样定理的含义',
    '了解滤波器的基本原理',
    '认识信号处理的应用',
  ],

  prerequisites: [
    '三角函数知识',
    '傅里叶变换基础',
    '复数的基本概念',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到信号处理实验。',
        },
        {
          id: 'intro-2',
          text: '你每天都在与信号打交道：听音乐、打电话、看视频。',
        },
        {
          id: 'intro-3',
          text: '这些信号是如何被处理、传输和存储的？',
        },
        {
          id: 'intro-4',
          text: '信号处理正是研究这些问题的学科。',
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
          text: '信号可以在时域或频域中分析。',
        },
        {
          id: 'concept-2',
          text: '时域显示信号随时间的变化，频域显示信号包含的频率成分。',
        },
        {
          id: 'concept-3',
          text: '傅里叶变换是连接时域和频域的桥梁。',
        },
        {
          id: 'concept-4',
          text: '让我们通过实例来理解这些概念。',
        },
      ],
    },
    {
      id: 'sampling',
      type: 'animation',
      title: '采样定理',
      lines: [
        {
          id: 'samp-1',
          text: '数字信号是对连续信号的采样。',
        },
        {
          id: 'samp-2',
          text: '采样定理告诉我们：采样频率必须大于信号最高频率的两倍。',
        },
        {
          id: 'samp-3',
          text: '否则会产生混叠，无法正确恢复原信号。',
        },
        {
          id: 'samp-4',
          text: '这就是为什么CD的采样率是44.1kHz，因为人耳能听到的最高频率约20kHz。',
        },
      ],
    },
    {
      id: 'filter',
      type: 'animation',
      title: '滤波器',
      lines: [
        {
          id: 'filt-1',
          text: '滤波器用于选择性地保留或去除某些频率成分。',
        },
        {
          id: 'filt-2',
          text: '低通滤波器保留低频，去除高频，用于去噪。',
        },
        {
          id: 'filt-3',
          text: '高通滤波器保留高频，去除低频，用于边缘检测。',
        },
        {
          id: 'filt-4',
          text: '带通滤波器只保留特定频率范围，用于信号分离。',
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
          text: '信号处理在现代技术中无处不在。',
        },
        {
          id: 'app-2',
          text: '音频处理：降噪、均衡、压缩。',
        },
        {
          id: 'app-3',
          text: '图像处理：锐化、模糊、边缘检测。',
        },
        {
          id: 'app-4',
          text: '通信系统：调制、解调、编码。',
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
          text: '今天我们探索了信号处理的基本概念。',
        },
        {
          id: 'sum-2',
          text: '时域和频域是分析信号的两种视角。',
        },
        {
          id: 'sum-3',
          text: '采样和滤波是数字信号处理的核心操作。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你理解数字世界的信号处理原理。',
        },
      ],
    },
  ],
}
