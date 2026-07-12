import type { NarrationScript } from '../types'

/**
 * 罗马数字 - 口播稿件
 * 核心概念：七个基本符号、加法规则、减法规则、转换与还原
 * 目标受众：小学以上
 */
export const romanNumeralsNarration: NarrationScript = {
  id: 'roman-numerals',
  title: '罗马数字',
  subtitle: '用七个字母写出千位以内的整数',
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
    '认识七个罗马数字基本符号及其数值',
    '掌握从大到小相加的书写规则',
    '理解小符号在左表示相减的减法规则',
    '学会数字与罗马数字之间的双向转换',
  ],

  prerequisites: ['认识一千以内的整数', '会做简单的加减法'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '钟表上、书本的章节号里，常常能看到一种古老的数字，它来自两千多年前的古罗马。' },
        { id: 'intro-2', text: '它不用零到九这些数字，而是用几个大写字母来记数。' },
        { id: 'intro-3', text: '今天我们就来看看，怎么用短短几个字母，写出一千以内甚至更大的数。' },
      ],
    },
    {
      id: 'symbols',
      type: 'concept',
      title: '七个基本符号',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'symbols-1', text: '罗马数字一共只有七个基本符号。' },
        { id: 'symbols-2', text: 'I 表示一，V 表示五，X 表示十，L 表示五十。' },
        { id: 'symbols-3', text: 'C 表示一百，D 表示五百，M 表示一千，记住它们就掌握了一半。' },
      ],
    },
    {
      id: 'add-rule',
      type: 'concept',
      title: '加法规则',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'add-1', text: '书写时把符号从大到小排好，再把它们的数值一个个加起来。' },
        { id: 'add-2', text: '比如二十八，写成 X X V I I I，也就是十加十加五加一加一加一。' },
        { id: 'add-3', text: '不过同一个符号最多连写三次，四个一就得换个写法了。' },
      ],
    },
    {
      id: 'sub-rule',
      type: 'concept',
      title: '减法规则',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sub-1', text: '当小符号写在大符号左边时，表示用大的减去小的。' },
        { id: 'sub-2', text: '四写成 I V，是五减一；九写成 I X，是十减一。' },
        { id: 'sub-3', text: '所以四十是 X L，九十是 X C，四百是 C D，九百是 C M。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手转换',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块选一个数，看它怎样被拆成一个个罗马符号再拼起来。' },
        { id: 'int-2', text: '试试今年，二零二四，它写成 M M X X I V，一千加一千加十加十再加上四。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '七个字母，加法从大到小相加，减法把小的放到大的左边。' },
        { id: 'sum-2', text: '掌握这两条规则，你就能读写一到三千九百九十九之间的任何罗马数字。' },
        { id: 'sum-3', text: '下次再看到钟表和碑文上的字母，你一定一眼就能读懂，我们下次再见！' },
      ],
    },
  ],
}
