import type { NarrationScript } from '../types'

/**
 * 赌徒破产 - 口播稿件
 * 核心概念：带吸收壁的一维随机游走、破产概率公式、公平vs不公平赌局
 * 目标受众：高中及以上
 */
export const gamblersRuinNarration: NarrationScript = {
  id: 'gamblers-ruin',
  title: '赌徒破产',
  subtitle: '随机游走到破产或达标',
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
    '理解赌徒破产是带两个吸收壁的随机游走',
    '掌握公平与不公平赌局的破产概率公式',
    '认识微小胜率劣势带来的长期必输',
    '体会本金与目标比例对结局的影响',
  ],

  prerequisites: ['了解概率基础', '了解随机游走概念'],

  sections: [
    {
      id: 'intro', type: 'intro', title: '开场引入', trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个赌徒带着一笔本金走进赌场，心里盘算着翻倍就收手。' },
        { id: 'intro-2', text: '他要么先输光离场，要么先达到目标金额。' },
        { id: 'intro-3', text: '问题是：这两种结局，各自会以多大的概率降临？' },
        { id: 'intro-4', text: '这就是概率论里著名的赌徒破产问题。' },
      ],
    },
    {
      id: 'walk', type: 'concept', title: '随机游走', trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'walk-1', text: '每赌一局，资金就上下跳动一元，像在数轴上左右随机迈步。' },
        { id: 'walk-2', text: '资金触到零就破产，触到目标就达标，这是两道吸收壁。' },
        { id: 'walk-3', text: '只要一直玩下去，游走终究会撞上其中一道壁停下。' },
      ],
    },
    {
      id: 'formula', type: 'concept', title: '破产概率公式', trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'form-1', text: '若每局输赢机会均等，破产概率就是目标减本金再除以目标。' },
        { id: 'form-2', text: '换句话说，本金占目标的比例越小，破产的可能就越大。' },
        { id: 'form-3', text: '若胜率不到一半，则要用输赢比的幂次公式来精确计算。' },
      ],
    },
    {
      id: 'fairness', type: 'concept', title: '公平与不公平', trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fair-1', text: '公平赌局里，破产与达标的概率恰好由本金和目标的比例决定。' },
        { id: 'fair-2', text: '可一旦胜率哪怕只低了一两个百分点，破产概率就急剧攀升。' },
        { id: 'fair-3', text: '赌场正是靠这点微小而稳定的优势，让长期玩家几乎必输。' },
      ],
    },
    {
      id: 'interaction', type: 'interaction', title: '亲手探索', trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同赌局设置，调整本金与胜率，看多局轨迹奔向哪道壁。' },
        { id: 'int-2', text: '点击重新模拟，对照理论破产概率，感受红绿两色的此消彼长。' },
      ],
    },
    {
      id: 'summary', type: 'summary', title: '总结', trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '赌徒破产，是一场带两道吸收壁的随机游走。' },
        { id: 'sum-2', text: '公平时看本金比例，不公平时那点劣势会被无限放大。' },
        { id: 'sum-3', text: '数学早已告诉我们久赌必输的道理，我们下次再见！' },
      ],
    },
  ],
}
