import { useState } from 'react'
import { Link } from 'react-router-dom'

// 难度等级定义
type DifficultyLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'expert'

interface Experiment {
  path: string
  title: string
  description: string
  icon: string
  difficulty: DifficultyLevel
  ageRange: string
  topics: string[]
  hasAnimation: boolean
  hasSteps: boolean
}

// 难度等级配置 - 使用更精美的渐变色
const difficultyConfig: Record<DifficultyLevel, { label: string; color: string; bgColor: string; gradient: string; ageRange: string }> = {
  beginner: { label: '入门级', color: 'text-emerald-700', bgColor: 'bg-emerald-50', gradient: 'from-emerald-400 to-teal-500', ageRange: '小学 6-12岁' },
  elementary: { label: '基础级', color: 'text-blue-700', bgColor: 'bg-blue-50', gradient: 'from-blue-400 to-indigo-500', ageRange: '初中 12-15岁' },
  intermediate: { label: '中级', color: 'text-amber-700', bgColor: 'bg-amber-50', gradient: 'from-amber-400 to-orange-500', ageRange: '高中 15-18岁' },
  advanced: { label: '高级', color: 'text-purple-700', bgColor: 'bg-purple-50', gradient: 'from-purple-400 to-pink-500', ageRange: '大学本科' },
  expert: { label: '专业级', color: 'text-rose-700', bgColor: 'bg-rose-50', gradient: 'from-rose-400 to-red-500', ageRange: '研究生+' },
}

// 主题分类
const topicCategories = [
  { id: 'geometry', label: '几何', icon: '📐' },
  { id: 'algebra', label: '代数', icon: '🔢' },
  { id: 'calculus', label: '微积分', icon: '∫' },
  { id: 'probability', label: '概率统计', icon: '🎲' },
  { id: 'linear-algebra', label: '线性代数', icon: '▦' },
  { id: 'analysis', label: '分析', icon: '📈' },
  { id: 'discrete', label: '离散数学', icon: '🔗' },
  { id: 'applied', label: '应用数学', icon: '⚙️' },
]

