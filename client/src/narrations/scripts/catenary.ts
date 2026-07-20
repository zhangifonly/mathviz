import type { NarrationScript } from '../types'

/**
 * 悬链线 - 口播稿件
 * 核心概念：双曲余弦曲线、与抛物线的区别、倒置最优拱、弧长
 * 目标受众：高中及以上
 */
export const catenaryNarration: NarrationScript = {
  id: 'catenary',
  title: '悬链线',
  subtitle: '双曲余弦的曲线',
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
    '理解悬链线方程 y=a·cosh(x/a) 的由来',
    '分辨悬链线与抛物线的异同',
    '认识倒置悬链线作为最优受压拱',
    '了解悬链线的弧长闭式公式',
  ],

  prerequisites: ['了解指数函数', '了解抛物线'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '抓住一条项链或电线的两端，让它自然下垂。' },
        { id: 'intro-2', text: '它会摆出一条优雅的下弯曲线，两端翘起，中间最低。' },
        { id: 'intro-3', text: '这条曲线有个专门的名字，叫做悬链线。' },
      ],
    },
    {
      id: 'cosh',
      type: 'concept',
      title: '双曲余弦',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '悬链线的方程是 y 等于 a 乘以双曲余弦 x 除以 a。' },
        { id: 'def-2', text: '双曲余弦，就是 e 的 x 次方与 e 的负 x 次方之和的一半。' },
        { id: 'def-3', text: '参数 a 决定曲线的胖瘦，a 越小垂得越深，a 越大越平坦。' },
      ],
    },
    {
      id: 'parabola',
      type: 'concept',
      title: '与抛物线的区别',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'par-1', text: '很多人以为下垂的链条是抛物线，其实不是。' },
        { id: 'par-2', text: '在顶点附近两者几乎重合，但离开中心后，悬链线上升得更快。' },
        { id: 'par-3', text: '伽利略当年也猜成了抛物线，直到后人用微积分才算清真相。' },
      ],
    },
    {
      id: 'arch',
      type: 'concept',
      title: '倒置成最优拱',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'arc-1', text: '把悬链线上下翻转，就得到一道拱。' },
        { id: 'arc-2', text: '这样的拱只承受压力，没有弯矩，是最省力的形状。' },
        { id: 'arc-3', text: '高迪设计圣家堂时，就用倒挂的链条模型来寻找这种拱。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整参数 a，看曲线在深与平之间连续变化。' },
        { id: 'int-2', text: '打开对比抛物线，再点倒置，亲眼看看它变成拱的样子。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '悬链线是柔软链条自然下垂的形状，方程用双曲余弦描述。' },
        { id: 'sum-2', text: '它像抛物线却不是，倒过来又成为最优的受压拱。' },
        { id: 'sum-3', text: '一条链条里藏着这么多数学，我们下次再见！' },
      ],
    },
  ],
}
