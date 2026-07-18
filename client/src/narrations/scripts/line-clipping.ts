import type { NarrationScript } from '../types'

/**
 * 线段裁剪 - 口播稿件
 * 核心概念：Cohen-Sutherland 区域码、trivial 接受/拒绝、迭代求交
 * 目标受众：高中及以上
 */
export const lineClippingNarration: NarrationScript = {
  id: 'line-clipping',
  title: '线段裁剪',
  subtitle: 'Cohen-Sutherland 算法',
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
    '理解矩形窗口对线段的裁剪问题',
    '掌握四位区域码的编码方式',
    '理解 trivial 接受与拒绝的位运算判定',
    '了解迭代求交点收窄线段的过程',
  ],

  prerequisites: ['了解平面坐标', '了解直线方程'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '屏幕上只有一个矩形窗口，我们只想看到窗口里面的画面。' },
        { id: 'intro-2', text: '可线段常常伸到窗口外面，超出的部分必须被剪掉。' },
        { id: 'intro-3', text: '如何又快又准地剪掉窗外的部分？这就是线段裁剪问题。' },
      ],
    },
    {
      id: 'concept-code',
      type: 'concept',
      title: '区域编码',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'code-1', text: '窗口的四条边把平面分成九个区域。' },
        { id: 'code-2', text: '给每个点一个四位编码，分别记录它在上、下、右、左哪个方向出界。' },
        { id: 'code-3', text: '窗口内的点，四位全是零。' },
      ],
    },
    {
      id: 'concept-trivial',
      type: 'concept',
      title: '接受与拒绝',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'triv-1', text: '两端编码都是零，说明整段都在窗内，直接接受。' },
        { id: 'triv-2', text: '两端编码按位与不为零，说明它们同在某条边外侧，整段可直接拒绝。' },
        { id: 'triv-3', text: '这两步只用位运算，快到几乎不花时间。' },
      ],
    },
    {
      id: 'concept-iterate',
      type: 'concept',
      title: '迭代裁剪',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'iter-1', text: '其余情况，就取一个在外的端点，求线段与那条边的交点。' },
        { id: 'iter-2', text: '用交点替换外面的端点，重新编码，再判断一次。' },
        { id: 'iter-3', text: '如此反复，最多几步就收窄成窗口内的那一段。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击画布移动测试线段的端点，看粉色的可见部分如何变化。' },
        { id: 'int-2', text: '把整条线段拖到窗外，它会被整体拒绝，一点都不显示。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '区域码让我们用位运算快速接受或拒绝大多数线段。' },
        { id: 'sum-2', text: '剩下的靠迭代求交，几步就能剪到窗口边界上。' },
        { id: 'sum-3', text: '简洁的编码加位运算，成就了图形学的经典算法，我们下次再见！' },
      ],
    },
  ],
}
