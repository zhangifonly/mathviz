/**
 * 平均曲率流 讲解稿
 */
import type { NarrationScript } from '../types'

export const meanCurvatureFlowNarration: NarrationScript = {
  id: 'mean-curvature-flow',
  title: '平均曲率流',
  subtitle: '几何中的热方程',
  difficulty: 'expert',
  targetAge: '研究生+',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解平均曲率流的定义与几何直觉',
    '掌握球面与圆柱的解析解',
    '认识奇点形成的机制',
    '了解流在几何分析中的地位',
  ],
  prerequisites: ['平均曲率', '偏微分方程初步', '旋转曲面'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '让曲面自己变光滑',
      lines: [
        {
          id: 'intro-1',
          text: '热方程会让温度分布越来越均匀，凹凸不平的初始状态最终趋于平坦。几何上有没有类似的东西？',
        },
        {
          id: 'intro-2',
          text: '有，就是平均曲率流。规则很简单：让曲面上每一点沿着法线方向移动，速度等于该点的平均曲率。',
        },
        {
          id: 'intro-3',
          text: '凸的地方向内收，凹的地方向外鼓，于是曲面越来越圆润。这是几何分析里最重要的流之一。',
        },
      ],
    },
    {
      id: 'sphere',
      type: 'formula',
      title: '球面的解析解',
      lines: [
        {
          id: 'sp-1',
          text: '球面是最简单的例子。半径为 R 的球面，两个主曲率都是 R 的倒数，所以平均曲率等于二除以 R。',
        },
        {
          id: 'sp-2',
          text: '代入流方程得到半径的微分方程，解出来是 R 的平方等于初始半径平方减去四倍时间。',
        },
        {
          id: 'sp-3',
          text: '这意味着球面在有限时间内缩成一点，时刻是初始半径平方除以四。而且过程中始终是球，形状不变，这叫自相似收缩。',
        },
      ],
    },
    {
      id: 'cylinder',
      type: 'concept',
      title: '圆柱的对比',
      lines: [
        {
          id: 'cy-1',
          text: '圆柱面就不一样了。它沿母线方向完全不弯，那个主曲率是零，所以平均曲率只有一除以 R。',
        },
        {
          id: 'cy-2',
          text: '曲率只有球面的一半，收缩自然更慢。解出来是 R 平方等于初始平方减去二倍时间。',
        },
        {
          id: 'cy-3',
          text: '所以同样半径的圆柱，坍塌时刻恰好是球面消失时刻的两倍。它最终塌成一条直线而不是一个点。',
        },
      ],
    },
    {
      id: 'singular',
      type: 'animation',
      title: '奇点的形成',
      lines: [
        {
          id: 'sg-1',
          text: '有趣的情形出现在形状不规则时。看哑铃：两端粗，中间一根细腰。',
        },
        {
          id: 'sg-2',
          text: '细腰处曲率大，收缩得快；两端粗的地方曲率小，收缩得慢。于是腰越来越细，最后断开。',
        },
        {
          id: 'sg-3',
          text: '断开的瞬间叫奇点。研究奇点如何形成、断开后怎么继续，是这个领域的核心难题。',
        },
      ],
    },
    {
      id: 'monotone',
      type: 'interaction',
      title: '单调减少的量',
      lines: [
        {
          id: 'mn-1',
          text: '流有几个必然单调减少的量，可以当作正确性的检验。首先是面积，它一直在减小。',
        },
        {
          id: 'mn-2',
          text: '体积也在减小。请观察屏幕上的两个读数，无论初始形状如何，它们都只降不升。',
        },
        {
          id: 'mn-3',
          text: '顺带一提，花生形演化时腰部会逐渐变粗，整体趋于球形。Huisken 在一九八四年证明了凸闭曲面必然如此。',
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
          text: '第一，平均曲率流让每点沿法向以平均曲率的速度移动，是几何版的热方程。',
        },
        {
          id: 'sum-2',
          text: '第二，球面自相似收缩，时刻是初始半径平方除以四；圆柱坍塌时刻是它的两倍。',
        },
        {
          id: 'sum-3',
          text: '第三，细腰处会形成奇点，而面积与体积始终单调减少。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