const experiments: Experiment[] = [
  // ===== 入门级 (小学 6-12岁) =====
  {
    path: '/basic-arithmetic',
    title: '加减乘除可视化',
    description: '通过方块和数轴理解基本运算，掌握加减乘除的本质含义。',
    icon: '➕',
    difficulty: 'beginner',
    ageRange: '小学低年级',
    topics: ['algebra'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/fractions',
    title: '分数可视化',
    description: '通过饼图、条形图和网格图理解分数的概念，学习分数的比较和运算。',
    icon: '🥧',
    difficulty: 'beginner',
    ageRange: '小学中年级',
    topics: ['algebra'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/geometry-shapes',
    title: '基础几何图形',
    description: '学习三角形、长方形、正方形、圆等常见几何图形的面积和周长计算。',
    icon: '📐',
    difficulty: 'beginner',
    ageRange: '小学中年级',
    topics: ['geometry'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/set-theory',
    title: '集合论可视化',
    description: '通过韦恩图理解并集、交集、差集等集合运算，培养逻辑思维能力。',
    icon: '⭕',
    difficulty: 'beginner',
    ageRange: '小学高年级',
    topics: ['discrete'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/golden-ratio',
    title: '黄金分割',
    description: '斐波那契数列、黄金螺线、向日葵种子排列中的黄金比例，发现自然界的数学之美。',
    icon: '🐚',
    difficulty: 'beginner',
    ageRange: '小学高年级',
    topics: ['geometry', 'algebra'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/number-theory',
    title: '数论探索',
    description: '素数分布、Collatz 猜想、Ulam 螺旋等数论可视化，探索数字的奥秘。',
    icon: '🔢',
    difficulty: 'beginner',
    ageRange: '小学高年级',
    topics: ['algebra', 'discrete'],
    hasAnimation: true,
    hasSteps: true,
  },

  // ===== 基础级 (初中 12-15岁) =====
  {
    path: '/linear-function',
    title: '一次函数',
    description: '探索斜率和截距对直线的影响，理解一次函数的图像特征和性质。',
    icon: '📏',
    difficulty: 'elementary',
    ageRange: '初中',
    topics: ['algebra', 'geometry'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/quadratic-function',
    title: '二次函数',
    description: '探索抛物线的顶点、对称轴和根，理解二次函数的图像特征。',
    icon: '📐',
    difficulty: 'elementary',
    ageRange: '初中',
    topics: ['algebra', 'geometry'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/pythagorean',
    title: '勾股定理',
    description: '探索直角三角形中边长的关系，理解勾股定理的几何证明和实际应用。',
    icon: '📏',
    difficulty: 'elementary',
    ageRange: '初中',
    topics: ['geometry'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/conic-sections',
    title: '圆锥曲线',
    description: '探索椭圆、双曲线和抛物线的性质，理解焦点、准线和离心率。',
    icon: '🔵',
    difficulty: 'intermediate',
    ageRange: '高中',
    topics: ['geometry', 'algebra'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/trigonometry',
    title: '三角函数',
    description: '通过单位圆动画直观理解正弦、余弦函数，探索三角函数的周期性和相位变化。',
    icon: '📐',
    difficulty: 'elementary',
    ageRange: '初中',
    topics: ['geometry', 'algebra'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/polar',
    title: '极坐标图形',
    description: '探索玫瑰线、心形线、螺线等极坐标系中的美丽曲线。',
    icon: '🌸',
    difficulty: 'elementary',
    ageRange: '初中',
    topics: ['geometry'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/probability',
    title: '概率分布',
    description: '探索正态分布、泊松分布、二项分布等常见概率分布的形态与参数影响。',
    icon: '🎲',
    difficulty: 'elementary',
    ageRange: '初中',
    topics: ['probability'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/bezier',
    title: '贝塞尔曲线',
    description: '交互式贝塞尔曲线编辑器，de Casteljau 算法可视化，理解曲线的构造原理。',
    icon: '✏️',
    difficulty: 'elementary',
    ageRange: '初中',
    topics: ['geometry'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/monte-carlo',
    title: '蒙特卡洛方法',
    description: '用随机投点法估算圆周率π，体验随机模拟的强大威力。',
    icon: '🎯',
    difficulty: 'elementary',
    ageRange: '初中',
    topics: ['probability', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },

  // ===== 中级 (高中 15-18岁) =====
  {
    path: '/calculus',
    title: '微积分',
    description: '可视化导数的几何意义（切线斜率）和积分的几何意义（曲线下面积）。',
    icon: '∫',
    difficulty: 'intermediate',
    ageRange: '高中',
    topics: ['calculus'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/taylor',
    title: '泰勒级数',
    description: '观察多项式如何逐项逼近函数，理解泰勒展开的收敛性。',
    icon: 'Σ',
    difficulty: 'intermediate',
    ageRange: '高中',
    topics: ['calculus', 'analysis'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/complex',
    title: '复数与复平面',
    description: '在复平面上可视化复数运算，理解欧拉公式 e^(iθ) 的几何意义。',
    icon: 'ℂ',
    difficulty: 'intermediate',
    ageRange: '高中',
    topics: ['algebra', 'geometry'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/parametric',
    title: '参数方程',
    description: '利萨如图形、摆线、贝塞尔曲线等参数曲线的可视化。',
    icon: '〰️',
    difficulty: 'intermediate',
    ageRange: '高中',
    topics: ['geometry', 'calculus'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/vector-field',
    title: '向量场',
    description: '探索二维向量场的散度、旋度和流线，理解场论基础。',
    icon: '➡️',
    difficulty: 'intermediate',
    ageRange: '高中',
    topics: ['calculus', 'linear-algebra'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/numerical-integration',
    title: '数值积分',
    description: '矩形法、梯形法、Simpson 法的可视化比较，理解数值计算原理。',
    icon: '∫',
    difficulty: 'intermediate',
    ageRange: '高中',
    topics: ['calculus', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/interpolation',
    title: '插值方法',
    description: '线性、拉格朗日、牛顿和三次样条插值，学习数据拟合技术。',
    icon: '📈',
    difficulty: 'intermediate',
    ageRange: '高中',
    topics: ['algebra', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },

  // ===== 高级 (大学本科) =====
  {
    path: '/linear-algebra',
    title: '线性代数',
    description: '观察矩阵变换如何影响向量空间，理解特征值和特征向量的几何含义。',
    icon: '▦',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['linear-algebra'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/matrix-decomposition',
    title: '矩阵分解',
    description: '可视化 SVD、特征值分解、LU 和 QR 分解，理解矩阵的结构。',
    icon: '🔢',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['linear-algebra'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/ode',
    title: '微分方程',
    description: '简谐振动、阻尼振动、捕食者-猎物模型等ODE的数值解和相图。',
    icon: '📈',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['calculus', 'analysis'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/fourier',
    title: '傅里叶变换',
    description: '探索信号的频域分解，理解傅里叶级数如何将复杂波形分解为简单正弦波的叠加。',
    icon: '📊',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['analysis', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/fourier-series',
    title: '傅里叶级数',
    description: '用旋转圆可视化傅里叶级数的叠加，理解吉布斯现象。',
    icon: '🎵',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['analysis', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/fourier-drawing',
    title: '傅里叶绘图',
    description: '用旋转的圆（本轮）绘制任意图形，理解傅里叶级数的几何意义。',
    icon: '✏️',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['analysis', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/pca',
    title: '主成分分析',
    description: '可视化数据降维、特征提取和协方差矩阵分解。',
    icon: '📊',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['linear-algebra', 'probability'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/regression',
    title: '回归分析',
    description: '线性、多项式、指数和对数回归，最小二乘法拟合。',
    icon: '📉',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['probability', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/clt',
    title: '中心极限定理',
    description: '观察样本均值如何趋向正态分布，理解统计学中最重要的定理之一。',
    icon: '🔔',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['probability'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/bayes',
    title: '贝叶斯定理',
    description: '理解条件概率和贝叶斯推断，揭示"基础率谬误"的直觉陷阱。',
    icon: '🧮',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['probability'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/markov-chain',
    title: '马尔可夫链',
    description: '状态转移、稳态分布和随机过程模拟。',
    icon: '🔗',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['probability', 'discrete'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/newton-method',
    title: '牛顿法求根',
    description: '可视化牛顿-拉弗森迭代法，观察切线如何逐步逼近方程的根。',
    icon: '🎯',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['calculus', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/gradient-descent',
    title: '梯度下降',
    description: '机器学习核心算法，观察优化路径如何找到函数最小值。',
    icon: '⬇️',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['calculus', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/optimization',
    title: '优化算法',
    description: '比较梯度下降、动量、Adam、模拟退火等优化方法。',
    icon: '🎯',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['calculus', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/signal-processing',
    title: '信号处理',
    description: '探索滤波器、频谱分析、窗函数和信号去噪技术。',
    icon: '📡',
    difficulty: 'advanced',
    ageRange: '大学',
    topics: ['analysis', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },

  // ===== 专业级 (研究生+) =====
  {
    path: '/chaos',
    title: '混沌理论',
    description: 'Logistic Map、Lorenz 吸引子，探索确定性系统中的混沌行为。',
    icon: '🦋',
    difficulty: 'expert',
    ageRange: '研究生',
    topics: ['analysis', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/fractal',
    title: '分形几何',
    description: '探索 Mandelbrot 集和 Julia 集的无限细节与自相似性。',
    icon: '🌀',
    difficulty: 'expert',
    ageRange: '研究生',
    topics: ['geometry', 'analysis'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/game-theory',
    title: '博弈论',
    description: '囚徒困境、纳什均衡、最优响应和演化博弈动态。',
    icon: '🎮',
    difficulty: 'expert',
    ageRange: '研究生',
    topics: ['discrete', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/wave-equation',
    title: '波动方程',
    description: '可视化驻波、行波、叠加和阻尼波，理解波动现象。',
    icon: '🌊',
    difficulty: 'expert',
    ageRange: '研究生',
    topics: ['calculus', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/heat-equation',
    title: '热传导方程',
    description: '一维热扩散过程的数值模拟和可视化。',
    icon: '🔥',
    difficulty: 'expert',
    ageRange: '研究生',
    topics: ['calculus', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/random-walk',
    title: '随机游走',
    description: '布朗运动、扩散过程和均方位移分析。',
    icon: '🚶',
    difficulty: 'expert',
    ageRange: '研究生',
    topics: ['probability', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
  {
    path: '/graph-theory',
    title: '图论基础',
    description: '可视化 BFS、DFS、Dijkstra 等图遍历算法的执行过程。',
    icon: '🕸️',
    difficulty: 'expert',
    ageRange: '研究生',
    topics: ['discrete', 'applied'],
    hasAnimation: true,
    hasSteps: true,
  },
]

// 按难度分组
const groupByDifficulty = (exps: Experiment[]) => {
  const groups: Record<DifficultyLevel, Experiment[]> = {
    beginner: [],
    elementary: [],
    intermediate: [],
    advanced: [],
    expert: [],
  }
  exps.forEach((exp) => {
    groups[exp.difficulty].push(exp)
  })
  return groups
}

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all')
  const [selectedTopic, setSelectedTopic] = useState<string | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 过滤实验
  const filteredExperiments = experiments.filter((exp) => {
    const matchesDifficulty = selectedDifficulty === 'all' || exp.difficulty === selectedDifficulty
    const matchesTopic = selectedTopic === 'all' || exp.topics.includes(selectedTopic)
    const matchesSearch =
      searchQuery === '' ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDifficulty && matchesTopic && matchesSearch
  })

  const groupedExperiments = groupByDifficulty(filteredExperiments)

  // 统计各难度数量
  const difficultyStats = {
    beginner: experiments.filter((e) => e.difficulty === 'beginner').length,
    elementary: experiments.filter((e) => e.difficulty === 'elementary').length,
    intermediate: experiments.filter((e) => e.difficulty === 'intermediate').length,
    advanced: experiments.filter((e) => e.difficulty === 'advanced').length,
    expert: experiments.filter((e) => e.difficulty === 'expert').length,
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 头部 - 更精美的设计 */}
      <header className="mb-6 md:mb-10">
        <div className="flex items-center gap-3 md:gap-4 mb-3">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <span className="text-2xl md:text-3xl text-white">∑</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              数学之美
            </h1>
            <p className="text-slate-500 text-sm md:text-base mt-0.5 md:mt-1">
              通过交互式可视化，探索数学的奥秘与美感
            </p>
          </div>
        </div>
      </header>

      {/* 统计卡片 - 移动端横向滚动 */}
      <div className="mb-6 md:mb-10 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex md:grid md:grid-cols-5 gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 snap-x snap-mandatory md:snap-none">
          {(Object.keys(difficultyConfig) as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(selectedDifficulty === level ? 'all' : level)}
              className={`relative flex-shrink-0 w-32 md:w-auto p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden group snap-start ${
                selectedDifficulty === level
                  ? 'border-indigo-400 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* 背景渐变装饰 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${difficultyConfig[level].gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

              <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${difficultyConfig[level].gradient} bg-clip-text text-transparent`}>
                {difficultyStats[level]}
              </div>
              <div className="text-xs md:text-sm font-semibold text-slate-700 mt-1">{difficultyConfig[level].label}</div>
              <div className="text-xs text-slate-400 mt-0.5 hidden md:block">{difficultyConfig[level].ageRange}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 筛选栏 - 玻璃态设计 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-4 md:p-5 mb-6 md:mb-10">
        <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:gap-4 md:items-center">
          {/* 搜索框 */}
          <div className="w-full md:flex-1 md:min-w-[200px] relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索实验..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none text-base"
            />
          </div>

          {/* 主题筛选 - 移动端横向滚动 */}
          <div className="-mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-wrap">
              <button
                onClick={() => setSelectedTopic('all')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedTopic === 'all'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                全部
              </button>
              {topicCategories.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? 'all' : topic.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    selectedTopic === topic.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {topic.icon} {topic.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 实验列表 - 按难度分组 */}
      {selectedDifficulty === 'all' ? (
        // 显示所有分组
        (Object.keys(difficultyConfig) as DifficultyLevel[]).map((level) => {
          const levelExperiments = groupedExperiments[level]
          if (levelExperiments.length === 0) return null

          return (
            <section key={level} className="mb-8 md:mb-12">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                <div className={`w-1 md:w-1.5 h-6 md:h-8 rounded-full bg-gradient-to-b ${difficultyConfig[level].gradient}`} />
                <span
                  className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold ${difficultyConfig[level].bgColor} ${difficultyConfig[level].color}`}
                >
                  {difficultyConfig[level].label}
                </span>
                <span className="text-slate-400 text-xs md:text-sm hidden sm:inline">{difficultyConfig[level].ageRange}</span>
                <span className="text-slate-300 text-xs md:text-sm hidden sm:inline">·</span>
                <span className="text-slate-400 text-xs md:text-sm">{levelExperiments.length} 个</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {levelExperiments.map((exp) => (
                  <ExperimentCard key={exp.path} experiment={exp} />
                ))}
              </div>
            </section>
          )
        })
      ) : (
        // 显示单个分组
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredExperiments.map((exp) => (
            <ExperimentCard key={exp.path} experiment={exp} />
          ))}
        </div>
      )}

      {/* 空状态 */}
      {filteredExperiments.length === 0 && (
        <div className="text-center py-12 md:py-16">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-3xl md:text-4xl">🔍</span>
          </div>
          <h3 className="text-base md:text-lg font-semibold text-slate-700 mb-2">没有找到匹配的实验</h3>
          <p className="text-slate-500 text-sm md:text-base">尝试调整筛选条件或搜索关键词</p>
        </div>
      )}

      {/* 即将推出 - 更精美的设计 */}
      <section className="mt-12 md:mt-16 relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-5 md:p-8">
        {/* 装饰性背景 */}
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 md:w-48 h-32 md:h-48 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-5 md:mb-6">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-lg md:text-xl">🚀</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">即将推出</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { title: '加减乘除可视化', level: '入门级', icon: '➕' },
              { title: '分数可视化', level: '入门级', icon: '🥧' },
              { title: '一次函数', level: '基础级', icon: '📏' },
              { title: '二次函数', level: '基础级', icon: '📐' },
              { title: '勾股定理', level: '基础级', icon: '📏' },
              { title: '圆锥曲线', level: '中级', icon: '🔵' },
              { title: '排列组合', level: '中级', icon: '🎰' },
              { title: '拉普拉斯变换', level: '高级', icon: '🔄' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/50 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-300"
              >
                <span className="text-xl md:text-2xl">{item.icon}</span>
                <h3 className="font-semibold text-slate-700 mt-2 text-sm md:text-base">{item.title}</h3>
                <span className="text-xs text-slate-500">{item.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// 实验卡片组件
function ExperimentCard({ experiment }: { experiment: Experiment }) {
  const config = difficultyConfig[experiment.difficulty]

  return (
    <Link
      to={experiment.path}
      className="group block p-4 md:p-5 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200/50 hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-200 transition-all duration-300 active:scale-[0.98] md:hover:-translate-y-1"
    >
      <div className="flex items-start gap-3 md:gap-4">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-lg md:text-2xl filter drop-shadow-sm">{experiment.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 md:mb-1.5">
            <h2 className="text-base md:text-lg font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
              {experiment.title}
            </h2>
          </div>
          <p className="text-slate-500 text-xs md:text-sm line-clamp-2 mb-2 md:mb-3 leading-relaxed">{experiment.description}</p>
          <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
            <span className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg text-xs font-semibold ${config.bgColor} ${config.color}`}>
              {config.label}
            </span>
            {experiment.hasAnimation && (
              <span className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg text-xs font-medium bg-violet-50 text-violet-600">
                动画
              </span>
            )}
            {experiment.hasSteps && (
              <span className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-md md:rounded-lg text-xs font-medium bg-cyan-50 text-cyan-600 hidden sm:inline-block">
                步骤
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
