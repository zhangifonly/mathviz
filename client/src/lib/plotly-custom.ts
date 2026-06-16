/**
 * 自定义 Plotly 精简内核
 *
 * react-plotly.js 默认引用 plotly.js/dist/plotly（完整 bundle，含 3D/gl/金融/地图
 * 等全部 40+ 种图表，约 4.8MB）。本项目通过 vite alias 将其重定向到这里，
 * 只注册实际用到的图表类型，去掉用不上的部分以减小打包体积。
 *
 * 已统计 src/ 中实际使用的 plotly type：
 *   scatter(core 自带), bar, scatter3d, surface, contour, heatmap, histogram, scattergl
 * 另注册 pie / mesh3d 作为常用备用。
 *
 * 新增图表类型时，请在下方 register 列表里补充对应模块，否则该类型不会渲染。
 */

import Plotly from 'plotly.js/lib/core'
import bar from 'plotly.js/lib/bar'
import pie from 'plotly.js/lib/pie'
import histogram from 'plotly.js/lib/histogram'
import contour from 'plotly.js/lib/contour'
import heatmap from 'plotly.js/lib/heatmap'
import scatter3d from 'plotly.js/lib/scatter3d'
import surface from 'plotly.js/lib/surface'
import mesh3d from 'plotly.js/lib/mesh3d'
import scattergl from 'plotly.js/lib/scattergl'

Plotly.register([
  bar,
  pie,
  histogram,
  contour,
  heatmap,
  scatter3d,
  surface,
  mesh3d,
  scattergl,
])

export default Plotly
