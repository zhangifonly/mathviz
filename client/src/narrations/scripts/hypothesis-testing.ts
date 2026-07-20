import type { NarrationScript } from '../types'

/**
 * 假设检验 - 口播稿件
 * 核心概念：原假设与备择、检验统计量、p 值、显著性水平
 * 目标受众：高中及以上
 */
export const hypothesisTestingNarration: NarrationScript = {
  id: 'hypothesis-testing',
  title: '假设检验',
  subtitle: '用数据判断原假设',
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
    '理解原假设与备择假设的对立关系',
    '掌握单样本 z 检验统计量的构造',
    '理解 p 值与显著性水平的含义',
    '学会根据 p 值做出拒绝或保留的判断',
  ],

  prerequisites: ['了解正态分布', '了解样本均值与标准差'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一款新药宣称能提高疗效指标，可这真的有效，还是只是运气？' },
        { id: 'intro-2', text: '光看几个样本均值升高，并不能立刻下结论。' },
        { id: 'intro-3', text: '统计学给了我们一套严谨的裁决方法，叫做假设检验。' },
      ],
    },
    {
      id: 'hypothesis',
      type: 'concept',
      title: '原假设与备择',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'hyp-1', text: '我们先立一个原假设，说新药没用，指标均值仍等于旧值。' },
        { id: 'hyp-2', text: '再立一个备择假设，说均值确实发生了改变。' },
        { id: 'hyp-3', text: '检验的思路是：先假定原假设成立，看数据是否足够反常。' },
      ],
    },
    {
      id: 'statistic',
      type: 'formula',
      title: '检验统计量',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'stat-1', text: '把样本均值减去原假设的均值，再除以标准误，得到 z 统计量。' },
        { id: 'stat-2', text: '如果原假设为真，这个 z 值应当服从标准正态分布。' },
        { id: 'stat-3', text: 'z 离零越远，就说明观测结果与原假设越不相容。' },
      ],
    },
    {
      id: 'pvalue',
      type: 'concept',
      title: 'p 值与显著性',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pval-1', text: 'p 值是：若原假设为真，出现比当前更极端结果的概率。' },
        { id: 'pval-2', text: '我们事先设定显著性水平，比如 0.05，作为怀疑的门槛。' },
        { id: 'pval-3', text: 'p 值小于这个门槛，就把它落进拒绝域，拒绝原假设。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整样本均值，看那条 z 竖线如何滑向尾部的拒绝域。' },
        { id: 'int-2', text: '再切换显著性水平，感受门槛收紧后判断如何变得更谨慎。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '假设检验先立原假设，再用统计量衡量数据的反常程度。' },
        { id: 'sum-2', text: 'p 值小于显著性水平就拒绝，否则暂且保留原假设。' },
        { id: 'sum-3', text: '让数据替我们说话，理性地做出判断，我们下次再见！' },
      ],
    },
  ],
}
