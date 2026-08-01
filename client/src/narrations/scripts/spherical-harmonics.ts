/**
 * 球谐函数 讲解稿
 */
import type { NarrationScript } from '../types'

export const sphericalHarmonicsNarration: NarrationScript = {
  id: 'spherical-harmonics',
  title: '球谐函数',
  subtitle: '球面上的振动模态',
  difficulty: 'expert',
  targetAge: '研究生+',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解球谐函数作为球面上的正交基',
    '掌握两个量子数 l 与 m 的几何含义',
    '认识正交归一性的数值验证方法',
    '了解从原子轨道到宇宙背景辐射的应用',
  ],
  prerequisites: ['球坐标', '傅里叶级数', '偏微分方程初步'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '球面能怎么振动',
      lines: [
        {
          id: 'intro-1',
          text: '拉紧一根弦，它的振动可以分解成一系列正弦波，这就是傅里叶级数。那么一个球面呢？',
        },
        {
          id: 'intro-2',
          text: '球面也有自己的振动模态，它们叫球谐函数。任何定义在球面上的函数，都能按它们展开。',
        },
        {
          id: 'intro-3',
          text: '这套函数的用处大到惊人：原子轨道、地球重力场、地磁场、宇宙微波背景辐射，甚至游戏里的环境光照压缩。',
        },
      ],
    },
    {
      id: 'quantum',
      type: 'concept',
      title: '两个量子数',
      lines: [
        {
          id: 'qt-1',
          text: '每个球谐函数由两个整数标记。第一个是 l，叫角量子数，它决定振动的总复杂度。',
        },
        {
          id: 'qt-2',
          text: '第二个是 m，叫磁量子数，取值范围是从负 l 到正 l。它决定函数绕竖直轴转一圈变化几个周期。',
        },
        {
          id: 'qt-3',
          text: '化学里的轨道命名就是它：l 等于零是 s 轨道，一是 p 轨道，二是 d 轨道，三是 f 轨道。',
        },
      ],
    },
    {
      id: 'nodal',
      type: 'animation',
      title: '节线的分布',
      lines: [
        {
          id: 'nd-1',
          text: '看画面上的形状。半径取球谐函数的绝对值，红色表示函数为正，蓝色表示为负。',
        },
        {
          id: 'nd-2',
          text: '红蓝交界处函数值为零，这些交界线叫节线。节线的分布有个漂亮的规律。',
        },
        {
          id: 'nd-3',
          text: '纬向节线有 l 减去 m 的绝对值那么多条，经向节线有 m 的绝对值那么多条。两者相加恒等于 l。',
        },
      ],
    },
    {
      id: 'ortho',
      type: 'formula',
      title: '正交归一性',
      lines: [
        {
          id: 'or-1',
          text: '球谐函数最重要的性质是正交归一。任取两个不同的球谐，在整个球面上求它们乘积的积分，结果精确为零。',
        },
        {
          id: 'or-2',
          text: '而任何球谐与自身的积分恰好等于一。这正是傅里叶展开能成立的前提，也是归一化系数被那样设计的原因。',
        },
        {
          id: 'or-3',
          text: '这条性质可以数值验证。屏幕上的内积读数在不同模态间是十的负十六次方量级，与自身则精确为一。',
        },
      ],
    },
    {
      id: 'apply',
      type: 'interaction',
      title: '从原子到宇宙',
      lines: [
        {
          id: 'ap-1',
          text: '请切换不同的量子数组合。l 等于零时是一个正球，这对应氢原子的 s 轨道，电子云球对称分布。',
        },
        {
          id: 'ap-2',
          text: 'l 等于一 m 等于零是两个叶片上下排列，这就是 p z 轨道。l 等于二 m 等于二则是四个叶片，那是 d 轨道。',
        },
        {
          id: 'ap-3',
          text: '同一套函数换个场景就是宇宙学。微波背景辐射的温度涨落按球谐展开，各个 l 的功率就是那条著名的功率谱。',
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
          text: '第一，球谐函数是球面上的振动模态，由角量子数 l 与磁量子数 m 标记。',
        },
        {
          id: 'sum-2',
          text: '第二，节线总数恒等于 l，其中纬向 l 减 m 的绝对值条，经向 m 的绝对值条。',
        },
        {
          id: 'sum-3',
          text: '第三，它们构成球面上的正交归一基，这是一切球面展开的基础。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
