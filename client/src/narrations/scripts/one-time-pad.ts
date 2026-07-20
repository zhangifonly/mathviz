import type { NarrationScript } from '../types'

/**
 * 一次一密 - 口播稿件
 * 核心概念：异或加密、真随机等长密钥、完美保密、密钥重用危险
 * 目标受众：高中及以上
 */
export const oneTimePadNarration: NarrationScript = {
  id: 'one-time-pad',
  title: '一次一密',
  subtitle: '完美保密的异或',
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
    '理解异或加密与它的对合性质',
    '认识真随机、等长、一次性密钥的必要',
    '理解完美保密的含义',
    '警惕密钥重用带来的致命泄露',
  ],

  prerequisites: ['了解二进制位', '了解异或运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有没有一种密码，无论敌人多聪明，都绝对无法破译？' },
        { id: 'intro-2', text: '答案是有的，它叫一次一密，理论上完美保密。' },
        { id: 'intro-3', text: '它的秘密，藏在一个最简单的运算里，异或。' },
      ],
    },
    {
      id: 'xor',
      type: 'concept',
      title: '异或加密',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'xor-1', text: '把明文和密钥的每一位逐个做异或，就得到密文。' },
        { id: 'xor-2', text: '异或有个奇妙性质，对同一个数异或两次会回到原样。' },
        { id: 'xor-3', text: '所以拿密文再异或同一把密钥，明文就原封不动地回来了。' },
      ],
    },
    {
      id: 'key',
      type: 'concept',
      title: '真随机密钥',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'key-1', text: '密钥必须是真随机的，而且和明文一样长。' },
        { id: 'key-2', text: '每一位密钥都是抛硬币般的零或一，毫无规律可循。' },
      ],
    },
    {
      id: 'perfect',
      type: 'concept',
      title: '完美保密与重用危险',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'per-1', text: '拿到密文，换一把密钥就能解出任意等长的明文。' },
        { id: 'per-2', text: '既然每种明文都可能，密文就没有泄露任何信息，这就是完美保密。' },
        { id: 'per-3', text: '但密钥绝不能重用，两条密文一异或，密钥抵消，明文关系就暴露了。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '输入一段文字，看它和密钥逐位异或成密文。' },
        { id: 'int-2', text: '再切到重用模式，亲眼看看密钥被抵消的危险。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '一次一密用真随机等长密钥异或明文，达到完美保密。' },
        { id: 'sum-2', text: '它的软肋不是数学，而是密钥必须一次一换、绝不重用。' },
        { id: 'sum-3', text: '最简单的异或，撑起最坚固的保密，我们下次再见！' },
      ],
    },
  ],
}
