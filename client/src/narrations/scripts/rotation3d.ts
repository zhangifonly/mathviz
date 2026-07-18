import type { NarrationScript } from '../types'

/**
 * 三维旋转矩阵 - 口播稿件
 * 核心概念：绕轴旋转矩阵、欧拉角组合、正交性、万向锁
 * 目标受众：高中及以上
 */
export const rotation3dNarration: NarrationScript = {
  id: 'rotation3d',
  title: '三维旋转矩阵',
  subtitle: '欧拉角与旋转',
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
    '理解绕 X、Y、Z 轴的基本旋转矩阵',
    '掌握用欧拉角组合出任意空间朝向',
    '认识旋转矩阵的正交性',
    '了解万向锁现象的由来',
  ],

  prerequisites: ['了解矩阵乘法', '了解三角函数'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '在平面上转动一个图形，我们只需要一个角度。' },
        { id: 'intro-2', text: '可到了三维空间，物体能上下俯仰、左右偏转、还能翻滚。' },
        { id: 'intro-3', text: '要精确描述这种旋转，就得请出三维旋转矩阵。' },
      ],
    },
    {
      id: 'axis',
      type: 'concept',
      title: '绕轴旋转矩阵',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '最基本的旋转，是绕着某一根坐标轴转动。' },
        { id: 'def-2', text: '绕 X 轴、绕 Y 轴、绕 Z 轴，各有一个三阶矩阵，只由正弦和余弦拼成。' },
        { id: 'def-3', text: '用它去乘一个点的坐标，就得到旋转后的新位置。' },
      ],
    },
    {
      id: 'euler',
      type: 'concept',
      title: '欧拉角组合',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'eul-1', text: '把三个基本旋转依次相乘，就能拼出任意方向的旋转。' },
        { id: 'eul-2', text: '这三个角，就叫做欧拉角。' },
        { id: 'eul-3', text: '要注意，乘的顺序不能随便换，先转 X 再转 Y，和反过来结果不同。' },
      ],
    },
    {
      id: 'gimbal',
      type: 'concept',
      title: '万向锁',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gim-1', text: '当中间那个角恰好转到九十度，两根旋转轴会重叠在一起。' },
        { id: 'gim-2', text: '此时系统丢失了一个自由度，这就是著名的万向锁。' },
        { id: 'gim-3', text: '工程上常改用四元数来绕开这个麻烦。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动三个滑块，分别调整绕 X、Y、Z 轴的角度。' },
        { id: 'int-2', text: '看这个立方体如何在空间里自由翻转起来。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '三个绕轴矩阵，是描述空间旋转的基本砖块。' },
        { id: 'sum-2', text: '把它们按欧拉角相乘，就能表达任意朝向。' },
        { id: 'sum-3', text: '旋转的世界既严谨又有趣，我们下次再见！' },
      ],
    },
  ],
}
