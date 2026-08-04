/**
 * 对偶多面体 讲解稿
 */
import type { NarrationScript } from '../types'

export const dualPolyhedraNarration: NarrationScript = {
  id: 'dual-polyhedra',
  title: '对偶多面体',
  subtitle: '面变顶点，顶点变面',
  difficulty: 'intermediate',
  targetAge: '高中 15-18岁',
  voice: 'yunxi',
  meta: {
    version: '1.0.0',
    createdAt: '2026-07-29',
    updatedAt: '2026-07-29',
  },
  objectives: [
    '理解对偶多面体的定义',
    '掌握极反演的构造方法',
    '认识五种柏拉图立体的三对配对',
    '会用欧拉示性数验证对偶关系',
  ],
  prerequisites: ['柏拉图立体', '欧拉公式', '向量运算'],
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '一种交换',
      lines: [
        {
          id: 'intro-1',
          text: '立方体有六个面、八个顶点。正八面体正好反过来：八个面、六个顶点。这不是巧合。',
        },
        {
          id: 'intro-2',
          text: '把一个多面体的每个面换成一个顶点、每个顶点换成一个面，棱保持不变，得到的就是它的对偶。',
        },
        {
          id: 'intro-3',
          text: '屏幕上蓝色是立方体，橙色是它的对偶。两者的棱互相垂直穿插，卡在一起。',
        },
      ],
    },
    {
      id: 'polar',
      type: 'formula',
      title: '极反演怎么做',
      lines: [
        {
          id: 'pl-1',
          text: '具体做法叫极反演。以半径 R 的球为镜子，每个面变成一个顶点。',
        },
        {
          id: 'pl-2',
          text: '新顶点在面法向上，距原点 R 平方除以 d，这里 d 是原点到那个面的距离。',
        },
        {
          id: 'pl-3',
          text: '所以面离得越近，对偶顶点就越远。屏幕上的读数验证了这个乘积恒等于 R 平方。',
        },
      ],
    },
    {
      id: 'euler',
      type: 'concept',
      title: '欧拉公式两边都成立',
      lines: [
        {
          id: 'eu-1',
          text: '既然面和顶点互换、棱数不变，那么欧拉公式两边都该成立。',
        },
        {
          id: 'eu-2',
          text: '立方体是八减十二加六等于二；对偶后是六减十二加八，还是二。加法可交换，所以必然相等。',
        },
        {
          id: 'eu-3',
          text: '请依次切换五种立体，看左上角的读数。原体和对偶的欧拉数永远都是二。',
        },
      ],
    },
    {
      id: 'pairs',
      type: 'animation',
      title: '三对配对',
      lines: [
        {
          id: 'pr-1',
          text: '五种柏拉图立体分成三对。立方体和正八面体一对，十二面体和二十面体一对。',
        },
        {
          id: 'pr-2',
          text: '正四面体比较特殊，它的对偶还是正四面体，叫自对偶。四个面四个顶点，本来就对称。',
        },
        {
          id: 'pr-3',
          text: '十二面体二十个顶点十二个面，二十面体正好倒过来。屏幕上切换看，两者的读数确实互换了。',
        },
      ],
    },
    {
      id: 'midsphere',
      type: 'interaction',
      title: '中球把它们卡住',
      lines: [
        {
          id: 'md-1',
          text: '还有个漂亮的细节。正多面体存在一个中球，与所有棱都相切。',
        },
        {
          id: 'md-2',
          text: '如果极反演就用这个中球做镜子，那么对偶的棱与原来的棱不但垂直，交点还恰好落在球面上。',
        },
        {
          id: 'md-3',
          text: '屏幕上灰色那个球就是中球。请打开它，看两组棱如何在球面上交叉卡住。垂直度读数是十的负十六次方。',
        },
      ],
    },
    {
      id: 'involution',
      type: 'concept',
      title: '再做一次回到原点',
      lines: [
        {
          id: 'iv-1',
          text: '最后一个性质：对偶的对偶就是自己。用同一个球做两次极反演，会精确回到出发的多面体。',
        },
        {
          id: 'iv-2',
          text: '这在数学上叫对合，就像取两次倒数、翻两次面。屏幕上的偏差读数是十的负十六次方，等于零。',
        },
        {
          id: 'iv-3',
          text: '所以对偶不是把多面体变成别的东西，而是换一个角度看同一个结构。',
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
          text: '第一，对偶把面换成顶点、顶点换成面，棱数不变，欧拉数两边都是二。',
        },
        {
          id: 'sum-2',
          text: '第二，极反演的规则是新顶点距原点 R 平方除以面距，面越近顶点越远。',
        },
        {
          id: 'sum-3',
          text: '第三，五种柏拉图立体分三对，正四面体自对偶，而对偶的对偶回到自己。感谢观看，我们下次再见。',
        },
      ],
    },
  ],
}
