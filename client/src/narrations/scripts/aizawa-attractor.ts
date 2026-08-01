/**
 * 相泽吸引子 讲解稿
 */
import type { NarrationScript } from '../types'

export const aizawaAttractorNarration: NarrationScript = {
  id: 'aizawa-attractor',
  title: '相泽吸引子',
  subtitle: '一个项打破全部对称',
  difficulty: 'advanced',
  targetAge: '大学本科',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解复数形式如何简化二维旋转方程',
    '掌握旋转等变性的严格定义与检验',
    '认识单个项如何决定整体对称性',
    '会用李雅普诺夫指数确认混沌',
  ],
  prerequisites: ['常微分方程', '复数', '对称性'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '球与柱交织的形状',
      lines: [
        {
          id: 'intro-1',
          text: '相泽吸引子的外形很特别。轨道大部分时间贴着一个球面缠绕，偶尔又沿着中轴穿出去，再折回来。',
        },
        {
          id: 'intro-2',
          text: '这种球面加轴向的混搭结构，在混沌吸引子里不算常见。它的方程也比洛伦兹系统复杂，光是参数就有六个。',
        },
        {
          id: 'intro-3',
          text: '但拆开看会发现，这六个参数里只有一个真正决定了它的对称性。今天就来找出那一个。',
        },
      ],
    },
    {
      id: 'complex',
      type: 'formula',
      title: '前两个方程合成一个',
      lines: [
        {
          id: 'cp-1',
          text: '先看前两个方程。横坐标的导数是 z 减 b 乘 x，再减 d 乘 y。纵坐标的导数是 d 乘 x，加上 z 减 b 乘 y。',
        },
        {
          id: 'cp-2',
          text: '这个交叉的形式提示我们用复数。令 w 等于 x 加 i 乘 y，那么两个方程合成一个：w 的导数等于 z 减 b 加上 i 乘 d，整体乘以 w。',
        },
        {
          id: 'cp-3',
          text: '这不是近似，是恒等式。屏幕上验证的误差精确为零。实部 z 减 b 控制径向的胀缩，虚部 d 控制绕轴的旋转速率。',
        },
      ],
    },
    {
      id: 'rotation',
      type: 'concept',
      title: '什么叫轴对称',
      lines: [
        {
          id: 'rt-1',
          text: '有了复数形式，轴对称就好判断了。绕 z 轴旋转，在复数语言里就是乘以一个模为一的复数。',
        },
        {
          id: 'rt-2',
          text: '严格的说法叫旋转等变：先旋转再求导，和先求导再旋转，结果必须完全一样。这两条路径的差就是等变误差。',
        },
        {
          id: 'rt-3',
          text: '前两个方程天然满足这一点，因为它们只依赖 w 本身。问题出在第三个方程。',
        },
      ],
    },
    {
      id: 'breaker',
      type: 'animation',
      title: '找出破坏者',
      lines: [
        {
          id: 'bk-1',
          text: '第三个方程大部分项都只依赖 z 和 x 平方加 y 平方，也就是只依赖到轴的距离，这些项都不破坏对称。',
        },
        {
          id: 'bk-2',
          text: '唯一的例外是最后那项，f 乘 z 乘 x 的三次方。它单独依赖 x，而不是依赖 x 平方加 y 平方，所以随旋转而变。',
        },
        {
          id: 'bk-3',
          text: '把 f 调成零，等变误差降到十的负十六次方，系统严格轴对称。f 一旦非零，误差立刻跳到十的负二次方量级。',
        },
      ],
    },
    {
      id: 'verify',
      type: 'interaction',
      title: '亲手验证',
      lines: [
        {
          id: 'vf-1',
          text: '请拖动 f 滑块，观察吸引子形状的变化。f 等于零时它是一个完美的回转体，绕轴任意角度看都一样。',
        },
        {
          id: 'vf-2',
          text: 'f 加大到零点一，回转对称消失，吸引子出现明显的方向性。继续加大到零点二五，不对称更加显著。',
        },
        {
          id: 'vf-3',
          text: '同时留意李雅普诺夫指数读数。标准参数下约为零点零七六，为正，确认这是真正的混沌而非复杂的周期运动。',
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
          text: '第一，前两个方程可以合成一个复数方程，实部管胀缩，虚部管旋转。',
        },
        {
          id: 'sum-2',
          text: '第二，旋转等变性是轴对称的严格判据，可以算出具体的误差数值。',
        },
        {
          id: 'sum-3',
          text: '第三，六个参数里只有 f 破坏轴对称，因为只有它依赖 x 而非到轴距离。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
