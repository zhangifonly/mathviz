import { useState, useEffect, useCallback } from 'react'

type BugStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
type BugType = 'display' | 'audio' | 'interaction' | 'content' | 'other'

interface Bug {
  id: number
  type: BugType
  description: string
  contact: string | null
  experiment_name: string | null
  experiment_path: string | null
  user_agent: string | null
  screen_size: string | null
  status: BugStatus
  created_at: string
  updated_at: string
}

const statusLabels: Record<BugStatus, { label: string; color: string }> = {
  open: { label: '待处理', color: 'bg-red-100 text-red-700' },
  in_progress: { label: '处理中', color: 'bg-yellow-100 text-yellow-700' },
  resolved: { label: '已解决', color: 'bg-green-100 text-green-700' },
  closed: { label: '已关闭', color: 'bg-gray-100 text-gray-700' },
}

const typeLabels: Record<BugType, string> = {
  display: '显示问题',
  audio: '音频问题',
  interaction: '交互问题',
  content: '内容错误',
  other: '其他问题',
}

export default function BugAdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [bugs, setBugs] = useState<Bug[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null)
  const [filterStatus, setFilterStatus] = useState<BugStatus | 'all'>('all')

  const fetchBugs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bugs')
      const data = await res.json()
      setBugs(data)
    } catch (error) {
      console.error('Failed to fetch bugs:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 检查是否已登录
    const token = sessionStorage.getItem('admin_token')
    if (token) {
      setIsLoggedIn(true)
      fetchBugs()
    }
  }, [fetchBugs])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        const data = await res.json()
        sessionStorage.setItem('admin_token', data.token)
        setIsLoggedIn(true)
        fetchBugs()
      } else {
        setLoginError('密码错误')
      }
    } catch {
      setLoginError('登录失败')
    }
  }

  const handleStatusChange = async (bugId: number, newStatus: BugStatus) => {
    try {
      const res = await fetch(`/api/bugs/${bugId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setBugs(bugs.map(bug =>
          bug.id === bugId ? { ...bug, status: newStatus, updated_at: new Date().toISOString() } : bug
        ))
        if (selectedBug?.id === bugId) {
          setSelectedBug({ ...selectedBug, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleDelete = async (bugId: number) => {
    if (!confirm('确定要删除这条反馈吗？')) return

    try {
      const res = await fetch(`/api/bugs/${bugId}`, { method: 'DELETE' })
      if (res.ok) {
        setBugs(bugs.filter(bug => bug.id !== bugId))
        if (selectedBug?.id === bugId) {
          setSelectedBug(null)
        }
      }
    } catch (error) {
      console.error('Failed to delete bug:', error)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    setIsLoggedIn(false)
    setPassword('')
  }

  const filteredBugs = filterStatus === 'all'
    ? bugs
    : bugs.filter(bug => bug.status === filterStatus)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  // 登录页面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Bug 管理后台</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">管理员密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            {loginError && (
              <div className="text-red-600 text-sm">{loginError}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 管理页面
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部导航 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Bug 管理后台</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">共 {bugs.length} 条反馈</span>
            <button
              onClick={handleLogout}
              className="px-4 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 过滤器 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">状态筛选：</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 text-sm rounded-full ${
                filterStatus === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              全部 ({bugs.length})
            </button>
            {(Object.keys(statusLabels) as BugStatus[]).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-sm rounded-full ${
                  filterStatus === status ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {statusLabels[status].label} ({bugs.filter(b => b.status === status).length})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bug 列表 */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                加载中...
              </div>
            ) : filteredBugs.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                暂无反馈
              </div>
            ) : (
              filteredBugs.map(bug => (
                <div
                  key={bug.id}
                  onClick={() => setSelectedBug(bug)}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedBug?.id === bug.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusLabels[bug.status].color}`}>
                          {statusLabels[bug.status].label}
                        </span>
                        <span className="text-xs text-gray-500">{typeLabels[bug.type]}</span>
                        <span className="text-xs text-gray-400">#{bug.id}</span>
                      </div>
                      <p className="text-gray-800 text-sm line-clamp-2">{bug.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        {bug.experiment_name && <span className="mr-3">📍 {bug.experiment_name}</span>}
                        <span>{formatDate(bug.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 详情面板 */}
          <div className="lg:col-span-1">
            {selectedBug ? (
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">反馈详情 #{selectedBug.id}</h3>
                  <button
                    onClick={() => setSelectedBug(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* 状态 */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">状态</label>
                    <select
                      value={selectedBug.status}
                      onChange={e => handleStatusChange(selectedBug.id, e.target.value as BugStatus)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      {(Object.keys(statusLabels) as BugStatus[]).map(status => (
                        <option key={status} value={status}>{statusLabels[status].label}</option>
                      ))}
                    </select>
                  </div>

                  {/* 类型 */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">类型</label>
                    <div className="text-sm text-gray-800">{typeLabels[selectedBug.type]}</div>
                  </div>

                  {/* 描述 */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">问题描述</label>
                    <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                      {selectedBug.description}
                    </div>
                  </div>

                  {/* 页面 */}
                  {selectedBug.experiment_path && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">所在页面</label>
                      <div className="text-sm text-gray-800">
                        {selectedBug.experiment_name || selectedBug.experiment_path}
                      </div>
                    </div>
                  )}

                  {/* 联系方式 */}
                  {selectedBug.contact && (
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">联系方式</label>
                      <div className="text-sm text-gray-800">{selectedBug.contact}</div>
                    </div>
                  )}

                  {/* 设备信息 */}
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">设备信息</label>
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <div>屏幕: {selectedBug.screen_size}</div>
                      <div className="truncate" title={selectedBug.user_agent || ''}>
                        UA: {selectedBug.user_agent?.slice(0, 50)}...
                      </div>
                    </div>
                  </div>

                  {/* 时间 */}
                  <div className="text-xs text-gray-500">
                    <div>创建: {formatDate(selectedBug.created_at)}</div>
                    <div>更新: {formatDate(selectedBug.updated_at)}</div>
                  </div>

                  {/* 删除按钮 */}
                  <button
                    onClick={() => handleDelete(selectedBug.id)}
                    className="w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    删除此反馈
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                点击左侧列表查看详情
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
