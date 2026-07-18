import { useState } from 'react'
import { Link } from 'react-router-dom'
import { experiments } from './catalog'
import type { DifficultyLevel, Experiment } from './catalog'

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

  // 判断是否情人节前后（2月12日-2月16日）
  const now = new Date()
  const isValentineSeason = now.getMonth() === 1 && now.getDate() >= 12 && now.getDate() <= 16

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

      {/* 情人节横幅 */}
      {isValentineSeason && (
        <Link
          to="/valentine"
          className="block w-full mb-6 md:mb-10 group relative overflow-hidden rounded-2xl border border-pink-200/50 bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 p-4 md:p-6 text-left hover:shadow-xl hover:shadow-pink-200/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/5 via-rose-400/10 to-red-400/5 group-hover:from-pink-400/10 group-hover:via-rose-400/15 group-hover:to-red-400/10 transition-all duration-500" />
          <div className="relative flex items-center gap-3 md:gap-5">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-400/30 group-hover:scale-110 transition-transform duration-500">
              <span className="text-2xl md:text-3xl">💕</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-base md:text-xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 bg-clip-text text-transparent">
                情人节快乐！四种数学表白函数
              </div>
              <div className="text-pink-500/70 text-xs md:text-sm mt-1">
                心形参数方程 · 笛卡尔心形线 · 隐函数心形 · 简洁心形 — 点击查看沉浸式动画
              </div>
            </div>
            <div className="text-pink-400 group-hover:translate-x-1 transition-transform">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      )}

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
