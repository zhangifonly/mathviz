import type { NarrationScript } from '../types'

/**
 * 凯撒密码 - 口播稿件
 * 核心概念：移位替换加密、模 26 运算、频率分析破解
 * 目标受众：初中及以上
 */
export const caesarCipherNarration: NarrationScript = {
  id: 'caesar-cipher',
  title: '凯撒密码',
  subtitle: '移位替换与频率分析',
  difficulty: 'beginner',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解凯撒密码的移位替换原理',
    '掌握模 26 运算在加解密中的作用',
    '认识频率分析如何破解替换密码',
    '体会密码学攻防的基本思想',
  ],

  prerequisites: ['了解字母表顺序', '了解余数概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '凯撒的秘密',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '两千年前，凯撒大帝要给前线将领传递密信。' },
        { id: 'intro-2', text: '他把信里的每个字母，都悄悄向后挪动固定的几位。' },
        { id: 'intro-3', text: '于是 A 变成了 D，B 变成了 E，敌人截获也看不懂。' },
      ],
    },
    {
      id: 'shift',
      type: 'concept',
      title: '移位加密',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '这个挪动的位数，就是密钥，我们叫它 shift。' },
        { id: 'def-2', text: '加密时每个字母沿字母表向后走 shift 步。' },
        { id: 'def-3', text: '解密只要反着走回来，秘密就还原了。' },
      ],
    },
    {
      id: 'mod',
      type: 'concept',
      title: '模 26 的循环',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mod-1', text: '可字母表只有 26 个，走到 Z 之后该怎么办？' },
        { id: 'mod-2', text: '答案是绕回开头，X、Y、Z 移三位就变成 A、B、C。' },
        { id: 'mod-3', text: '这种首尾相接的循环，数学上正是模 26 运算。' },
      ],
    },
    {
      id: 'crack',
      type: 'concept',
      title: '频率分析破解',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'crk-1', text: '可惜移位并不改变每个字母出现的频率。' },
        { id: 'crk-2', text: '英文里字母 E 最常见，密文里最高的柱子多半就是它。' },
        { id: 'crk-3', text: '用卡方统计把密文频率和标准频率一比，真正的密钥立刻现形。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手加密与破解',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整移位量，看字母环怎样错开，密文如何变化。' },
        { id: 'int-2', text: '再点一下破解，让频率分析替你找回隐藏的 shift。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '凯撒密码靠固定移位加密，用模 26 让字母循环。' },
        { id: 'sum-2', text: '但它不掩盖频率，频率分析轻松将它攻破。' },
        { id: 'sum-3', text: '简单的移位，藏着密码攻防的第一课，我们下次再见！' },
      ],
    },
  ],
}
