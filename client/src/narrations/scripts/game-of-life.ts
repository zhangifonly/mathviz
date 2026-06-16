import type { NarrationScript } from '../types'

/**
 * 康威生命游戏 - 口播稿件
 * 核心概念：元胞自动机，简单规则涌现复杂行为
 * 目标受众：初中及以上
 */
export const gameOfLifeNarration: NarrationScript = {
  id: 'game-of-life',
  title: '康威生命游戏',
  subtitle: '简单规则涌现复杂生命',
  difficulty: 'intermediate',
  targetAge: '初中 12岁以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-06-05',
    updatedAt: '2026-06-05',
  },

  objectives: [
    '理解元胞自动机的概念',
    '掌握生命游戏的 B3/S23 规则',
    '观察简单规则如何涌现复杂图案',
    '认识滑翔机、脉冲星等经典结构',
  ],

  prerequisites: [
    '认识网格和坐标',
    '会简单计数',
  ],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '欢迎来到康威生命游戏。它不是真正的游戏，而是一个奇妙的数学世界。' },
        { id: 'intro-2', text: '1970年，数学家约翰·康威设计了它。整个世界只是一张布满方格的网格。' },
        { id: 'intro-3', text: '每个格子代表一个细胞，它只有两种状态：活着，或者死去。' },
        { id: 'intro-4', text: '神奇的是，仅靠两条极简单的规则，就能涌现出令人惊叹的复杂图案。' },
      ],
    },
    {
      id: 'rules',
      type: 'concept',
      title: '游戏规则',
      trigger: { type: 'auto' },
      lines: [
        { id: 'rules-1', text: '每个细胞周围有八个邻居。规则只看这八个邻居里有几个是活的。', formula: 'n = \\text{活邻居数}' },
        { id: 'rules-2', text: '第一条规则：如果一个活细胞周围有两个或三个活邻居，它就继续存活。', formula: '\\text{存活}: n \\in \\{2,3\\}' },
        { id: 'rules-3', text: '邻居太少会孤独而死，邻居太多会拥挤而死。这就是生存的平衡。' },
        { id: 'rules-4', text: '第二条规则：如果一个死细胞周围恰好有三个活邻居，它就会诞生。', formula: '\\text{出生}: n = 3' },
        { id: 'rules-5', text: '这套规则被称为 B3/S23。所有细胞同时根据它更新，进入下一代。' },
      ],
    },
    {
      id: 'patterns',
      type: 'animation',
      title: '经典图案',
      trigger: { type: 'auto' },
      lines: [
        { id: 'pat-1', text: '最有名的图案是滑翔机。五个细胞组成的小队，竟然能在网格上斜向爬行。' },
        { id: 'pat-2', text: '每过四代，滑翔机就完整地向前移动一格，永不停歇。' },
        { id: 'pat-3', text: '闪烁灯是最简单的振荡器，三个细胞不停地横竖切换。' },
        { id: 'pat-4', text: '脉冲星则壮观得多，它是一个周期为三的巨大振荡结构，像心脏一样搏动。' },
        { id: 'pat-5', text: '高斯帕滑翔机枪更不可思议，它会源源不断地发射出新的滑翔机。' },
      ],
    },
    {
      id: 'emergence',
      type: 'concept',
      title: '涌现之美',
      trigger: { type: 'auto' },
      lines: [
        { id: 'emg-1', text: '这就是数学中"涌现"的概念：复杂的整体行为，源自简单的局部规则。' },
        { id: 'emg-2', text: '没有谁在指挥这些细胞，它们只是各自遵守同一条规则。' },
        { id: 'emg-3', text: '生命游戏被证明是图灵完备的，理论上它能完成任何计算机能做的计算。' },
        { id: 'emg-4', text: '从蚁群到大脑，从星系到生命本身，自然界处处都是这种涌现现象。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '动手探索',
      trigger: { type: 'auto' },
      lines: [
        { id: 'int-1', text: '现在轮到你了。点击网格上的格子，亲手创造你的初始生命。' },
        { id: 'int-2', text: '点击"随机"按钮，看看混沌的初始状态会演化出怎样的结局。' },
        { id: 'int-3', text: '调整速度滑块，放慢节奏，仔细观察每一代的变化。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结回顾',
      trigger: { type: 'auto' },
      lines: [
        { id: 'sum-1', text: '我们认识了生命游戏：一个由 B3/S23 规则驱动的元胞自动机。' },
        { id: 'sum-2', text: '我们见证了滑翔机的爬行、脉冲星的搏动，以及简单规则的无穷可能。' },
        { id: 'sum-3', text: '数学之美，正在于这种从简单到复杂的奇妙跨越。继续探索吧！' },
      ],
    },
  ],
}
