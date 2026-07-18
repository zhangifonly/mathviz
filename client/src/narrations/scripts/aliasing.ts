import type { NarrationScript } from '../types'

/**
 * 混叠现象 - 口播稿件
 * 核心概念：采样、欠采样、奈奎斯特频率、表观(混叠)频率
 * 目标受众：高中及以上
 */
export const aliasingNarration: NarrationScript = {
  id: 'aliasing',
  title: '混叠现象',
  subtitle: '采样不足的频率伪装',
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
    '理解采样如何把连续信号变成离散点',
    '认识欠采样导致的混叠现象',
    '掌握奈奎斯特频率与表观频率的计算',
    '解释车轮倒转、摩尔纹等生活中的混叠',
  ],

  prerequisites: ['了解正弦函数', '了解频率的概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '看老电影时，你有没有发现飞驰的车轮竟然在倒转？' },
        { id: 'intro-2', text: '车轮明明在往前，画面里却像在往后转，甚至静止不动。' },
        { id: 'intro-3', text: '这不是错觉，而是相机每秒只拍有限张画面造成的错位。' },
        { id: 'intro-4', text: '这种高频信号伪装成低频的现象，就叫做混叠。' },
      ],
    },
    {
      id: 'sample',
      type: 'concept',
      title: '什么是采样',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '真实世界的信号是连续的，比如一条不停摆动的正弦曲线。' },
        { id: 'def-2', text: '要用数字记录它，只能每隔一小段时间取一个值，这就是采样。' },
        { id: 'def-3', text: '每秒取多少个点，叫做采样率，记作 fs。' },
      ],
    },
    {
      id: 'undersample',
      type: 'concept',
      title: '欠采样与混叠',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'under-1', text: '如果采样点太稀疏，就会漏掉波形中间的快速起伏。' },
        { id: 'under-2', text: '把这些稀疏的点连起来，会得到一条完全不同的低频曲线。' },
        { id: 'under-3', text: '奈奎斯特定理告诉我们，采样率必须大于信号频率的两倍。' },
      ],
    },
    {
      id: 'apparent',
      type: 'concept',
      title: '表观频率',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'app-1', text: '混叠后看到的假频率，可以精确算出来。' },
        { id: 'app-2', text: '它等于真实频率减去采样率的整数倍，再取绝对值。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调高真实频率，或调低采样率，看红色假波如何出现。' },
        { id: 'int-2', text: '当采样率越过奈奎斯特这条线，红波就会和灰波重合。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '采样不足时，高频信号会伪装成低频，这就是混叠。' },
        { id: 'sum-2', text: '只要采样率高过频率的两倍，就能忠实还原原信号。' },
        { id: 'sum-3', text: '看懂了车轮倒转的秘密，我们下次再见！' },
      ],
    },
  ],
}
