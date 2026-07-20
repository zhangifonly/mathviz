import type { NarrationScript } from '../types'

/**
 * 弧长与曲率 - 口播稿件
 * 核心概念：弧长积分、曲率定义、密切圆（曲率圆）
 * 目标受众：高中及以上
 */
export const arcLengthCurvatureNarration: NarrationScript = {
  id: 'arc-length-curvature',
  title: '弧长与曲率',
  subtitle: '曲线的长度与弯曲',
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
    '理解用积分求参数曲线弧长的思路',
    '掌握曲率 κ 的定义与几何意义',
    '认识密切圆（曲率圆）与曲率半径',
    '体会切向量与法向量随点移动的变化',
  ],

  prerequisites: ['了解导数', '了解定积分'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一条弯弯曲曲的曲线，我们想问它两件事。' },
        { id: 'intro-2', text: '第一，它到底有多长；第二，它在每一点弯得有多厉害。' },
        { id: 'intro-3', text: '长度叫弧长，弯曲程度叫曲率，今天就把它们讲清楚。' },
      ],
    },
    {
      id: 'length',
      type: 'concept',
      title: '弧长积分',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'len-1', text: '把曲线切成许多极小的段，每一小段几乎就是一条直线。' },
        { id: 'len-2', text: '每段长度约等于速度乘以时间，速度就是根号下 x 撇平方加 y 撇平方。' },
        { id: 'len-3', text: '把所有小段加起来取极限，就是弧长积分：对速度从 a 到 b 积分。' },
      ],
    },
    {
      id: 'curvature',
      type: 'concept',
      title: '曲率定义',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cur-1', text: '曲率衡量方向转变的快慢，转得越急，曲率越大。' },
        { id: 'cur-2', text: '对参数曲线，曲率 κ 等于 x 撇乘 y 两撇减 y 撇乘 x 两撇，再除以速度的三次方。' },
        { id: 'cur-3', text: '直线永不转向，曲率为零；圆处处一样弯，曲率恒为半径的倒数。' },
      ],
    },
    {
      id: 'osculate',
      type: 'concept',
      title: '密切圆',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'osc-1', text: '在曲线的某一点，画一个与它贴合得最紧的圆，这就是密切圆。' },
        { id: 'osc-2', text: '密切圆的半径正好是曲率半径，也就是曲率的倒数，一比 κ。' },
        { id: 'osc-3', text: '曲线越弯，密切圆越小；曲线越直，密切圆越大直到变成直线。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块移动那个点，看密切圆如何随弯曲程度胀大或缩小。' },
        { id: 'int-2', text: '再换成抛物线或螺线，观察切向量和法向量怎样一路转动。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '弧长是把速度沿参数积分得到的曲线总长。' },
        { id: 'sum-2', text: '曲率描述弯曲快慢，它的倒数是密切圆的半径。' },
        { id: 'sum-3', text: '长度与弯曲，两把尺子丈量曲线的一切，我们下次再见！' },
      ],
    },
  ],
}
