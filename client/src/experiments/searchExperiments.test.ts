import { describe, it, expect } from 'vitest'
import { buildPinyinIndex, searchExperiments, type Searchable } from './searchExperiments'

const items: Searchable[] = [
  { path: '/koch-snowflake', title: '科赫雪花', description: '无穷周长有限面积的分形' },
  { path: '/benfords-law', title: '本福特定律', description: '首位数字的分布' },
  { path: '/random-walk', title: '随机游走', description: '布朗运动的离散版本' },
  { path: '/circle-packing', title: '圆填充', description: '最密堆积的艺术' },
  { path: '/fourier', title: '傅里叶变换', description: '信号分解为正弦波' },
]

const paths = (r: Searchable[]) => r.map((x) => x.path)

describe('实验搜索', () => {
  it('buildPinyinIndex 生成全拼与首字母', () => {
    expect(buildPinyinIndex('科赫雪花')).toEqual({ full: 'kehexuehua', abbr: 'khxh' })
    expect(buildPinyinIndex('圆填充')).toEqual({ full: 'yuantianchong', abbr: 'ytc' })
  })

  it('空查询返回全部', () => {
    expect(searchExperiments(items, '')).toHaveLength(5)
    expect(searchExperiments(items, '   ')).toHaveLength(5)
  })

  it('拼音首字母匹配', () => {
    expect(paths(searchExperiments(items, 'khxh'))).toContain('/koch-snowflake')
    expect(paths(searchExperiments(items, 'bhtdl'))).toContain('/benfords-law')
  })

  it('全拼匹配', () => {
    expect(paths(searchExperiments(items, 'kehe'))).toContain('/koch-snowflake')
    expect(paths(searchExperiments(items, 'yuantianchong'))).toContain('/circle-packing')
  })

  it('中文子串直接匹配', () => {
    expect(paths(searchExperiments(items, '雪花'))).toContain('/koch-snowflake')
    expect(paths(searchExperiments(items, '随机'))).toContain('/random-walk')
  })

  it('模糊容错(少量拼写偏差)', () => {
    // kohe 少一个字母，仍应匹配 科赫(kehe)
    expect(paths(searchExperiments(items, 'kohe'))).toContain('/koch-snowflake')
  })

  it('多关键词 AND：都命中才返回', () => {
    // "分形 雪花" 两词都指向科赫
    const r = searchExperiments(items, '雪花 分形')
    expect(paths(r)).toEqual(['/koch-snowflake'])
    // "雪花 圆" 没有同时含两者的 → 空
    expect(searchExperiments(items, '雪花 圆填充')).toHaveLength(0)
  })

  it('无匹配返回空', () => {
    expect(searchExperiments(items, 'zzzzzz')).toHaveLength(0)
  })

  it('保持原始顺序', () => {
    const r = searchExperiments(items, '的') // 描述里多个含"的"
    const idx = r.map((x) => items.findIndex((i) => i.path === x.path))
    expect(idx).toEqual([...idx].sort((a, b) => a - b))
  })
})
