import type { NarrationScript } from '../types'

/**
 * 庞加莱圆盘 - 口播稿件
 * 核心概念：非欧几何、双曲平面、测地线、平行公设失效
 * 目标受众：高中及以上
 */
export const poincareDiskNarration: NarrationScript = {
  id: 'poincare-disk',
  title: '庞加莱圆盘',
  subtitle: '双曲几何模型',
  difficulty: 'expert',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解欧氏第五公设及其被质疑的历史',
    '认识庞加莱圆盘作为双曲平面的模型',
    '理解测地线是垂直边界的圆弧',
    '感受"过一点有无穷多平行线"的双曲世界',
  ],

  prerequisites: ['了解平面几何', '了解圆与角度'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '第五公设与非欧',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '两千年来，人们都相信欧几里得的第五公设：过直线外一点，只能作一条平行线。' },
        { id: 'intro-2', text: '它太啰嗦，数学家们想用其他公设证明它，却屡屡失败。' },
        { id: 'intro-3', text: '直到有人大胆假设它不成立，竟然生出了一片自洽的新几何，双曲几何。' },
      ],
    },
    {
      id: 'model',
      type: 'concept',
      title: '圆盘模型',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '庞加莱把整个双曲平面，装进了一个小小的单位圆盘里。' },
        { id: 'def-2', text: '圆盘的边界，代表无穷远，你永远走不到那条边。' },
        { id: 'def-3', text: '越靠近边界，同样大小的图形看起来越小，其实它们完全全等。' },
      ],
    },
    {
      id: 'geodesic',
      type: 'concept',
      title: '测地线',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'geo-1', text: '在这个世界里，最短路径不再是直线，而是垂直于边界的圆弧。' },
        { id: 'geo-2', text: '只有恰好穿过圆心的那条，才退化成一条笔直的直径。' },
        { id: 'geo-3', text: '这些弧线，就是双曲世界里真正的直线。' },
      ],
    },
    {
      id: 'parallel',
      type: 'concept',
      title: '无穷多平行线',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'par-1', text: '给定一条测地线和线外一点，过这点能画出无穷多条都不相交的测地线。' },
        { id: 'par-2', text: '平行线不再唯一，第五公设在这里彻底失效。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动两个红点，观察连接它们的测地线如何弯曲。' },
        { id: 'int-2', text: '切换不同的镶嵌，看正多边形如何铺满整个双曲平面。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '庞加莱圆盘把无限的双曲平面，收进一个有限的圆里。' },
        { id: 'sum-2', text: '测地线是垂直边界的弧，平行线有无穷多条。' },
        { id: 'sum-3', text: '推翻一条公设，竟打开一个全新的宇宙，我们下次再见！' },
      ],
    },
  ],
}
