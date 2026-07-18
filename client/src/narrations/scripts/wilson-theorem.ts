import type { NarrationScript } from '../types'

/**
 * 威尔逊定理 - 口播稿件
 * 核心概念：阶乘取模、素性充要判据、素数与合数的分野
 * 目标受众：高中及以上
 */
export const wilsonTheoremNarration: NarrationScript = {
  id: 'wilson-theorem',
  title: '威尔逊定理',
  subtitle: '阶乘的素性判据',
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
    '理解威尔逊定理的表述与含义',
    '掌握阶乘取模的计算方法',
    '认识素数与合数在该判据下的差异',
    '体会充要条件的严谨之美',
  ],

  prerequisites: ['了解阶乘', '了解同余与取模'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '素数，是只能被一和自己整除的数，它们像质点一样构成整数的骨架。' },
        { id: 'intro-2', text: '判断一个数是不是素数，通常靠试除。但有没有一个漂亮的公式，一眼道破？' },
        { id: 'intro-3', text: '十八世纪的数学家发现，阶乘竟然藏着素数的秘密。' },
      ],
    },
    {
      id: 'theorem',
      type: 'concept',
      title: '威尔逊定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'thm-1', text: '威尔逊定理说：整数 n 大于一时，n 是素数，当且仅当 n 减一的阶乘除以 n 余 n 减一。' },
        { id: 'thm-2', text: '写成同余就是 n 减一的阶乘 ≡ 负一，模 n。' },
        { id: 'thm-3', text: '注意这是充要条件，素数满足它，也只有素数满足它。' },
      ],
    },
    {
      id: 'modfact',
      type: 'concept',
      title: '模 n 的阶乘',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mod-1', text: '阶乘增长极快，二十的阶乘就有十九位数，直接算必然溢出。' },
        { id: 'mod-2', text: '诀窍是边乘边取模：每乘一个数就对 n 取一次余数，结果始终待在零到 n 之间。' },
        { id: 'mod-3', text: '这样即便 n 很大，计算也稳稳当当，不会越界。' },
      ],
    },
    {
      id: 'contrast',
      type: 'concept',
      title: '素数与合数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '看图中的条形：素数处，余数恰好等于 n 减一，绿色条几乎顶到最高。' },
        { id: 'con-2', text: '合数处却大多塌成零，因为它的因子早已配对相乘，把余数抹平。' },
        { id: 'con-3', text: '唯一的例外是四，它的余数是二，其余合数都乖乖归零。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手验证',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块选一个 n，看它的余数是不是等于 n 减一。' },
        { id: 'int-2', text: '等式成立就是素数，塌陷为零就是合数，判据一试便知。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '威尔逊定理用一句同余式，精准圈出了所有素数。' },
        { id: 'sum-2', text: '取模阶乘让庞大的运算收进小小的余数里，优雅又可算。' },
        { id: 'sum-3', text: '一个阶乘，认出了素数的面孔，数学之美又添一笔，我们下次再见！' },
      ],
    },
  ],
}
