import type { NarrationScript } from '../types'

/**
 * 本福特定律 - 口播稿件
 * 核心概念：首位数字分布、log(1+1/d)、反欺诈应用
 * 目标受众：初中及以上
 */
export const benfordsLawNarration: NarrationScript = {
  id: 'benfords-law',
  title: '本福特定律',
  subtitle: '首位数字的分布',
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
    '理解首位数字并非均匀分布',
    '掌握本福特概率公式 log(1+1/d)',
    '认识哪些数据服从本福特定律',
    '了解它在反欺诈中的应用',
  ],

  prerequisites: ['了解百分比', '了解对数的基本概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '随手翻开一本账簿，把每个数的首位数字记下来。' },
        { id: 'intro-2', text: '你可能以为 1 到 9 出现的机会应该差不多。' },
        { id: 'intro-3', text: '但真实数据里，以 1 开头的数远远最多，几乎占了三成。' },
      ],
    },
    {
      id: 'dist',
      type: 'concept',
      title: '首位分布',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '把首位数字画成柱状图，你会看到一条从高到低的滑梯。' },
        { id: 'def-2', text: '首位 1 最高，2 次之，一路递减到 9 最矮。' },
        { id: 'def-3', text: '这条规律叫本福特定律，广泛藏在自然与经济数据中。' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: '本福特公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'form-1', text: '首位是 d 的概率，等于 log 以 10 为底的 1 加 1 除以 d。' },
        { id: 'form-2', text: '代进去算：首位 1 约百分之三十点一，首位 9 只有百分之四点六。' },
        { id: 'form-3', text: '数据跨越很多数量级时，就会自然趴向这条曲线。' },
      ],
    },
    {
      id: 'fraud',
      type: 'concept',
      title: '反欺诈应用',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'app-1', text: '人们编造数字时，往往把首位平均分配，露出破绽。' },
        { id: 'app-2', text: '于是税务、财报和选举审计，都用本福特定律筛查造假。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换 2 的幂或斐波那契数列，蓝柱会紧贴红色理论曲线。' },
        { id: 'int-2', text: '再换成均匀随机数，柱子立刻被拉平，明显不服从定律。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '本福特定律说，首位数字按 log 加 1 除以 d 递减分布。' },
        { id: 'sum-2', text: '跨量级的真实数据几乎都遵守它，均匀随机数则不会。' },
        { id: 'sum-3', text: '一条对数曲线,竟能揪出藏在数字里的谎言，我们下次再见！' },
      ],
    },
  ],
}
