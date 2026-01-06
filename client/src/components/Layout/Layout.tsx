import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { NarrationProvider, useNarrationOptional } from '../../contexts/NarrationContext'
import { NarrationController } from '../NarrationController'
import { BugReportButton } from '../BugReport'

function LayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const narration = useNarrationOptional()
  const location = useLocation()
  const isNarrationMode = narration?.playbackState.isNarrationMode || false
  const isPresenterMode = narration?.playbackState.isPresenterMode || false

  // 获取当前实验名称（用于 Bug 报告）
  const experimentPath = location.pathname
  const isExperimentPage = experimentPath !== '/' && experimentPath.length > 1

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 移动端顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-40 md:hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-lg">∑</span>
            </div>
            <span className="text-lg font-bold">数学之美</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="打开菜单"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* 移动端遮罩层 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 主内容区 */}
      <main className={`flex-1 overflow-auto md:ml-0 pt-14 md:pt-0 transition-all duration-300 ${isNarrationMode ? 'pb-20' : ''}`}>
        <div className="min-h-full p-4 md:p-8 flex flex-col">
          <div className="animate-fade-in flex-1">
            <Outlet />
          </div>
          {/* 版权信息 */}
          <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()}{' '}
              <a
                href="https://www.whaty.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                网梯科技
              </a>
              {' '}版权所有
            </p>
          </footer>
        </div>
      </main>

      {/* 底部讲解控制条 - 仅在非演示模式下显示 */}
      {isNarrationMode && !isPresenterMode && <NarrationController />}

      {/* Bug 报告按钮 - 仅在实验页面显示 */}
      {isExperimentPage && <BugReportButton experimentPath={experimentPath} />}
    </div>
  )
}

export default function Layout() {
  return (
    <NarrationProvider>
      <LayoutContent />
    </NarrationProvider>
  )
}
