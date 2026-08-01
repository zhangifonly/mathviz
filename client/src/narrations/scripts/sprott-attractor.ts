/**
 * 斯普罗特极简吸引子 讲解稿
 */
import type { NarrationScript } from '../types'

export const sprottAttractorNarration: NarrationScript = {
  id: 'sprott-attractor',
  title: '斯普罗特极简吸引子',
  subtitle: '混沌最少需要几项',
  difficulty: 'expert',
  targetAge: '研究生+',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解混沌所需的最小方程复杂度',
    '分清耗散与混沌两个独立概念',
    '掌握保守系统的正确判据：散度的时间平均',
    '认识计算机穷举在数学发现中的作用',
  ],
  prerequisites: ['常微分方程', '混沌与李雅普诺夫指数', '散度'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '一个尖锐的问题',
      lines: [
        {
          id: 'intro-1',
          text: '洛伦兹系统展开后有七项，其中两个非线性项。罗斯勒系统也是七项，一个非线性项。',
        },
        {
          id: 'intro-2',
          text: '一九九四年斯普罗特问了个尖锐的问题：产生混沌到底最少需要多复杂的方程？能不能比七项更少？',
        },
        {
          id: 'intro-3',
          text: '他的做法很直接：让计算机穷举所有可能的三维二次系统，逐个检验是否混沌。这是计算机辅助数学发现的经典案例。',
        },
      ],
    },
    {
      id: 'answer',
      type: 'concept',
      title: '答案是五项',
      lines: [
        {
          id: 'an-1',
          text: '穷举的结果是十九个系统，全都只有五项或六项。斯普罗特按字母给它们编号，从 Case A 一直到 Case S。',
        },
        {
          id: 'an-2',
          text: '本实验收录三个代表。Case A 的方程是 x 导数等于 y，y 导数等于负 x 加 y z，z 导数等于一减 y 平方。',
        },
        {
          id: 'an-3',
          text: '数一数：三个方程加起来正好五项，其中两个是二次项。比洛伦兹少了整整两项，这就是极简的含金量。',
        },
      ],
    },
    {
      id: 'conservative',
      type: 'formula',
      title: '保守系统也能混沌',
      lines: [
        {
          id: 'cs-1',
          text: 'Case A 有个特别之处。算它的散度，得到的结果是 z，而不是一个负常数。',
        },
        {
          id: 'cs-2',
          text: '散度不是常数，那它是耗散还是保守？要看沿轨道的时间平均。实测这个平均值是负零点零零四，几乎正好是零。',
        },
        {
          id: 'cs-3',
          text: '也就是说 Case A 是保守系统，相空间体积长期不变。但它的李雅普诺夫指数是正零点零四三，确确实实混沌。',
        },
      ],
    },
    {
      id: 'misconception',
      type: 'concept',
      title: '澄清一个误解',
      lines: [
        {
          id: 'ms-1',
          text: '很多介绍会说混沌系统必须耗散。Case A 直接推翻了这个说法。',
        },
        {
          id: 'ms-2',
          text: '正确的表述是：耗散是存在吸引子的条件，不是存在混沌的条件。保守系统里的混沌轨道不收缩到低维集合上，但依然指数分离。',
        },
        {
          id: 'ms-3',
          text: '对比 Case B 和 Case C，它们的散度恒等于负一，是真正的耗散系统。三者都混沌，说明混沌与耗散确实独立。',
        },
      ],
    },
    {
      id: 'compare',
      type: 'interaction',
      title: '三个 Case 的对比',
      lines: [
        {
          id: 'cm-1',
          text: '请依次切换三个 Case，留意散度读数的差别。Case A 随位置变化，Case B 和 C 恒为负一。',
        },
        {
          id: 'cm-2',
          text: 'Case B 和 C 的差别只在第三个方程：一个是一减 x 乘 y，另一个是一减 x 平方。前两个方程完全相同。',
        },
        {
          id: 'cm-3',
          text: '这么小的差别却给出不同的吸引子形状，说明在极简系统里每一项都举足轻重，没有冗余可以删。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '回顾',
      lines: [
        {
          id: 'sum-1',
          text: '第一，斯普罗特用计算机穷举证明五项方程足以产生混沌，比洛伦兹少两项。',
        },
        {
          id: 'sum-2',
          text: '第二，Case A 的散度时间平均为零，是保守系统，却依然混沌。',
        },
        {
          id: 'sum-3',
          text: '第三，耗散是存在吸引子的条件，不是存在混沌的条件，两者相互独立。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
