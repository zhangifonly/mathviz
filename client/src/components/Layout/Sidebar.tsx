import { useState } from 'react'
import { NavLink } from 'react-router-dom'

interface NavCategory {
  name: string
  icon: string
  items: { path: string; label: string; icon: string }[]
}

const navCategories: NavCategory[] = [
  {
    name: '入门级',
    icon: '🌱',
    items: [
      { path: '/basic-arithmetic', label: '加减乘除', icon: '➕' },
      { path: '/fractions', label: '分数可视化', icon: '🥧' },
      { path: '/geometry-shapes', label: '基础几何', icon: '📐' },
      { path: '/set-theory', label: '集合论', icon: '⭕' },
      { path: '/golden-ratio', label: '黄金分割', icon: '🐚' },
      { path: '/number-theory', label: '数论探索', icon: '🔢' },
    ],
  },
  {
    name: '基础级',
    icon: '📘',
    items: [
      { path: '/linear-function', label: '一次函数', icon: '📏' },
      { path: '/quadratic-function', label: '二次函数', icon: '📐' },
      { path: '/pythagorean', label: '勾股定理', icon: '📏' },
      { path: '/trigonometry', label: '三角函数', icon: '📐' },
      { path: '/polar', label: '极坐标图形', icon: '🌸' },
      { path: '/probability', label: '概率分布', icon: '🎲' },
      { path: '/bezier', label: '贝塞尔曲线', icon: '✏️' },
      { path: '/monte-carlo', label: '蒙特卡洛', icon: '🎯' },
    ],
  },
  {
    name: '中级',
    icon: '📗',
    items: [
      { path: '/conic-sections', label: '圆锥曲线', icon: '🔵' },
      { path: '/calculus', label: '微积分', icon: '∫' },
      { path: '/taylor', label: '泰勒级数', icon: 'Σ' },
      { path: '/complex', label: '复数与复平面', icon: 'ℂ' },
      { path: '/parametric', label: '参数方程', icon: '〰️' },
      { path: '/vector-field', label: '向量场', icon: '➡️' },
      { path: '/numerical-integration', label: '数值积分', icon: '∫' },
      { path: '/interpolation', label: '插值方法', icon: '📈' },
    ],
  },
  {
    name: '高级',
    icon: '📙',
    items: [
      { path: '/linear-algebra', label: '线性代数', icon: '▦' },
      { path: '/matrix-decomposition', label: '矩阵分解', icon: '🔢' },
      { path: '/ode', label: '微分方程', icon: '📈' },
      { path: '/fourier', label: '傅里叶变换', icon: '📊' },
      { path: '/fourier-series', label: '傅里叶级数', icon: '🎵' },
      { path: '/fourier-drawing', label: '傅里叶绘图', icon: '✏️' },
      { path: '/pca', label: '主成分分析', icon: '📊' },
      { path: '/regression', label: '回归分析', icon: '📉' },
      { path: '/clt', label: '中心极限定理', icon: '🔔' },
      { path: '/bayes', label: '贝叶斯定理', icon: '🧮' },
      { path: '/markov-chain', label: '马尔可夫链', icon: '🔗' },
      { path: '/newton-method', label: '牛顿法求根', icon: '🎯' },
      { path: '/gradient-descent', label: '梯度下降', icon: '⬇️' },
      { path: '/optimization', label: '优化算法', icon: '🎯' },
      { path: '/signal-processing', label: '信号处理', icon: '📡' },
    ],
  },
  {
    name: '专业级',
    icon: '📕',
    items: [
      { path: '/chaos', label: '混沌理论', icon: '🦋' },
      { path: '/fractal', label: '分形几何', icon: '🌀' },
      { path: '/game-theory', label: '博弈论', icon: '🎮' },
      { path: '/wave-equation', label: '波动方程', icon: '🌊' },
      { path: '/heat-equation', label: '热传导方程', icon: '🔥' },
      { path: '/random-walk', label: '随机游走', icon: '🚶' },
      { path: '/graph-theory', label: '图论基础', icon: '🕸️' },
    ],
  },
]

export default function Sidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['入门级', '基础级'])

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  return (
    <aside className="w-56 bg-slate-800 text-white flex flex-col h-screen">
      <NavLink to="/" className="p-4 border-b border-slate-700 hover:bg-slate-700 transition-colors">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
          <h1 className="text-lg font-bold">数学之美</h1>
        </div>
      </NavLink>
      <nav className="flex-1 overflow-y-auto">
        <div className="p-2">
          {navCategories.map((category) => (
            <div key={category.name} className="mb-1">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-slate-500">({category.items.length})</span>
                </span>
                <span className={`text-xs transition-transform ${expandedCategories.includes(category.name) ? 'rotate-90' : ''}`}>
                  ▶
                </span>
              </button>
              {expandedCategories.includes(category.name) && (
                <ul className="ml-2 mt-1 space-y-0.5">
                  {category.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`
                        }
                      >
                        <span className="text-xs">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>
      <div className="p-3 border-t border-slate-700 text-xs text-slate-500">
        共 {navCategories.reduce((sum, c) => sum + c.items.length, 0)} 个实验
      </div>
    </aside>
  )
}
