import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../../bugs.json')

export type BugStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type BugType = 'display' | 'audio' | 'interaction' | 'content' | 'other'

export interface Bug {
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

interface BugsDbData {
  bugs: Bug[]
  nextId: number
}

const defaultData: BugsDbData = { bugs: [], nextId: 1 }
const adapter = new JSONFile<BugsDbData>(dbPath)
const bugsDb = new Low<BugsDbData>(adapter, defaultData)

await bugsDb.read()

export function getAllBugs(): Bug[] {
  return bugsDb.data.bugs.sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function getBugById(id: number): Bug | undefined {
  return bugsDb.data.bugs.find(bug => bug.id === id)
}

export async function createBug(bug: Omit<Bug, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Bug> {
  const now = new Date().toISOString()
  const newBug: Bug = {
    ...bug,
    id: bugsDb.data.nextId++,
    status: 'open',
    created_at: now,
    updated_at: now
  }
  bugsDb.data.bugs.push(newBug)
  await bugsDb.write()
  return newBug
}

export async function updateBugStatus(id: number, status: BugStatus): Promise<boolean> {
  const bug = bugsDb.data.bugs.find(b => b.id === id)
  if (!bug) return false

  bug.status = status
  bug.updated_at = new Date().toISOString()

  await bugsDb.write()
  return true
}

export async function deleteBug(id: number): Promise<boolean> {
  const index = bugsDb.data.bugs.findIndex(b => b.id === id)
  if (index === -1) return false

  bugsDb.data.bugs.splice(index, 1)
  await bugsDb.write()
  return true
}

export default bugsDb
