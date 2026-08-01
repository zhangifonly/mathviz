/**
 * 8字形克莱因瓶 讲解稿
 */
import type { NarrationScript } from '../types'

export const kleinBottleFigure8Narration: NarrationScript = {
  id: 'klein-bottle-figure8',
  title: '8字形克莱因瓶',
  subtitle: '同样的示性数, 不同的可定向性',
  difficulty: 'expert',
  targetAge: '研究生+',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '认识克莱因瓶的第二种浸入方式',
    '理解截面翻转半圈如何造成不可定向',
    '掌握粘合关系的严格表述',
    '分清欧拉示性数与可定向性两个独立的不变量',
  ],
  prerequisites: ['克莱因瓶', '莫比乌斯带', '欧拉示性数'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '另一种画法',
      lines: [
        {
          id: 'intro-1',
          text: '克莱因瓶最出名的形象是一个瓶子，瓶口绕回去穿过瓶身。但这只是它在三维空间中的一种浸入方式。',
        },
        {
          id: 'intro-2',
          text: '还有一种画法叫 8 字形浸入，看起来完全不像瓶子，更像一条打了结的环形管道。',
        },
        {
          id: 'intro-3',
          text: '两种画法描述的是同一个拓扑曲面。今天我们用 8 字形版本，因为它的构造机制更容易讲清楚。',
        },
      ],
    },
    {
      id: 'section',
      type: 'concept',
      title: '8 字形的截面',
      lines: [
        {
          id: 'sc-1',
          text: '构造从截面开始。取一条 8 字形曲线，用参数写出来就是正弦 v 和正弦二 v 这一对。',
        },
        {
          id: 'sc-2',
          text: '这条曲线在 v 等于零和 v 等于圆周率两处都经过原点，所以它自己交叉一次，这正是 8 字的腰。',
        },
        {
          id: 'sc-3',
          text: '现在把这个 8 字形截面沿着一个圆周搬运一圈。如果搬运途中截面朝向不变，得到的只是一个普通的管道。',
        },
      ],
    },
    {
      id: 'twist',
      type: 'formula',
      title: '关键的半圈',
      lines: [
        {
          id: 'tw-1',
          text: '关键动作在这里：搬运时让截面同步旋转，但转速只有搬运速度的一半。',
        },
        {
          id: 'tw-2',
          text: '方程里体现为 u 除以二这个角度。搬运走完一整圈也就是二倍圆周率时，截面只转过半圈。',
        },
        {
          id: 'tw-3',
          text: '这个机制和莫比乌斯带完全一样。半圈的错位使得曲面绕回来时上下颠倒，于是无法定义统一的正反面。',
        },
      ],
    },
    {
      id: 'gluing',
      type: 'animation',
      title: '粘合关系',
      lines: [
        {
          id: 'gl-1',
          text: '怎么严格描述这个错位？看曲面在参数域上的粘合关系。直觉上 u 加二倍圆周率应该回到原处。',
        },
        {
          id: 'gl-2',
          text: '但实测偏差是二点三五，明显不重合。正确的粘合是 u 加二倍圆周率的同时把 v 取反。',
        },
        {
          id: 'gl-3',
          text: '换成这个关系后偏差降到十的负十六次方。这条 v 取反的要求就是克莱因瓶的定义性粘合。',
        },
      ],
    },
    {
      id: 'invariant',
      type: 'interaction',
      title: '两个独立的不变量',
      lines: [
        {
          id: 'iv-1',
          text: '克莱因瓶的欧拉示性数是零，和环面完全一样。那么这两个曲面能不能算同一个？',
        },
        {
          id: 'iv-2',
          text: '不能。因为可定向性不同：环面有明确的内外两面，克莱因瓶只有一个面。',
        },
        {
          id: 'iv-3',
          text: '这说明欧拉示性数与可定向性是两个独立的不变量。判断闭曲面必须两个一起看，缺一不可。',
        },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '回顾',
      lines: [
        {
          id: 'sum-1',
          text: '第一，8 字形浸入把 8 字截面沿圆周搬运，途中让它转过半圈。',
        },
        {
          id: 'sum-2',
          text: '第二，粘合关系是 u 加二倍圆周率配合 v 取反，这半圈错位造成了不可定向。',
        },
        {
          id: 'sum-3',
          text: '第三，它与环面示性数相同但可定向性不同，二者是独立的不变量。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
