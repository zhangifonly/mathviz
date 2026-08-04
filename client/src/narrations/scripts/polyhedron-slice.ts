/**
 * 多面体截面 讲解稿
 */
import type { NarrationScript } from '../types'

export const polyhedronSliceNarration: NarrationScript = {
  id: 'polyhedron-slice',
  title: '多面体截面',
  subtitle: '立方体能切出正六边形',
  difficulty: 'intermediate',
  targetAge: '高中 15-18岁',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '掌握平面与多面体求交的方法',
    '知道立方体可以切出正六边形',
    '理解截面边数不超过面数',
    '认识切平面位置如何改变截面形状',
  ],
  prerequisites: ['多面体', '平面方程', '向量'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '切一刀看看',
      lines: [
        {
          id: 'intro-1',
          text: '拿一个立方体，用一个平面把它切开。切口是什么形状？',
        },
        {
          id: 'intro-2',
          text: '平行于面切，得到正方形，这个不奇怪。斜着切呢？',
        },
        {
          id: 'intro-3',
          text: '如果沿着体对角线的垂直方向、从正中间切过去，切口是一个正六边形。一个只有正方形面的立体，却能切出六边形。',
        },
      ],
    },
    {
      id: 'algorithm',
      type: 'formula',
      title: '怎么算出来',
      lines: [
        {
          id: 'al-1',
          text: '算法很直接。对立体的每一个面，求这个平面与该面的交线段。',
        },
        {
          id: 'al-2',
          text: '具体做法是看每条棱的两个端点在平面的哪一侧。异号说明这条棱穿过平面，用线性插值算出交点。',
        },
        {
          id: 'al-3',
          text: '最后一步最关键：把所有线段首尾相接排成一个环。线段的产生顺序是任意的，不排序就画成一团乱线。',
        },
      ],
    },
    {
      id: 'hexagon',
      type: 'animation',
      title: '正六边形的由来',
      lines: [
        {
          id: 'hx-1',
          text: '为什么中间那一刀恰好是正的？因为体对角线是立方体的三重对称轴。',
        },
        {
          id: 'hx-2',
          text: '绕这根轴转一百二十度，立方体回到自己。截面也必须回到自己，所以它有三重对称。',
        },
        {
          id: 'hx-3',
          text: '再加上过中心的对称性，六条边只能全部等长。屏幕上的读数确认：边长极差为零，内角都是一百二十度。',
        },
      ],
    },
    {
      id: 'sweep',
      type: 'interaction',
      title: '扫过去看变化',
      lines: [
        {
          id: 'sw-1',
          text: '请拖动位置滑块，让切平面从一头扫到另一头。',
        },
        {
          id: 'sw-2',
          text: '一开始切到一个角，是正三角形。往中间移动，三角形的角被削掉，变成六边形。',
        },
        {
          id: 'sw-3',
          text: '注意只有正中间那一刀是正六边形。两侧虽然也是六边形，但边长不齐，屏幕上的正多边形判定会显示否。',
        },
      ],
    },
    {
      id: 'others',
      type: 'concept',
      title: '别的立体',
      lines: [
        {
          id: 'ot-1',
          text: '正四面体更反直觉。它只有四个三角形面，但在中间高度水平切，截面是正方形。',
        },
        {
          id: 'ot-2',
          text: '正八面体沿三重轴切，同样得到正六边形，与立方体那一刀呼应，因为两者互为对偶。',
        },
        {
          id: 'ot-3',
          text: '有个通用的上界：截面的边数不会超过立体的面数，因为切口的每条边都来自某一个面。',
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
          text: '第一，平面切多面体的算法是逐面求交，再把线段接成环。',
        },
        {
          id: 'sum-2',
          text: '第二，立方体沿体对角线过中心切出正六边形，正四面体能切出正方形。',
        },
        {
          id: 'sum-3',
          text: '第三，截面边数不超过面数，而对称轴决定了哪一刀切出的是正多边形。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
