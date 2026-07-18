import type { NarrationScript } from '../types'

/**
 * QR 分解 - 口播稿件
 * 核心概念：Gram-Schmidt 正交化、正交阵 Q、上三角阵 R、A = Q R
 * 目标受众：高中及以上
 */
export const qrDecompositionNarration: NarrationScript = {
  id: 'qr-decomposition',
  title: 'QR分解',
  subtitle: '正交阵乘上三角',
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
    '理解 QR 分解把矩阵拆成正交阵与上三角阵',
    '掌握 Gram-Schmidt 正交化的几何直觉',
    '认识 Q 的正交性与 R 的上三角结构',
    '了解 QR 分解在最小二乘与特征值算法中的作用',
  ],

  prerequisites: ['了解向量点积', '了解矩阵乘法'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个矩阵的各列，往往彼此歪斜、纠缠不清。' },
        { id: 'intro-2', text: 'QR 分解要做的，是把它拆成两块干净的结构。' },
        { id: 'intro-3', text: '一块是列彼此垂直的正交阵 Q，一块是上三角阵 R。' },
      ],
    },
    {
      id: 'gs',
      type: 'concept',
      title: 'Gram-Schmidt 正交化',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'gs-1', text: '第一列直接单位化，作为第一个正交方向。' },
        { id: 'gs-2', text: '第二列减去它在第一个方向上的投影，剩下的部分就与前者垂直。' },
        { id: 'gs-3', text: '逐列这样投影相减、再单位化，就得到一组两两正交的单位向量。' },
      ],
    },
    {
      id: 'qr',
      type: 'concept',
      title: 'Q 与 R',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'qr-1', text: '这些正交单位向量并排，就是正交阵 Q，满足 Q 转置乘 Q 等于单位阵。' },
        { id: 'qr-2', text: '而正交化时减掉的每个投影系数，恰好被记录进上三角阵 R。' },
        { id: 'qr-3', text: 'R 的对角线，就是每一列减去投影后剩下的长度。' },
      ],
    },
    {
      id: 'verify',
      type: 'concept',
      title: 'QR = A 验证',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ver-1', text: '把 Q 与 R 乘回去，正好还原出原始矩阵 A。' },
        { id: 'ver-2', text: '因为 R 记下了如何用正交基重新组合出每一列。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同矩阵，看虚线的原始列如何被拉成实线的正交列。' },
        { id: 'int-2', text: '对照右侧的 Q 与 R 表格，验证它们相乘就是原矩阵。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'QR 分解把矩阵拆成正交阵 Q 与上三角阵 R。' },
        { id: 'sum-2', text: '它由 Gram-Schmidt 正交化得来，是最小二乘和 QR 特征值算法的基石。' },
        { id: 'sum-3', text: '把歪斜化作正交，让计算变得清爽，我们下次再见！' },
      ],
    },
  ],
}
