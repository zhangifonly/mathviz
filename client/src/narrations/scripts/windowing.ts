import type { NarrationScript } from '../types'

/**
 * 加窗函数 - 口播稿件
 * 核心概念：频谱泄漏、窗函数、主瓣旁瓣权衡
 * 目标受众：高中及以上
 */
export const windowingNarration: NarrationScript = {
  id: 'windowing',
  title: '加窗函数',
  subtitle: '减少频谱泄漏',
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
    '理解有限截断为什么会造成频谱泄漏',
    '认识矩形、汉宁、汉明、布莱克曼四种窗',
    '理解主瓣宽度与旁瓣高度的权衡',
    '学会根据需求选择合适的窗函数',
  ],

  prerequisites: ['了解正弦信号', '了解傅里叶变换的基本概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '截断的代价',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '要分析一段信号的频率，我们只能截取有限的一段来计算。' },
        { id: 'intro-2', text: '可这一刀切下去，信号的两端被硬生生截断了。' },
        { id: 'intro-3', text: '这个突兀的边缘，会给频谱带来意想不到的麻烦。' },
      ],
    },
    {
      id: 'leakage',
      type: 'concept',
      title: '频谱泄漏',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'leak-1', text: '本该是一根干净的谱线，却向两侧渗出许多小的杂散能量。' },
        { id: 'leak-2', text: '这就是频谱泄漏，真实频率被涂抹到了周围一大片。' },
        { id: 'leak-3', text: '罪魁祸首，正是矩形窗那两个陡峭的直角边缘。' },
      ],
    },
    {
      id: 'window',
      type: 'concept',
      title: '窗函数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'win-1', text: '解决办法是给信号乘上一个两端渐渐归零的窗函数。' },
        { id: 'win-2', text: '汉宁、汉明、布莱克曼窗，都是让边缘平滑过渡的曲线。' },
        { id: 'win-3', text: '边缘不再突兀，泄漏出去的杂散能量就大大减少了。' },
      ],
    },
    {
      id: 'tradeoff',
      type: 'concept',
      title: '主瓣旁瓣权衡',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'trade-1', text: '频谱里高高的中间部分叫主瓣，两侧的小峰叫旁瓣。' },
        { id: 'trade-2', text: '矩形窗主瓣最窄、分辨率高，但旁瓣高、泄漏重。' },
        { id: 'trade-3', text: '布莱克曼窗旁瓣压得最低，代价是主瓣变宽、分辨率下降。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手切换',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的窗，观察下方频谱旁瓣的高低变化。' },
        { id: 'int-2', text: '从矩形到布莱克曼，看杂散能量一点点被压下去。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '截断造成泄漏，加窗让边缘平滑，泄漏随之减小。' },
        { id: 'sum-2', text: '窄主瓣与低旁瓣不可兼得，要按需求取舍。' },
        { id: 'sum-3', text: '一扇合适的窗，让频谱更清晰，我们下次再见！' },
      ],
    },
  ],
}
