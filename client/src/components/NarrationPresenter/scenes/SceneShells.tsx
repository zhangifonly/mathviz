/**
 * 讲解场景的标题页与回顾页（所有渲染器共用）
 *
 * 这两种页面在每个渲染器里结构完全一样，只有文案不同。
 * 抽出来后每个渲染器少写约 25 行样板。
 */

export interface TitleSpec {
  title: string
  subtitle: string
}

/** 标题页：大标题 + 副标题 */
export function TitleScene({
  sceneId, titles, fallbackTitle,
}: {
  sceneId: string
  titles: Record<string, TitleSpec>
  fallbackTitle: string
}) {
  const { title, subtitle } = titles[sceneId] ?? { title: fallbackTitle, subtitle: '' }
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

/** 回顾页：若干条带勾号的要点 */
export function SummaryScene({
  sceneId, summaries, heading = '回顾',
}: {
  sceneId: string
  summaries: Record<string, string[]>
  heading?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h2 className="text-3xl font-bold text-white mb-2">{heading}</h2>
      {(summaries[sceneId] ?? []).map((t) => (
        <div key={t} className="text-xl text-white/80 flex items-center gap-3">
          <span className="text-emerald-400">✓</span>{t}
        </div>
      ))}
    </div>
  )
}
