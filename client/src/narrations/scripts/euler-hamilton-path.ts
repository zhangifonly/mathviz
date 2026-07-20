import type { NarrationScript } from '../types'

/**
 * 欧拉与哈密顿回路 - 口播稿件
 * 核心概念：一笔画的度数判据、Hierholzer 构造、哈密顿回路的困难
 * 目标受众：高中及以上
 */
export const eulerHamiltonPathNarration: NarrationScript = {
  id: 'euler-hamilton-path',
  title: '欧拉与哈密顿回路',
  subtitle: '一笔画与遍历顶点',
  difficulty: 'intermediate',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解欧拉路径与回路的度数判据',
    '掌握一笔画能否完成的判断方法',
    '认识哈密顿回路与欧拉回路的本质区别',
    '感受图论从一个趣味问题诞生的历史',
  ],

  prerequisites: ['了解顶点与边的概念', '会数一个点连了几条线'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '十八世纪的柯尼斯堡有七座桥，连接着两岸和两座小岛。' },
        { id: 'intro-2', text: '市民们爱问：能不能走过每座桥恰好一次，最后回到出发点？' },
        { id: 'intro-3', text: '数学家欧拉把陆地画成点，桥画成线，图论就此诞生。' },
      ],
    },
    {
      id: 'euler',
      type: 'concept',
      title: '欧拉的度数判据',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '一个顶点连出的边数，我们叫它的度数。' },
        { id: 'def-2', text: '欧拉发现：除了起点和终点，每次进入一个点都要有一条边再离开。' },
        { id: 'def-3', text: '所以能一笔画走遍每条边并回到原点，全部顶点度数就必须是偶数。' },
      ],
    },
    {
      id: 'condition',
      type: 'concept',
      title: '一笔画的条件',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cond-1', text: '如果恰好有两个奇度顶点，就能画出一条欧拉路径，从一个奇点走到另一个。' },
        { id: 'cond-2', text: '柯尼斯堡四块陆地全是奇度，于是七桥问题根本无解。' },
        { id: 'cond-3', text: '满足条件时，用 Hierholzer 算法就能真正拼出这条一笔画路线。' },
      ],
    },
    {
      id: 'hamilton',
      type: 'concept',
      title: '哈密顿回路',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ham-1', text: '换个问题：能不能走遍每个顶点恰好一次再回到起点？' },
        { id: 'ham-2', text: '这叫哈密顿回路，看似相似，却出奇地难。' },
        { id: 'ham-3', text: '欧拉只需数度数，哈密顿至今没有简单判据，只能小图暴力搜索。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '选一个图形，看它属于欧拉回路、欧拉路径还是无法一笔画。' },
        { id: 'int-2', text: '拖动滑块，粉色高亮会沿着算法找到的路线逐边点亮。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '一笔画看边的度数，全偶成回路，两奇成路径。' },
        { id: 'sum-2', text: '哈密顿走遍顶点，是图论中著名的难题。' },
        { id: 'sum-3', text: '一座桥引出一门学问，这就是数学的魅力，我们下次再见！' },
      ],
    },
  ],
}
