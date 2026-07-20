import type { NarrationScript } from '../types'

/**
 * 约瑟夫问题 - 口播稿件
 * 核心概念：循环报数出局、递推公式、幸存者位置
 * 目标受众：初中及以上
 */
export const josephusProblemNarration: NarrationScript = {
  id: 'josephus-problem',
  title: '约瑟夫问题',
  subtitle: '循环报数出局',
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
    '理解约瑟夫问题的报数出局规则',
    '掌握递推公式 J(n,k)=(J(n-1,k)+k)%n',
    '会推导最终幸存者的位置',
    '感受递推思想化繁为简的力量',
  ],

  prerequisites: ['了解取余运算', '了解数列递推'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '相传古代有一群人围成一圈，约定用报数来决定命运。' },
        { id: 'intro-2', text: '他们从第一个人开始报数，数到某个数字的人就要出局。' },
        { id: 'intro-3', text: '一圈又一圈，人越来越少，谁能坚持到最后呢？' },
      ],
    },
    {
      id: 'rule',
      type: 'concept',
      title: '出局规则',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rule-1', text: 'n 个人围成圈，从第一人开始，每数到第 k 个人就让他出局。' },
        { id: 'rule-2', text: '出局后不再参与，从下一个人继续报数，圈子越缩越小。' },
        { id: 'rule-3', text: '如此循环，直到圈里只剩下唯一的一个幸存者。' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: '递推公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'formula-1', text: '直接模拟当然可以，但数学家找到了更漂亮的递推关系。' },
        { id: 'formula-2', text: '用零基编号，只剩一人时答案是零，即 J(1,k)=0。' },
        { id: 'formula-3', text: '每多一个人，答案就整体平移 k 位再取余：J(n,k)=(J(n-1,k)+k)%n。' },
      ],
    },
    {
      id: 'survivor',
      type: 'concept',
      title: '幸存者位置',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'survivor-1', text: '从一个人层层递推到 n 个人，最后加一就换回我们熟悉的编号。' },
        { id: 'survivor-2', text: '比如七人每数到三出局，幸存者恰好是第四号。' },
        { id: 'survivor-3', text: '递推把一次次繁琐的报数，浓缩成短短几步计算。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块改变人数 n 和报数 k，看幸存者如何变化。' },
        { id: 'int-2', text: '点击播放，跟着灰色圆点一个个熄灭，见证幸存者诞生。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '约瑟夫问题用报数出局的规则，考验谁能笑到最后。' },
        { id: 'sum-2', text: '一条简洁的递推公式，就能预言那个幸运的位置。' },
        { id: 'sum-3', text: '递推的力量，让复杂问题变得清晰，我们下次再见！' },
      ],
    },
  ],
}
