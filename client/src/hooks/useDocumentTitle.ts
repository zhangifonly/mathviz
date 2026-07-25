/**
 * 按当前路由同步 document.title
 *
 * 原先 300 个实验页共用首页标题, 浏览器多标签、收藏夹、搜索收录都无法区分。
 * 这里从实验目录取标题, 未登记的路径回退到站点名。
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { experiments } from '../experiments/catalog'

const SITE_NAME = '数学之美'
const HOME_TITLE = `${SITE_NAME} - 交互式数学可视化`

// path(不含前导斜杠) -> 实验标题
const titleByPath = new Map(
  experiments.map(e => [e.path.replace(/^\//, ''), e.title])
)

export function useDocumentTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const key = pathname.replace(/^\//, '').replace(/\/$/, '')
    if (!key) {
      document.title = HOME_TITLE
      return
    }
    const title = titleByPath.get(key)
    document.title = title ? `${title} - ${SITE_NAME}` : HOME_TITLE
  }, [pathname])
}
