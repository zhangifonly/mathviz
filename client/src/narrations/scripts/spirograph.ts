import type { NarrationScript } from '../types'

/**
 * 万花尺（内摆线）- 口播稿件
 * 核心概念：内摆线参数方程、齿数比与花瓣数、gcd 与闭合
 * 目标受众：初中及以上
 */
export const spirographNarration: NarrationScript = {
  id: 'spirograph',
  title: '万花尺',
  subtitle: '内摆线的花纹',
  difficulty: 'elementary',
  targetAge: '小学高年级以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '认识万花尺画出的内摆线',
    '理解内摆线的参数方程',
    '明白齿数比如何决定花瓣数量',
    '了解 gcd 与曲线闭合的关系',
  ],

  prerequisites: ['了解圆与半径', '了解最大公约数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '还记得童年那把塑料万花尺吗？把笔尖插进小圆的孔里。' },
        { id: 'intro-2', text: '让小圆贴着大圆内侧慢慢滚动，笔尖就画出一朵朵对称的花。' },
        { id: 'intro-3', text: '这些花纹背后，其实藏着一条优美的曲线，叫内摆线。' },
      ],
    },
    {
      id: 'equation',
      type: 'concept',
      title: '内摆线的方程',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '设大圆半径 R，小圆半径 r，笔尖到小圆圆心的距离是 d。' },
        { id: 'def-2', text: '横坐标 x 等于 R 减 r 乘以 cos t，再加上 d 乘以 cos 这个比例乘 t。' },
        { id: 'def-3', text: '纵坐标 y 把两个余弦换成正弦，中间的加号换成减号，笔尖轨迹就定下来了。' },
      ],
    },
    {
      id: 'petal',
      type: 'concept',
      title: '齿数比决定花瓣',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pet-1', text: '真正决定花朵形状的，是大圆和小圆半径的比，也就是齿数比。' },
        { id: 'pet-2', text: '比值不同，花瓣的数量和缠绕方式就完全不同。' },
      ],
    },
    {
      id: 'closure',
      type: 'concept',
      title: 'gcd 与闭合',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'clo-1', text: '花瓣的数量，正好等于 R 除以 R 和 r 的最大公约数。' },
        { id: 'clo-2', text: '小圆要滚满若干整圈，笔尖才回到起点，曲线才真正闭合。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着调整 R、r 和 d，看花瓣如何增减、疏密如何变化。' },
        { id: 'int-2', text: '每换一组数字，都会开出一朵独一无二的数学之花。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '内摆线，就是小圆在大圆内滚动时笔尖画出的轨迹。' },
        { id: 'sum-2', text: '一个简单的比值和最大公约数，就决定了整朵花的模样。' },
        { id: 'sum-3', text: '愿你也能用数学画出美丽的花纹，我们下次再见！' },
      ],
    },
  ],
}
