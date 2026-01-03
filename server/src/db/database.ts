import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../data.json')

export interface Experiment {
  id: number
  name: string
  type: string
  params: string
  created_at: string
  updated_at: string
}

interface DbData {
  experiments: Experiment[]
  nextId: number
}

const defaultData: DbData = { experiments: [], nextId: 1 }
const adapter = new JSONFile<DbData>(dbPath)
const db = new Low<DbData>(adapter, defaultData)

await db.read()

export function getAllExperiments(): Experiment[] {
  return db.data.experiments.sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
}

export function getExperimentById(id: number): Experiment | undefined {
  return db.data.experiments.find(exp => exp.id === id)
}

export async function createExperiment(exp: Omit<Experiment, 'id' | 'created_at' | 'updated_at'>): Promise<Experiment> {
  const now = new Date().toISOString()
  const newExp: Experiment = {
    ...exp,
    id: db.data.nextId++,
    created_at: now,
    updated_at: now
  }
  db.data.experiments.push(newExp)
  await db.write()
  return newExp
}

export async function updateExperiment(id: number, updates: Partial<Pick<Experiment, 'name' | 'params'>>): Promise<boolean> {
  const exp = db.data.experiments.find(e => e.id === id)
  if (!exp) return false

  if (updates.name) exp.name = updates.name
  if (updates.params) exp.params = updates.params
  exp.updated_at = new Date().toISOString()

  await db.write()
  return true
}

export async function deleteExperiment(id: number): Promise<boolean> {
  const index = db.data.experiments.findIndex(e => e.id === id)
  if (index === -1) return false

  db.data.experiments.splice(index, 1)
  await db.write()
  return true
}

export default db
