import type { NarrationScript } from '../types'

/**
 * 勾股数 - 口播稿件
 * 核心概念：a²+b²=c²、欧几里得生成公式、本原与派生
 * 目标受众：初中及以上
 */
export const pythagoreanTriplesNarration: NarrationScript = {
  id: 'pythagorean-triples',
  title: '勾股数',
  subtitle: '整数直角三角形',
  difficulty: 'intermediate',
  targetAge: '初中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解勾股数的定义 a²+b²=c²',
    '掌握欧几里得生成公式',
    '区分本原勾股数与派生勾股数',
    '感受整数解在平面上的分布之美',
  ],

  prerequisites: ['勾股定理', '整数与互质概念'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '开场引入',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '三条边都是整数的直角三角形，最出名的就是三、四、五。' },
        { id: 'intro-2', text: '三的平方加四的平方，正好等于五的平方，严丝合缝。' },
        { id: 'intro-3', text: '像这样满足勾股定理的整数三元组，我们就叫它勾股数。' },
      ],
    },
    {
      id: 'concept',
      type: 'concept',
      title: '什么是勾股数',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '勾股数是一组正整数 a、b、c，满足 a²加 b²等于 c²。' },
        { id: 'def-2', text: '除了三四五，还有五、十二、十三，八、十五、十七，都是它的成员。' },
        { id: 'def-3', text: '问题来了：这样的整数三角形，究竟有多少组，又该怎样一网打尽？' },
      ],
    },
    {
      id: 'formula',
      type: 'concept',
      title: '欧几里得公式',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'form-1', text: '古希腊的欧几里得给出了答案：取两个正整数 m 大于 n。' },
        { id: 'form-2', text: '令 a 等于 m²减 n²，b 等于二 m n，c 等于 m²加 n²。' },
        { id: 'form-3', text: '代进去一算，a²加 b²恰好等于 c²，源源不断地造出勾股数。' },
      ],
    },
    {
      id: 'primitive',
      type: 'concept',
      title: '本原与派生',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'prim-1', text: '当 m 和 n 互质，而且一奇一偶时，得到的是本原勾股数，三边再无公因数。' },
        { id: 'prim-2', text: '把一组本原解同时乘以二、乘以三，就得到六八十、九十二十七这些派生解。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '调大斜边的上限，屏幕上的整数点会越来越多，铺成放射状的图案。' },
        { id: 'int-2', text: '点开任意一组，看看它的平方和是不是真的严丝合缝。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '勾股数是满足 a²加 b²等于 c²的整数三元组。' },
        { id: 'sum-2', text: '欧几里得公式用 m、n 两个参数，把它们全部生成出来。' },
        { id: 'sum-3', text: '一条古老的定理，藏着无穷的整数之美，我们下次再见！' },
      ],
    },
  ],
}
