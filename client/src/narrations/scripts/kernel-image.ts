import type { NarrationScript } from '../types'

/**
 * 核与像 - 口播稿件
 * 核心概念：线性映射的零空间(核)与列空间(像)、秩-零化度定理
 * 目标受众：高中及以上
 */
export const kernelImageNarration: NarrationScript = {
  id: 'kernel-image',
  title: '核与像',
  subtitle: '线性映射的零空间与列空间',
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
    '理解线性映射把空间送往何处',
    '认识核是被压成零的输入方向',
    '认识像是输出能到达的集合',
    '掌握秩-零化度定理',
  ],

  prerequisites: ['了解矩阵乘向量', '了解平面坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '一个矩阵，其实是一台把平面搬来搬去的机器。' },
        { id: 'intro-2', text: '你喂给它一个向量，它就吐出另一个向量。' },
        { id: 'intro-3', text: '那么问题来了：这台机器最终把整个平面送到了哪里？' },
      ],
    },
    {
      id: 'kernel',
      type: 'concept',
      title: '核：被压成零的方向',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'ker-1', text: '有些方向很特别，无论向量多长，映射后都变成了零向量。' },
        { id: 'ker-2', text: '这些被彻底压扁的方向，合起来就叫做核，也就是零空间。' },
        { id: 'ker-3', text: '满秩的映射没有核，而降秩时，核就是那条被压没的直线。' },
      ],
    },
    {
      id: 'image',
      type: 'concept',
      title: '像：能到达的地方',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'img-1', text: '再看输出：所有结果向量铺成的集合，就是像，也叫列空间。' },
        { id: 'img-2', text: '满秩时像铺满整个平面，降一秩就塌成一条直线，全零则只剩原点。' },
      ],
    },
    {
      id: 'theorem',
      type: 'concept',
      title: '秩-零化度定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'thm-1', text: '像的维数叫秩，核的维数叫零化度。' },
        { id: 'thm-2', text: '奇妙的是，它俩相加永远等于输入空间的维数。' },
        { id: 'thm-3', text: '在平面里就是：秩加零化度恒等于二，一分不多一分不少。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换满秩矩阵，看左边的网格被完整搬到右边。' },
        { id: 'int-2', text: '再换成秩一矩阵，红色的核方向瞬间全部坍缩到原点。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '核是被映射抹掉的方向，像是映射能触及的天地。' },
        { id: 'sum-2', text: '秩与零化度此消彼长，加起来恰好是维数守恒。' },
        { id: 'sum-3', text: '看懂了核与像，就看懂了线性映射的骨架，我们下次再见！' },
      ],
    },
  ],
}
