/**
 * 猴鞍面 讲解稿
 */
import type { NarrationScript } from '../types'

export const monkeySaddleNarration: NarrationScript = {
  id: 'monkey-saddle',
  title: '猴鞍面',
  subtitle: '三上三下的退化临界点',
  difficulty: 'intermediate',
  targetAge: '高中 15-18岁',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解普通鞍面与猴鞍面的区别',
    '认识二阶判别法失效的情形',
    '掌握退化临界点的判断',
    '体会复数幂给出 n 重鞍面的统一构造',
  ],
  prerequisites: ['偏导数', '极值判别', '极坐标'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '给猴子留个位置',
      lines: [
        {
          id: 'intro-1',
          text: '普通的马鞍面有两个下坡，正好放骑手的两条腿。但如果骑手是一只猴子，它还有一条尾巴，得再来一个下坡。',
        },
        {
          id: 'intro-2',
          text: '满足这个要求的曲面叫猴鞍面，方程是 x 的三次方减去三倍的 x 乘 y 的平方。',
        },
        {
          id: 'intro-3',
          text: '它有三个上坡三个下坡交替排列。但这张面的真正价值不在形状，而在它揭示的一个重要数学事实。',
        },
      ],
    },
    {
      id: 'polar',
      type: 'formula',
      title: '换成极坐标',
      lines: [
        {
          id: 'pl-1',
          text: '直角坐标形式看不出对称性。换成极坐标后，方程变得极其干净：z 等于半径的三次方乘以余弦三倍角。',
        },
        {
          id: 'pl-2',
          text: '这个形式一眼就能看出三重对称。角度每转一百二十度，余弦三倍角完全复原，所以曲面转一百二十度和原来一样。',
        },
        {
          id: 'pl-3',
          text: '角度每转六十度，余弦三倍角变号，也就是上坡变下坡。转一整圈符号变化六次，正好三上三下。',
        },
      ],
    },
    {
      id: 'degenerate',
      type: 'concept',
      title: '判别法失效了',
      lines: [
        {
          id: 'dg-1',
          text: '现在说重点。判断一个临界点是极大、极小还是鞍点，标准方法是看二阶偏导构成的 Hesse 矩阵的行列式。',
        },
        {
          id: 'dg-2',
          text: '对普通鞍面，原点处这个行列式等于负四，小于零，判定为鞍点，一切正常。',
        },
        {
          id: 'dg-3',
          text: '但对猴鞍面，原点处的 Hesse 矩阵三个分量全是零，行列式也是零。二阶判别法给不出任何结论，彻底失效了。',
        },
      ],
    },
    {
      id: 'higher',
      type: 'concept',
      title: '必须看三阶项',
      lines: [
        {
          id: 'hg-1',
          text: '为什么会这样？因为猴鞍面的最低次项是三次的。泰勒展开到二阶时，所有二阶项的系数都是零。',
        },
        {
          id: 'hg-2',
          text: '要判断原点的性质，必须展开到三阶。这类临界点叫退化临界点，是奇点理论研究的起点。',
        },
        {
          id: 'hg-3',
          text: '猴鞍面因此成了教科书上最标准的例子，专门用来说明二阶判别法有它的适用边界。',
        },
      ],
    },
    {
      id: 'general',
      type: 'interaction',
      title: '推广到 n 重',
      lines: [
        {
          id: 'gn-1',
          text: '这个构造可以推广。取复数 x 加 i y 的 n 次方，只留实部，就得到 n 重鞍面。',
        },
        {
          id: 'gn-2',
          text: '请切换重数观察。n 等于二是普通鞍面，两上两下；n 等于三是猴鞍面；n 等于四则有四上四下。',
        },
        {
          id: 'gn-3',
          text: '留意 Hesse 行列式读数：只有 n 等于二时它不为零。n 大于等于三时最低次项高于二次，判别法一律失效。',
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
          text: '第一，猴鞍面有三个上坡三个下坡，极坐标下是半径三次方乘余弦三倍角。',
        },
        {
          id: 'sum-2',
          text: '第二，它在原点处 Hesse 矩阵全为零，二阶判别法失效，必须看三阶项。',
        },
        {
          id: 'sum-3',
          text: '第三，复数的 n 次方取实部给出 n 重鞍面的统一构造。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
