import type { NarrationScript } from '../types'

/**
 * 伽马函数 - 口播稿件
 * 核心概念：阶乘的连续推广、Γ(n)=(n-1)!、递推、Γ(1/2)=√π
 * 目标受众：高中及以上
 */
export const gammaFunctionNarration: NarrationScript = {
  id: 'gamma-function',
  title: '伽马函数',
  subtitle: '阶乘的连续推广',
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
    '理解伽马函数是阶乘向实数的连续推广',
    '掌握 Γ(n)=(n-1)! 与递推 Γ(x+1)=xΓ(x)',
    '认识神奇的半整数值 Γ(1/2)=√π',
    '了解曲线在 0 与负整数处的极点',
  ],

  prerequisites: ['了解阶乘', '了解函数与曲线'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '我们都会算 3 的阶乘等于 6，4 的阶乘等于 24。' },
        { id: 'intro-2', text: '可如果我问你，0.5 的阶乘等于多少呢？' },
        { id: 'intro-3', text: '阶乘只对整数有定义，这个问题看起来毫无意义。' },
        { id: 'intro-4', text: '但数学家找到了一条光滑曲线，把阶乘延伸到了每一个实数。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '伽马函数登场',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '这条曲线就是伽马函数，记作大写希腊字母 Γ。' },
        { id: 'def-2', text: '它由一个积分定义，但你只需记住它是阶乘的连续版本。' },
        { id: 'def-3', text: '图中蓝色曲线就是 Γ(x)，在整个正半轴上光滑延展。' },
      ],
    },
    {
      id: 'factorial',
      type: 'concept',
      title: '与阶乘的桥梁',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fac-1', text: '对每个正整数 n，伽马函数满足 Γ(n) 等于 (n-1) 的阶乘。' },
        { id: 'fac-2', text: '看那些粉色的点，它们正好落在曲线上，就是阶乘值。' },
        { id: 'fac-3', text: '于是整数的阶乘，只是这条连续曲线上的一串离散刻度。' },
      ],
    },
    {
      id: 'recur',
      type: 'concept',
      title: '递推与半整数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rec-1', text: '伽马函数遵守一条优美的递推：Γ(x+1) 等于 x 乘以 Γ(x)。' },
        { id: 'rec-2', text: '这正是阶乘那句每次乘一个数的规则，被推广到了实数。' },
        { id: 'rec-3', text: '最惊艳的是 Γ(1/2) 恰好等于根号 π，圆周率就这样冒了出来。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '选一个 x 值，看看曲线在那里给出的 Γ(x) 是多少。' },
        { id: 'int-2', text: '试试 2.5 或 0.5，感受阶乘在整数之间的连续过渡。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '伽马函数把阶乘从整数光滑地推广到了所有实数。' },
        { id: 'sum-2', text: '它满足 Γ(n)=(n-1)!、递推 Γ(x+1)=xΓ(x)，还有 Γ(1/2)=√π。' },
        { id: 'sum-3', text: '一条曲线连起离散与连续，数学之美如此，我们下次再见！' },
      ],
    },
  ],
}
