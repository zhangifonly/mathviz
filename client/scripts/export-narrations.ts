/**
 * 将 TypeScript 稿件导出为 JSON 格式
 * 供 Python 音频生成脚本使用
 *
 * 使用方法：npx ts-node scripts/export-narrations.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// 导入所有稿件
import { narrationScripts } from '../src/narrations'

const OUTPUT_DIR = path.join(__dirname, '../src/narrations/scripts')

async function main() {
  console.log('📝 导出口播稿件为 JSON 格式...\n')

  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const scriptIds = Object.keys(narrationScripts)
  console.log(`找到 ${scriptIds.length} 个稿件\n`)

  for (const id of scriptIds) {
    const script = narrationScripts[id]
    const outputPath = path.join(OUTPUT_DIR, `${id}.json`)

    // 写入 JSON 文件
    fs.writeFileSync(outputPath, JSON.stringify(script, null, 2), 'utf-8')

    // 统计信息
    const totalLines = script.sections.reduce(
      (sum, section) => sum + section.lines.length,
      0
    )

    console.log(`✅ ${script.title} (${id})`)
    console.log(`   段落数: ${script.sections.length}`)
    console.log(`   总行数: ${totalLines}`)
    console.log(`   输出: ${outputPath}\n`)
  }

  console.log('🎉 导出完成!')
}

main().catch(console.error)
