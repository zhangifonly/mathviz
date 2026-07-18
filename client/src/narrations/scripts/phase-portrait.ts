import type { NarrationScript } from '../types'

/**
 * 相图分析 - 口播稿件
 * 核心概念：线性系统 x'=Ax、向量场、平衡点、特征值分类
 * 目标受众：高中及以上
 */
export const phasePortraitNarration: NarrationScript = {
  id: 'phase-portrait',
  title: '相图分析',
  subtitle: '平衡点的类型',
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
    '理解相平面与向量场的含义',
    '认识平衡点及其稳定性',
    '掌握用迹与行列式判别结点鞍点焦点中心',
    '通过轨线直观感受系统的长期行为',
  ],

  prerequisites: ['了解导数', '了解矩阵与特征值'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有些微分方程很难解出公式，但我们其实不必解它。' },
        { id: 'intro-2', text: '只要看解在平面上如何流动，就能读懂系统的命运。' },
        { id: 'intro-3', text: '这就是相图分析，一种用几何眼光看动力系统的方法。' },
      ],
    },
    {
      id: 'field',
      type: 'concept',
      title: '相平面与向量场',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'field-1', text: '把状态画成平面上的点，方程 x撇 等于 A x 就给每个点指定一个速度箭头。' },
        { id: 'field-2', text: '所有箭头汇成一片向量场，像水面的暗流指引着运动方向。' },
        { id: 'field-3', text: '顺着箭头走，就描出一条轨线，也就是系统真实的演化路径。' },
      ],
    },
    {
      id: 'equil',
      type: 'concept',
      title: '平衡点',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eq-1', text: '有一个特殊的点，速度恰好为零，那里的状态永不改变。' },
        { id: 'eq-2', text: '它就是平衡点，对线性系统来说正是原点。' },
        { id: 'eq-3', text: '附近的轨线是被它吸引还是被它推开，决定了系统稳定与否。' },
      ],
    },
    {
      id: 'classify',
      type: 'concept',
      title: '特征值分类',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cls-1', text: '矩阵 A 的特征值揭示一切：由迹与行列式就能判断。' },
        { id: 'cls-2', text: '两个同号实特征值是结点，一正一负是鞍点。' },
        { id: 'cls-3', text: '共轭复特征值让轨线打转，实部不为零是焦点，纯虚数则是中心。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的系统，看向量场与轨线如何随之改变。' },
        { id: 'int-2', text: '对照迹和行列式，验证平衡点的类型是否与你的判断一致。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '相图让我们不解方程也能看清系统的行为。' },
        { id: 'sum-2', text: '结点鞍点焦点中心，四种类型都写在特征值里。' },
        { id: 'sum-3', text: '用几何读懂动力系统，我们下次再见！' },
      ],
    },
  ],
}
