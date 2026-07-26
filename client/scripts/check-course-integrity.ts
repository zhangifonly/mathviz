#!/usr/bin/env npx ts-node
/**
 * 课程完整性检查脚本
 *
 * 在构建前运行，确保所有课程都正确注册在各个配置文件中
 * 防止出现"新课程使用傅里叶动画"这类低级错误
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '..')
const NARRATIONS_DIR = path.join(ROOT, 'src/narrations/scripts')
const SCENES_DIR = path.join(ROOT, 'src/components/NarrationPresenter')
const RENDERERS_DIR = path.join(ROOT, 'src/components/NarrationPresenter/scenes')

interface CheckResult {
  courseId: string
  hasScript: boolean
  hasSceneConfig: boolean
  hasRenderer: boolean
  registeredInFactory: boolean
  registeredInPresenter: boolean
  registeredInCustomList: boolean
  /** 是否在 catalog.ts 中（决定首页是否出现卡片） */
  inCatalog: boolean
  /** 是否在 Sidebar.tsx 中（决定左侧导航是否出现入口） */
  inSidebar: boolean
  /** 是否在 App.tsx 中配了路由（决定链接点开是否 404） */
  hasRoute: boolean
}

// 不需要专属渲染器的课程（使用默认傅里叶渲染）
const COURSES_USING_DEFAULT_RENDERER = ['fourier']

// 有特殊处理逻辑的课程（在 NarrationPresenter 中单独处理，不需要在 experimentsWithCustomRenderer 列表中）
const COURSES_WITH_SPECIAL_HANDLING = ['basic-arithmetic']

// 待完成的课程（已有讲解稿件但尚未完成场景配置，暂时跳过检查）
// TODO: 完成这些课程的配置后从此列表移除
const COURSES_PENDING_COMPLETION: string[] = []

function getAllCourseIds(): string[] {
  // 从讲解稿件目录获取所有课程 ID
  const files = fs.readdirSync(NARRATIONS_DIR)
  return files
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .map(f => f.replace('.ts', ''))
}

function checkSceneConfigExists(courseId: string): boolean {
  // 检查场景配置文件是否存在
  const camelCase = toCamelCase(courseId)
  // 处理特殊命名：conic-sections -> conic, quadratic-function -> quadratic 等
  const shortCamelCase = camelCase.replace(/Sections$/, '').replace(/Function$/, '')

  const possibleNames = [
    `${courseId}Scenes.ts`,
    `${camelCase}Scenes.ts`,
    `${shortCamelCase}Scenes.ts`,
  ]
  return possibleNames.some(name =>
    fs.existsSync(path.join(SCENES_DIR, name))
  )
}

function checkRendererExists(courseId: string): boolean {
  // 检查场景渲染器是否存在（目录形式或文件形式）
  const pascalCase = toPascalCase(courseId)
  // 处理特殊命名：conic-sections -> Conic, quadratic-function -> Quadratic 等
  const shortPascalCase = pascalCase.replace(/Sections$/, '').replace(/Function$/, '')

  const possiblePaths = [
    // 目录形式（主要形式）
    path.join(RENDERERS_DIR, pascalCase),
    path.join(RENDERERS_DIR, shortPascalCase),
    // 文件形式
    path.join(RENDERERS_DIR, `${pascalCase}SceneRenderer.tsx`),
    path.join(RENDERERS_DIR, `${shortPascalCase}SceneRenderer.tsx`),
  ]
  return possiblePaths.some(p => fs.existsSync(p))
}

function checkRegisteredInFactory(courseId: string): boolean {
  // 检查是否在 SceneRendererFactory 中注册
  const factoryPath = path.join(RENDERERS_DIR, 'SceneRendererFactory.tsx')
  const content = fs.readFileSync(factoryPath, 'utf-8')
  return content.includes(`'${courseId}'`)
}

function checkRegisteredInPresenter(courseId: string): boolean {
  // 场景配置已改为按需加载: 注册表在 sceneFiles.ts 的 SCENE_FILES 中,
  // 由 sceneRegistry.loadSceneConfig 动态 import(原 NarrationPresenter.sceneConfigMap 已移除)
  const registryPath = path.join(SCENES_DIR, 'sceneFiles.ts')
  const content = fs.readFileSync(registryPath, 'utf-8')
  const mapMatch = content.match(/SCENE_FILES: Record<string, string> = \{([\s\S]*?)\n\}/m)
  if (!mapMatch) return false
  // 注册项形如 'course-id': 'xxxScenes', 顺带校验指向的文件真实存在
  const entry = mapMatch[1].match(new RegExp(`'${courseId}':\\s*'([^']+)'`))
  if (!entry) return false
  return fs.existsSync(path.join(SCENES_DIR, `${entry[1]}.ts`))
}

function checkRegisteredInCustomList(courseId: string): boolean {
  // 检查是否在 experimentsWithCustomRenderer 列表中
  const presenterPath = path.join(SCENES_DIR, 'NarrationPresenter.tsx')
  const content = fs.readFileSync(presenterPath, 'utf-8')
  const customListMatch = content.match(/experimentsWithCustomRenderer\s*=\s*\[([\s\S]*?)\]/)
  if (!customListMatch) return false
  return customListMatch[1].includes(`'${courseId}'`)
}

// 三个前端集成点的内容只读一次, 300 门课逐个 readFileSync 太浪费
const catalogContent = fs.readFileSync(path.join(ROOT, 'src/experiments/catalog.ts'), 'utf-8')
const sidebarContent = fs.readFileSync(path.join(ROOT, 'src/components/Layout/Sidebar.tsx'), 'utf-8')
const appContent = fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf-8')

