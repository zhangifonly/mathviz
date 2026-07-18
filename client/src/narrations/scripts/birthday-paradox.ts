import type { NarrationScript } from '../types'

/**
 * 生日悖论 - 口播稿件
 * 核心概念：补事件求概率、组合配对爆炸、反直觉的概率增长
 * 目标受众：初中及以上
 */
export const birthdayParadoxNarration: NarrationScript = {
  id: 'birthday-paradox',
  title: '生日悖论',
  subtitle: '23人竟有一半概率同天',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解生日悖论为何反直觉',
    '学会用补事件计算碰撞概率',
    '认识 23 人过半、70 人几乎必然的结论',
    '体会组合配对数量的快速增长',
  ],

  prerequisites: ['了解概率的基本含义', '了解百分数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一间教室里坐着二十三个人，我问一句：有没有两个人生日恰好在同一天？' },
        { id: 'intro-2', text: '大多数人会觉得，一年有三百六十五天，这么巧的事应该很少见。' },
        { id: 'intro-3', text: '可数学给出的答案是：这件事发生的概率，竟然超过了一半。' },
      ],
    },
    {
      id: 'counter',
      type: 'concept',
      title: '为何反直觉',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cnt-1', text: '我们容易把问题想成：某个人和我同一天，那确实很难。' },
        { id: 'cnt-2', text: '但真正比较的是任意两个人的配对，二十三个人能凑出两百五十三对。' },
        { id: 'cnt-3', text: '这么多对同时去碰运气，撞上的机会自然就大了起来。' },
      ],
    },
    {
      id: 'complement',
      type: 'concept',
      title: '用补事件计算',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cmp-1', text: '直接数碰撞很麻烦，我们换个角度，先算所有人生日都不同的概率。' },
        { id: 'cmp-2', text: '第二个人要避开一天，第三个避开两天，一路乘下去，这个乘积越来越小。' },
        { id: 'cmp-3', text: '用一减去这个乘积，就是至少两人同天的概率了。' },
      ],
    },
    {
      id: 'result',
      type: 'concept',
      title: '关键的数字',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'res-1', text: '算下来，二十三个人时概率约为百分之五十点七，刚好过半。' },
        { id: 'res-2', text: '到了七十个人，概率高达百分之九十九点九，几乎必然会撞。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块改变人数，看曲线怎样迅速爬过那条百分之五十的虚线。' },
        { id: 'int-2', text: '再点模拟按钮,让计算机反复布置房间，模拟频率会紧紧贴着理论曲线。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '生日悖论的关键，是比较所有配对，而不是拿自己去比。' },
        { id: 'sum-2', text: '借助补事件，我们把复杂的概率算得干净利落。' },
        { id: 'sum-3', text: '直觉常常骗人，而数学帮我们看清真相，我们下次再见！' },
      ],
    },
  ],
}
