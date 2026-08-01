/**
 * 环面纽结管 讲解稿
 */
import type { NarrationScript } from '../types'

export const torusKnotSurfaceNarration: NarrationScript = {
  id: 'torus-knot-surface',
  title: '环面纽结管',
  subtitle: '两个整数决定一个纽结',
  difficulty: 'advanced',
  targetAge: '大学本科',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解环面纽结由两个整数完全决定',
    '掌握交叉数、亏格、桥数三个公式',
    '认识 gcd 判据区分纽结与链环',
    '体会 (p,q) 与 (q,p) 给出同一纽结',
  ],
  prerequisites: ['环面', '纽结的基本概念', '最大公约数'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '在甜甜圈表面绕行',
      lines: [
        {
          id: 'intro-1',
          text: '拿一个甜甜圈，在它表面画一条封闭曲线。规则是：一边绕着中心孔转，一边绕着管子转。',
        },
        {
          id: 'intro-2',
          text: '绕中心孔的圈数记作 q，绕管子的圈数记作 p。这两个整数一定，曲线就完全定了。',
        },
        {
          id: 'intro-3',
          text: '把这条曲线从环面上取下来，套上一层圆管，就得到一个实心的纽结。这类纽结叫环面纽结。',
        },
      ],
    },
    {
      id: 'why',
      type: 'concept',
      title: '为什么值得研究',
      lines: [
        {
          id: 'wh-1',
          text: '纽结理论有个现实困难：给定一个纽结，算它的不变量往往很麻烦，得靠查表。',
        },
        {
          id: 'wh-2',
          text: '环面纽结是难得的例外。它的主要不变量都有现成的公式，只需要 p 和 q 两个数字代进去。',
        },
        {
          id: 'wh-3',
          text: '所以它成了纽结理论最好的教材：所有量都算得出来，不用背表，还能验证公式之间的一致性。',
        },
      ],
    },
    {
      id: 'formulas',
      type: 'formula',
      title: '三个公式',
      lines: [
        {
          id: 'fm-1',
          text: '第一个是交叉数，等于 p 乘 q 减一与 q 乘 p 减一这两个数里的较小者。三叶结代入得三，五叶结得五。',
        },
        {
          id: 'fm-2',
          text: '第二个是亏格，等于 p 减一乘 q 减一再除以二。这是纽结的 Seifert 曲面上有几个洞。',
        },
        {
          id: 'fm-3',
          text: '第三个是桥数，就是 p 和 q 中较小的那个。它表示纽结最少能分成几段上跨。',
        },
      ],
    },
    {
      id: 'gcd',
      type: 'animation',
      title: '互素才是纽结',
      lines: [
        {
          id: 'gc-1',
          text: '但有个前提必须先满足。绕行时如果 p 和 q 有公因数，曲线会提前闭合，绕不完整个环面。',
        },
        {
          id: 'gc-2',
          text: '这时得到的不是一根绳子打结，而是好几根绳子套在一起，叫链环。分支的数量恰好等于 p 与 q 的最大公约数。',
        },
        {
          id: 'gc-3',
          text: '请切换到二和六，你会看到最大公约数是二，画面上出现两个分开的圈。三个公式此时都不适用。',
        },
      ],
    },
    {
      id: 'symmetry',
      type: 'interaction',
      title: '一个有趣的对称',
      lines: [
        {
          id: 'sy-1',
          text: '现在做个实验：先看二和三，再看三和二。虽然绕行方式完全不同，得到的却是同一个纽结类型。',
        },
        {
          id: 'sy-2',
          text: '这不是巧合。你可以验证三个公式在交换 p 与 q 后值都不变，交叉数、亏格、桥数一个都没动。',
        },
        {
          id: 'sy-3',
          text: '几何上的解释是：把环面从内向外翻过来，经线和纬线的角色就互换了，而纽结类型不受影响。',
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
          text: '第一，环面纽结由两个整数 p 与 q 完全决定，绕经线 p 圈、绕纬线 q 圈。',
        },
        {
          id: 'sum-2',
          text: '第二，交叉数、亏格、桥数都有现成公式，代入 p 与 q 即可算出，无需查表。',
        },
        {
          id: 'sum-3',
          text: '第三，p 与 q 必须互素才是纽结，否则是链环，分支数等于最大公约数。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
