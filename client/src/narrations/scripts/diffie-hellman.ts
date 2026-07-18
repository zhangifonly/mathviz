import type { NarrationScript } from '../types'

/**
 * 迪菲-赫尔曼密钥交换 - 口播稿件
 * 核心概念：公开信道协商密钥、快速幂取模、离散对数难题
 * 目标受众：高中及以上
 */
export const diffieHellmanNarration: NarrationScript = {
  id: 'diffie-hellman',
  title: '迪菲-赫尔曼密钥交换',
  subtitle: '公开信道协商密钥',
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
    '理解在公开信道上协商出共享密钥的思想',
    '认识公开参数与私钥的角色区别',
    '掌握共享密钥两边相等的数学原因',
    '了解离散对数难题带来的安全性',
  ],

  prerequisites: ['了解取模运算', '了解幂运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '两个人从没见过面，聊天全程被人偷听，他们能约定一把只有彼此知道的钥匙吗？' },
        { id: 'intro-2', text: '听起来不可能，但一九七六年的迪菲和赫尔曼做到了。' },
        { id: 'intro-3', text: '秘密不在于藏住对话，而在于藏住一个难以逆转的计算。' },
      ],
    },
    {
      id: 'params',
      type: 'concept',
      title: '公开参数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '首先，双方公开约定一个素数 p，和它的一个原根 g。' },
        { id: 'def-2', text: '这两个数写在明面上，全世界包括窃听者都能看到。' },
        { id: 'def-3', text: '真正的秘密，藏在各自心里的私钥里。' },
      ],
    },
    {
      id: 'compute',
      type: 'concept',
      title: '各自计算',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cmp-1', text: 'Alice 选私钥 a，算出公开值 A 等于 g 的 a 次方对 p 取模。' },
        { id: 'cmp-2', text: 'Bob 选私钥 b，同样算出 B 等于 g 的 b 次方对 p 取模。' },
        { id: 'cmp-3', text: '他们把 A 和 B 大大方方地在公开信道上交换。' },
      ],
    },
    {
      id: 'shared',
      type: 'concept',
      title: '密钥相同',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'shr-1', text: 'Alice 拿 B 再乘方 a 次，Bob 拿 A 再乘方 b 次。' },
        { id: 'shr-2', text: '奇妙的是，两边都等于 g 的 a 乘 b 次方对 p 取模，密钥完全相同。' },
        { id: 'shr-3', text: '窃听者只有 A 和 B，想反推私钥要解离散对数，几乎不可能。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着给 Alice 和 Bob 各选一个私钥，看看两边的共享密钥。' },
        { id: 'int-2', text: '无论怎么换，只要参数不变，两边算出的密钥总是一致。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '公开 p、g、A、B，私钥却始终不出门。' },
        { id: 'sum-2', text: '快速幂让计算轻松，离散对数让破解无望。' },
        { id: 'sum-3', text: '这把在阳光下协商出的钥匙，撑起了今天的加密世界，我们下次再见！' },
      ],
    },
  ],
}
