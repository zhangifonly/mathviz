import type { NarrationScript } from '../types'

/**
 * 容斥原理 - 口播稿件
 * 核心概念：重复计数、韦恩图、加减交替、多集合推广
 * 目标受众：初中及以上
 */
export const inclusionExclusionNarration: NarrationScript = {
  id: 'inclusion-exclusion',
  title: '容斥原理',
  subtitle: '交替加减算并集',
  difficulty: 'intermediate',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解直接相加会导致重复计数的问题',
    '会用韦恩图分解各互斥区域',
    '掌握容斥公式的加减交替规律',
    '了解容斥原理向多集合的推广',
  ],

  prerequisites: ['了解集合与并集', '了解整除'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一到三十里，能被二整除的有十五个，能被三整除的有十个。' },
        { id: 'intro-2', text: '要问能被二或被三整除的一共几个，能直接十五加十吗？' },
        { id: 'intro-3', text: '不行，像六、十二这些数被数了两遍，答案会偏大。' },
      ],
    },
    {
      id: 'venn',
      type: 'concept',
      title: '韦恩图',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'venn-1', text: '我们用三个圆表示三个集合，重叠处就是它们的公共元素。' },
        { id: 'venn-2', text: '两圆相交的区域被算了两次，三圆相交的中心被算了三次。' },
        { id: 'venn-3', text: '看清每块区域被重复的次数，就找到了修正的钥匙。' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: '容斥公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'form-1', text: '先把各集合大小加起来，再减去所有两两交集，多减的补回来。' },
        { id: 'form-2', text: '于是加上三个集合的公共部分，正好把中心区域数对。' },
        { id: 'form-3', text: '加单个、减两两、加三三，这就是交替加减的容斥公式。' },
      ],
    },
    {
      id: 'general',
      type: 'concept',
      title: '多集合推广',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gen-1', text: '集合再多也是同样的节奏：奇数个交集取正号，偶数个取负号。' },
        { id: 'gen-2', text: '这个正负交替的规律，来自减法一层层修正的过程。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换范围 N，看每一项如何随之变化。' },
        { id: 'int-2', text: '对照逐项列表，验证加减之后并集刚好数对。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '容斥原理用加减交替，消除并集里的重复计数。' },
        { id: 'sum-2', text: '奇加偶减的符号规律，让它推广到任意多个集合。' },
        { id: 'sum-3', text: '数清重叠，加减有序，我们下次再见！' },
      ],
    },
  ],
}
