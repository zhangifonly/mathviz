import type { NarrationScript } from '../types'

/**
 * 希尔密码 - 口播稿件
 * 核心概念：矩阵加密、字母块向量、模 26 运算、模逆矩阵解密
 * 目标受众：高中及以上
 */
export const hillCipherNarration: NarrationScript = {
  id: 'hill-cipher',
  title: '希尔密码',
  subtitle: '矩阵加密字母块',
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
    '理解希尔密码把字母块当作向量的思路',
    '掌握密钥矩阵乘向量再模 26 的加密过程',
    '认识模逆矩阵在解密中的关键作用',
    '感受线性代数在密码学中的应用',
  ],

  prerequisites: ['了解矩阵乘法', '了解取模运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '古老的密码遇上矩阵，会碰撞出怎样的火花？' },
        { id: 'intro-2', text: '1929 年，数学家希尔用线性代数改造了加密。' },
        { id: 'intro-3', text: '他让一整块字母同时变换，而不是一个个替换。' },
      ],
    },
    {
      id: 'vector',
      type: 'concept',
      title: '字母块向量',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '先把每个字母换成数字，A 是 0，B 是 1，直到 Z 是 25。' },
        { id: 'def-2', text: '再把明文每两个字母打包成一个二维向量。' },
        { id: 'def-3', text: '于是 HE 就变成了列向量 7 和 4。' },
      ],
    },
    {
      id: 'multiply',
      type: 'concept',
      title: '矩阵乘法加密',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mul-1', text: '取一个二乘二的密钥矩阵，去乘这个明文向量。' },
        { id: 'mul-2', text: '得到的结果再对 26 取模，落回字母表范围。' },
        { id: 'mul-3', text: '两个新数字翻译回字母，就是加密后的密文块。' },
      ],
    },
    {
      id: 'inverse',
      type: 'concept',
      title: '模逆矩阵解密',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'inv-1', text: '解密要用密钥矩阵在模 26 下的逆矩阵。' },
        { id: 'inv-2', text: '前提是行列式与 26 互质，逆矩阵才存在。' },
        { id: 'inv-3', text: '逆矩阵乘上密文向量，就精确地还原出明文。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '输入你自己的明文，看它如何被逐块加密。' },
        { id: 'int-2', text: '翻动字母块，观察每一步的向量乘法运算。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '希尔密码把字母块当向量，用矩阵乘法加密。' },
        { id: 'sum-2', text: '解密依赖模 26 的逆矩阵，行列式必须与 26 互质。' },
        { id: 'sum-3', text: '线性代数就这样守护了秘密，我们下次再见！' },
      ],
    },
  ],
}
