/**
 * 图着色示例图集（带坐标，便于 Canvas 绘制）
 */
import type { Graph } from './graphColoring'

/** 生成轮图 Wn：中心 1 个节点连接外圈 n 个节点，外圈首尾相连成环 */
function wheel(n: number, cx: number, cy: number, r: number): Graph {
  const nodes = [{ x: cx, y: cy, label: 'C' }]
  const edges: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    nodes.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), label: `${i + 1}` })
    edges.push([0, i + 1])
    edges.push([i + 1, ((i + 1) % n) + 1])
  }
  return { nodes, edges }
}

/** 五省地图式平面图：相邻省份连边 */
const MAP_GRAPH: Graph = {
  nodes: [
    { x: 180, y: 120, label: 'A' },
    { x: 340, y: 110, label: 'B' },
    { x: 460, y: 220, label: 'C' },
    { x: 300, y: 260, label: 'D' },
    { x: 150, y: 300, label: 'E' },
    { x: 400, y: 380, label: 'F' },
  ],
  edges: [
    [0, 1], [0, 3], [0, 4], [1, 2], [1, 3],
    [2, 3], [2, 5], [3, 4], [3, 5], [4, 5],
  ],
}

/** 彼得森图：外五边形 + 内五角星，经典色数=3 的非平面图 */
function petersen(cx: number, cy: number): Graph {
  const nodes: Graph['nodes'] = []
  const edges: [number, number][] = []
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    nodes.push({ x: cx + 150 * Math.cos(a), y: cy + 150 * Math.sin(a), label: `O${i}` })
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2
    nodes.push({ x: cx + 70 * Math.cos(a), y: cy + 70 * Math.sin(a), label: `I${i}` })
  }
  for (let i = 0; i < 5; i++) {
    edges.push([i, (i + 1) % 5])
    edges.push([i, i + 5])
    edges.push([i + 5, ((i + 2) % 5) + 5])
  }
  return { nodes, edges }
}

export interface SampleGraph {
  key: string
  name: string
  graph: Graph
}

export const SAMPLE_GRAPHS: SampleGraph[] = [
  { key: 'map', name: '地图·六区', graph: MAP_GRAPH },
  { key: 'wheel6', name: '轮图 W6', graph: wheel(6, 300, 240, 170) },
  { key: 'wheel5', name: '轮图 W5', graph: wheel(5, 300, 240, 170) },
  { key: 'petersen', name: '彼得森图', graph: petersen(300, 240) },
]
