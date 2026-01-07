/**
 * 线性代数场景渲染器
 * 渲染向量、矩阵变换、特征值/特征向量等线性代数可视化
 */

import { useState, useEffect, useRef } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '线性代数', subtitle: '向量空间与线性变换' },
    'summary-intro': { title: '总结回顾', subtitle: '线性代数的核心思想' },
    'summary-end': { title: '感谢观看', subtitle: '探索线性空间之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '线性代数', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 向量场景
function VectorScene({
  vectors = [{ x: 3, y: 2, color: '#3b82f6', label: 'v' }],
  showGrid = true,
  animate = false
}: {
  vectors?: Array<{ x: number; y: number; color: string; label: string }>;
  showGrid?: boolean;
  animate?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (!animate) return
    const timer = setInterval(() => {
      setAnimationPhase(p => (p + 0.02) % (Math.PI * 2))
    }, 50)
    return () => clearInterval(timer)
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 40 // 每单位的像素数

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
      ctx.lineWidth = 1

      // 垂直线
      for (let x = centerX % scale; x < width; x += scale) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // 水平线
      for (let y = centerY % scale; y < height; y += scale) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 2

    // X轴
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()

    // Y轴
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // 绘制向量
    vectors.forEach((vec, idx) => {
      let x = vec.x
      let y = vec.y

      // 动画效果
      if (animate) {
        const phase = animationPhase + (idx * Math.PI / 3)
        x = vec.x * Math.cos(phase) - vec.y * Math.sin(phase)
        y = vec.x * Math.sin(phase) + vec.y * Math.cos(phase)
      }

      const endX = centerX + x * scale
      const endY = centerY - y * scale

      // 绘制向量线
      ctx.strokeStyle = vec.color
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // 绘制箭头
      const angle = Math.atan2(-y, x)
      const arrowLength = 15
      const arrowAngle = Math.PI / 6

      ctx.fillStyle = vec.color
      ctx.beginPath()
      ctx.moveTo(endX, endY)
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - arrowAngle),
        endY + arrowLength * Math.sin(angle - arrowAngle)
      )
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + arrowAngle),
        endY + arrowLength * Math.sin(angle + arrowAngle)
      )
      ctx.closePath()
      ctx.fill()

      // 绘制标签
      ctx.fillStyle = 'white'
      ctx.font = '16px sans-serif'
      ctx.fillText(vec.label, endX + 10, endY - 10)
    })

    // 绘制坐标轴标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('x', width - 20, centerY - 10)
    ctx.fillText('y', centerX + 10, 20)
  }, [vectors, showGrid, animate, animationPhase])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={600}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
    </div>
  )
}

// 线性变换场景
function TransformScene({
  transformType = 'rotation',
  animate = true
}: {
  transformType?: 'rotation' | 'scaling' | 'shear' | 'reflection';
  animate?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!animate) return
    const timer = setInterval(() => {
      setT(prev => (prev + 0.02) % (Math.PI * 2))
    }, 50)
    return () => clearInterval(timer)
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 60

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // 定义变换矩阵
    let matrix: number[][]
    switch (transformType) {
      case 'rotation':
        matrix = [
          [Math.cos(t), -Math.sin(t)],
          [Math.sin(t), Math.cos(t)]
        ]
        break
      case 'scaling':
        const s = 1 + 0.5 * Math.sin(t)
        matrix = [[s, 0], [0, s]]
        break
      case 'shear':
        const k = Math.sin(t)
        matrix = [[1, k], [0, 1]]
        break
      case 'reflection':
        const angle = t / 2
        const cos2a = Math.cos(2 * angle)
        const sin2a = Math.sin(2 * angle)
        matrix = [[cos2a, sin2a], [sin2a, -cos2a]]
        break
      default:
        matrix = [[1, 0], [0, 1]]
    }

    // 应用变换
    const transform = (x: number, y: number) => ({
      x: matrix[0][0] * x + matrix[0][1] * y,
      y: matrix[1][0] * x + matrix[1][1] * y
    })

    // 绘制原始网格（淡色）
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
    ctx.lineWidth = 1
    for (let i = -5; i <= 5; i++) {
      // 垂直线
      ctx.beginPath()
      ctx.moveTo(centerX + i * scale, centerY - 5 * scale)
      ctx.lineTo(centerX + i * scale, centerY + 5 * scale)
      ctx.stroke()
      // 水平线
      ctx.beginPath()
      ctx.moveTo(centerX - 5 * scale, centerY + i * scale)
      ctx.lineTo(centerX + 5 * scale, centerY + i * scale)
      ctx.stroke()
    }

    // 绘制变换后的网格
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'
    ctx.lineWidth = 2
    for (let i = -5; i <= 5; i++) {
      // 垂直线
      ctx.beginPath()
      for (let j = -5; j <= 5; j += 0.2) {
        const p = transform(i, j)
        const px = centerX + p.x * scale
        const py = centerY - p.y * scale
        if (j === -5) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()

      // 水平线
      ctx.beginPath()
      for (let j = -5; j <= 5; j += 0.2) {
        const p = transform(j, i)
        const px = centerX + p.x * scale
        const py = centerY - p.y * scale
        if (j === -5) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }

    // 绘制基向量
    const i_hat = transform(1, 0)
    const j_hat = transform(0, 1)

    // i-hat (红色)
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + i_hat.x * scale, centerY - i_hat.y * scale)
    ctx.stroke()

    // j-hat (蓝色)
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + j_hat.x * scale, centerY - j_hat.y * scale)
    ctx.stroke()

    // 标签
    ctx.fillStyle = 'white'
    ctx.font = '14px sans-serif'
    ctx.fillText('î', centerX + i_hat.x * scale + 10, centerY - i_hat.y * scale)
    ctx.fillText('ĵ', centerX + j_hat.x * scale + 10, centerY - j_hat.y * scale)
  }, [transformType, t, animate])

  const transformNames: Record<string, string> = {
    rotation: '旋转变换',
    scaling: '缩放变换',
    shear: '剪切变换',
    reflection: '反射变换'
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
      <p className="text-white/70 text-lg">{transformNames[transformType]}</p>
    </div>
  )
}

