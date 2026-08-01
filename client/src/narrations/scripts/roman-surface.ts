/**
 * 罗马曲面 讲解稿
 */
import type { NarrationScript } from '../types'

export const romanSurfaceNarration: NarrationScript = {
  id: 'roman-surface',
  title: '罗马曲面',
  subtitle: '斯坦纳的四次曲面',
  difficulty: 'expert',
  targetAge: '研究生+',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '认识罗马曲面的参数方程与隐式四次方程',
    '理解对径点粘合如何体现射影平面的结构',
    '掌握自交线、分支点、三重点这三类奇异结构',
    '体会代数曲面的对称性如何从方程读出',
  ],
  prerequisites: ['参数曲面', '射影平面', '多项式方程'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '在罗马的发现',
      lines: [
        {
          id: 'intro-1',
          text: '一八四四年，瑞士数学家雅各布·斯坦纳访问罗马时发现了一张奇特的曲面。后人就用发现地给它命名，叫罗马曲面。',
        },
        {
          id: 'intro-2',
          text: '它和交叉帽一样，是实射影平面在三维空间中的浸入。但它的对称性要漂亮得多，方程也更加规整。',
        },
        {
          id: 'intro-3',
          text: '屏幕上这个形状看起来像四片花瓣拧在一起，实际上它是三条自交线相互穿插的结果。',
        },
      ],
    },
    {
      id: 'equation',
      type: 'formula',
      title: '两种方程',
      lines: [
        {
          id: 'eq-1',
          text: '罗马曲面可以用两种方式描述。参数形式用两个角度 u 和 v，三个坐标都是它们正弦余弦的乘积。',
        },
        {
          id: 'eq-2',
          text: '隐式形式更漂亮：x 方 y 方加 y 方 z 方加 z 方 x 方，等于 a 方乘以 x y z。这是一个四次代数曲面。',
        },
        {
          id: 'eq-3',
          text: '你可以在屏幕上看到隐式方程的残差读数。参数方程给出的每一个点，代进隐式方程都精确地等于零。',
        },
      ],
    },
    {
      id: 'projective',
      type: 'concept',
      title: '射影平面的体现',
      lines: [
        {
          id: 'proj-1',
          text: '怎么看出它是射影平面？关键在一个恒等式：参数 u 和 v 与 u 加圆周率、圆周率减 v 这一对，映到空间中完全相同的点。',
        },
        {
          id: 'proj-2',
          text: '这正是射影平面的定义方式。把球面上每一对对径点认同为同一个点，得到的商空间就是射影平面。',
        },
        {
          id: 'proj-3',
          text: '所以参数域虽然是个矩形，但因为这种成对认同，它实际描述的是一张不可定向的闭曲面。',
        },
      ],
    },
    {
      id: 'singular',
      type: 'animation',
      title: '三类奇异结构',
      lines: [
        {
          id: 'sing-1',
          text: '罗马曲面的奇异结构比交叉帽丰富。首先是三条自交线，它们分别沿着 x 轴、y 轴和 z 轴伸展。',
        },
        {
          id: 'sing-2',
          text: '每条自交线段的两端各有一个分支点，三条线一共六个。这也是它比交叉帽复杂的地方。',
        },
        {
          id: 'sing-3',
          text: '最特别的是原点。三条自交线在那里交汇，曲面在这一点有三片同时穿过，这叫三重点，整张曲面只有一个。',
        },
      ],
    },
    {
      id: 'symmetry',
      type: 'interaction',
      title: '对称性',
      lines: [
        {
          id: 'sym-1',
          text: '请旋转视角观察这张曲面。你会发现无论从 x、y 还是 z 方向看过去，看到的形状都是一样的。',
        },
        {
          id: 'sym-2',
          text: '这不是巧合。隐式方程里三个变量的地位完全对称，任意交换 x、y、z 方程都不变，所以曲面必然有这种对称性。',
        },
        {
          id: 'sym-3',
          text: '拖动尺度滑块时注意，整个曲面按 a 的平方等比缩放，三条自交线的半长恰好是 a 平方除以二。',
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
          text: '第一，罗马曲面是斯坦纳一八四四年发现的四次代数曲面，也是射影平面的一种浸入。',
        },
        {
          id: 'sum-2',
          text: '第二，它有三条沿坐标轴的自交线、六个分支点和一个位于原点的三重点。',
        },
        {
          id: 'sum-3',
          text: '第三，隐式方程中三个变量完全对称，这直接决定了曲面的高度对称外形。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
