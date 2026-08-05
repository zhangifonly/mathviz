/**
 * 拟柱体公式 讲解稿
 */
import type { NarrationScript } from '../types'

export const prismatoidNarration: NarrationScript = {
  id: 'prismatoid',
  title: '拟柱体公式',
  subtitle: '只量三个截面就能算出体积',
  difficulty: 'intermediate',
  targetAge: '高中 15-18岁',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '掌握拟柱体公式的形式',
    '知道它对三次以内截面精确',
    '理解中学体积公式都是它的特例',
    '认识公式失效的边界',
  ],
  prerequisites: ['立体几何', '多项式', 'Cavalieri 原理'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '三个数字就够',
      lines: [
        {
          id: 'intro-1',
          text: '上一讲说过，体积等于截面积的积分。那要量无穷多个截面才行吗？',
        },
        {
          id: 'intro-2',
          text: '不用。有一条公式只需要三个截面：下底、正中间、上顶。',
        },
        {
          id: 'intro-3',
          text: '体积等于高除以六，乘上下底面积加四倍中间面积加上顶面积。这叫拟柱体公式。',
        },
      ],
    },
    {
      id: 'exact',
      type: 'formula',
      title: '它不是近似',
      lines: [
        {
          id: 'ex-1',
          text: '容易以为这只是个估算，但只要截面积随高度的变化是三次以内的多项式，公式就精确成立。',
        },
        {
          id: 'ex-2',
          text: '原因在辛普森公式：用一条抛物线穿过三个采样点，再积这条抛物线。',
        },
        {
          id: 'ex-3',
          text: '屏幕右边绿线是真实截面积曲线，黄虚线是穿过三点的抛物线。两条线重合时，公式就精确。',
        },
      ],
    },
    {
      id: 'cases',
      type: 'concept',
      title: '中学公式全在里面',
      lines: [
        {
          id: 'cs-1',
          text: '哪些立体的截面积是三次以内的？答案是：常见的全都是。',
        },
        {
          id: 'cs-2',
          text: '柱体的截面积是常数，零次。楔体线性，一次。锥体、台体、球都是二次。',
        },
        {
          id: 'cs-3',
          text: '所以柱、楔、锥、台、球这五个体积公式，全是同一条拟柱体公式的特例。请依次切换验证。',
        },
      ],
    },
    {
      id: 'sphere',
      type: 'animation',
      title: '球最惊人',
      lines: [
        {
          id: 'sp-1',
          text: '球的情形值得单独看。它的上下两端都是一个点，截面积都是零。',
        },
        {
          id: 'sp-2',
          text: '于是公式里只剩中间那一项：高除以六，乘四倍中间截面积。',
        },
        {
          id: 'sp-3',
          text: '高是二倍半径，中间截面是半径 r 的圆。代进去算出三分之四倍圆周率乘 r 立方，正是球的体积。只靠一刀就定出来了。',
        },
      ],
    },
    {
      id: 'limit',
      type: 'interaction',
      title: '什么时候失效',
      lines: [
        {
          id: 'lm-1',
          text: '既然有适用范围，就该看看越界会怎样。请切到四次截面那个人造例子。',
        },
        {
          id: 'lm-2',
          text: '这时两条曲线明显分开了。抛物线穿过三点，但在点之间偏离真实曲线，积出来的体积就不对。',
        },
        {
          id: 'lm-3',
          text: '屏幕上相对误差跳到百分之三点二，判定也从精确变成失效。这条边界很清楚：三次以内精确，四次开始只是近似。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '回顾',
      lines: [
        {
          id: 'sum-1',
          text: '第一，拟柱体公式用下底、中间、上顶三个截面算体积，系数是一、四、一，再除以六。',
        },
        {
          id: 'sum-2',
          text: '第二，截面积次数不超过三时公式精确，柱、楔、锥、台、球全部满足。',
        },
        {
          id: 'sum-3',
          text: '第三，本质是辛普森公式：积的其实是穿过三点的那条抛物线，四次以上就会偏。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
