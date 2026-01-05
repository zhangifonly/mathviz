/**
 * 标题场景 - 显示课程标题和段落标题
 */

interface Props {
  sectionId: string
  sceneId: string
}

const sectionTitles: Record<string, { title: string; subtitle?: string }> = {
  intro: { title: '加减乘除', subtitle: '用方块学习四则运算' },
  addition: { title: '加法', subtitle: '把两组方块合在一起' },
  subtraction: { title: '减法', subtitle: '从一组方块中拿走一些' },
  multiplication: { title: '乘法', subtitle: '重复相加的快捷方式' },
  division: { title: '除法', subtitle: '平均分配方块' },
  summary: { title: '总结', subtitle: '四则运算的奥秘' },
}

export default function TitleScene({ sectionId }: Props) {
  const info = sectionTitles[sectionId] || { title: '加减乘除' }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
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
