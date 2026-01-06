import { Router } from 'express'
import { getAllBugs, getBugById, createBug, updateBugStatus, deleteBug } from '../db/bugs.js'

const router = Router()

// 获取所有 Bug 报告
router.get('/', (_req, res) => {
  const bugs = getAllBugs()
  res.json(bugs)
})

// 获取单个 Bug
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const bug = getBugById(id)
  if (!bug) {
    return res.status(404).json({ error: 'Bug not found' })
  }
  res.json(bug)
})

// 创建新 Bug 报告
router.post('/', async (req, res) => {
  try {
    const { type, description, contact, experiment_name, experiment_path, user_agent, screen_size } = req.body

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' })
    }

    const bug = await createBug({
      type: type || 'other',
      description: description.trim(),
      contact: contact || null,
      experiment_name: experiment_name || null,
      experiment_path: experiment_path || null,
      user_agent: user_agent || null,
      screen_size: screen_size || null,
    })

    res.status(201).json(bug)
  } catch (error) {
    console.error('Error creating bug:', error)
    res.status(500).json({ error: 'Failed to create bug report' })
  }
})

// 更新 Bug 状态
router.patch('/:id/status', async (req, res) => {
  const id = parseInt(req.params.id)
  const { status } = req.body

  if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const success = await updateBugStatus(id, status)
  if (!success) {
    return res.status(404).json({ error: 'Bug not found' })
  }

  res.json({ success: true })
})

// 删除 Bug
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const success = await deleteBug(id)
  if (!success) {
    return res.status(404).json({ error: 'Bug not found' })
  }
  res.json({ success: true })
})

export default router
