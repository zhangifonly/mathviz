/**
 * 吸引子实验的混沌诊断卡片（六个吸引子实验共用）
 *
 * λ₁ 与散度是判断混沌的严格判据 —— 不能靠画面看着乱就下结论,
 * 所以每个吸引子实验都把这两个数字摆在明处。
 */

export interface DiagnosticsCardProps {
  /** 最大李雅普诺夫指数 */
  lam: number
  /** 散度 ∇·f */
  div: number
  /** 由 λ₁ 判定的状态标签 */
  tag: string
  /** 知识卡条目 [加粗前缀, 其余文字] */
  facts: Array<[string, string]>
}

export default function DiagnosticsCard({ lam, div, tag, facts }: DiagnosticsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">混沌诊断与要点</h3>
      <ul className="text-sm text-gray-600 space-y-1.5">
        <li>
          • 最大李雅普诺夫指数 <b>{lam.toFixed(4)}</b> → <b>{tag}</b>
        </li>
        <li>
          • 散度 ∇·f = <b>{div.toFixed(3)}</b>（负值表示相空间体积收缩）
        </li>
        {facts.map(([h, t]) => (
          <li key={h}>• <b>{h}</b>{t}</li>
        ))}
      </ul>
    </div>
  )
}
