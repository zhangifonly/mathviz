/**
 * 托马斯吸引子 讲解稿
 */
import type { NarrationScript } from '../types'

export const thomasAttractorNarration: NarrationScript = {
  id: 'thomas-attractor',
  title: '托马斯吸引子',
  subtitle: '一个参数走完全部路径',
  difficulty: 'advanced',
  targetAge: '大学本科',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解阻尼参数如何控制系统状态',
    '认识从不动点到极限环到混沌的过渡',
    '掌握用李雅普诺夫指数区分三种状态',
    '了解正弦耦合系统的有界性来源',
  ],
  prerequisites: ['常微分方程', '极限环', '混沌基本概念'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '循环推动的三个变量',
      lines: [
        {
          id: 'intro-1',
          text: '托马斯系统的结构很好懂：每个变量被下一个变量的正弦驱动，同时被自己的阻尼拖住。',
        },
        {
          id: 'intro-2',
          text: '驱动项让系统想动，阻尼项让系统想停。两股力量的强弱由一个参数 b 控制。',
        },
        {
          id: 'intro-3',
          text: '妙处在于，只调这一个参数，系统会走完动力系统的三种典型状态。这在同一个方程里看全，机会不多。',
        },
      ],
    },
    {
      id: 'damped',
      type: 'concept',
      title: '阻尼占上风',
      lines: [
        {
          id: 'dm-1',
          text: '先把 b 调大，比如零点五。阻尼压倒驱动，所有轨道都被拉向原点。',
        },
        {
          id: 'dm-2',
          text: '李雅普诺夫指数是负零点三四，明确的负值。轨道尺度趋于零，系统最终静止在不动点上。',
        },
        {
          id: 'dm-3',
          text: '这时系统完全可预测：无论从哪出发，结局都一样。没有任何混沌。',
        },
      ],
    },
    {
      id: 'cycle',
      type: 'animation',
      title: '临界的极限环',
      lines: [
        {
          id: 'cy-1',
          text: '把 b 降到零点三二左右，情况变了。轨道不再收缩到点，而是落在一个闭合的环上反复循环。',
        },
        {
          id: 'cy-2',
          text: '这叫极限环，是周期运动。李雅普诺夫指数几乎正好是零，处在混沌与收敛的临界线上。',
        },
        {
          id: 'cy-3',
          text: '极限环仍然可预测，只是变成了周期性的可预测。系统有了持续的振荡，但没有随机性。',
        },
      ],
    },
    {
      id: 'chaos',
      type: 'formula',
      title: '混沌接管',
      lines: [
        {
          id: 'ch-1',
          text: '继续把 b 降到零点二零八。轨道彻底放弃了周期性，开始在空间里不规则地缠绕。',
        },
        {
          id: 'ch-2',
          text: '李雅普诺夫指数转为正零点零三一。相邻轨道指数分离，长期预测变得不可能。',
        },
        {
          id: 'ch-3',
          text: 'b 再往下降到零点一，指数升到零点零七八，轨道范围也从八点五扩大到十八点五。混沌越来越强。',
        },
      ],
    },
    {
      id: 'bounded',
      type: 'interaction',
      title: '为什么不会跑掉',
      lines: [
        {
          id: 'bd-1',
          text: '有个问题值得想：驱动项一直在推，轨道为什么不飞到无穷远？',
        },
        {
          id: 'bd-2',
          text: '因为正弦函数的值永远在正负一之间。当坐标大到让阻尼项超过一时，那个方向的导数必定把它拉回来。',
        },
        {
          id: 'bd-3',
          text: '由此得到一个估计：轨道被限制在坐标绝对值不超过一除以 b 的立方体内。b 越小盒子越大，这正是范围扩大的原因。',
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
          text: '第一，托马斯系统由正弦循环耦合而成，阻尼参数 b 控制全局行为。',
        },
        {
          id: 'sum-2',
          text: '第二，b 从大到小依次给出不动点、极限环、混沌三种状态，李雅普诺夫指数从负到零到正。',
        },
        {
          id: 'sum-3',
          text: '第三，正弦有界保证轨道困在边长约二除以 b 的盒子里，不会发散。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
