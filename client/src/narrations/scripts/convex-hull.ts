import type { NarrationScript } from '../types'

/**
 * 凸包算法 - 口播稿件
 * 核心概念：凸包定义、叉积判转向、Andrew 单调链构造
 * 目标受众：初中及以上
 */
export const convexHullNarration: NarrationScript = {
  id: 'convex-hull',
  title: '凸包算法',
  subtitle: '橡皮筋套住散点',
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
    '理解凸包是套住所有点的最小凸多边形',
    '掌握用叉积判断三点的左转与右转',
    '认识 Andrew 单调链的排序加扫描思路',
    '感受几何算法从直观到高效的过程',
  ],

  prerequisites: ['了解平面坐标', '了解向量与乘法'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '桌面上散落着一把图钉，我们拿一根橡皮筋把它们全部圈起来。' },
        { id: 'intro-2', text: '松开手，橡皮筋会紧紧收缩，箍在最外圈的那几颗钉子上。' },
        { id: 'intro-3', text: '橡皮筋最终勾勒出的这个多边形，就是这堆点的凸包。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '凸包的定义',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '凸包是能把所有点都包住的、面积最小的凸多边形。' },
        { id: 'def-2', text: '它的每个顶点都来自原来的散点，内部的点则被安稳地裹在里面。' },
        { id: 'def-3', text: '凸的意思是：多边形不会向内凹陷，连线永远走在边界之内。' },
      ],
    },
    {
      id: 'cross',
      type: 'concept',
      title: '叉积判转向',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cross-1', text: '要构造边界，关键是判断走过三个点时，是向左拐还是向右拐。' },
        { id: 'cross-2', text: '这靠向量叉积：结果为正是逆时针左转，为负是顺时针右转，为零则三点共线。' },
        { id: 'cross-3', text: '只要出现了右转，就说明刚才那个点让边界凹了进去，应该被舍弃。' },
      ],
    },
    {
      id: 'chain',
      type: 'concept',
      title: '单调链构造',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'chain-1', text: 'Andrew 算法先把所有点按横坐标从左到右排好队。' },
        { id: 'chain-2', text: '然后从左扫到右构造下半条链，再从右扫回来构造上半条链。' },
        { id: 'chain-3', text: '扫描时不断用叉积检查转向，把凹进去的点弹出，上下拼起来就是完整凸包。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调整散点数量，观察橡皮筋轮廓怎样随着点变多而伸展。' },
        { id: 'int-2', text: '点击重新随机，每一次都换一堆点，凸包也随之重新收紧。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '凸包是套住散点的最小凸多边形，就像收紧的橡皮筋。' },
        { id: 'sum-2', text: '叉积判左右转，单调链排序加扫描，只需 O(n log n) 就能求出。' },
        { id: 'sum-3', text: '一根橡皮筋背后藏着漂亮的几何算法，我们下次再见！' },
      ],
    },
  ],
}