// 特征值/特征向量场景
function EigenScene({ animate = true }: { animate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!animate) return
    const timer = setInterval(() => {
      setT(prev => (prev + 0.02) % (Math.PI * 2))
    }, 50)
    return () => clearInterval(timer)
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const scale = 50

    // 清空画布
    ctx.fillStyle = 'rgba(30, 41, 59, 1)'
    ctx.fillRect(0, 0, width, height)

    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // 示例矩阵: [[2, 0], [0, 1]] - 特征值为 2 和 1
    const matrix = [[2, 0], [0, 1]]

    // 特征向量
    const eigen1 = { x: 1, y: 0, eigenvalue: 2, color: '#ef4444' }
    const eigen2 = { x: 0, y: 1, eigenvalue: 1, color: '#3b82f6' }

    // 绘制一般向量的变换
    const angle = t
    const v = { x: Math.cos(angle), y: Math.sin(angle) }
    const Av = {
      x: matrix[0][0] * v.x + matrix[0][1] * v.y,
      y: matrix[1][0] * v.x + matrix[1][1] * v.y
    }

    // 原始向量（绿色）
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + v.x * scale * 2, centerY - v.y * scale * 2)
    ctx.stroke()

    // 变换后的向量（黄色）
    ctx.strokeStyle = '#eab308'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Av.x * scale * 2, centerY - Av.y * scale * 2)
    ctx.stroke()

    // 绘制特征向量
    const eigenVectors = [eigen1, eigen2]
    eigenVectors.forEach((eigenVector) => {
      const scaled = {
        x: eigenVector.x * eigenVector.eigenvalue,
        y: eigenVector.y * eigenVector.eigenvalue
      }

      // 原始特征向量
      ctx.strokeStyle = eigenVector.color
      ctx.globalAlpha = 0.5
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + eigenVector.x * scale * 2, centerY - eigenVector.y * scale * 2)
      ctx.stroke()

      // 变换后的特征向量（沿同一方向）
      ctx.globalAlpha = 1
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + scaled.x * scale * 2, centerY - scaled.y * scale * 2)
      ctx.stroke()

      // 绘制箭头
      const endX = centerX + scaled.x * scale * 2
      const endY = centerY - scaled.y * scale * 2
      const arrowAngle = Math.atan2(-scaled.y, scaled.x)
      const arrowLength = 15
      const arrowWidth = Math.PI / 6

      ctx.fillStyle = eigenVector.color
      ctx.beginPath()
      ctx.moveTo(endX, endY)
      ctx.lineTo(
        endX - arrowLength * Math.cos(arrowAngle - arrowWidth),
        endY + arrowLength * Math.sin(arrowAngle - arrowWidth)
      )
      ctx.lineTo(
        endX - arrowLength * Math.cos(arrowAngle + arrowWidth),
        endY + arrowLength * Math.sin(arrowAngle + arrowWidth)
      )
      ctx.closePath()
      ctx.fill()

      // 标签
      ctx.fillStyle = 'white'
      ctx.font = '14px sans-serif'
      ctx.fillText(
        `λ=${eigenVector.eigenvalue}`,
        centerX + scaled.x * scale * 2 + 15,
        centerY - scaled.y * scale * 2
      )
    })

    ctx.globalAlpha = 1

    // 图例
    ctx.fillStyle = 'white'
    ctx.font = '12px sans-serif'
    ctx.fillText('绿色: 原始向量 v', 20, 30)
    ctx.fillText('黄色: 变换后 Av', 20, 50)
    ctx.fillText('红/蓝: 特征向量', 20, 70)
  }, [t, animate])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={450}
        className="max-w-full border border-white/10 rounded"
      />
      <p className="text-white/70 text-lg">特征向量保持方向不变，只改变长度</p>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'vector': {
      formula: '\\vec{v} = \\begin{bmatrix} x \\\\ y \\end{bmatrix}',
      description: '向量的表示',
    },
    'matrix': {
      formula: 'A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
      description: '矩阵的表示',
    },
    'transform': {
      formula: '\\vec{v}_{new} = A\\vec{v}',
      description: '线性变换',
    },
    'eigenvalue': {
      formula: 'A\\vec{v} = \\lambda\\vec{v}',
      description: '特征值方程',
    },
    'determinant': {
      formula: '\\det(A) = ad - bc',
      description: '2×2 矩阵的行列式',
    },
    'dot-product': {
      formula: '\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta',
      description: '向量点积',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['vector']

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
    'app-intro': {
      title: '线性代数的应用',
      items: ['计算机图形学', '机器学习', '量子力学', '数据分析'],
      icon: '🎯',
    },
    'app-graphics': {
      title: '计算机图形学',
      items: ['3D 变换', '投影矩阵', '旋转和缩放', '相机视角'],
      icon: '🎮',
    },
    'app-ml': {
      title: '机器学习',
      items: ['神经网络', '主成分分析', '降维技术', '特征提取'],
      icon: '🤖',
    },
    'app-physics': {
      title: '物理学',
      items: ['量子态', '力学系统', '电磁场', '振动分析'],
      icon: '⚛️',
    },
  }

  const app = apps[sceneId] || apps['app-intro']

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
export default function LinearAlgebraSceneRenderer({ scene }: SceneRendererProps) {
  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/50 text-lg">加载中...</div>
      </div>
    )
  }

  const { sectionId, scene: sceneConfig } = scene

  // 标题场景
  if (sceneConfig.type === 'title') {
    return <TitleScene sceneId={sceneConfig.id} />
  }

  // 应用场景
  if (sceneConfig.type === 'application') {
    return <ApplicationScene sceneId={sceneConfig.id} />
  }

  // 公式场景
  if (sceneConfig.type === 'formula') {
    const formulaType = scene.lineState?.params?.formulaType as string || 'vector'
    return <FormulaScene formulaType={formulaType} />
  }

  // 根据 section 和 scene 决定显示什么
  switch (sectionId) {
    case 'intro':
      if (sceneConfig.id.includes('vector')) {
        return <VectorScene />
      }
      if (sceneConfig.id.includes('transform')) {
        return <TransformScene transformType="rotation" />
      }
      return <VectorScene />

    case 'vectors':
      if (sceneConfig.id.includes('addition')) {
        return <VectorScene
          vectors={[
            { x: 2, y: 1, color: '#3b82f6', label: 'u' },
            { x: 1, y: 2, color: '#ef4444', label: 'v' },
            { x: 3, y: 3, color: '#22c55e', label: 'u+v' }
          ]}
        />
      }
      if (sceneConfig.id.includes('scaling')) {
        return <VectorScene
          vectors={[
            { x: 2, y: 1, color: '#3b82f6', label: 'v' },
            { x: 4, y: 2, color: '#ef4444', label: '2v' }
          ]}
        />
      }
      return <VectorScene />

    case 'transform':
      const transformType = (scene.lineState?.params?.transformType as 'rotation' | 'scaling' | 'shear' | 'reflection') || 'rotation'
      return <TransformScene transformType={transformType} />

    case 'eigen':
      return <EigenScene />

    case 'application':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('transform')) {
        return <TransformScene transformType="rotation" />
      }
      if (sceneConfig.id.includes('eigen')) {
        return <EigenScene />
      }
      return <VectorScene animate />

    default:
      return <VectorScene />
  }
}
