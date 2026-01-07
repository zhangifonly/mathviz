/**
 * PCA主成分分析场景渲染器
 * 渲染数据点散点图、主成分方向、降维投影动画等
 */

import { useMemo, useState, useEffect } from 'react'
import Plot from 'react-plotly.js'
import type { Data } from 'plotly.js'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-1': { title: '主成分分析', subtitle: '探索数据降维与特征提取' },
    'sum-1': { title: '总结回顾', subtitle: 'PCA的核心思想' },
    'sum-4': { title: '感谢观看', subtitle: '理解降维的数学本质' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '主成分分析', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 生成2D椭圆形数据点
function generateEllipseData(n: number = 100, angle: number = Math.PI / 4) {
  const data: { x: number[]; y: number[] } = { x: [], y: [] }

  for (let i = 0; i < n; i++) {
    // 生成椭圆形分布的数据
    const theta = Math.random() * 2 * Math.PI
    const r = Math.sqrt(Math.random())
    const x = r * Math.cos(theta) * 3
    const y = r * Math.sin(theta) * 1

    // 旋转数据点
    const xRot = x * Math.cos(angle) - y * Math.sin(angle)
    const yRot = x * Math.sin(angle) + y * Math.cos(angle)

    // 添加噪声
    data.x.push(xRot + (Math.random() - 0.5) * 0.3)
    data.y.push(yRot + (Math.random() - 0.5) * 0.3)
  }

  return data
}

// 计算主成分
function computePCA(data: { x: number[]; y: number[] }) {
  const n = data.x.length

  // 计算均值
  const meanX = data.x.reduce((a, b) => a + b, 0) / n
  const meanY = data.y.reduce((a, b) => a + b, 0) / n

  // 中心化数据
  const centeredX = data.x.map(x => x - meanX)
  const centeredY = data.y.map(y => y - meanY)

  // 计算协方差矩阵
  let cov_xx = 0, cov_xy = 0, cov_yy = 0
  for (let i = 0; i < n; i++) {
    cov_xx += centeredX[i] * centeredX[i]
    cov_xy += centeredX[i] * centeredY[i]
    cov_yy += centeredY[i] * centeredY[i]
  }
  cov_xx /= n
  cov_xy /= n
  cov_yy /= n

  // 计算特征值和特征向量
  const trace = cov_xx + cov_yy
  const det = cov_xx * cov_yy - cov_xy * cov_xy
  const lambda1 = trace / 2 + Math.sqrt(trace * trace / 4 - det)
  const lambda2 = trace / 2 - Math.sqrt(trace * trace / 4 - det)

  // 第一主成分方向
  const v1x = cov_xy
  const v1y = lambda1 - cov_xx
  const norm1 = Math.sqrt(v1x * v1x + v1y * v1y)

  // 第二主成分方向（垂直于第一主成分）
  const v2x = -v1y / norm1
  const v2y = v1x / norm1

  return {
    mean: { x: meanX, y: meanY },
    pc1: { x: v1x / norm1, y: v1y / norm1, variance: lambda1 },
    pc2: { x: v2x, y: v2y, variance: lambda2 },
  }
}

// 数据点散点图场景
function DataPointsScene({ showPCA = false }: { showPCA?: boolean }) {
  const data = useMemo(() => generateEllipseData(150), [])
  const pca = useMemo(() => computePCA(data), [data])

  const traces: Data[] = [
    {
      x: data.x,
      y: data.y,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: 8,
        color: '#60a5fa',
        opacity: 0.6,
      },
      name: '数据点',
    },
  ]

  if (showPCA) {
    // 添加第一主成分
    const scale1 = Math.sqrt(pca.pc1.variance) * 3
    traces.push({
      x: [pca.mean.x - pca.pc1.x * scale1, pca.mean.x + pca.pc1.x * scale1],
      y: [pca.mean.y - pca.pc1.y * scale1, pca.mean.y + pca.pc1.y * scale1],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#ef4444', width: 3 },
      name: '第一主成分',
    } as Data)

    // 添加第二主成分
    const scale2 = Math.sqrt(pca.pc2.variance) * 3
    traces.push({
      x: [pca.mean.x - pca.pc2.x * scale2, pca.mean.x + pca.pc2.x * scale2],
      y: [pca.mean.y - pca.pc2.y * scale2, pca.mean.y + pca.pc2.y * scale2],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#22c55e', width: 3 },
      name: '第二主成分',
    } as Data)
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 450,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'X' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'Y' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          showlegend: showPCA,
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
    </div>
  )
}

