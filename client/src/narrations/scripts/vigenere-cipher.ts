import type { NarrationScript } from '../types'

/**
 * 维吉尼亚密码 - 口播稿件
 * 核心概念：多表移位、维吉尼亚方阵、循环密钥、模 26 加法
 * 目标受众：初中及以上
 */
export const vigenereCipherNarration: NarrationScript = {
  id: 'vigenere-cipher',
  title: '维吉尼亚密码',
  subtitle: '多表移位加密',
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
    '理解多表移位加密的原理',
    '会用维吉尼亚方阵完成加解密',
    '明白它为何比凯撒密码更安全',
    '体会密钥循环对齐的作用',
  ],

  prerequisites: ['了解字母表', '了解求余数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '十六世纪，人们发明了一种被誉为不可破译的密码。' },
        { id: 'intro-2', text: '它让同一个字母，每次都变成不同的模样。' },
        { id: 'intro-3', text: '三百年里无人能解，它就是维吉尼亚密码。' },
      ],
    },
    {
      id: 'shift',
      type: 'concept',
      title: '多表移位',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'shift-1', text: '把每个字母看作零到二十五的编号，加密就是做加法再对二十六取余。' },
        { id: 'shift-2', text: '关键在于，每个位置移动多少，由密钥字母决定。' },
        { id: 'shift-3', text: '密钥不够长就循环使用，铺满整段明文。' },
      ],
    },
    {
      id: 'tabula',
      type: 'concept',
      title: '维吉尼亚方阵',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'tab-1', text: '这张二十六乘二十六的方阵，就是加密的查找表。' },
        { id: 'tab-2', text: '用明文字母选一行，用密钥字母选一列，交点就是密文。' },
        { id: 'tab-3', text: '解密时反过来，沿密钥那一列找回明文所在的行。' },
      ],
    },
    {
      id: 'stronger',
      type: 'concept',
      title: '比凯撒强在哪',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'str-1', text: '凯撒密码只用一个固定偏移，字母频率原样保留，很容易被统计破解。' },
        { id: 'str-2', text: '维吉尼亚用多个移位表交替，把频率抹平，统计分析就失灵了。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手加密',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '输入你的明文和密钥，逐个字母观察它如何被移位。' },
        { id: 'int-2', text: '看方阵里高亮的行列交点，正是当前这个字母的密文。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '维吉尼亚密码用循环密钥驱动多张移位表，逐字母加密。' },
        { id: 'sum-2', text: '它抹平了字母频率，因此远比单表的凯撒密码坚固。' },
        { id: 'sum-3', text: '一张小小的方阵，藏着三百年的秘密，我们下次再见！' },
      ],
    },
  ],
}
