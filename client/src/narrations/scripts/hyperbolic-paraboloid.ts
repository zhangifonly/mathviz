/**
 * 双曲抛物面 讲解稿
 */
import type { NarrationScript } from '../types'

export const hyperbolicParaboloidNarration: NarrationScript = {
  id: 'hyperbolic-paraboloid',
  title: '双曲抛物面',
  subtitle: '由两族直线铺满的马鞍面',
  difficulty: 'intermediate',
  targetAge: '高中 15-18岁',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解鞍点：两个方向的弯曲方向相反',
    '认识高斯曲率为负的几何含义',
    '理解双直纹面：弯曲的面可以由直线铺满',
    '知道这一性质在建筑工程中的应用',
  ],
  prerequisites: ['二次函数', '空间直角坐标系'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '薯片的形状',
      lines: [
        {
          id: 'intro-1',
          text: '拿起一片薯片仔细看，它沿一个方向向上弯，沿垂直的方向却向下弯。这种两头翘中间凹的形状，数学上叫双曲抛物面。',
        },
        {
          id: 'intro-2',
          text: '它的方程简单得出人意料：z 等于 x 的平方减去 y 的平方，各自再除以一个系数。一个加号变成减号，碗就变成了马鞍。',
        },
        {
          id: 'intro-3',
          text: '今天要讲的重点不是它的形状，而是藏在这个弯曲曲面里的一个反直觉事实。',
        },
      ],
    },
    {
      id: 'saddle',
      type: 'concept',
      title: '处处是鞍点',
      lines: [
        {
          id: 'sad-1',
          text: '先看弯曲方式。沿着 x 方向切一刀，截面是一条开口向上的抛物线。沿着 y 方向切，截面是开口向下的抛物线。',
        },
        {
          id: 'sad-2',
          text: '两个主方向的弯曲符号相反，乘起来就是负数。这个乘积叫高斯曲率，负的高斯曲率就意味着这一点是鞍点。',
        },
        {
          id: 'sad-3',
          text: '关键在于，这张曲面上没有任何一点例外。每一点的高斯曲率都是负的，所以它处处都是鞍点，没有碗形的地方。',
        },
      ],
    },
    {
      id: 'ruled',
      type: 'animation',
      title: '弯曲的面由直线铺成',
      lines: [
        {
          id: 'rul-1',
          text: '现在看反直觉的部分。这张明显弯曲的曲面，居然可以被一族笔直的直线完全铺满，一根都不弯。',
        },
        {
          id: 'rul-2',
          text: '更惊人的是，这样的直线族不只一族，而是整整两族。画面上黄色和青色的两组线就是它们。',
        },
        {
          id: 'rul-3',
          text: '曲面上每一点都恰好有两条直线穿过，一条来自第一族，一条来自第二族。这种曲面叫双直纹面。',
        },
      ],
    },
    {
      id: 'proof',
      type: 'formula',
      title: '换个参数就看清了',
      lines: [
        {
          id: 'prf-1',
          text: '为什么会这样？换一组参数就一目了然。令 x 等于 a 乘 s 加 t，y 等于 b 乘 s 减 t，那么 z 恰好等于四倍的 s 乘 t。',
        },
        {
          id: 'prf-2',
          text: '现在固定 t 不动，只让 s 变化。三个坐标都是 s 的一次函数，这就是一条直线的标准形式。',
        },
        {
          id: 'prf-3',
          text: '反过来固定 s 让 t 变化，同样得到一次函数，也是直线。两种固定方式就给出了两族直线。',
        },
      ],
    },
    {
      id: 'apply',
      type: 'application',
      title: '工程上的妙用',
      lines: [
        {
          id: 'app-1',
          text: '这个性质在建筑上极其有用。想盖一个漂亮的曲面屋顶，却不想定制昂贵的弯曲构件，怎么办？',
        },
        {
          id: 'app-2',
          text: '答案就是用双曲抛物面。整个屋顶用笔直的钢梁或木梁按两族方向交叉搭起来，成品却是一张优雅的曲面。',
        },
        {
          id: 'app-3',
          text: '请拖动两个系数滑块，看曲面如何在不同比例间变化。无论怎么调，那两族直线始终存在，这是它的固有性质。',
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
          text: '第一，双曲抛物面的高斯曲率处处为负，所以它每一点都是鞍点。',
        },
        {
          id: 'sum-2',
          text: '第二，它是双直纹面，能被两族直线完全铺满，每点恰有两条直线穿过。',
        },
        {
          id: 'sum-3',
          text: '第三，正因如此，弯曲的屋顶可以用笔直的梁搭出来。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
