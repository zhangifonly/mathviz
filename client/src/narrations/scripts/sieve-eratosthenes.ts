import type { NarrationScript } from '../types'

/**
 * 埃氏筛法 - 口播稿件
 * 核心概念：素数、埃拉托斯特尼筛法、素数分布、算法效率
 * 目标受众：小学高年级及以上
 */
export const sieveEratosthenesNarration: NarrationScript = {
  id: 'sieve-eratosthenes',
  title: '埃氏筛法',
  subtitle: '古老而优雅的素数筛选',
  difficulty: 'elementary',
  targetAge: '小学高年级以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解素数的定义与意义',
    '掌握埃拉托斯特尼筛法的原理',
    '观察素数分布逐渐稀疏的规律',
    '体会筛法相比逐个试除的效率优势',
  ],

  prerequisites: ['了解整数与因数', '了解倍数概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '素数，是只能被 1 和它自己整除的数，比如 2、3、5、7。' },
        { id: 'intro-2', text: '它们像整数世界里的原子，任何数都能拆成素数的乘积。' },
        { id: 'intro-3', text: '可素数没有简单公式，我们该怎么把它们一网打尽呢？' },
      ],
    },
    {
      id: 'principle',
      type: 'concept',
      title: '筛法原理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'prin-1', text: '两千多年前，古希腊学者埃拉托斯特尼想出一个妙招。' },
        { id: 'prin-2', text: '从 2 开始，把它的倍数 4、6、8 全部划掉，它们都是合数。' },
        { id: 'prin-3', text: '再找下一个没被划掉的数 3，把 3 的倍数也划掉，如此反复。' },
        { id: 'prin-4', text: '像用筛子筛沙，漏下来没被划掉的，就全是素数。' },
      ],
    },
    {
      id: 'observe',
      type: 'concept',
      title: '观察分布',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'obs-1', text: '看这张表，金色的素数在开头很密集。' },
        { id: 'obs-2', text: '可越往后走，素数就越稀少，间隔越拉越大。' },
        { id: 'obs-3', text: '素数无穷无尽，但会渐渐变得稀疏，这就是素数定理描述的规律。' },
      ],
    },
    {
      id: 'efficiency',
      type: 'concept',
      title: '效率之美',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eff-1', text: '如果逐个去试除判断，每个数都要费不少功夫。' },
        { id: 'eff-2', text: '而筛法只做加法标记倍数，而且只需筛到根号 n 就够了。' },
        { id: 'eff-3', text: '因为更大的合数，早已被它较小的质因子划掉了。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手筛一筛',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整上界，看看筛到 50、100 还是 200，素数各有多少。' },
        { id: 'int-2', text: '点击单步，亲眼看着一个个素数的倍数被逐层筛除。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '埃氏筛法用最朴素的划倍数，高效找出所有素数。' },
        { id: 'sum-2', text: '一个古老的智慧，至今仍闪耀在计算机算法之中。' },
        { id: 'sum-3', text: '愿你也爱上素数的神秘与秩序，我们下次再见！' },
      ],
    },
  ],
}
