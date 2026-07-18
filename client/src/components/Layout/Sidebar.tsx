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
      { path: '/even-odd', label: '奇偶数与整除', icon: '🔢' },
      { path: '/roman-numerals', label: '罗马数字', icon: '🏛️' },
      { path: '/symmetry', label: '对称之美', icon: '🦋' },
      { path: '/tangram', label: '七巧板', icon: '🧩' },
      { path: '/clock-angles', label: '时钟与角度', icon: '🕐' },
      { path: '/pigeonhole', label: '鸽巢原理', icon: '🕳️' },
      { path: '/dice-probability', label: '骰子与古典概率', icon: '🎲' },
      { path: '/fibonacci-nature', label: '斐波那契与自然', icon: '🌻' },
      { path: '/prime-factorization', label: '质因数分解', icon: '🧬' },
      { path: '/number-bases', label: '进制转换', icon: '🔢' },
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
      { path: '/inequalities', label: '不等式与数轴', icon: '⚖️' },
      { path: '/linear-system', label: '二元一次方程组', icon: '📐' },
      { path: '/similar-triangles', label: '相似三角形', icon: '🔺' },
      { path: '/circle-geometry', label: '圆的几何', icon: '⭕' },
      { path: '/stats-basics', label: '统计初步', icon: '📊' },
      { path: '/absolute-value', label: '绝对值函数', icon: '📈' },
      { path: '/sequences', label: '等差等比数列', icon: '🔗' },
      { path: '/tower-of-hanoi', label: '汉诺塔', icon: '🗼' },
      { path: '/magic-square', label: '幻方', icon: '🔯' },
      { path: '/sieve-eratosthenes', label: '埃氏筛法', icon: '🧮' },
      { path: '/collatz', label: '考拉兹猜想', icon: '🎢' },
      { path: '/perfect-numbers', label: '完全数与亲和数', icon: '💯' },
      { path: '/tessellation', label: '密铺镶嵌', icon: '🔷' },
      { path: '/pythagoras-tree', label: '毕达哥拉斯树', icon: '🌳' },
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
      { path: '/exponential-log', label: '指数与对数', icon: '📉' },
      { path: '/matrix-transform', label: '矩阵变换', icon: '🔲' },
      { path: '/dot-cross-product', label: '点积与叉积', icon: '✖️' },
      { path: '/parabola-optics', label: '抛物线与光学', icon: '🔦' },
      { path: '/sine-superposition', label: '波的叠加', icon: '〰️' },
      { path: '/combinatorial-proof', label: '组合恒等式', icon: '🎯' },
      { path: '/modular-arithmetic', label: '模运算与同余', icon: '🕰️' },
      { path: '/continued-fraction', label: '连分数', icon: '➗' },
      { path: '/epidemic-sir', label: 'SIR传染病模型', icon: '🦠' },
      { path: '/game-of-life', label: '康威生命游戏', icon: '🦠' },
      { path: '/permutation-combination', label: '排列组合', icon: '🎯' },
      { path: '/triangle-centers', label: '三角形四心', icon: '📐' },
      { path: '/circle-packing', label: '圆填充', icon: '🔵' },
      { path: '/reuleaux', label: '等宽曲线', icon: '🔺' },
      { path: '/pick-theorem', label: '皮克定理', icon: '📍' },
      { path: '/convex-hull', label: '凸包算法', icon: '📎' },
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
      { path: '/eigen-visualization', label: '特征值与特征向量', icon: '🎚️' },
      { path: '/svd', label: '奇异值分解', icon: '🖼️' },
      { path: '/gram-schmidt', label: '施密特正交化', icon: '📏' },
      { path: '/lagrange-multiplier', label: '拉格朗日乘数', icon: '⛰️' },
      { path: '/green-theorem', label: '格林公式', icon: '🌀' },
      { path: '/residue-theorem', label: '留数定理', icon: '🔵' },
      { path: '/power-series', label: '幂级数收敛', icon: '♾️' },
      { path: '/gaussian-process', label: '高斯过程', icon: '📶' },
      { path: '/kalman-filter', label: '卡尔曼滤波', icon: '🛰️' },
      { path: '/simulated-annealing', label: '模拟退火', icon: '🔥' },
      { path: '/cryptography', label: '密码学基础', icon: '🔐' },
      { path: '/euler-identity', label: '欧拉恒等式', icon: '🔷' },
      { path: '/laplace', label: '拉普拉斯变换', icon: '🔄' },
      { path: '/mobius', label: '莫比乌斯环', icon: '♾️' },
      { path: '/numerical-analysis', label: '数值分析', icon: '🔢' },
      { path: '/reaction-diffusion', label: '反应扩散', icon: '🐆' },
      { path: '/steiner-chain', label: '斯坦纳链', icon: '⛓️' },
      { path: '/delaunay-triangulation', label: 'Delaunay三角剖分', icon: '🔺' },
      { path: '/spherical-geometry', label: '球面几何', icon: '🌍' },
      { path: '/inversive-geometry', label: '反演几何', icon: '🔄' },
      { path: '/euler-line', label: '欧拉线', icon: '📏' },
      { path: '/nine-point-circle', label: '九点圆', icon: '⭕' },
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
      { path: '/mandelbrot-julia', label: '曼德博与朱利亚集', icon: '🌈' },
      { path: '/double-pendulum', label: '双摆混沌', icon: '🎢' },
      { path: '/lorenz-attractor', label: '洛伦兹吸引子', icon: '🦋' },
      { path: '/nbody-simulation', label: 'N体引力仿真', icon: '🪐' },
      { path: '/percolation', label: '渗流模型', icon: '💧' },
      { path: '/cellular-automata', label: '元胞自动机', icon: '⬛' },
      { path: '/knot-theory', label: '纽结理论', icon: '🪢' },
      { path: '/wavelet', label: '小波变换', icon: '🌊' },
      { path: '/differential-geometry', label: '微分几何', icon: '🌐' },
      { path: '/pde', label: '偏微分方程', icon: '∂' },
      { path: '/three-body', label: '三体引力轨道', icon: '🪐' },
      { path: '/apollonian-gasket', label: '阿波罗尼垫片', icon: '⚪' },
      { path: '/poincare-disk', label: '庞加莱圆盘', icon: '🌐' },
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
