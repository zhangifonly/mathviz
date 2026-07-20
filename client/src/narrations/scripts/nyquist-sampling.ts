import type { NarrationScript } from '../types'

/**
 * 奈奎斯特采样 - 口播稿件
 * 核心概念：采样定理、sinc 插值重建、临界采样率
 * 目标受众：高中及以上
 */
export const nyquistSamplingNarration: NarrationScript = {
  id: 'nyquist-sampling',
  title: '奈奎斯特采样',
  subtitle: '采样定理与信号重建',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解采样定理为何要求采样率超过最高频率两倍',
    '掌握 sinc 插值如何从离散点重建连续信号',
    '认识临界采样与欠采样导致的失真',
    '体会数字世界还原模拟信号的数学原理',
  ],

  prerequisites: ['了解正弦波与频率', '了解函数图像'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们每天听的数字音乐，其实只是一串离散的采样数字。' },
        { id: 'intro-2', text: '奇怪的是，这些孤立的点，竟能还原成连续流畅的声波。' },
        { id: 'intro-3', text: '几个采样点，真的能完整还原原来的信号吗？' },
      ],
    },
    {
      id: 'theorem',
      type: 'concept',
      title: '采样定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'thm-1', text: '奈奎斯特给出了答案：只要采样率超过信号最高频率的两倍。' },
        { id: 'thm-2', text: '换句话说，一个周期里至少要取到两个以上的采样点。' },
        { id: 'thm-3', text: '满足这个条件，采样就没有丢失任何信息。' },
      ],
    },
    {
      id: 'reconstruct',
      type: 'concept',
      title: 'sinc 插值重建',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rec-1', text: '重建的办法是给每个采样点放上一个 sinc 波。' },
        { id: 'rec-2', text: 'sinc 波在自己的采样点处为一，在其他采样点处恰好为零。' },
        { id: 'rec-3', text: '把所有 sinc 波按采样值缩放叠加，就精确还原出原始曲线。' },
      ],
    },
    {
      id: 'critical',
      type: 'concept',
      title: '临界与不足',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'crit-1', text: '如果采样率刚好等于两倍最高频率，就处在临界的边缘。' },
        { id: 'crit-2', text: '一旦采样率低于这个门槛，重建的蓝线就明显偏离原信号。' },
        { id: 'crit-3', text: '信息一旦在采样时丢失，再高明的插值也补不回来。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动采样率滑块，看蓝色重建波形怎样贴合或偏离灰色原信号。' },
        { id: 'int-2', text: '试试欠采样预设，观察采样点太稀时重建如何彻底失真。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '采样定理告诉我们，采样率超过两倍最高频率就能无损采样。' },
        { id: 'sum-2', text: 'sinc 插值把离散采样点重新连成连续的信号。' },
        { id: 'sum-3', text: '这正是数字世界还原真实声音的秘密，我们下次再见！' },
      ],
    },
  ],
}
