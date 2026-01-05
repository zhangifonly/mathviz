import type { NarrationScript } from '../types'

/**
 * 集合论可视化实验 - 口播稿件
 *
 * 核心概念：通过韦恩图理解集合运算
 * 目标受众：小学生（6-12岁），数学入门
 */
export const setTheoryNarration: NarrationScript = {
  id: 'set-theory',
  title: '集合论可视化',
  subtitle: '通过韦恩图理解集合运算',
  difficulty: 'beginner',
  targetAge: '小学 6-12岁',
  voice: 'xiaoxiao',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-01-03',
    updatedAt: '2026-01-03',
  },

  objectives: [
    '理解集合的基本概念',
    '认识韦恩图的表示方法',
    '掌握并集、交集、差集、对称差的运算',
    '理解集合运算的实际应用',
  ],

  prerequisites: [
    '认识数字',
    '理解"属于"和"不属于"的概念',
    '会做简单的分类',
  ],

  sections: [
    // ========== 第一部分：开场引入 ==========
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        {
          id: 'intro-1',
          text: '小朋友们好！欢迎来到集合论可视化实验。',
          animation: { action: 'reset' },
        },
        {
          id: 'intro-2',
          text: '你有没有把玩具分过类？比如把汽车放一堆，把积木放一堆？',
        },
        {
          id: 'intro-3',
          text: '这种把东西分成不同组的方法，在数学里叫做"集合"。',
        },
        {
          id: 'intro-4',
          text: '今天，我们要用漂亮的韦恩图来学习集合运算。准备好了吗？',
        },
      ],
    },

    // ========== 第二部分：集合概念 ==========
    {
      id: 'concept',
      type: 'concept',
      title: '认识集合',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'concept-1',
          text: '集合就是把有共同特点的东西放在一起。',
        },
        {
          id: 'concept-2',
          text: '比如，集合A可以是"1到5的数字"，写成 A = {1, 2, 3, 4, 5}。',
        },
        {
          id: 'concept-3',
          text: '集合B可以是"4到8的数字"，写成 B = {4, 5, 6, 7, 8}。',
        },
        {
          id: 'concept-4',
          text: '大括号里的数字叫做集合的"元素"。',
        },
        {
          id: 'concept-5',
          text: '如果一个数字在集合里，我们说它"属于"这个集合。',
        },
      ],
    },

    // ========== 第三部分：韦恩图 ==========
    {
      id: 'venn',
      type: 'concept',
      title: '韦恩图',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'venn-1',
          text: '韦恩图是用圆圈来表示集合的图形。',
        },
        {
          id: 'venn-2',
          text: '蓝色的圆圈代表集合A，绿色的圆圈代表集合B。',
        },
        {
          id: 'venn-3',
          text: '两个圆圈重叠的部分，表示两个集合都有的元素。',
        },
        {
          id: 'venn-4',
          text: '看！4和5既在A里，也在B里，所以它们在重叠的区域。',
        },
        {
          id: 'venn-5',
          text: '韦恩图让我们一眼就能看出集合之间的关系！',
        },
      ],
    },

    // ========== 第四部分：并集 ==========
    {
      id: 'union',
      type: 'concept',
      title: '并集',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'union-1',
          text: '并集就是把两个集合的所有元素合在一起。',
          animation: { action: 'setParams', params: { operation: 'union' } },
        },
        {
          id: 'union-2',
          text: '符号是"∪"，读作"并"。A ∪ B 就是A并B。',
        },
        {
          id: 'union-3',
          text: '看韦恩图，紫色高亮的部分就是并集，包括两个圆圈的所有区域。',
        },
        {
          id: 'union-4',
          text: 'A = {1,2,3,4,5}，B = {4,5,6,7,8}，A ∪ B = {1,2,3,4,5,6,7,8}。',
        },
        {
          id: 'union-5',
          text: '注意！4和5虽然在两个集合里都有，但在并集里只写一次。',
        },
      ],
    },

    // ========== 第五部分：交集 ==========
    {
      id: 'intersection',
      type: 'concept',
      title: '交集',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'inter-1',
          text: '交集是两个集合共同拥有的元素。',
          animation: { action: 'setParams', params: { operation: 'intersection' } },
        },
        {
          id: 'inter-2',
          text: '符号是"∩"，读作"交"。A ∩ B 就是A交B。',
        },
        {
          id: 'inter-3',
          text: '看韦恩图，紫色高亮的部分就是交集，只有两个圆圈重叠的区域。',
        },
        {
          id: 'inter-4',
          text: 'A = {1,2,3,4,5}，B = {4,5,6,7,8}，A ∩ B = {4,5}。',
        },
        {
          id: 'inter-5',
          text: '只有4和5同时在A和B里，所以交集就是{4,5}。',
        },
      ],
    },

    // ========== 第六部分：差集 ==========
    {
      id: 'difference',
      type: 'concept',
      title: '差集',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'diff-1',
          text: '差集是从一个集合里去掉另一个集合的元素。',
          animation: { action: 'setParams', params: { operation: 'difference' } },
        },
        {
          id: 'diff-2',
          text: '符号是"\\"，A \\ B 读作"A减B"。',
        },
        {
          id: 'diff-3',
          text: '看韦恩图，紫色高亮的部分是A里有但B里没有的元素。',
        },
        {
          id: 'diff-4',
          text: 'A = {1,2,3,4,5}，B = {4,5,6,7,8}，A \\ B = {1,2,3}。',
        },
        {
          id: 'diff-5',
          text: '1、2、3只在A里，不在B里，所以它们是差集的元素。',
        },
      ],
    },

    // ========== 第七部分：对称差 ==========
    {
      id: 'symmetric',
      type: 'concept',
      title: '对称差',
      trigger: { type: 'auto' },
      lines: [
        {
          id: 'sym-1',
          text: '对称差是两个集合各自独有的元素。',
          animation: { action: 'setParams', params: { operation: 'symmetric' } },
        },
        {
          id: 'sym-2',
          text: '符号是"△"，A △ B 读作"A对称差B"。',
        },
        {
          id: 'sym-3',
          text: '看韦恩图，紫色高亮的部分是两个圆圈不重叠的区域。',
        },
        {
          id: 'sym-4',
          text: 'A △ B = {1,2,3,6,7,8}，就是去掉了共同的4和5。',
        },
        {
          id: 'sym-5',
          text: '对称差也可以理解为：并集减去交集。',
        },
      ],
    },

    // ========== 第八部分：参数互动 ==========
    {
      id: 'parameters',
      type: 'interaction',
      title: '自己试试',
      trigger: { type: 'parameter' },
      lines: [
        {
          id: 'param-1',
          text: '现在轮到你来试试了！',
        },
        {
          id: 'param-2',
          text: '在右边的控制面板，你可以修改集合A和集合B的元素。',
        },
        {
          id: 'param-3',
          text: '点击不同的运算按钮，看看韦恩图会怎么变化？',
        },
        {
          id: 'param-4',
          text: '试试让两个集合完全不重叠，交集会变成什么？',
        },
        {
          id: 'param-5',
          text: '再试试让一个集合完全包含另一个，差集会变成什么？',
        },
      ],
    },

    // ========== 第九部分：实际应用 ==========
    {
      id: 'application',
      type: 'application',
      title: '生活中的应用',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'app-1',
          text: '集合运算在生活中到处都能用到！',
        },
        {
          id: 'app-2',
          text: '比如，喜欢足球的同学是集合A，喜欢篮球的同学是集合B。',
        },
        {
          id: 'app-3',
          text: '两种都喜欢的同学就是交集，至少喜欢一种的就是并集。',
        },
        {
          id: 'app-4',
          text: '搜索引擎也用集合运算：搜"苹果 AND 手机"就是交集，"苹果 OR 水果"就是并集。',
        },
        {
          id: 'app-5',
          text: '学好集合，你就能更好地分类和整理信息啦！',
        },
      ],
    },

    // ========== 第十部分：总结 ==========
    {
      id: 'summary',
      type: 'summary',
      title: '总结回顾',
      trigger: { type: 'manual' },
      lines: [
        {
          id: 'summary-1',
          text: '今天我们学习了集合运算，让我们来回顾一下。',
          animation: { action: 'reset' },
        },
        {
          id: 'summary-2',
          text: '集合是把有共同特点的元素放在一起，用大括号表示。',
        },
        {
          id: 'summary-3',
          text: '韦恩图用圆圈来表示集合，重叠部分是共同元素。',
        },
        {
          id: 'summary-4',
          text: '并集∪是所有元素，交集∩是共同元素，差集\\是独有元素。',
        },
        {
          id: 'summary-5',
          text: '对称差△是两个集合各自独有的元素合在一起。',
        },
        {
          id: 'summary-6',
          text: '太棒了！你已经掌握了集合运算的基本知识。继续探索其他实验，发现更多数学的乐趣吧！',
        },
      ],
    },
  ],

  furtherReading: [
    {
      title: '概率分布',
      description: '学习概率，集合的高级应用',
      link: '/probability',
    },
    {
      title: '数论探索',
      description: '探索数字的奥秘',
      link: '/number-theory',
    },
  ],
}

export default setTheoryNarration
