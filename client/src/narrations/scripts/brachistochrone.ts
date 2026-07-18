import type { NarrationScript } from '../types'

/**
 * 最速降线 - 口播稿件
 * 核心概念：变分法、摆线、能量守恒下滑时间
 */
export const brachistochroneNarration: NarrationScript = {
  id: 'brachistochrone',
  title: '最速降线',
  subtitle: '下滑最快的曲线是摆线',
  difficulty: 'expert',
  targetAge: '大学以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解最速降线问题的提出与意义',
    '认识下滑时间由路径形状决定',
    '知道答案是摆线而非直线或圆弧',
    '感受变分法开辟的数学新天地',
  ],

  prerequisites: ['了解能量守恒', '了解曲线与积分'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一颗小球从高处滑到低处，走哪条路最快？' },
        { id: 'intro-2', text: '直觉会说：两点之间直线最短，那自然最快。' },
        { id: 'intro-3', text: '可是最短并不等于最快，这正是三百年前的著名谜题。' },
      ],
    },
    {
      id: 'problem',
      type: 'concept',
      title: '伯努利的挑战',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'prob-1', text: '一六九六年，伯努利向全欧洲数学家公开征解。' },
        { id: 'prob-2', text: '据说牛顿收到问题，当晚就给出了答案。' },
        { id: 'prob-3', text: '这道题催生了一门全新的数学分支——变分法。' },
      ],
    },
    {
      id: 'energy',
      type: 'concept',
      title: '速度来自高度',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'en-1', text: '由能量守恒，小球的速度只取决于它下落的高度。' },
        { id: 'en-2', text: '一开始陡一点，就能更快获得速度。' },
        { id: 'en-3', text: '于是走一条先陡后缓的曲线，反而比直线更快到达。' },
      ],
    },
    {
      id: 'cycloid',
      type: 'concept',
      title: '答案是摆线',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cyc-1', text: '这条最快的曲线，正是滚动圆上一点画出的摆线。' },
        { id: 'cyc-2', text: '看画面里三颗球同时出发，摆线上的球总是最先到底。' },
        { id: 'cyc-3', text: '它还是等时曲线：从任意点释放，到底部用时都相同。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲眼见证',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '盯住三条路径的小球，感受摆线的领先。' },
        { id: 'int-2', text: '直线最短却最慢，弯一点的摆线才最快。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '最速降线告诉我们：最短不等于最快。' },
        { id: 'sum-2', text: '一条摆线，串起了牛顿、伯努利与变分法的诞生。' },
        { id: 'sum-3', text: '数学之美，常藏在反直觉的答案里，我们下次再见！' },
      ],
    },
  ],
}
