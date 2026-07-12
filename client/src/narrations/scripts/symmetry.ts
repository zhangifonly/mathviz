import type { NarrationScript } from '../types'

/**
 * 对称之美 - 口播稿件
 * 核心概念：镜像对称、旋转对称、对称群
 * 目标受众：小学以上
 */
export const symmetryNarration: NarrationScript = {
  id: 'symmetry',
  title: '对称之美',
  subtitle: '藏在蝴蝶与雪花里的数学规律',
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
    '认识镜像对称与旋转对称',
    '理解对称就是变换后与自己重合',
    '感受对称在自然与艺术中的普遍存在',
  ],

  prerequisites: ['会数数', '认识左右和方向'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '你有没有发现，蝴蝶的左边和右边长得一模一样？' },
        { id: 'intro-2', text: '这种左右一样的美，数学上叫做对称。' },
        { id: 'intro-3', text: '今天我们一起来看看，对称到底藏着怎样的规律。' },
      ],
    },
    {
      id: 'mirror',
      type: 'concept',
      title: '镜像对称',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'mirror-1', text: '想象在图案中间竖一面镜子，左边照出来正好是右边。' },
        { id: 'mirror-2', text: '这条镜子所在的线，就叫对称轴。' },
        { id: 'mirror-3', text: '蝴蝶、人脸、树叶，都有这样一条对称轴。' },
      ],
    },
    {
      id: 'rotation',
      type: 'concept',
      title: '旋转对称',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'rotation-1', text: '还有一种对称，是把图案绕着中心转一转。' },
        { id: 'rotation-2', text: '风车转四分之一圈，看起来和原来一样，这叫四重旋转对称。' },
        { id: 'rotation-3', text: '海星转五分之一圈重合，雪花转六分之一圈重合。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '切换不同的图案，数一数它转几次才能回到原样。' },
        { id: 'int-2', text: '再找一找，哪些图案还能沿着对称轴翻折重合。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '对称就是变换之后还能和自己重合。' },
        { id: 'sum-2', text: '翻一翻是镜像对称，转一转是旋转对称。' },
        { id: 'sum-3', text: '大自然把对称藏在处处，我们下次再见！' },
      ],
    },
  ],
}
