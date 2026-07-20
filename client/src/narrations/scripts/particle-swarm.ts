import type { NarrationScript } from '../types'

/**
 * 粒子群优化 - 口播稿件
 * 核心概念:群体智能、个体最优与全局最优、速度更新
 * 目标受众:高中及以上
 */
export const particleSwarmNarration: NarrationScript = {
  id: 'particle-swarm',
  title: '粒子群优化',
  subtitle: '群体智能寻优',
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
    '理解粒子群优化的群体智能思想',
    '掌握位置与速度的迭代更新规则',
    '区分个体最优与全局最优的作用',
    '感受简单规则涌现出的寻优能力',
  ],

  prerequisites: ['了解二维坐标', '了解函数最小值'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一群鸟在天空盘旋,寻找食物最多的地方。' },
        { id: 'intro-2', text: '没有谁指挥,可它们总能齐刷刷聚向最好的一片区域。' },
        { id: 'intro-3', text: '科学家把这种群体智慧抽象成算法,叫粒子群优化。' },
      ],
    },
    {
      id: 'position',
      type: 'concept',
      title: '位置与速度',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pos-1', text: '每只鸟看成一个粒子,它有一个位置,也有一个速度。' },
        { id: 'pos-2', text: '位置代表一个候选答案,我们要找的是让目标函数最小的地方。' },
        { id: 'pos-3', text: '速度决定它下一步往哪飞、飞多远。' },
      ],
    },
    {
      id: 'best',
      type: 'concept',
      title: '个体与全局最优',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'best-1', text: '每个粒子记着自己飞过的最好位置,这是个体最优。' },
        { id: 'best-2', text: '整群还共享一个大家去过的最好位置,这是全局最优。' },
        { id: 'best-3', text: '就是这两个记忆,牵引着群体不断靠近答案。' },
      ],
    },
    {
      id: 'update',
      type: 'concept',
      title: '速度更新',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'upd-1', text: '新速度由三股力量合成:惯性,让它保持原来的方向。' },
        { id: 'upd-2', text: '认知项,把它拉向自己的个体最优;社会项,把它拉向全局最优。' },
        { id: 'upd-3', text: '三者加权相加,粒子便在探索与聚拢之间取得平衡。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点击单步迭代,看散乱的粒子一步步向红环聚集。' },
        { id: 'int-2', text: '换个随机分布再试,每次的收敛路径都不一样。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '粒子群优化让一群简单的粒子协作,逼近函数的最小值。' },
        { id: 'sum-2', text: '惯性、个体最优、全局最优三力合成,驱动整群寻优。' },
        { id: 'sum-3', text: '简单的规则,涌现出聪明的群体,我们下次再见!' },
      ],
    },
  ],
}
