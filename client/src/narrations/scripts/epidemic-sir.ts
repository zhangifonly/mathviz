import type { NarrationScript } from '../types'

/**
 * SIR 传染病模型 - 口播稿件
 * 核心概念：易感感染康复三仓室、基本再生数 R0、群体免疫阈值
 * 目标受众：高中以上
 */
export const epidemicSirNarration: NarrationScript = {
  id: 'epidemic-sir',
  title: 'SIR 传染病模型',
  subtitle: '用三条曲线看懂疫情的兴衰',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解易感、感染、康复三类人群的划分',
    '掌握 SIR 微分方程的含义',
    '理解基本再生数 R0 如何决定疫情走向',
    '认识群体免疫阈值的数学本质',
  ],

  prerequisites: ['了解百分比与比例', '初步了解变化率的概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一场传染病是怎么爆发、又怎么退去的？其实背后有一个非常优雅的数学模型。' },
        { id: 'intro-2', text: '它叫做 SIR 模型，把整个人群只分成三类人。' },
        { id: 'intro-3', text: '接下来，我们就用三条曲线，把疫情的兴衰完整地看一遍。' },
      ],
    },
    {
      id: 'compartments',
      type: 'concept',
      title: '三类人群',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'comp-1', text: 'S 是易感者，还没得病但可能被感染；I 是感染者，正带着病毒并会传染别人。' },
        { id: 'comp-2', text: 'R 是康复者，病好之后获得免疫，不再被传染，也不再传染别人。' },
        { id: 'comp-3', text: '随着时间推移，人们从易感变成感染，再从感染变成康复，像水从一个池子流向下一个。' },
      ],
    },
    {
      id: 'equations',
      type: 'concept',
      title: '变化的规则',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eq-1', text: '新增感染的速度，正比于易感者和感染者相遇的机会，也就是两者比例的乘积再乘上传染率。' },
        { id: 'eq-2', text: '同时，感染者会按康复率稳定地转为康复者。' },
        { id: 'eq-3', text: '易感只减不增，康复只增不减，中间的感染者先涨后落，形成一条钟形的曲线。' },
      ],
    },
    {
      id: 'r0',
      type: 'concept',
      title: '关键的 R0',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'r0-1', text: '最关键的数字是基本再生数 R0，它等于传染率除以康复率。' },
        { id: 'r0-2', text: '它的含义是：一个病人在完全易感的人群里，平均会传染给多少人。' },
        { id: 'r0-3', text: '如果 R0 大于一，疫情就会爆发；如果小于一，它会自己慢慢消退。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手调参',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着调高传染率，你会看到感染峰值更高、来得更早，医疗系统更容易被挤垮。' },
        { id: 'int-2', text: '当免疫人群的比例超过一减去 R0 分之一，疫情就传不下去了，这就是群体免疫阈值。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'SIR 模型用三类人群和两条速率，就刻画出了疫情的完整过程。' },
        { id: 'sum-2', text: 'R0 决定了会不会爆发，压低传染率就是在把 R0 拉到一以下。' },
        { id: 'sum-3', text: '简单的规则，深刻的洞见，这就是数学建模的力量，我们下次再见！' },
      ],
    },
  ],
}
