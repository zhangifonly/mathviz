import type { NarrationScript } from '../types'

/**
 * 谢尔宾斯基地毯 - 口播稿件
 * 核心概念：九宫格挖中心、递归自相似、分数维数 log8/log3
 * 目标受众：初中及以上
 */
export const sierpinskiCarpetNarration: NarrationScript = {
  id: 'sierpinski-carpet',
  title: '谢尔宾斯基地毯',
  subtitle: '二维挖洞分形',
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
    '理解九宫格挖中心的构造规则',
    '认识递归带来的自相似结构',
    '了解分数维数 log8/log3 的含义',
    '感受简单规则生成的无穷细节',
  ],

  prerequisites: ['了解正方形与面积', '了解乘方运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '想象一块方方正正的地毯，我们要在上面不断挖洞。' },
        { id: 'intro-2', text: '每挖一次，图案就多一层花纹，越挖越精细。' },
        { id: 'intro-3', text: '这就是谢尔宾斯基地毯，一种优美的二维分形。' },
      ],
    },
    {
      id: 'rule',
      type: 'concept',
      title: '九宫格挖中心',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rule-1', text: '先把正方形切成三行三列，一共九个小方格。' },
        { id: 'rule-2', text: '把正中间那一格挖空，只留下周围的八格。' },
        { id: 'rule-3', text: '这就是一次迭代，最基本的一步。' },
      ],
    },
    {
      id: 'recurse',
      type: 'concept',
      title: '递归自相似',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rec-1', text: '接着，对留下的每一个小方格,重复同样的挖洞规则。' },
        { id: 'rec-2', text: '每格又分出八个更小的格,一层套一层。' },
        { id: 'rec-3', text: '放大任意一角,都和整体长得一模一样,这叫自相似。' },
      ],
    },
    {
      id: 'dimension',
      type: 'concept',
      title: '分数维数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'dim-1', text: '每次边长缩小到三分之一,却留下八个副本。' },
        { id: 'dim-2', text: '维数等于 log8 除以 log3,约等于一点八九。' },
        { id: 'dim-3', text: '它比线更满,又比面更空,是介于一维和二维之间的存在。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整迭代层数,看地毯上的洞如何层层绽开。' },
        { id: 'int-2', text: '层数越高,细节越丰富,面积却越来越接近零。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '九宫格挖中心,再递归重复,就得到谢尔宾斯基地毯。' },
        { id: 'sum-2', text: '它自相似,维数是 log8 比 log3,面积趋于零。' },
        { id: 'sum-3', text: '简单的规则藏着无穷的细节,我们下次再见!' },
      ],
    },
  ],
}
