/**
 * 吸引子实验的参数面板（六个吸引子实验共用）
 *
 * 结构一致: 一个滑块 + 若干预设按钮。预设的参数字段名各不相同,
 * 所以用 valueOf 回调取值, 而不是写死字段名。
 */

export interface AttractorPreset {
  label: string
  note: string
}

/**
 * 用泛型而非类型断言接收预设。
 * 各吸引子的参数字段名不同(alpha/a/b), 断言成具体形状会被 tsc 拒绝
 * (AttractorPreset 与 {alpha:number} 没有重叠), 泛型才是对的做法。
 */
export interface AttractorControlsProps<P extends AttractorPreset> {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  presets: readonly P[]
  /** 从预设里取出参数值 */
  valueOf: (p: P) => number
}

export default function AttractorControls<P extends AttractorPreset>(
  props: AttractorControlsProps<P>,
) {
  const { label, value, min, max, step, onChange, presets, valueOf } = props
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold mb-3">{label}：{value.toFixed(3)}</h3>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full" aria-label={label}
      />
      <div className="mt-3 space-y-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => onChange(valueOf(p))}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left flex justify-between ${Math.abs(value - valueOf(p)) < 1e-9 ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
          >
            <span>{p.label}</span><span className="text-xs opacity-70">{p.note}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
