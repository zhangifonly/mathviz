import type { NarrationScript } from '../types'

/**
 * 离散余弦变换 - 口播稿件
 * 核心概念：余弦基分解、能量集中低频、丢高频压缩（JPEG 核心）
 * 目标受众：高中及以上
 */
export const discreteCosineTransformNarration: NarrationScript = {
  id: 'discrete-cosine-transform',
  title: '离散余弦变换',
  subtitle: 'JPEG 压缩的核心',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解 DCT 把信号分解为余弦基的叠加',
    '认识平滑信号能量集中在低频的特点',
    '理解丢弃高频系数实现有损压缩的原理',
    '了解 DCT 在 JPEG 图像压缩中的作用',
  ],

  prerequisites: ['了解余弦函数', '了解离散信号'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一张照片动辄几百万像素，为什么存成文件却小得多？' },
        { id: 'intro-2', text: '秘密就藏在离散余弦变换里，简称 DCT。' },
        { id: 'intro-3', text: '它是 JPEG 图像压缩的数学核心。' },
      ],
    },
    {
      id: 'basis',
      type: 'concept',
      title: '余弦基',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'basis-1', text: '任何一段信号，都可以写成一系列不同频率余弦波的叠加。' },
        { id: 'basis-2', text: '低频余弦缓慢起伏，勾勒信号的大轮廓。' },
        { id: 'basis-3', text: '高频余弦快速震荡，负责补上细节和棱角。' },
      ],
    },
    {
      id: 'coeff',
      type: 'concept',
      title: 'DCT 系数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'coeff-1', text: 'DCT 算出每个余弦基的权重，也就是一串系数。' },
        { id: 'coeff-2', text: '对平滑信号来说，能量几乎全都集中在最左侧的低频系数上。' },
        { id: 'coeff-3', text: '右侧那些高频系数往往很小，接近于零。' },
      ],
    },
    {
      id: 'compress',
      type: 'concept',
      title: '丢高频压缩',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'comp-1', text: '既然高频系数很小，我们干脆把它们丢掉，只留前几个。' },
        { id: 'comp-2', text: '用逆变换把保留的系数还原，重建信号几乎和原来一模一样。' },
        { id: 'comp-3', text: '存储的数字少了一大半，这就是有损压缩。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着调整保留的系数个数，看重建曲线如何变化。' },
        { id: 'int-2', text: '保留越少压缩率越高，曲线也会慢慢丢掉细节变得平滑。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'DCT 把信号分解成余弦基，能量集中在低频。' },
        { id: 'sum-2', text: '丢掉微小的高频系数，就能在几乎不失真的前提下大幅压缩。' },
        { id: 'sum-3', text: '一组余弦波，撑起了整个数字图像世界，我们下次再见！' },
      ],
    },
  ],
}
