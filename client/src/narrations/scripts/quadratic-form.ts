import type { NarrationScript } from '../types'

/**
 * 二次型 - 口播稿件
 * 核心概念：对称矩阵表示、特征值定类型、正定=碗形椭圆
 * 目标受众：高中及以上
 */
export const quadraticFormNarration: NarrationScript = {
  id: 'quadratic-form',
  title: '二次型',
  subtitle: '矩阵刻画的曲面',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解二次型的对称矩阵表示',
    '掌握用特征值符号判定二次型类型',
    '认识正定二次型的碗形椭圆等高线',
    '感受矩阵如何刻画一张曲面',
  ],

  prerequisites: ['了解二次函数', '了解矩阵与向量乘法'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一元二次函数画出一条抛物线，那两个变量的二次式呢？' },
        { id: 'intro-2', text: '看这个式子：a 乘 x 平方，加 c 乘 y 平方，中间还夹着一项交叉的 x 乘 y。' },
        { id: 'intro-3', text: '它叫二次型，描绘的是一整张曲面，而不再是一条曲线。' },
      ],
    },
    {
      id: 'matrix',
      type: 'concept',
      title: '对称矩阵表示',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '交叉项让人头疼，但一个对称矩阵能把它收拾得干干净净。' },
        { id: 'def-2', text: '把系数排成矩阵：对角线是 a 和 c，两个角上各放半个交叉系数 b。' },
        { id: 'def-3', text: '于是二次型就写成向量乘矩阵再乘向量，简洁又统一。' },
      ],
    },
    {
      id: 'eigen',
      type: 'concept',
      title: '特征值定类型',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eig-1', text: '这个对称矩阵的两个特征值，藏着曲面的全部秘密。' },
        { id: 'eig-2', text: '两个都为正，是正定；都为负，是负定；一正一负，就是不定。' },
        { id: 'eig-3', text: '沿着特征向量的方向看，特征值正好是那个方向上的弯曲快慢。' },
      ],
    },
    {
      id: 'posdef',
      type: 'concept',
      title: '正定与碗形',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pos-1', text: '正定时，曲面像一只朝上的碗，处处高于中心。' },
        { id: 'pos-2', text: '此时等高线是一圈套一圈的椭圆，越往外数值越大。' },
        { id: 'pos-3', text: '而不定型呢，曲面变成马鞍，等高线成了双曲线。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动 a、b、c 三个滑块，看等高线在椭圆和双曲线之间切换。' },
        { id: 'int-2', text: '留意右侧的特征值，它的符号一变，类型立刻就变。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '二次型用一个对称矩阵，把带交叉项的二次式收进方寸之间。' },
        { id: 'sum-2', text: '两个特征值的符号，一锤定音地决定它是碗、是鞍还是倒碗。' },
        { id: 'sum-3', text: '从系数到矩阵再到曲面，这正是线性代数的优雅，我们下次再见！' },
      ],
    },
  ],
}
