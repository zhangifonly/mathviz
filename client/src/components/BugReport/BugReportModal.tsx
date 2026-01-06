import { useState } from 'react'

interface BugReportModalProps {
  onClose: () => void
  experimentName?: string
  experimentPath?: string
}

type BugType = 'display' | 'audio' | 'interaction' | 'content' | 'other'

const bugTypes: { value: BugType; label: string }[] = [
  { value: 'display', label: '显示问题' },
  { value: 'audio', label: '音频问题' },
  { value: 'interaction', label: '交互问题' },
  { value: 'content', label: '内容错误' },
  { value: 'other', label: '其他问题' },
]

export default function BugReportModal({ onClose, experimentName, experimentPath }: BugReportModalProps) {
  const [bugType, setBugType] = useState<BugType>('other')
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      setError('请描述您遇到的问题')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: bugType,
          description: description.trim(),
          contact: contact.trim() || null,
          experiment_name: experimentName || null,
          experiment_path: experimentPath || window.location.pathname,
          user_agent: navigator.userAgent,
          screen_size: `${window.innerWidth}x${window.innerHeight}`,
        }),
      })

      if (!response.ok) throw new Error('提交失败')

      setSubmitted(true)
    } catch {
      setError('提交失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-white rounded-xl p-6 max-w-md mx-4 text-center" onClick={e => e.stopPropagation()}>
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">感谢您的反馈！</h3>
          <p className="text-gray-600 mb-4">我们会尽快处理您报告的问题。</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            关闭
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">报告问题</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          发现了 Bug？请告诉我们，帮助我们改进！
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 当前页面 */}
          <div className="p-3 bg-gray-50 rounded-lg text-sm">
            <span className="text-gray-500">当前页面：</span>
            <span className="text-gray-800 ml-1">{experimentName || window.location.pathname}</span>
          </div>

          {/* 问题类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">问题类型</label>
            <div className="flex flex-wrap gap-2">
              {bugTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setBugType(type.value)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    bugType === type.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 问题描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              问题描述 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="请详细描述您遇到的问题..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 联系方式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              联系方式 <span className="text-gray-400 text-xs">（可选，方便我们联系您）</span>
            </label>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="邮箱或微信"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '提交中...' : '提交反馈'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
