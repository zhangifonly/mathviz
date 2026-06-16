import type { NarrationScript } from '../types'

/**
 * 欧拉恒等式 - 口播稿件
 * 核心概念：e^(iπ)+1=0，复指数旋转
 * 目标受众：高中及以上
 */
export const eulerIdentityNarration: NarrationScript = {
  id: 'euler-identity',
  title: '欧拉恒等式',
  subtitle: '最美的数学公式',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-06-05',
    updatedAt: '2026-06-05',
  },

  objectives: [
    '理解欧拉公式 e^(iθ)=cosθ+isinθ',
    '理解复指数的几何意义是旋转',
    '理解欧拉恒等式 e^(iπ)+1=0 的由来',
    '欣赏五大数学常数的统一之美',
  ],

  prerequisites: [
    '了解复数与复平面',
    '熟悉正弦余弦函数',
    '了解指数函数',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有一个公式，被无数数学家誉为"上帝写下的方程"，它就是欧拉恒等式。' },
        { id: 'intro-2', text: '它长这样：e 的 iπ 次方，加上 1，等于 0。', formula: 'e^{i\\pi} + 1 = 0' },
        { id: 'intro-3', text: '为什么它如此动人？因为它把数学中五个最重要的常数，用最简洁的方式联系在一起。' },
        { id: 'intro-4', text: '自然底数 e、虚数单位 i、圆周率 π、还有 1 和 0，全都出现在这一行里。' },
      ],
    },
    {
      id: 'euler-formula',
      type: 'formula',
      title: '欧拉公式',
      trigger: { type: 'auto' },
      lines: [
        { id: 'ef-1', text: '要理解它，先认识更一般的欧拉公式。', formula: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta' },
        { id: 'ef-2', text: 'e 的 i theta 次方，等于 cos theta 加上 i 乘 sin theta。' },
        { id: 'ef-3', text: '这个公式架起了指数世界和三角世界之间的桥梁，看似毫不相关的两者竟然相通。' },
        { id: 'ef-4', text: '它的几何意义更加美妙：e 的 i theta 次方，正好是复平面单位圆上的一个点。' },
      ],
    },
    {
      id: 'rotation',
      type: 'animation',
      title: '旋转的几何',
      trigger: { type: 'auto' },
      lines: [
        { id: 'rot-1', text: '让 theta 从 0 开始增大，这个点就沿着单位圆逆时针旋转。' },
        { id: 'rot-2', text: '它的实部是 cos theta，投影在水平轴上；虚部是 sin theta，投影在竖直轴上。' },
        { id: 'rot-3', text: '当 theta 等于 π，也就是转过半圈时，点恰好到达 −1 的位置。', formula: 'e^{i\\pi} = -1' },
        { id: 'rot-4', text: '所以 e 的 iπ 次方等于 −1，两边加上 1，就得到了那个等于 0 的恒等式。' },
        { id: 'rot-5', text: '一次半圆的旋转，就把指数、虚数、圆周率和零优雅地缝合在了一起。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '动手探索',
      trigger: { type: 'auto' },
      lines: [
        { id: 'int-1', text: '现在你可以拖动角度滑块，亲自让这个点在单位圆上旋转。' },
        { id: 'int-2', text: '点击 π 按钮，观察点是如何精确落在 −1 上的。' },
        { id: 'int-3', text: '点击播放，看完整的一圈旋转，theta 转到 2π 时点又回到了起点 1。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结回顾',
      trigger: { type: 'auto' },
      lines: [
        { id: 'sum-1', text: '我们看到欧拉公式把复指数解读为单位圆上的旋转。' },
        { id: 'sum-2', text: '当旋转半圈，e 的 iπ 次方抵达 −1，于是有了 e 的 iπ 次方加 1 等于 0。' },
        { id: 'sum-3', text: '简洁中蕴含深刻，这正是数学之美的极致体现。继续探索吧！' },
      ],
    },
  ],
}
