import type { NarrationScript } from '../types'

/**
 * 吉布斯现象 - 口播稿件
 * 核心概念：方波的傅里叶部分和、跳变处过冲、9% 不消失
 * 目标受众：高中及以上
 */
export const gibbsPhenomenonNarration: NarrationScript = {
  id: 'gibbs-phenomenon',
  title: '吉布斯现象',
  subtitle: '跳变处的过冲',
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
    '理解方波的傅里叶部分和逼近',
    '认识跳变点附近的过冲振铃',
    '知道过冲约 9% 且不随项数消失',
    '感受收敛与逐点逼近的微妙差别',
  ],

  prerequisites: ['了解正弦函数', '了解傅里叶级数的思想'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个方波，棱角分明，上下笔直地跳变。' },
        { id: 'intro-2', text: '我们能否用光滑的正弦波，一层层把它拼出来？' },
        { id: 'intro-3', text: '傅里叶说可以，只要把足够多的正弦叠加起来。' },
      ],
    },
    {
      id: 'partial',
      type: 'concept',
      title: '傅里叶部分和',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '方波的傅里叶级数只含奇次谐波：sin x、sin 3x、sin 5x……' },
        { id: 'def-2', text: '取前 n 项相加，就得到部分和，它像波浪一样贴近方波。' },
        { id: 'def-3', text: '项数越多，平坦段越平，逼近看起来越来越好。' },
      ],
    },
    {
      id: 'overshoot',
      type: 'concept',
      title: '跳变处的过冲',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ovs-1', text: '可是盯住跳变点，你会发现曲线总是冲过了头。' },
        { id: 'ovs-2', text: '紧挨跳变的地方，鼓起一个小尖角，然后来回振铃。' },
        { id: 'ovs-3', text: '这个顶峰，永远比方波的真实电平高出一截。' },
      ],
    },
    {
      id: 'gibbs',
      type: 'concept',
      title: '9% 不消失',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gib-1', text: '奇妙的是，这个过冲约等于跳变量的百分之九。' },
        { id: 'gib-2', text: '无论加到五十项还是五千项，它都顽固地停在九个百分点。' },
        { id: 'gib-3', text: '增加项数只让振铃越挤越窄，峰却压不下去，这就是吉布斯现象。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调大项数，看平坦段迅速变平，逼近越来越好。' },
        { id: 'int-2', text: '再盯着跳变点的红色尖峰，它却始终高高地立在那儿。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '部分和整体收敛，跳变点却留下固定的过冲。' },
        { id: 'sum-2', text: '这提醒我们：逐点逼近和一致逼近，并不是一回事。' },
        { id: 'sum-3', text: '一道跳变，藏着九个百分点的秘密，我们下次再见！' },
      ],
    },
  ],
}
