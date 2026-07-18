import type { NarrationScript } from '../types'

/**
 * 平方和定理 - 口播稿件
 * 核心概念：两平方和、费马双平方定理、格点圆
 * 目标受众：高中及以上
 */
export const sumOfSquaresNarration: NarrationScript = {
  id: 'sum-of-squares',
  title: '平方和定理',
  subtitle: '哪些数是两平方和',
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
    '理解两平方和的定义与判定',
    '掌握费马双平方定理的核心结论',
    '认识格点圆与整点表示的联系',
    '感受数论与几何交汇的美感',
  ],

  prerequisites: ['了解平方与质因数分解', '了解平面坐标'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '平方和之谜',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '有些数能拆成两个平方数的和，比如 5 等于 1 加 4。' },
        { id: 'intro-2', text: '可 3 无论怎么试，都凑不出两个平方相加。' },
        { id: 'intro-3', text: '究竟哪些数是两平方和？这背后藏着一条优雅的定律。' },
      ],
    },
    {
      id: 'define',
      type: 'concept',
      title: '两平方和',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'def-1', text: '我们说 n 是两平方和，如果存在整数 a 和 b，使 a 方加 b 方等于 n。' },
        { id: 'def-2', text: '25 就有两种拆法：0 方加 5 方，还有 3 方加 4 方。' },
        { id: 'def-3', text: '把 1 到 100 逐个检验，能表示的数会在网格里点亮。' },
      ],
    },
    {
      id: 'fermat',
      type: 'concept',
      title: '费马双平方定理',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'fer-1', text: '费马发现了判定的钥匙，就藏在质因数分解里。' },
        { id: 'fer-2', text: '把 n 分解，只看形如 4k 加 3 的质因子，比如 3、7、11。' },
        { id: 'fer-3', text: '当且仅当这些因子都出现偶数次时，n 才是两平方和。' },
        { id: 'fer-4', text: '这就是为什么 3 不行，而 9 等于 3 的平方却可以。' },
      ],
    },
    {
      id: 'circle',
      type: 'concept',
      title: '格点圆',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'cir-1', text: '换个视角，a 方加 b 方等于 n 正是半径为根号 n 的圆。' },
        { id: 'cir-2', text: '圆上每一个整数坐标点，都对应一种平方和的表示。' },
        { id: 'cir-3', text: '于是数论问题，变成了数一数圆上有几个格点。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手探索',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '拖动滑块选一个 n，看它能否拆分，又有几种拆法。' },
        { id: 'int-2', text: '切换到格点圆，直观看到那些落在圆上的整点。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: '两平方和由 4k 加 3 型质因子的奇偶决定，这是费马的定理。' },
        { id: 'sum-2', text: '格点圆把它翻译成几何，让数与形彼此照亮。' },
        { id: 'sum-3', text: '一条简洁的定律，串起数论与几何，我们下次再见！' },
      ],
    },
  ],
}
