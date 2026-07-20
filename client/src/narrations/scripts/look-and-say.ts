import type { NarrationScript } from '../types'

/**
 * 外观数列 - 口播稿件
 * 核心概念：读出上一项、只含1/2/3、项长增长与康威常数
 * 目标受众：初中及以上
 */
export const lookAndSayNarration: NarrationScript = {
  id: 'look-and-say',
  title: '外观数列',
  subtitle: '读出上一项',
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
    '理解外观数列"读出上一项"的生成规则',
    '发现从 1 出发各项只含数字 1、2、3',
    '观察项长如何一步步增长',
    '认识增长速率趋于康威常数',
  ],

  prerequisites: ['会数数', '认识数字'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '看这样一个数：1。' },
        { id: 'intro-2', text: '我们不去算它，而是把它读出来：一个1。' },
        { id: 'intro-3', text: '把读出来的话写成数字，就是11。' },
        { id: 'intro-4', text: '这种"读出上一项"得到的数列，叫外观数列。' },
      ],
    },
    {
      id: 'rule',
      type: 'concept',
      title: '读出的规则',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '规则很简单：把连续相同的数字，按几个几读出来。' },
        { id: 'def-2', text: '11有两个1，读作21；21是一个2一个1，读作1211。' },
        { id: 'def-3', text: '照这样一直读下去，就能生成一整列越来越长的数。' },
      ],
    },
    {
      id: 'grow',
      type: 'concept',
      title: '项长的增长',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'grow-1', text: '每读一次，数字串通常会变长一些。' },
        { id: 'grow-2', text: '把每一项的长度取对数画出来，会得到一条近乎笔直的斜线。' },
        { id: 'grow-3', text: '笔直，意味着项长在按固定的倍数稳定增长。' },
      ],
    },
    {
      id: 'conway',
      type: 'concept',
      title: '康威常数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'con-1', text: '数学家康威证明，相邻两项的长度比会趋于一个固定值。' },
        { id: 'con-2', text: '这个值约等于1.303577，被称为康威常数。' },
        { id: 'con-3', text: '更妙的是，从1出发，数列里永远只会出现1、2、3三个数字。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块，一项一项地把数列展开。' },
        { id: 'int-2', text: '留意右边的曲线，是否越来越贴近那条康威斜率线。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '外观数列的规则，就是老老实实读出上一项。' },
        { id: 'sum-2', text: '简单的读法，却藏着只含1、2、3和康威常数的深刻规律。' },
        { id: 'sum-3', text: '数学的乐趣常常始于一句大声读出来，我们下次再见！' },
      ],
    },
  ],
}
