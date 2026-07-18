import type { NarrationScript } from '../types'

/**
 * 弦振动 - 口播稿件
 * 核心概念：波动方程、驻波与节点、基频与泛音、模态叠加
 * 目标受众：高中及以上
 */
export const vibratingStringNarration: NarrationScript = {
  id: 'vibrating-string',
  title: '弦振动',
  subtitle: '驻波与泛音',
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
    '理解两端固定弦的本征模态与驻波',
    '认识节点、腹以及波动方程的意义',
    '区分基频与泛音，理解音色的来源',
    '感受任意弦形由模态叠加而成',
  ],

  prerequisites: ['了解正弦函数', '了解简谐振动'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '拨动一根吉他弦，它来回抖动，空气随之发声。' },
        { id: 'intro-2', text: '奇妙的是，弦的两端被牢牢固定，中间却能自由摆动。' },
        { id: 'intro-3', text: '这看似简单的振动里，藏着一整套优美的数学。' },
      ],
    },
    {
      id: 'wave-eq',
      type: 'concept',
      title: '波动方程',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'wave-1', text: '弦上每一小段的加速度，正比于它两侧的弯曲程度。' },
        { id: 'wave-2', text: '把这条规律写成公式，就是描述弦运动的波动方程。' },
        { id: 'wave-3', text: '它的解，恰好是一族形状固定、只随时间伸缩的驻波。' },
      ],
    },
    {
      id: 'standing',
      type: 'concept',
      title: '驻波与节点',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'stand-1', text: '驻波不向前跑，它在原地上下起伏。' },
        { id: 'stand-2', text: '始终不动的点叫节点，摆幅最大的点叫腹。' },
        { id: 'stand-3', text: '第 n 阶驻波，弦上正好有 n 减一个内部节点。' },
      ],
    },
    {
      id: 'harmonics',
      type: 'concept',
      title: '基频与泛音',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'harm-1', text: '最简单的一阶驻波频率最低，叫基频，决定我们听到的音高。' },
        { id: 'harm-2', text: '二阶、三阶等更高频的驻波叫泛音，频率是基频的整数倍。' },
        { id: 'harm-3', text: '各泛音的强弱比例不同，同一个音高就有了不同的音色。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '勾选不同的模态，看单个驻波如何在原地起伏。' },
        { id: 'int-2', text: '再把几个模态叠加起来，弦形立刻变得复杂而生动。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '两端固定的弦，只能以一族驻波模态振动。' },
        { id: 'sum-2', text: '基频定音高，泛音配比定音色，任意弦形都是它们的叠加。' },
        { id: 'sum-3', text: '一根小小的弦，竟弹出如此深的数学，我们下次再见！' },
      ],
    },
  ],
}
