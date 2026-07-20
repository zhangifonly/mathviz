/**
 * 首页实验搜索：支持拼音首字母、全拼、模糊容错、多关键词(AND)。
 *
 * 设计：
 * - 用 pinyin-pro 为每个实验的标题预计算 { 全拼, 首字母 } 拉丁化索引；
 * - 用 Fuse.js 在 [标题, 全拼, 首字母, 描述] 多字段做模糊匹配(Bitap 编辑距离容错)；
 * - 多关键词按空格切分，每个词都需命中(AND 交集)，逐词更符合搜索直觉。
 */
import Fuse from 'fuse.js'
import { pinyin } from 'pinyin-pro'

export interface Searchable {
  path: string
  title: string
  description: string
}

interface Indexed<T> {
  item: T
  title: string
  full: string // 全拼，如 "kehexuehua"
  abbr: string // 首字母，如 "khxh"
  description: string
}

/** 为一条记录计算拼音索引（全拼 + 首字母），非中文字符原样保留 */
export function buildPinyinIndex(title: string): { full: string; abbr: string } {
  const syllables = pinyin(title, { toneType: 'none', type: 'array' }) as string[]
  const full = syllables.join('').toLowerCase()
  const abbr = syllables.map((s) => s[0] || '').join('').toLowerCase()
  return { full, abbr }
}

/** 构建带拼音索引的可搜索列表 */
export function buildIndex<T extends Searchable>(items: T[]): Indexed<T>[] {
  return items.map((item) => {
    const { full, abbr } = buildPinyinIndex(item.title)
    return { item, title: item.title, full, abbr, description: item.description }
  })
}

/** 创建 Fuse 实例（多字段、中等阈值容错） */
export function makeFuse<T extends Searchable>(indexed: Indexed<T>[]): Fuse<Indexed<T>> {
  return new Fuse(indexed, {
    includeScore: false,
    threshold: 0.4, // 0=精确, 1=全匹配；0.4 兼顾容错与噪音
    ignoreLocation: true,
    keys: [
      { name: 'title', weight: 3 },
      { name: 'abbr', weight: 2 },
      { name: 'full', weight: 2 },
      { name: 'description', weight: 1 },
    ],
  })
}

/**
 * 搜索：多关键词按空格切分，每个词都需命中(AND)。返回按原顺序排列的匹配项。
 * @param items 全部实验
 * @param query 用户输入
 * @param fuse  可选的预建 Fuse 实例(避免每次重建)；不传则内部构建
 */
export function searchExperiments<T extends Searchable>(
  items: T[],
  query: string,
  fuse?: Fuse<Indexed<T>>,
): T[] {
  const q = query.trim().toLowerCase()
  if (q === '') return items
  const words = q.split(/\s+/).filter(Boolean)
  const f = fuse ?? makeFuse(buildIndex(items))

  // 每个关键词得到一个命中 path 集合，取交集(AND)
  let acc: Set<string> | null = null
  for (const w of words) {
    const hits = new Set(f.search(w).map((r) => r.item.item.path))
    if (acc === null) {
      acc = hits
    } else {
      const prev: Set<string> = acc
      acc = new Set(Array.from(prev).filter((p) => hits.has(p)))
    }
    if (acc.size === 0) break
  }
  const matched = acc ?? new Set<string>()
  // 保持原始顺序输出
  return items.filter((it) => matched.has(it.path))
}
