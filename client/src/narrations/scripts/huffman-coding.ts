import type { NarrationScript } from '../types'

/**
 * 哈夫曼编码 - 口播稿件
 * 核心概念：变长编码、前缀码、贪心建树、压缩率
 * 目标受众：初中及以上
 */
export const huffmanCodingNarration: NarrationScript = {
  id: 'huffman-coding',
  title: '哈夫曼编码',
  subtitle: '最优前缀码压缩',
  difficulty: 'intermediate',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: { author: 'MathViz Team', version: '1.0.0', createdAt: '2026-07-18', updatedAt: '2026-07-18' },

  objectives: [
    '理解变长编码为何能压缩文本',
    '认识前缀码的无歧义性质',
    '掌握哈夫曼贪心建树的过程',
    '会读懂编码表并比较压缩率',
  ],

  prerequisites: ['了解二进制', '了解字符与频率'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一段文字存进电脑，每个字符都要用若干个 0 和 1 来表示。' },
        { id: 'intro-2', text: '如果每个字符都用同样长的编码，常见字和罕见字就一样占地方。' },
        { id: 'intro-3', text: '可文字里字母出现的频率天差地别，能不能让常见字更省位数？' },
        { id: 'intro-4', text: '哈夫曼编码给出了最优答案，我们这就来看看。' },
      ],
    },
    {
      id: 'variable',
      type: 'concept',
      title: '变长编码',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'var-1', text: '核心思路是：出现次数多的字符，用短编码；出现次数少的，用长编码。' },
        { id: 'var-2', text: '这样总位数由高频字符主导，整体自然被压缩下来。' },
        { id: 'var-3', text: '就像摩尔斯电码里，最常用的字母 E 只用一个点。' },
      ],
    },
    {
      id: 'prefix',
      type: 'concept',
      title: '前缀码',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pre-1', text: '但长度不一带来新问题：一串 0 和 1 该从哪里断开？' },
        { id: 'pre-2', text: '哈夫曼用前缀码解决：任何字符的编码，都不是另一个字符编码的开头。' },
        { id: 'pre-3', text: '于是解码时一路读到匹配就断开，绝不会产生歧义。' },
      ],
    },
    {
      id: 'greedy',
      type: 'concept',
      title: '贪心建树',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gre-1', text: '把每个字符看成一个节点，频率写在上面。' },
        { id: 'gre-2', text: '每次取出频率最小的两个节点，合并成一个新节点，频率相加。' },
        { id: 'gre-3', text: '不断重复，直到只剩一个根，一棵哈夫曼树就长成了。' },
        { id: 'gre-4', text: '从根往下走，左边记 0、右边记 1，每片叶子的路径就是它的编码。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一段文本，看树的形状和编码表怎样随频率改变。' },
        { id: 'int-2', text: '对比定长和哈夫曼的位数，感受压缩率一路降下来。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '哈夫曼编码用变长前缀码，让高频字符更省位数。' },
        { id: 'sum-2', text: '每次合并两个最小频率节点的贪心，给出了最优编码。' },
        { id: 'sum-3', text: '它是 ZIP、JPEG 背后的老功臣，一个贪心创造的压缩魔法，我们下次再见！' },
      ],
    },
  ],
}
