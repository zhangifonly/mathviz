import type { NarrationScript } from '../types'

/**
 * 相似三角形 - 口播稿件
 * 核心概念：形状相同大小不同、对应角相等、对应边成比例、面积比等于相似比的平方
 * 目标受众：初中及以上
 */
export const similarTrianglesNarration: NarrationScript = {
  id: 'similar-triangles',
  title: '相似三角形',
  subtitle: '形状相同，大小可变的秘密',
  difficulty: 'elementary',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-12',
    updatedAt: '2026-07-12',
  },

  objectives: [
    '理解相似三角形的定义',
    '掌握对应角相等、对应边成比例',
    '理解面积比等于相似比的平方',
    '感受相似在生活中的应用',
  ],

  prerequisites: ['认识三角形', '了解比例'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '你有没有发现，照片放大以后，里面的形状一点都没变样。' },
        { id: 'intro-2', text: '变大变小，但看起来还是同一个东西，这就是相似。' },
        { id: 'intro-3', text: '今天我们就用三角形，来看清相似背后的规律。' },
      ],
    },
    {
      id: 'definition',
      type: 'concept',
      title: '什么是相似三角形',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '两个三角形如果形状完全相同，只是大小不一样，我们就说它们相似。' },
        { id: 'def-2', text: '这里的蓝色三角形和粉色三角形，就是一对相似三角形。' },
        { id: 'def-3', text: '判断相似有一个关键，就是它们的对应角要完全相等。' },
      ],
    },
    {
      id: 'angles',
      type: 'concept',
      title: '对应角相等',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ang-1', text: '不管三角形放大还是缩小，三个内角始终保持不变。' },
        { id: 'ang-2', text: '角决定了形状，所以只要三个角对应相等，两个三角形一定相似。' },
      ],
    },
    {
      id: 'ratio',
      type: 'concept',
      title: '对应边成比例',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rat-1', text: '相似的另一半秘密，藏在边长里。' },
        { id: 'rat-2', text: '把对应的边一一相除，你会得到同一个数，我们叫它相似比。' },
        { id: 'rat-3', text: '更有意思的是，两个三角形的面积之比，等于相似比的平方。' },
        { id: 'rat-4', text: '边长放大两倍，面积就变成了四倍，这一点常常被人忽略。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '试着切换不同的相似比，看粉色三角形怎样长大或缩小。' },
        { id: 'int-2', text: '注意观察上方的面积比，它总是相似比乘以它自己。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '相似三角形形状相同，对应角相等，对应边成比例。' },
        { id: 'sum-2', text: '边按相似比变化，面积按相似比的平方变化。' },
        { id: 'sum-3', text: '从地图到照片，相似无处不在，我们下次再见！' },
      ],
    },
  ],
}
