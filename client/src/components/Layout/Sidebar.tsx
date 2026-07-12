import { useState } from 'react'
import { NavLink } from 'react-router-dom'

interface NavCategory {
  name: string
  icon: string
  items: { path: string; label: string; icon: string }[]
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
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
      { path: '/pascal-triangle', label: '帕斯卡三角', icon: '🔺' },
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
      { path: '/cycloid', label: '旋轮线家族', icon: '🎡' },
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
      { path: '/lissajous', label: '利萨茹与玫瑰', icon: '🌹' },
      { path: '/ulam-spiral', label: '素数螺旋', icon: '🌀' },
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
      { path: '/l-system', label: 'L-系统植物', icon: '🌿' },
      { path: '/game-theory', label: '博弈论', icon: '🎮' },
      { path: '/wave-equation', label: '波动方程', icon: '🌊' },
      { path: '/heat-equation', label: '热传导方程', icon: '🔥' },
      { path: '/random-walk', label: '随机游走', icon: '🚶' },
      { path: '/graph-theory', label: '图论基础', icon: '🕸️' },
      { path: '/voronoi', label: '沃罗诺伊图', icon: '🔷' },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['入门级', '基础级'])

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  const handleNavClick = () => {
    // 移动端点击导航项后关闭侧边栏
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 md:w-64
        bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
        text-white flex flex-col h-screen shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Logo 区域 */}
      <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
        <NavLink
          to="/"
          onClick={handleNavClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-xl">∑</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              数学之美
            </h1>
            <p className="text-xs text-slate-400">交互式可视化平台</p>
          </div>
        </NavLink>

        {/* 移动端关闭按钮 */}
        <button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="关闭菜单"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 导航区域 */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-3 space-y-2">
          {navCategories.map((category) => (
            <div key={category.name} className="mb-1">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 group"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg group-hover:scale-110 transition-transform">{category.icon}</span>
                  <span className="text-sm font-semibold">{category.name}</span>
                  <span className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">
                    {category.items.length}
                  </span>
                </span>
                <span
                  className={`text-xs text-slate-500 transition-transform duration-200 ${
                    expandedCategories.includes(category.name) ? 'rotate-90' : ''
                  }`}
                >
                  ▶
                </span>
              </button>

              {/* 展开的子菜单 */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedCategories.includes(category.name)
                    ? 'max-h-[500px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <ul className="ml-3 mt-1 space-y-0.5 border-l-2 border-slate-700/50 pl-3">
                  {category.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-3 py-2.5 md:py-2 rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1'
                          }`
                        }
                      >
                        <span className="text-sm">{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* 底部统计 */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">实验总数</span>
          <span className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-semibold shadow-lg shadow-indigo-500/25">
            {navCategories.reduce((sum, c) => sum + c.items.length, 0)}
          </span>
        </div>
      </div>
    </aside>
  )
}
