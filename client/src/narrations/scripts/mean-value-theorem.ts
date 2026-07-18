import type { NarrationScript } from '../types'

/**
 * 中值定理 - 口播稿件
 * 核心概念：平均变化率、割线斜率、拉格朗日中值定理、罗尔定理
 * 目标受众：高中及以上
 */
export const meanValueTheoremNarration: NarrationScript = {
  id: 'mean-value-theorem',
  title: '中值定理',
  subtitle: '切线平行于割线',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解平均变化率与割线斜率的关系',
    '掌握拉格朗日中值定理的几何意义',
    '认识罗尔定理是中值定理的特例',
    '学会用数值方法寻找中值点',
  ],

  prerequisites: ['了解导数概念', '了解直线斜率'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '开车从 A 地到 B 地，平均时速是总路程除以总时间。' },
        { id: 'intro-2', text: '这个平均变化率，在图像上就是连接起点终点的那条割线的斜率。' },
        { id: 'intro-3', text: '一个自然的问题是：路上有没有某个瞬间，恰好跑出这个平均速度？' },
      ],
    },
    {
      id: 'secant',
      type: 'concept',
      title: '割线斜率',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sec-1', text: '割线斜率等于 f(b) 减 f(a)，再除以 b 减 a。' },
        { id: 'sec-2', text: '它衡量的是整个区间上，函数值的总体升降快慢。' },
        { id: 'sec-3', text: '而曲线上每一点的切线斜率，就是那一瞬间的导数。' },
      ],
    },
    {
      id: 'mvt',
      type: 'concept',
      title: '中值定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mvt-1', text: '拉格朗日中值定理说：只要函数连续又光滑，区间内必有一点 c。' },
        { id: 'mvt-2', text: '在这一点，切线斜率恰好等于割线斜率，两条线彼此平行。' },
        { id: 'mvt-3', text: '也就是说，瞬时变化率总会在某处追平平均变化率。' },
      ],
    },
    {
      id: 'rolle',
      type: 'concept',
      title: '罗尔定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rolle-1', text: '如果两端点函数值相等，割线就变成水平线，斜率为零。' },
        { id: 'rolle-2', text: '这时必有一点导数为零，那正是曲线的峰或谷，这就是罗尔定理。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一个函数或调整区间，红色割线会随之移动。' },
        { id: 'int-2', text: '注意那条绿色切线始终与割线平行，中值点 c 也随之改变。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '中值定理保证平均变化率一定会被某个瞬时变化率取到。' },
        { id: 'sum-2', text: '几何上，就是曲线上总有一点的切线平行于两端的割线。' },
        { id: 'sum-3', text: '罗尔定理是它水平时的特例，我们下次再见！' },
      ],
    },
  ],
}
