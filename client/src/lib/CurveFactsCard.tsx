/**
 * 曲线实验的读数与要点卡片（四个曲线实验共用）
 *
 * 每个实验的读数项目不同，故用 rows 传入已格式化的条目，
 * 而不是把曲率/挠率写死在这里。
 */

export interface CurveFactsCardProps {
  title?: string
  /** 已格式化的读数行，元素为 [标签, 值, 附注?] */
  rows: Array<[string, string, string?]>
  /** 知识要点 [加粗前缀, 其余文字] */
  facts: Array<[string, string]>
}

export default function CurveFactsCard({
  title = '读数与要点', rows, facts,
}: CurveFactsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="text-sm text-gray-600 space-y-1.5">
        {rows.map(([label, value, note]) => (
          <li key={label}>
            • {label} <b>{value}</b>{note ? `（${note}）` : ''}
          </li>
        ))}
        {facts.map(([h, t]) => (
          <li key={h}>• <b>{h}</b>{t}</li>
        ))}
      </ul>
    </div>
  )
}
