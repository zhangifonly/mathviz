/**
 * Cavalieri 原理 讲解稿
 */
import type { NarrationScript } from '../types'

export const cavalieriNarration: NarrationScript = {
  id: 'cavalieri',
  title: 'Cavalieri 原理',
  subtitle: '截面积处处相等，体积就相等',
  difficulty: 'intermediate',
  targetAge: '高中 15-18岁',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解 Cavalieri 原理的内容',
    '知道棱锥体积公式里 1/3 的来历',
    '掌握阿基米德算球体积的方法',
    '认识它与积分的关系',
  ],
  prerequisites: ['立体几何', '面积公式', '数列求和'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '一摞纸的启发',
      lines: [
        {
          id: 'intro-1',
          text: '桌上放一摞纸，整整齐齐。现在用手把它推歪，变成一个斜的柱体。',
        },
        {
          id: 'intro-2',
          text: '纸还是那些纸，每一张的面积都没变，所以总的体积也没变。这个道理谁都懂。',
        },
        {
          id: 'intro-3',
          text: '卡瓦列里在一六三五年把它写成一条原理：两个立体如果被任意平行平面截得的面积总相等，那么体积相等。',
        },
      ],
    },
    {
      id: 'pyramid',
      type: 'formula',
      title: '棱锥的三分之一',
      lines: [
        {
          id: 'py-1',
          text: '这条原理最有用的推论之一，是棱锥的体积公式：底面积乘高再除以三。',
        },
        {
          id: 'py-2',
          text: '为什么是三？看截面。在高度 h 处，棱锥的截面是底面按比例缩小的相似形，比例是一减 h 除以 H。',
        },
        {
          id: 'py-3',
          text: '面积按比例的平方缩小，把这个平方从零积到 H，得到的正是三分之一。屏幕上的数值积分验证了这点。',
        },
      ],
    },
    {
      id: 'same',
      type: 'animation',
      title: '形状不同也能等体积',
      lines: [
        {
          id: 'sm-1',
          text: '请切到棱锥那个场景。左边是底面为圆的棱锥，右边是圆锥，两者同底同高。',
        },
        {
          id: 'sm-2',
          text: '拖动滑块，你会看到两片黄色截面的面积始终完全相等，屏幕中间显示等号。',
        },
        {
          id: 'sm-3',
          text: '既然处处相等，体积就必然相等。这就是这条原理的用法：把难算的立体换成好算的。',
        },
      ],
    },
    {
      id: 'sphere',
      type: 'concept',
      title: '阿基米德算球体积',
      lines: [
        {
          id: 'sp-1',
          text: '最漂亮的应用来自阿基米德，比卡瓦列里早了一千八百年。他要算球的体积。',
        },
        {
          id: 'sp-2',
          text: '取一个半球，半径 r。在高度 h 处切一刀，截面是个圆，半径是根号下 r 平方减 h 平方，面积就是圆周率乘这个差。',
        },
        {
          id: 'sp-3',
          text: '再取一个圆柱，从中挖掉一个倒立的圆锥。同样高度切一刀，截面是个环，外圆半径 r，内圆半径恰好是 h。环的面积也是圆周率乘那个差。',
        },
      ],
    },
    {
      id: 'archimedes',
      type: 'interaction',
      title: '两个截面处处相同',
      lines: [
        {
          id: 'ar-1',
          text: '请切到球那个场景，拖动滑块从底到顶。两片截面的面积读数始终一致，偏差是零。',
        },
        {
          id: 'ar-2',
          text: '于是半球的体积等于圆柱减圆锥，也就是圆周率乘 r 立方，减去它的三分之一，等于三分之二倍圆周率乘 r 立方。',
        },
        {
          id: 'ar-3',
          text: '乘以二得到整球：三分之四倍圆周率乘 r 立方。阿基米德还发现球与外接圆柱的体积比恰好是二比三，他自豪到把这个图刻在了墓碑上。',
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
          text: '第一，截面积处处相等的两个立体，体积必定相等，这就是卡瓦列里原理。',
        },
        {
          id: 'sum-2',
          text: '第二，棱锥公式里的三分之一，来自截面按比例平方收缩后的积分。',
        },
        {
          id: 'sum-3',
          text: '第三，阿基米德用半球与「圆柱挖去圆锥」截面相同，算出了球体积，而这条原理本质上就是积分。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
