import { Router, Request, Response } from 'express'
import { getAllExperiments, getExperimentById, createExperiment, updateExperiment, deleteExperiment } from '../db/database.js'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  try {
    const experiments = getAllExperiments()
    res.json(experiments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experiments' })
  }
})

router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const experiment = getExperimentById(id)
    if (experiment) {
      res.json(experiment)
    } else {
      res.status(404).json({ error: 'Experiment not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experiment' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, type, params } = req.body
    if (!name || !type || !params) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }
    const experiment = await createExperiment({ name, type, params: JSON.stringify(params) })
    res.status(201).json(experiment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create experiment' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const { name, params } = req.body
    const updated = await updateExperiment(id, {
      name,
      params: params ? JSON.stringify(params) : undefined
    })
    if (updated) {
      res.json({ success: true })
    } else {
      res.status(404).json({ error: 'Experiment not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update experiment' })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const deleted = await deleteExperiment(id)
    if (deleted) {
      res.json({ success: true })
    } else {
      res.status(404).json({ error: 'Experiment not found' })
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete experiment' })
  }
})

export default router
