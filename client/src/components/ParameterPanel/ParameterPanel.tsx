interface SliderParam {
  key: string
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
}

interface ParameterPanelProps {
  title: string
  params: SliderParam[]
  onChange: (key: string, value: number) => void
}

export default function ParameterPanel({ title, params, onChange }: ParameterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {params.map((param) => (
          <div key={param.key}>
            <div className="flex justify-between text-sm mb-1">
              <label className="text-gray-600">{param.label}</label>
              <span className="text-gray-800 font-medium">
                {param.value.toFixed(param.step && param.step < 1 ? 2 : 0)}
                {param.unit && ` ${param.unit}`}
              </span>
            </div>
            <input
              type="range"
              min={param.min}
              max={param.max}
              step={param.step || 1}
              value={param.value}
              onChange={(e) => onChange(param.key, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