// 主成分方向场景（带动画）
function PrincipalComponentScene({ animate = false }: { animate?: boolean }) {
  const data = useMemo(() => generateEllipseData(150), [])
  const pca = useMemo(() => computePCA(data), [data])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!animate) {
      setProgress(1)
      return
    }

    let frame = 0
    const maxFrames = 100
    const timer = setInterval(() => {
      frame++
      setProgress(Math.min(frame / maxFrames, 1))
      if (frame >= maxFrames) {
        frame = 0
      }
    }, 30)

    return () => clearInterval(timer)
  }, [animate])

  const scale1 = Math.sqrt(pca.pc1.variance) * 3 * progress
  const scale2 = Math.sqrt(pca.pc2.variance) * 3 * progress

  const traces: Data[] = [
    {
      x: data.x,
      y: data.y,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: 8,
        color: '#60a5fa',
        opacity: 0.6,
      },
      name: '数据点',
    },
    {
      x: [pca.mean.x - pca.pc1.x * scale1, pca.mean.x + pca.pc1.x * scale1],
      y: [pca.mean.y - pca.pc1.y * scale1, pca.mean.y + pca.pc1.y * scale1],
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#ef4444', width: 4 },
      marker: { size: 10, symbol: 'arrow', angleref: 'previous' },
      name: '第一主成分',
    } as Data,
    {
      x: [pca.mean.x - pca.pc2.x * scale2, pca.mean.x + pca.pc2.x * scale2],
      y: [pca.mean.y - pca.pc2.y * scale2, pca.mean.y + pca.pc2.y * scale2],
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#22c55e', width: 4 },
      marker: { size: 10, symbol: 'arrow', angleref: 'previous' },
      name: '第二主成分',
    } as Data,
  ]

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'X' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'Y' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          showlegend: true,
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
      <div className="text-white/70 text-sm">
        <p>第一主成分方差: {pca.pc1.variance.toFixed(2)}</p>
        <p>第二主成分方差: {pca.pc2.variance.toFixed(2)}</p>
      </div>
    </div>
  )
}

// 降维投影动画场景
function ProjectionScene() {
  const data = useMemo(() => generateEllipseData(150), [])
  const pca = useMemo(() => computePCA(data), [data])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const maxFrames = 150
    const timer = setInterval(() => {
      frame++
      setProgress(Math.min(frame / maxFrames, 1))
      if (frame >= maxFrames + 50) {
        frame = 0
      }
    }, 30)

    return () => clearInterval(timer)
  }, [])

  // 计算投影点
  const projectedData = useMemo(() => {
    const projected: { x: number[]; y: number[] } = { x: [], y: [] }

    for (let i = 0; i < data.x.length; i++) {
      const x = data.x[i] - pca.mean.x
      const y = data.y[i] - pca.mean.y

      // 投影到第一主成分
      const proj = x * pca.pc1.x + y * pca.pc1.y
      const projX = proj * pca.pc1.x + pca.mean.x
      const projY = proj * pca.pc1.y + pca.mean.y

      // 插值动画
      projected.x.push(data.x[i] * (1 - progress) + projX * progress)
      projected.y.push(data.y[i] * (1 - progress) + projY * progress)
    }

    return projected
  }, [data, pca, progress])

  const scale1 = Math.sqrt(pca.pc1.variance) * 3

  const traces: Data[] = [
    {
      x: projectedData.x,
      y: projectedData.y,
      type: 'scatter',
      mode: 'markers',
      marker: {
        size: 8,
        color: '#60a5fa',
        opacity: 0.6,
      },
      name: '数据点',
    },
    {
      x: [pca.mean.x - pca.pc1.x * scale1, pca.mean.x + pca.pc1.x * scale1],
      y: [pca.mean.y - pca.pc1.y * scale1, pca.mean.y + pca.pc1.y * scale1],
      type: 'scatter',
      mode: 'lines',
      line: { color: '#ef4444', width: 4 },
      name: '第一主成分',
    } as Data,
  ]

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 400,
          margin: { t: 20, r: 30, b: 50, l: 60 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'rgba(255,255,255,0.05)',
          xaxis: {
            title: { text: 'X' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          yaxis: {
            title: { text: 'Y' },
            color: 'white',
            gridcolor: 'rgba(255,255,255,0.1)',
            zeroline: true,
            zerolinecolor: 'rgba(255,255,255,0.3)',
          },
          showlegend: true,
          legend: {
            font: { color: 'white' },
            bgcolor: 'rgba(0,0,0,0.5)',
          },
        }}
        config={{ responsive: true, displayModeBar: false }}
        className="w-full"
      />
      <p className="text-white/70 text-sm">
        投影进度: {(progress * 100).toFixed(0)}%
      </p>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'covariance': {
      formula: '\\Sigma = \\frac{1}{n}X^TX',
      description: '协方差矩阵的计算',
    },
    'eigendecomposition': {
      formula: '\\Sigma v = \\lambda v',
      description: '特征值分解：主成分是特征向量',
    },
    'projection': {
      formula: 'z = W^T(x - \\mu)',
      description: '数据投影到主成分空间',
    },
    'variance': {
      formula: '\\text{Var}(PC_i) = \\lambda_i',
      description: '主成分的方差等于特征值',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['covariance']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8">
      <div className="p-8 bg-white/10 rounded-2xl backdrop-blur">
        <MathFormula formula={formula} className="text-2xl" />
      </div>
      <p className="text-white/70 text-lg">{description}</p>
    </div>
  )
}

