import type { NarrationScript } from '../types'

/**
 * 莫比乌斯环与克莱因瓶 - 口播稿件
 * 核心概念：单侧曲面、不可定向性、拓扑学
 * 目标受众：高中及以上
 */
export const mobiusNarration: NarrationScript = {
  id: 'mobius',
  title: '莫比乌斯环与克莱因瓶',
  subtitle: '只有一个面的神奇曲面',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-06-17',
    updatedAt: '2026-06-17',
  },

  objectives: [
    '理解"单侧曲面"的概念',
    '认识莫比乌斯环的构造与性质',
    '了解克莱因瓶与不可定向曲面',
    '建立对拓扑学的直观认识',
  ],

  prerequisites: [
    '了解三维坐标',
    '了解参数方程',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '拿一条纸带，把一端翻转180度，再和另一端粘起来。你就做出了一个莫比乌斯环。' },
        { id: 'intro-2', text: '它看起来普普通通，却藏着一个违反直觉的秘密：它只有一个面。' },
        { id: 'intro-3', text: '普通的纸带有正反两面，但莫比乌斯环上的蚂蚁，不用翻越边缘就能走遍"两面"。' },
        { id: 'intro-4', text: '今天我们就在三维空间里，亲手旋转这些奇妙的拓扑曲面。' },
      ],
    },
    {
      id: 'mobius',
      type: 'animation',
      title: '莫比乌斯环',
      trigger: { type: 'auto' },
      lines: [
        { id: 'mob-1', text: '这就是莫比乌斯环。注意它的扭转：中线绕一圈，带子本身却翻转了半圈。', formula: 'z = \\tfrac{v}{2}\\sin\\tfrac{u}{2}' },
        { id: 'mob-2', text: '让一只蚂蚁沿中线出发，走完一圈，它会发现自己来到了出发点的"背面"。' },
        { id: 'mob-3', text: '只有再走第二圈，蚂蚁才真正回到起点。一圈到背面，两圈才归位，这正是单侧的证据。' },
        { id: 'mob-4', text: '更妙的是：沿中线把它剪开，它不会一分为二，而是变成一个更长的双扭大环。' },
      ],
    },
    {
      id: 'klein',
      type: 'animation',
      title: '克莱因瓶',
      trigger: { type: 'auto' },
      lines: [
        { id: 'klein-1', text: '如果把两条莫比乌斯环的边缝合起来，会得到什么？答案是克莱因瓶。' },
        { id: 'klein-2', text: '它是一个没有边界、也没有内外之分的封闭曲面。倒进去的水，分不清是在瓶内还是瓶外。' },
        { id: 'klein-3', text: '我们看到的"瓶颈穿过瓶身"只是三维的妥协，真正的克莱因瓶完美地存在于四维空间。' },
      ],
    },
    {
      id: 'compare',
      type: 'concept',
      title: '可定向与否',
      trigger: { type: 'auto' },
      lines: [
        { id: 'cmp-1', text: '作为对比，看看普通的环面。它和莫比乌斯环一样是一个圈，却清清楚楚有内外两面。' },
        { id: 'cmp-2', text: '环面是可定向曲面，而莫比乌斯环和克莱因瓶是不可定向曲面。' },
        { id: 'cmp-3', text: '是否可定向，是拓扑学区分曲面的一个根本特征，它不随拉伸弯曲而改变。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '动手探索',
      trigger: { type: 'auto' },
      lines: [
        { id: 'int-1', text: '现在你可以用鼠标拖动，从任意角度旋转这些曲面，仔细观察它们的扭转结构。' },
        { id: 'int-2', text: '切换莫比乌斯环、克莱因瓶和环面，对比单侧与双侧的差异。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结回顾',
      trigger: { type: 'auto' },
      lines: [
        { id: 'sum-1', text: '我们认识了只有一个面的莫比乌斯环，和没有内外的克莱因瓶。' },
        { id: 'sum-2', text: '它们颠覆了我们对"面"的直觉，开启了拓扑学这门研究形状本质的学科。' },
        { id: 'sum-3', text: '数学的想象力可以超越我们生活的维度。继续探索吧！' },
      ],
    },
  ],
}
