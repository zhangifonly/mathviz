/**
 * Descartes 角亏定理 讲解稿
 */
import type { NarrationScript } from '../types'

export const descartesDefectNarration: NarrationScript = {
  id: 'descartes-defect',
  title: 'Descartes 角亏定理',
  subtitle: '所有顶点的角亏加起来永远是 4π',
  difficulty: 'intermediate',
  targetAge: '高中 15-18岁',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解顶点角亏的定义',
    '掌握角亏总和恒为 4π 这一事实',
    '知道它与欧拉公式等价',
    '认识角亏是离散化的高斯曲率',
  ],
  prerequisites: ['多面体', '欧拉公式', '弧度制'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '顶点合不拢',
      lines: [
        {
          id: 'intro-1',
          text: '拿一个立方体，看它的任意一个顶点。三个正方形面在这里交汇，每个贡献九十度，加起来两百七十度。',
        },
        {
          id: 'intro-2',
          text: '但平面上一圈是三百六十度。所以还差九十度，合不拢。正是这个差额让平面弯成了立体。',
        },
        {
          id: 'intro-3',
          text: '这个差额叫角亏。屏幕上每个顶点画了一个黄色圆盘，越大表示角亏越多。',
        },
      ],
    },
    {
      id: 'theorem',
      type: 'formula',
      title: '总和永远是 4π',
      lines: [
        {
          id: 'th-1',
          text: '笛卡尔在一六三零年代发现了一件事：把所有顶点的角亏加起来，结果永远是四倍圆周率。',
        },
        {
          id: 'th-2',
          text: '立方体八个顶点，每个九十度，加起来七百二十度，正好是四倍圆周率。',
        },
        {
          id: 'th-3',
          text: '正四面体只有四个顶点，但每个角亏是一百八十度，乘四还是七百二十度。请切换立体验证。',
        },
      ],
    },
    {
      id: 'invariant',
      type: 'animation',
      title: '与形状无关',
      lines: [
        {
          id: 'iv-1',
          text: '这个总和与多面体长什么样完全无关。顶点越多，每个顶点分到的角亏就越少。',
        },
        {
          id: 'iv-2',
          text: '正十二面体有二十个顶点，每个只有三十六度；正二十面体十二个顶点，每个六十度。',
        },
        {
          id: 'iv-3',
          text: '但乘起来都是七百二十度。屏幕右侧的残差读数显示，五种立体的偏差都在十的负十四次方量级。',
        },
      ],
    },
    {
      id: 'euler',
      type: 'concept',
      title: '它就是欧拉公式',
      lines: [
        {
          id: 'eu-1',
          text: '这个定理比欧拉公式早了一百多年，而且两者其实是同一件事。',
        },
        {
          id: 'eu-2',
          text: '推导只需两步。角亏总和等于两倍圆周率乘顶点数，减去所有面角之和。而每个 n 边形的内角和是 n 减二再乘圆周率。',
        },
        {
          id: 'eu-3',
          text: '把面的边数总和等于两倍棱数代进去，整理得到：角亏总和等于两倍圆周率乘上顶点减棱加面。令它等于四倍圆周率，就是欧拉公式。',
        },
      ],
    },
    {
      id: 'curvature',
      type: 'interaction',
      title: '离散的曲率',
      lines: [
        {
          id: 'cv-1',
          text: '为什么恰好是四倍圆周率，而不是别的数？因为那正是单位球面的面积。',
        },
        {
          id: 'cv-2',
          text: '把多面体想成球面的粗糙近似，曲率全都集中在顶点上。角亏就是那一点的离散高斯曲率。',
        },
        {
          id: 'cv-3',
          text: '于是这条定理就是高斯-博内定理在多面体上的样子。我们之前讲过的球面盈余、双曲角亏，与它是同一件事的三种面孔。',
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
          text: '第一，顶点角亏等于两倍圆周率减去该点的面角和，凸多面体上恒为正。',
        },
        {
          id: 'sum-2',
          text: '第二，所有角亏之和永远是四倍圆周率，与顶点个数和形状都无关。',
        },
        {
          id: 'sum-3',
          text: '第三，这条定理与欧拉公式等价，本质是高斯-博内定理的离散形式。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