// 应用场景
function ApplicationScene({ sceneId }: { sceneId: string }) {
  const apps: Record<string, { title: string; items: string[]; icon: string }> = {
    'app-1': {
      title: 'PCA的应用领域',
      items: ['图像处理', '金融分析', '生物信息学', '数据可视化'],
      icon: '📊',
    },
    'app-2': {
      title: '图像处理',
      items: ['人脸识别', '图像压缩', '特征提取', '降噪处理'],
      icon: '🖼️',
    },
    'app-3': {
      title: '金融分析',
      items: ['风险因子识别', '投资组合优化', '市场趋势分析', '异常检测'],
      icon: '💰',
    },
    'app-4': {
      title: '生物信息学',
      items: ['基因表达分析', '蛋白质结构', '疾病分类', '药物发现'],
      icon: '🧬',
    },
  }

  const app = apps[sceneId] || apps['app-1']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function PcaSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title' || sceneConfig.id === 'intro-1' || sceneConfig.id === 'sum-1' || sceneConfig.id === 'sum-4') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application' || sectionId === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('intro-2') || sceneConfig.id.includes('intro-3')) {
        return <DataPointsScene showPCA={false} />
      }
      if (sceneConfig.id.includes('intro-4')) {
        return <DataPointsScene showPCA={true} />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    case 'concept':
      if (sceneConfig.id.includes('concept-1')) {
        return <DataPointsScene showPCA={false} />
      }
      if (sceneConfig.id.includes('concept-2')) {
        return <PrincipalComponentScene animate={false} />
      }
      if (sceneConfig.id.includes('concept-3') || sceneConfig.id.includes('concept-4')) {
        return <PrincipalComponentScene animate={true} />
      }
      return <DataPointsScene showPCA={true} />

    case 'visualization':
      if (sceneConfig.id.includes('vis-1') || sceneConfig.id.includes('vis-2')) {
        return <DataPointsScene showPCA={false} />
      }
      if (sceneConfig.id.includes('vis-3')) {
        return <PrincipalComponentScene animate={true} />
      }
      if (sceneConfig.id.includes('vis-4')) {
        return <PrincipalComponentScene animate={false} />
      }
      return <DataPointsScene showPCA={true} />

    case 'math':
      if (sceneConfig.id.includes('math-1')) {
        return <FormulaScene formulaType="covariance" />
      }
      if (sceneConfig.id.includes('math-2')) {
        return <FormulaScene formulaType="eigendecomposition" />
      }
      if (sceneConfig.id.includes('math-3')) {
        return <FormulaScene formulaType="variance" />
      }
      if (sceneConfig.id.includes('math-4')) {
        return <ProjectionScene />
      }
      return <FormulaScene formulaType="covariance" />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('sum-2')) {
        return <PrincipalComponentScene animate={false} />
      }
      if (sceneConfig.id.includes('sum-3')) {
        return <ProjectionScene />
      }
      return <TitleScene sceneId={sceneConfig.id} />

    default:
      return <DataPointsScene showPCA={true} />
  }
}
