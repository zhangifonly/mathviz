import type { NarrationScript } from '../types'

/**
 * 格雷码 - 口播稿件
 * 核心概念：相邻只差一位、异或转换、卡诺图应用
 * 目标受众：初中及以上
 */
export const grayCodeNarration: NarrationScript = {
  id: 'gray-code',
  title: '格雷码',
  subtitle: '相邻只差一位',
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
    '理解格雷码相邻只差一位的核心特性',
    '掌握二进制与格雷码之间的异或转换',
    '了解格雷码在旋转编码器与卡诺图中的应用',
  ],

  prerequisites: ['了解二进制', '了解异或运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '想象一个旋转编码器，正在读取转轴的角度。' },
        { id: 'intro-2', text: '如果用普通二进制，从 3 转到 4 时，三位要同时翻转。' },
        { id: 'intro-3', text: '各位的翻转很难完全同步，一瞬间可能读出错误的乱码。' },
        { id: 'intro-4', text: '格雷码正是为解决这个难题而生的一种巧妙编码。' },
      ],
    },
    {
      id: 'adjacent',
      type: 'concept',
      title: '相邻只差一位',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'adj-1', text: '格雷码的规矩很简单：相邻的两个码，只允许一位发生变化。' },
        { id: 'adj-2', text: '这样从一个数跳到下一个数，永远只翻转一个比特。' },
        { id: 'adj-3', text: '看画面里高亮的橙色格子，那就是唯一改变的那一位。' },
      ],
    },
    {
      id: 'convert',
      type: 'concept',
      title: '异或转换',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conv-1', text: '从二进制得到格雷码，只需一步：让它和右移一位的自己做异或。' },
        { id: 'conv-2', text: '写成公式就是，格雷码等于 n 异或 n 右移一位。' },
        { id: 'conv-3', text: '反过来还原时，把格雷码逐位向右做前缀异或即可。' },
      ],
    },
    {
      id: 'karnaugh',
      type: 'concept',
      title: '卡诺图应用',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'kar-1', text: '数字电路里的卡诺图，行列标号正是用格雷码排列的。' },
        { id: 'kar-2', text: '因为相邻格只差一位，相邻的一才能合并化简逻辑表达式。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换位数，看看三位和四位的格雷码序列有什么不同。' },
        { id: 'int-2', text: '逐行观察，确认任意相邻两行始终只有一个格子在变化。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '格雷码让相邻数字只差一位，避免了多位同变的读数错误。' },
        { id: 'sum-2', text: '一个异或运算，就能在二进制和格雷码之间自由转换。' },
        { id: 'sum-3', text: '从编码器到卡诺图，它无处不在，我们下次再见！' },
      ],
    },
  ],
}