function checkInCatalog(courseId: string): boolean {
  // catalog 条目形如 path: '/course-id'
  return new RegExp(`path:\\s*'/${courseId}'`).test(catalogContent)
}

function checkInSidebar(courseId: string): boolean {
  return new RegExp(`path:\\s*'/${courseId}'`).test(sidebarContent)
}

function checkHasRoute(courseId: string): boolean {
  // App.tsx 里是相对路径的嵌套路由: <Route path="course-id" ...>
  return new RegExp(`path="/?${courseId}"`).test(appContent)
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

function checkCourse(courseId: string): CheckResult {
  return {
    courseId,
    hasScript: true, // 已经从脚本目录获取，肯定存在
    hasSceneConfig: checkSceneConfigExists(courseId),
    hasRenderer: checkRendererExists(courseId),
    registeredInFactory: checkRegisteredInFactory(courseId),
    registeredInPresenter: checkRegisteredInPresenter(courseId),
    registeredInCustomList: checkRegisteredInCustomList(courseId),
    inCatalog: checkInCatalog(courseId),
    inSidebar: checkInSidebar(courseId),
    hasRoute: checkHasRoute(courseId),
  }
}

function main() {
  console.log('🔍 检查课程完整性...\n')

  const courseIds = getAllCourseIds()
  const results: CheckResult[] = courseIds.map(checkCourse)

  let hasErrors = false
  const errors: string[] = []
  const warnings: string[] = []

  for (const result of results) {
    const isDefaultRenderer = COURSES_USING_DEFAULT_RENDERER.includes(result.courseId)
    const hasSpecialHandling = COURSES_WITH_SPECIAL_HANDLING.includes(result.courseId)
    const isPendingCompletion = COURSES_PENDING_COMPLETION.includes(result.courseId)

    // 跳过待完成的课程
    if (isPendingCompletion) {
      warnings.push(`⚠️  [${result.courseId}] 待完成配置（已跳过检查）`)
      continue
    }

    // 检查场景配置
    if (!result.hasSceneConfig) {
      errors.push(`❌ [${result.courseId}] 缺少场景配置文件 (xxxScenes.ts)`)
      hasErrors = true
    }

    // 检查场景配置注册表(按需加载)
    if (!result.registeredInPresenter) {
      errors.push(`❌ [${result.courseId}] 未在 sceneFiles.ts 的 SCENE_FILES 中注册, 或注册项指向的 xxxScenes.ts 不存在`)
      hasErrors = true
    }

    // 前端集成点: 漏掉任一处, 构建仍会通过, 但用户找不到或点不开这个实验
    if (!result.hasRoute) {
      errors.push(`❌ [${result.courseId}] 未在 App.tsx 中配置路由（链接会 404）`)
      hasErrors = true
    }
    if (!result.inCatalog) {
      errors.push(`❌ [${result.courseId}] 未在 catalog.ts 中登记（首页无卡片）`)
      hasErrors = true
    }
    if (!result.inSidebar) {
      errors.push(`❌ [${result.courseId}] 未在 Sidebar.tsx 中登记（左侧导航无入口）`)
      hasErrors = true
    }

    // 非默认渲染器的课程需要额外检查
    if (!isDefaultRenderer) {
      if (!result.hasRenderer) {
        errors.push(`❌ [${result.courseId}] 缺少场景渲染器 (XxxSceneRenderer.tsx)`)
        hasErrors = true
      }

      if (!result.registeredInFactory) {
        errors.push(`❌ [${result.courseId}] 未在 SceneRendererFactory.tsx 中注册`)
        hasErrors = true
      }

      // 有特殊处理的课程不需要在 experimentsWithCustomRenderer 列表中
      if (!hasSpecialHandling && !result.registeredInCustomList) {
        errors.push(`❌ [${result.courseId}] 未在 experimentsWithCustomRenderer 列表中注册`)
        hasErrors = true
      }
    }
  }

  if (hasErrors) {
    console.log('发现以下问题：\n')
    errors.forEach(e => console.log(e))
    console.log('\n💡 提示：添加新课程时需要修改以下文件：')
    console.log('   1. src/narrations/scripts/xxx.ts - 讲解稿件')
    console.log('   2. src/components/NarrationPresenter/xxxScenes.ts - 场景配置')
    console.log('   3. src/components/NarrationPresenter/scenes/XxxSceneRenderer.tsx - 场景渲染器')
    console.log('   4. src/components/NarrationPresenter/scenes/SceneRendererFactory.tsx - 注册渲染器')
    console.log('   5. src/components/NarrationPresenter/sceneFiles.ts - 注册场景配置文件名(按需加载)')
    console.log('   6. src/components/NarrationPresenter/NarrationPresenter.tsx - 注册自定义渲染器列表')
    console.log('')
    process.exit(1)
  }

  // 显示警告（待完成的课程）
  if (warnings.length > 0) {
    console.log('⚠️  待完成的课程：\n')
    warnings.forEach(w => console.log(w))
    console.log('')
  }

  const completedCount = courseIds.length - COURSES_PENDING_COMPLETION.length
  console.log(`✅ ${completedCount} 个课程配置完整！\n`)

  // 打印课程列表
  console.log('课程列表：')
  results.forEach(r => {
    const isDefault = COURSES_USING_DEFAULT_RENDERER.includes(r.courseId)
    console.log(`  • ${r.courseId}${isDefault ? ' (默认渲染器)' : ''}`)
  })
}

main()
