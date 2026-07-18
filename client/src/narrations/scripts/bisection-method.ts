import type { NarrationScript } from '../types'

/**
 * 二分法求根 - 口播稿件
 * 核心概念：介值定理、含根区间对半缩小、线性收敛
 * 目标受众：初中及以上
 */
export const bisectionMethodNarration: NarrationScript = {
  id: 'bisection-method',
  title: '二分法求根',
  subtitle: '对半缩小含根区间',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解用夹逼思想逼近方程的根',
    '掌握介值定理保证根存在的条件',
    '学会用中点符号把含根区间对半缩小',
    '认识二分法线性收敛、稳而不快的特点',
  ],

  prerequisites: ['了解函数与方程', '知道正负号的含义'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '很多方程没有公式解，比如求根号二，我们只能一步步逼近。' },
        { id: 'intro-2', text: '二分法的想法很朴素：先圈住根，再不断把圈子缩小一半。' },
        { id: 'intro-3', text: '就像猜数字游戏，每次都往中间猜，范围越缩越窄。' },
      ],
    },
    {
      id: 'ivt',
      type: 'concept',
      title: '介值定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ivt-1', text: '看这条连续曲线，左端在横轴下方，右端在上方。' },
        { id: 'ivt-2', text: '一条连续的线从下爬到上，中途必然穿过横轴。' },
        { id: 'ivt-3', text: '这就是介值定理：只要两端函数值异号，区间里一定有根。' },
      ],
    },
    {
      id: 'midpoint',
      type: 'concept',
      title: '取中点判符号',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mid-1', text: '取区间中点，算出它的函数值，看它是正还是负。' },
        { id: 'mid-2', text: '中点与哪一端异号，根就藏在那半边。' },
        { id: 'mid-3', text: '于是我们扔掉没有根的一半，只留下含根的那一半。' },
      ],
    },
    {
      id: 'halve',
      type: 'concept',
      title: '区间减半',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'halve-1', text: '每做一次，含根区间的宽度就精确地缩小一半。' },
        { id: 'halve-2', text: '这叫线性收敛，大约每一步多锁定一个二进制位。' },
        { id: 'halve-3', text: '它不算快，却极其稳当，只要开局异号就必定收敛。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '点下一步，亲眼看两条竖线一次次向真正的根夹拢。' },
        { id: 'int-2', text: '换个函数再试，二分法照样一步步把根圈出来。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '介值定理先保证根的存在，再用中点符号缩小区间。' },
        { id: 'sum-2', text: '每步对半减半，稳稳逼近，这就是二分法的全部秘密。' },
        { id: 'sum-3', text: '简单的夹逼，蕴含深刻的收敛之美，我们下次再见！' },
      ],
    },
  ],
}
