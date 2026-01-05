/**
 * 分数标题场景
 */

interface Props {
  sectionId: string
}

const titles: Record<string, { title: string; subtitle?: string }> = {
  intro: { title: '分数可视化', subtitle: '用图形理解分数' },
  concept: { title: '认识分数', subtitle: '分子和分母' },
  visualization: { title: '图形表示', subtitle: '饼图、条形图、网格图' },
  compare: { title: '比较分数', subtitle: '谁大谁小' },
  addition: { title: '分数加法', subtitle: '通分再相加' },
  multiplication: { title: '分数乘法', subtitle: '分子乘分子' },
  simplify: { title: '约分', subtitle: '化简分数' },
  parameters: { title: '动手试试', subtitle: '自己操作' },
  summary: { title: '总结', subtitle: '分数的奥秘' },
}

export default function TitleScene({ sectionId }: Props) {
  const info = titles[sectionId] || { title: '分数' }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-pink-600">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
        {info.title}
      </h1>
      {info.subtitle && (
        <p className="text-xl md:text-2xl text-white/80">
          {info.subtitle}
        </p>
      )}
    </div>
  )
}
