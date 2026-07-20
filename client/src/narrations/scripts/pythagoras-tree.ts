import type { NarrationScript } from '../types'

/**
 * 毕达哥拉斯树 - 口播稿件
 * 核心概念：勾股定理的图形、递归自相似、分形生长
 * 目标受众：小学高年级及以上
 */
export const pythagorasTreeNarration: NarrationScript = {
  id: 'pythagoras-tree',
  title: '毕达哥拉斯树',
  subtitle: '勾股定理生长出的分形',
  difficulty: 'elementary',
  targetAge: '小学以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '从图形角度理解勾股定理',
    '认识毕达哥拉斯树的构造规则',
    '理解递归生长与每层翻倍',
    '感受分形的自相似之美',
  ],

  prerequisites: ['认识正方形和直角三角形'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '两千多年前，毕达哥拉斯发现了一个关于直角三角形的秘密。' },
        { id: 'intro-2', text: '两条直角边上正方形的面积之和，正好等于斜边上正方形的面积。' },
        { id: 'intro-3', text: '如果让这条规则不停地长下去，会画出什么呢？' },
      ],
    },
    {
      id: 'build',
      type: 'concept',
      title: '构造规则',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '先画一个正方形，作为整棵树的树干。' },
        { id: 'def-2', text: '在它的顶边上，架起一个直角三角形。' },
        { id: 'def-3', text: '三角形的两条直角边，又各自成为一个新正方形的底边。' },
      ],
    },
    {
      id: 'grow',
      type: 'concept',
      title: '递归生长',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'grow-1', text: '对每个新正方形，重复同样的动作：架三角形，长出两个更小的正方形。' },
        { id: 'grow-2', text: '每往上一层，正方形的数量就翻一倍。' },
        { id: 'grow-3', text: '一分二，二分四，越长越密，渐渐撑开一片茂密的树冠。' },
      ],
    },
    {
      id: 'fractal',
      type: 'concept',
      title: '自相似之美',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'frac-1', text: '仔细看，随便摘下一根枝条，它都和整棵树长得一模一样。' },
        { id: 'frac-2', text: '这种局部和整体相似的结构，就叫做分形。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '增加递归深度，看树冠如何变得越来越繁茂。' },
        { id: 'int-2', text: '再调整三角形的倾角，整棵树就会向左或向右舒展成不同的姿态。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '一个正方形，加上勾股定理的直角三角形，不断重复。' },
        { id: 'sum-2', text: '简单规则反复递归，就长成了自相似的分形树。' },
        { id: 'sum-3', text: '数学的种子里，藏着一整片森林，我们下次再见！' },
      ],
    },
  ],
}
