import type { NarrationScript } from '../types'

/**
 * 博弈论实验 - 口播稿件
 *
 * 核心概念：策略互动与纳什均衡
 * 目标受众：大学本科生，有基础概率知识
 */
export const gameTheoryNarration: NarrationScript = {
  id: 'game-theory',
  title: '博弈论',
  subtitle: '探索策略互动的数学',
  difficulty: 'intermediate',
  targetAge: '大学本科',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2025-01-06',
    updatedAt: '2025-01-06',
  },

  objectives: [
    '理解博弈论的基本框架',
    '掌握纳什均衡的概念',
    '分析囚徒困境等经典博弈',
    '了解博弈论在现实中的应用',
  ],

  prerequisites: [
    '基础概率知识',
    '矩阵的基本概念',
    '逻辑推理能力',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      lines: [
        {
          id: 'intro-1',
          text: '欢迎来到博弈论实验。',
        },
        {
          id: 'intro-2',
          text: '你有没有想过，为什么两家相邻的加油站价格总是差不多？',
        },
        {
          id: 'intro-3',
          text: '或者，为什么国家之间会陷入军备竞赛的困境？',
        },
        {
          id: 'intro-4',
          text: '博弈论正是研究这类策略互动的数学工具。',
        },
      ],
    },
    {
      id: 'concept',
      type: 'concept',
      title: '核心概念',
      lines: [
        {
          id: 'concept-1',
          text: '博弈论研究的是多个决策者之间的策略互动。',
        },
        {
          id: 'concept-2',
          text: '每个参与者都试图最大化自己的收益，同时考虑其他人的可能行动。',
        },
        {
          id: 'concept-3',
          text: '核心概念是纳什均衡：没有人能通过单方面改变策略来获得更好的结果。',
        },
        {
          id: 'concept-4',
          text: '这个概念由约翰·纳什在1950年提出，他因此获得了诺贝尔经济学奖。',
        },
      ],
    },
    {
      id: 'prisoner',
      type: 'animation',
      title: '囚徒困境',
      lines: [
        {
          id: 'prisoner-1',
          text: '让我们来看最著名的博弈：囚徒困境。',
        },
        {
          id: 'prisoner-2',
          text: '两个嫌疑人被分开审讯，每人可以选择沉默或背叛对方。',
        },
        {
          id: 'prisoner-3',
          text: '如果都沉默，各判1年；都背叛，各判3年；一人背叛一人沉默，背叛者释放，沉默者判5年。',
        },
        {
          id: 'prisoner-4',
          text: '理性分析表明，双方都会选择背叛，尽管双方沉默对整体更好。',
        },
      ],
    },
    {
      id: 'nash',
      type: 'concept',
      title: '纳什均衡',
      lines: [
        {
          id: 'nash-1',
          text: '囚徒困境中的双方背叛就是一个纳什均衡。',
        },
        {
          id: 'nash-2',
          text: '在这个状态下，任何一方单独改变策略都会让自己更糟。',
        },
        {
          id: 'nash-3',
          text: '纳什均衡不一定是最优结果，但它是一种稳定状态。',
        },
        {
          id: 'nash-4',
          text: '纳什证明了每个有限博弈至少存在一个纳什均衡。',
        },
      ],
    },
    {
      id: 'application',
      type: 'application',
      title: '实际应用',
      lines: [
        {
          id: 'app-1',
          text: '博弈论在现实中有广泛应用。',
        },
        {
          id: 'app-2',
          text: '在经济学中，它用于分析市场竞争和拍卖设计。',
        },
        {
          id: 'app-3',
          text: '在政治学中，它帮助理解国际关系和投票行为。',
        },
        {
          id: 'app-4',
          text: '在生物学中，它解释了动物的进化策略和合作行为。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      lines: [
        {
          id: 'sum-1',
          text: '今天我们探索了博弈论的基本概念。',
        },
        {
          id: 'sum-2',
          text: '博弈论揭示了理性个体如何在互动中做出决策。',
        },
        {
          id: 'sum-3',
          text: '它告诉我们，个体理性有时会导致集体非理性的结果。',
        },
        {
          id: 'sum-4',
          text: '希望这次实验能帮助你更好地理解策略思维。',
        },
      ],
    },
  ],
}
