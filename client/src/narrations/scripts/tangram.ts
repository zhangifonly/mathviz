import type { NarrationScript } from '../types'

/**
 * 七巧板 - 口播稿件
 * 核心概念：正方形剖分、面积守恒、图形的旋转平移拼接
 * 目标受众：小学以上
 */
export const tangramNarration: NarrationScript = {
  id: 'tangram',
  title: '七巧板',
  subtitle: '一块正方形，切出千变万化',
  difficulty: 'beginner',
  targetAge: '小学以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '认识七巧板的七块基本图形',
    '理解一个正方形是怎样被切成七块的',
    '发现拼图前后面积始终不变的守恒规律',
    '体会旋转和平移如何把小图形拼成新图形',
  ],

  prerequisites: ['认识三角形和正方形', '知道什么是面积'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '这是七巧板，中国古人发明的一种智力玩具，名字的意思就是七块巧妙的板子。' },
        { id: 'intro-2', text: '它看起来只是一个普通的正方形，可里面藏着大大的学问。' },
        { id: 'intro-3', text: '只要把它切开再拼一拼，就能变出成百上千种图案。' },
      ],
    },
    {
      id: 'pieces',
      type: 'concept',
      title: '认识七块',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'pieces-1', text: '把正方形切开，我们得到七块：两个大三角形，一个中三角形，两个小三角形。' },
        { id: 'pieces-2', text: '再加上一个正方形，和一个歪歪的平行四边形，一共正好七块。' },
        { id: 'pieces-3', text: '如果把最小的三角形当作一份，大三角形就是四份，正方形和平行四边形各是两份。' },
      ],
    },
    {
      id: 'dissection',
      type: 'concept',
      title: '正方形的剖分',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'dissect-1', text: '这七块不是随便切的，它们能严丝合缝地拼回原来的大正方形。' },
        { id: 'dissect-2', text: '不重叠，也不留缝，这说明七块的面积加起来，正好等于大正方形。' },
      ],
    },
    {
      id: 'conservation',
      type: 'concept',
      title: '面积守恒',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'conserve-1', text: '这里藏着一条重要的规律：不管你把七块拼成什么样子，总面积永远不变。' },
        { id: 'conserve-2', text: '拼成三角形、长方形还是一只小猫，用的都是同样这七块，面积始终一样多。' },
        { id: 'conserve-3', text: '因为拼图只是把图形搬来搬去、转个方向，既没有增加也没有减少。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手拼一拼',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '选一个目标图形，看看这七块怎样通过旋转和平移拼进它的轮廓里。' },
        { id: 'int-2', text: '你会发现，虽然外形变了，但每一次用的都是这七块,一块也不多，一块也不少。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '七巧板就是把一个正方形，巧妙地切成五个三角形、一个正方形和一个平行四边形。' },
        { id: 'sum-2', text: '不管拼成什么，面积守恒的规律始终成立，这就是它千变万化背后的数学。' },
        { id: 'sum-3', text: '动手拼一拼，感受图形变换的乐趣，我们下次再见！' },
      ],
    },
  ],
}
