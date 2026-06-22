import { useEffect, useRef, useState, useCallback } from 'react'

// 经典心形参数方程
// x(t) = 16sin³(t)
// y(t) = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
function heartX(t: number): number {
  return 16 * Math.pow(Math.sin(t), 3)
}

function heartY(t: number): number {
  return 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

export default function ValentineHeart({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const progressRef = useRef(0)
  const showFormulaRef = useRef(false)
  const showTextRef = useRef(false)
  const [showFormula, setShowFormula] = useState(false)
  const [showText, setShowText] = useState(false)

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(dpr, dpr)
  }, [])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const getW = () => window.innerWidth
    const getH = () => window.innerHeight
    const getScale = () => Math.min(getW(), getH()) / 45

    const startTime = performance.now()

    function spawnHeartParticle() {
      const t = Math.random() * Math.PI * 2
      const s = getScale()
      const cx = getW() / 2
      const cy = getH() / 2 - s * 1.5
      const px = cx + heartX(t) * s
      const py = cy - heartY(t) * s
      const angle = Math.random() * Math.PI * 2
      const speed = 0.3 + Math.random() * 0.8

      particlesRef.current.push({
        x: px, y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 0,
        maxLife: 60 + Math.random() * 80,
        size: 1.5 + Math.random() * 2.5,
        hue: 340 + Math.random() * 30,
      })
    }

    function drawFrame(c: CanvasRenderingContext2D, now: number) {
      const elapsed = (now - startTime) / 1000
      const dpr = window.devicePixelRatio || 1
      const w = getW()
      const h = getH()

      c.save()
      c.setTransform(dpr, 0, 0, dpr, 0, 0)

      // 拖尾效果
      c.fillStyle = 'rgba(10, 5, 15, 0.12)'
      c.fillRect(0, 0, w, h)

      const s = getScale()
      const cx = w / 2
      const cy = h / 2 - s * 1.5

      // 阶段 0: 绘制心形轮廓 (0-3秒)
      if (elapsed < 3) {
        progressRef.current = Math.min(elapsed / 2.5, 1)
        const maxT = progressRef.current * Math.PI * 2
        const steps = Math.floor(maxT / 0.02)

        c.beginPath()
        c.strokeStyle = 'rgba(255, 80, 120, 0.9)'
        c.lineWidth = 2.5
        c.shadowColor = 'rgba(255, 50, 100, 0.8)'
        c.shadowBlur = 15

        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * maxT
          const x = cx + heartX(t) * s
          const y = cy - heartY(t) * s
          if (i === 0) c.moveTo(x, y)
          else c.lineTo(x, y)
        }
        c.stroke()
        c.shadowBlur = 0

        // 头部发光点
        if (steps > 0) {
          const hx = cx + heartX(maxT) * s
          const hy = cy - heartY(maxT) * s
          const glow = c.createRadialGradient(hx, hy, 0, hx, hy, 12)
          glow.addColorStop(0, 'rgba(255, 200, 220, 1)')
          glow.addColorStop(0.5, 'rgba(255, 80, 120, 0.6)')
          glow.addColorStop(1, 'rgba(255, 50, 100, 0)')
          c.fillStyle = glow
          c.beginPath()
          c.arc(hx, hy, 12, 0, Math.PI * 2)
          c.fill()
        }
      }

      // 阶段 1: 心形填充 + 粒子 (2.5秒后)
      if (elapsed >= 2.5) {
        const breathe = 1 + 0.03 * Math.sin(elapsed * 2.5)
        const bs = s * breathe

        c.beginPath()
        for (let i = 0; i <= 200; i++) {
          const t = (i / 200) * Math.PI * 2
          const x = cx + heartX(t) * bs
          const y = cy - heartY(t) * bs
          if (i === 0) c.moveTo(x, y)
          else c.lineTo(x, y)
        }
        c.closePath()

        const fillAlpha = Math.min((elapsed - 2.5) / 1.5, 0.35)
        const grad = c.createRadialGradient(cx, cy, 0, cx, cy, 16 * bs)
        grad.addColorStop(0, `rgba(255, 100, 140, ${fillAlpha * 1.2})`)
        grad.addColorStop(0.7, `rgba(220, 40, 80, ${fillAlpha})`)
        grad.addColorStop(1, `rgba(180, 20, 60, ${fillAlpha * 0.6})`)
        c.fillStyle = grad
        c.fill()

        c.strokeStyle = `rgba(255, 80, 120, ${Math.min((elapsed - 2.5) / 1, 0.9)})`
        c.lineWidth = 2
        c.shadowColor = 'rgba(255, 50, 100, 0.6)'
        c.shadowBlur = 20
        c.stroke()
        c.shadowBlur = 0

        if (Math.random() < 0.4) spawnHeartParticle()
      }

      // 粒子
      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.01
        p.life++

        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
          continue
        }

        const lifeRatio = p.life / p.maxLife
        const alpha = lifeRatio < 0.1 ? lifeRatio * 10 : 1 - (lifeRatio - 0.1) / 0.9
        c.beginPath()
        c.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2)
        c.fillStyle = `hsla(${p.hue}, 90%, 70%, ${alpha * 0.8})`
        c.fill()
      }

      // 显示公式和文字
      if (elapsed >= 4 && !showFormulaRef.current) {
        showFormulaRef.current = true
        setShowFormula(true)
      }
      if (elapsed >= 5.5 && !showTextRef.current) {
        showTextRef.current = true
        setShowText(true)
      }

      // 背景星星
      if (Math.random() < 0.15) {
        const sx = Math.random() * w
        const sy = Math.random() * h
        c.beginPath()
        c.arc(sx, sy, Math.random() * 1.5, 0, Math.PI * 2)
        c.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.3})`
        c.fill()
      }

      c.restore()
    }

    function animate(now: number) {
      drawFrame(ctx!, now)
      animRef.current = requestAnimationFrame(animate)
    }

    // 初始化黑色背景
    const dpr = window.devicePixelRatio || 1
    ctx.save()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = 'rgb(10, 5, 15)'
    ctx.fillRect(0, 0, getW(), getH())
    ctx.restore()

    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a050f]" onClick={onClose}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 数学公式 */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-[22%] md:bottom-[18%] text-center transition-all ${
          showFormula ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDuration: '1500ms' }}
      >
        <div className="text-pink-300/80 text-xs md:text-sm font-mono tracking-wider mb-2">
          x(t) = 16sin³(t)
        </div>
        <div className="text-pink-300/80 text-xs md:text-sm font-mono tracking-wider">
          y(t) = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
        </div>
      </div>

      {/* 表白文字 */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 bottom-[10%] md:bottom-[8%] text-center transition-all ${
          showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDuration: '2000ms' }}
      >
        <div className="text-pink-200/90 text-lg md:text-2xl font-light tracking-[0.3em]">
          数学之美，献给你
        </div>
        <div className="text-pink-400/50 text-xs md:text-sm mt-3 tracking-wider">
          Happy Valentine&apos;s Day 2026
        </div>
      </div>

      {/* 关闭提示 */}
      <div className="absolute top-6 right-6 text-white/30 text-xs md:text-sm cursor-pointer hover:text-white/60 transition-colors">
        点击任意处关闭
      </div>
    </div>
  )
}
