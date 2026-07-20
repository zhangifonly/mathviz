import type { NarrationScript } from '../types'

/**
 * 龙形曲线 - 口播稿件
 * 核心概念：折叠序列、转向规律、自相似分形、不自交填充
 * 目标受众：初中及以上
 */
export const dragonCurveNarration: NarrationScript = {
  id: 'dragon-curve',
  title: '龙形曲线',
  subtitle: '折纸展开的分形',
  difficulty: 'intermediate',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解折叠序列如何生成转向规律',
    '认识龙形曲线的自相似分形结构',
    '体会曲线不自交且能填满区域的奇妙性质',
    '感受简单折纸规则孕育的复杂之美',
  ],

  prerequisites: ['了解方向与转向', '了解平面坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '拿一张细长的纸条，把右端向左对折一次。' },
        { id: 'intro-2', text: '再对折、再对折，每次都朝同一个方向叠。' },
        { id: 'intro-3', text: '展开纸条，把每道折痕都掰成直角。' },
        { id: 'intro-4', text: '眼前竟浮现出一条蜿蜒盘旋的龙，这就是龙形曲线。' },
      ],
    },
    {
      id: 'fold',
      type: 'concept',
      title: '折痕的规律',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fold-1', text: '每对折一次，折痕数量都会比原来多一倍再加一。' },
        { id: 'fold-2', text: '新的折痕总在正中间添一道谷折，两侧则镜像翻转。' },
        { id: 'fold-3', text: '这条递推规律，让折痕像细胞分裂一样成倍生长。' },
      ],
    },
    {
      id: 'turn',
      type: 'concept',
      title: '转向序列',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'turn-1', text: '把每道折痕记成一次左转或右转，就得到一串转向序列。' },
        { id: 'turn-2', text: '沿着序列走，每步等长，遇到记号就拐九十度。' },
        { id: 'turn-3', text: '正是这串左右左右的密码，一笔画出整条龙。' },
      ],
    },
    {
      id: 'fill',
      type: 'concept',
      title: '填满而不自交',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fill-1', text: '奇妙的是，这条曲线永远不会与自己相交。' },
        { id: 'fill-2', text: '迭代越多，它越是严丝合缝地铺满一整片区域。' },
        { id: 'fill-3', text: '放大任意一角，都能看到和整体一模一样的小龙。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整迭代次数，看龙从简单折线长成繁复的分形。' },
        { id: 'int-2', text: '留意渐变的颜色，它标出了这一笔行进的先后顺序。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '龙形曲线源自反复对折纸条，再展成直角。' },
        { id: 'sum-2', text: '折叠序列生成转向密码，画出自相似又不自交的分形。' },
        { id: 'sum-3', text: '一次简单的对折，折出无穷的几何之美，我们下次再见！' },
      ],
    },
  ],
}
