import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ============ 数学函数 ============

// 场景1: 心形参数方程 x(t)=16sin³(t), y(t)=13cos(t)-5cos(2t)-2cos(3t)-cos(4t)
function heartX(t: number) { return 16 * Math.sin(t) ** 3 }
function heartY(t: number) { return 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t) }

// 场景2: 笛卡尔心形线 r = a(1 - cosθ)
function cardioidR(theta: number, a: number) { return a * (1 - Math.cos(theta)) }

// 场景4: 简洁心形 x=sin(t), y=cos(t)+cbrt(sin²(t))  (参数化 x²+(y-∛x²)²=1)
function simpleHeartX(t: number) { return Math.sin(t) }
function simpleHeartY(t: number) { return Math.cos(t) + Math.cbrt(Math.sin(t) ** 2) }

// ============ 粒子 ============
interface Particle {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; size: number; hue: number
}

function spawnParticle(x: number, y: number): Particle {
  const angle = Math.random() * Math.PI * 2
  const speed = 0.3 + Math.random() * 0.8
  return {
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 0.5,
    life: 0, maxLife: 60 + Math.random() * 80,
    size: 1.5 + Math.random() * 2.5,
    hue: 340 + Math.random() * 30,
  }
}

function updateAndDrawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx; p.y += p.vy; p.vy -= 0.01; p.life++
    if (p.life >= p.maxLife) { particles.splice(i, 1); continue }
    const r = p.life / p.maxLife
    const alpha = r < 0.1 ? r * 10 : 1 - (r - 0.1) / 0.9
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * (1 - r * 0.5), 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue},90%,70%,${alpha * 0.8})`
    ctx.fill()
  }
}

// ============ 场景配置 ============
const SCENES = [
  { name: '心形参数方程', formula: 'x = 16sin³t\ny = 13cost − 5cos2t − 2cos3t − cos4t', duration: 6 },
  { name: '笛卡尔心形线', formula: 'r = a(1 − cosθ)', duration: 6 },
  { name: '隐函数心形', formula: '(x² + y² − 1)³ = x²y³', duration: 6 },
  { name: '简洁心形', formula: 'x² + (y − ∛x²)² = 1', duration: 6 },
]

// ============ 场景绘制函数 ============

function drawScene1(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particles: Particle[]) {
  const s = Math.min(w, h) / 50
  const cx = w / 2, cy = h * 0.4

  // 阶段1: 描线 (0-3s)
  if (t < 3) {
    const progress = Math.min(t / 2.5, 1)
    const maxT = progress * Math.PI * 2
    const steps = Math.floor(maxT / 0.02)
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255,80,120,0.9)'
    ctx.lineWidth = 2.5
    ctx.shadowColor = 'rgba(255,50,100,0.8)'
    ctx.shadowBlur = 15
    for (let i = 0; i <= steps; i++) {
      const tt = (i / steps) * maxT
      const x = cx + heartX(tt) * s, y = cy - heartY(tt) * s
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0
    // 头部发光点
    if (steps > 0) {
      const hx = cx + heartX(maxT) * s, hy = cy - heartY(maxT) * s
      const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 12)
      g.addColorStop(0, 'rgba(255,200,220,1)')
      g.addColorStop(1, 'rgba(255,50,100,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(hx, hy, 12, 0, Math.PI * 2); ctx.fill()
    }
  }

  // 阶段2: 填充 + 呼吸 + 粒子 (2.5s+)
  if (t >= 2.5) {
    const breathe = 1 + 0.03 * Math.sin(t * 2.5)
    const bs = s * breathe
    ctx.beginPath()
    for (let i = 0; i <= 200; i++) {
      const tt = (i / 200) * Math.PI * 2
      const x = cx + heartX(tt) * bs, y = cy - heartY(tt) * bs
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.closePath()
    const fa = Math.min((t - 2.5) / 1.5, 0.35)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16 * bs)
    grad.addColorStop(0, `rgba(255,100,140,${fa * 1.2})`)
    grad.addColorStop(1, `rgba(180,20,60,${fa * 0.6})`)
    ctx.fillStyle = grad; ctx.fill()
    ctx.strokeStyle = `rgba(255,80,120,${Math.min((t - 2.5), 0.9)})`
    ctx.lineWidth = 2; ctx.shadowColor = 'rgba(255,50,100,0.6)'; ctx.shadowBlur = 20
    ctx.stroke(); ctx.shadowBlur = 0
    if (Math.random() < 0.4) {
      const rt = Math.random() * Math.PI * 2
      particles.push(spawnParticle(cx + heartX(rt) * s, cy - heartY(rt) * s))
    }
  }
}

function drawScene2(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particles: Particle[]) {
  const a = Math.min(w, h) / 6
  const cx = w / 2, cy = h * 0.42

  const progress = Math.min(t / 3, 1)
  const maxTheta = progress * Math.PI * 2
  const steps = Math.floor(maxTheta / 0.01)

  // 描线
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255,120,180,0.9)'
  ctx.lineWidth = 3
  ctx.shadowColor = 'rgba(255,80,160,0.7)'
  ctx.shadowBlur = 12
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxTheta
    const r = cardioidR(theta, a)
    const x = cx + r * Math.cos(theta), y = cy - r * Math.sin(theta)
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.shadowBlur = 0

  // 填充 (3s+)
  if (t >= 3) {
    const breathe = 1 + 0.02 * Math.sin(t * 3)
    const ba = a * breathe
    ctx.beginPath()
    for (let i = 0; i <= 300; i++) {
      const theta = (i / 300) * Math.PI * 2
      const r = cardioidR(theta, ba)
      const x = cx + r * Math.cos(theta), y = cy - r * Math.sin(theta)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.closePath()
    const fa = Math.min((t - 3) / 1.5, 0.3)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, ba * 2)
    grad.addColorStop(0, `rgba(255,140,200,${fa})`)
    grad.addColorStop(1, `rgba(200,40,100,${fa * 0.5})`)
    ctx.fillStyle = grad; ctx.fill()

    if (Math.random() < 0.3) {
      const rt = Math.random() * Math.PI * 2
      const rr = cardioidR(rt, a)
      particles.push(spawnParticle(cx + rr * Math.cos(rt), cy - rr * Math.sin(rt)))
    }
  }
}

function drawScene3(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, imgDataRef: { data: ImageData | null }) {
  const s = Math.min(w, h) * 0.35
  const cx = w / 2, cy = h * 0.4
  const res = 2 // 每2像素采样

  // 预计算 ImageData（只算一次）
  if (!imgDataRef.data) {
    const iw = Math.ceil(s * 2.4 / res), ih = Math.ceil(s * 2.8 / res)
    const imgData = ctx.createImageData(iw, ih)
    for (let py = 0; py < ih; py++) {
      for (let px = 0; px < iw; px++) {
        const x = (px / iw - 0.5) * 2.4
        const y = (0.5 - py / ih) * 2.8 + 0.3
        const lhs = (x * x + y * y - 1) ** 3
        const rhs = x * x * y * y * y
        if (lhs <= rhs) {
          const dist = Math.abs(lhs - rhs)
          const edge = dist < 0.01 ? 1 : 0.7
          const idx = (py * iw + px) * 4
          imgData.data[idx] = Math.floor(255 * edge)
          imgData.data[idx + 1] = Math.floor(60 * edge)
          imgData.data[idx + 2] = Math.floor(100 * edge)
          imgData.data[idx + 3] = 255
        }
      }
    }
    imgDataRef.data = imgData
  }

  // 逐行扫描显现
  const imgData = imgDataRef.data
  const iw = imgData.width, ih = imgData.height
  const revealRows = Math.min(Math.floor((t / 3) * ih), ih)

  // 创建临时 canvas 绘制 ImageData 再缩放
  const tmpCanvas = document.createElement('canvas')
  tmpCanvas.width = iw; tmpCanvas.height = revealRows || 1
  const tmpCtx = tmpCanvas.getContext('2d')!
  const partial = tmpCtx.createImageData(iw, revealRows || 1)
  partial.data.set(imgData.data.subarray(0, iw * (revealRows || 1) * 4))
  tmpCtx.putImageData(partial, 0, 0)

  const drawW = s * 2.4, drawH = s * 2.8
  const drawX = cx - drawW / 2, drawY = cy - drawH / 2
  const revealH = (revealRows / ih) * drawH

  ctx.shadowColor = 'rgba(255,50,100,0.5)'
  ctx.shadowBlur = 20
  ctx.drawImage(tmpCanvas, drawX, drawY, drawW, revealH)
  ctx.shadowBlur = 0

  // 扫描线发光
  if (revealRows < ih && t < 3.5) {
    const lineY = drawY + revealH
    const g = ctx.createLinearGradient(drawX, lineY - 3, drawX, lineY + 3)
    g.addColorStop(0, 'rgba(255,150,200,0)')
    g.addColorStop(0.5, 'rgba(255,150,200,0.8)')
    g.addColorStop(1, 'rgba(255,150,200,0)')
    ctx.fillStyle = g
    ctx.fillRect(drawX, lineY - 3, drawW, 6)
  }
}

function drawScene4(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, particles: Particle[]) {
  const s = Math.min(w, h) * 0.3
  const cx = w / 2, cy = h * 0.38

  const progress = Math.min(t / 3, 1)
  const maxT = progress * Math.PI * 2
  const steps = Math.floor(maxT / 0.015)

  // 手写笔触效果
  ctx.beginPath()
  ctx.strokeStyle = 'rgba(255,100,150,0.9)'
  ctx.shadowColor = 'rgba(255,60,120,0.6)'
  ctx.shadowBlur = 10
  for (let i = 0; i <= steps; i++) {
    const tt = (i / steps) * maxT - Math.PI
    const x = cx + simpleHeartX(tt) * s
    const y = cy - simpleHeartY(tt) * s
    // 变宽笔触
    ctx.lineWidth = 2 + Math.sin(tt * 3) * 1
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.shadowBlur = 0

  // 填充 (3s+)
  if (t >= 3) {
    const breathe = 1 + 0.025 * Math.sin(t * 2.8)
    const bs = s * breathe
    ctx.beginPath()
    for (let i = 0; i <= 200; i++) {
      const tt = (i / 200) * Math.PI * 2 - Math.PI
      const x = cx + simpleHeartX(tt) * bs, y = cy - simpleHeartY(tt) * bs
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.closePath()
    const fa = Math.min((t - 3) / 1.5, 0.3)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, bs * 1.5)
    grad.addColorStop(0, `rgba(255,130,170,${fa})`)
    grad.addColorStop(1, `rgba(200,30,80,${fa * 0.5})`)
    ctx.fillStyle = grad; ctx.fill()

    // 花瓣粒子
    if (Math.random() < 0.35) {
      const rt = Math.random() * Math.PI * 2 - Math.PI
      particles.push(spawnParticle(cx + simpleHeartX(rt) * s, cy - simpleHeartY(rt) * s))
    }
  }
}

// 背景星空
function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number) {
  if (Math.random() < 0.2) {
    ctx.beginPath()
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.3})`
    ctx.fill()
  }
}

// 结尾场景：四心缩小排列
function drawEndingScene(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  const s = Math.min(w, h) / 120
  const positions = [
    { x: w * 0.3, y: h * 0.25 }, { x: w * 0.7, y: h * 0.25 },
    { x: w * 0.3, y: h * 0.48 }, { x: w * 0.7, y: h * 0.48 },
  ]
  const fadeIn = Math.min(t / 1.5, 1)

  positions.forEach((pos, idx) => {
    const breathe = 1 + 0.04 * Math.sin(t * 2 + idx * 1.5)
    const bs = s * breathe * fadeIn
    ctx.globalAlpha = fadeIn
    ctx.beginPath()

    if (idx === 0) {
      for (let i = 0; i <= 200; i++) {
        const tt = (i / 200) * Math.PI * 2
        const x = pos.x + heartX(tt) * bs, y = pos.y - heartY(tt) * bs
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
    } else if (idx === 1) {
      const a = bs * 3
      for (let i = 0; i <= 200; i++) {
        const theta = (i / 200) * Math.PI * 2
        const r = cardioidR(theta, a)
        const x = pos.x + r * Math.cos(theta), y = pos.y - r * Math.sin(theta)
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
    } else if (idx === 2) {
      // 隐函数心形用简化轮廓
      const sz = bs * 8
      for (let i = 0; i <= 200; i++) {
        const tt = (i / 200) * Math.PI * 2
        const x = pos.x + heartX(tt) * bs * 0.8, y = pos.y - heartY(tt) * bs * 0.8
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x + sz * 0, y)
      }
    } else {
      const sz = bs * 8
      for (let i = 0; i <= 200; i++) {
        const tt = (i / 200) * Math.PI * 2 - Math.PI
        const x = pos.x + simpleHeartX(tt) * sz, y = pos.y - simpleHeartY(tt) * sz
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
    }
    ctx.closePath()
    const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, bs * 18)
    grad.addColorStop(0, 'rgba(255,120,160,0.5)')
    grad.addColorStop(1, 'rgba(200,30,80,0.15)')
    ctx.fillStyle = grad; ctx.fill()
    ctx.strokeStyle = 'rgba(255,80,120,0.8)'
    ctx.lineWidth = 1.5; ctx.stroke()
    ctx.globalAlpha = 1
  })
}

// ============ 主组件 ============
export default function ValentineMobile() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const scene3ImgRef = useRef<{ data: ImageData | null }>({ data: null })
  const [currentScene, setCurrentScene] = useState(0)
  const [showFormula, setShowFormula] = useState(false)
  const [showEnding, setShowEnding] = useState(false)
  const sceneStartRef = useRef(0)
  const currentSceneRef = useRef(0)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const autoPlayRef = useRef(true)

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

  const goToScene = useCallback((idx: number) => {
    if (idx < 0 || idx > 4) return
    currentSceneRef.current = idx
    setCurrentScene(idx)
    setShowFormula(false)
    setShowEnding(idx === 4)
    sceneStartRef.current = performance.now()
    particlesRef.current = []
    scene3ImgRef.current.data = null
    if (idx < 4) setTimeout(() => setShowFormula(true), 800)
  }, [])

  // 触摸手势
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x
    if (Math.abs(dx) > 50) {
      autoPlayRef.current = false
      if (dx < 0) goToScene(Math.min(currentSceneRef.current + 1, 4))
      else goToScene(Math.max(currentSceneRef.current - 1, 0))
    }
  }, [goToScene])

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

    const dpr = window.devicePixelRatio || 1
    const getW = () => window.innerWidth
    const getH = () => window.innerHeight

    sceneStartRef.current = performance.now()
    setTimeout(() => setShowFormula(true), 800)

    // 初始化黑色背景
    ctx.save()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = 'rgb(10,5,15)'
    ctx.fillRect(0, 0, getW(), getH())
    ctx.restore()

    function animate(now: number) {
      const w = getW(), h = getH()
      const sceneIdx = currentSceneRef.current
      const elapsed = (now - sceneStartRef.current) / 1000

      ctx!.save()
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      // 拖尾
      ctx!.fillStyle = 'rgba(10,5,15,0.15)'
      ctx!.fillRect(0, 0, w, h)

      drawStars(ctx!, w, h)

      if (sceneIdx < 4) {
        const particles = particlesRef.current
        switch (sceneIdx) {
          case 0: drawScene1(ctx!, w, h, elapsed, particles); break
          case 1: drawScene2(ctx!, w, h, elapsed, particles); break
          case 2: drawScene3(ctx!, w, h, elapsed, scene3ImgRef.current); break
          case 3: drawScene4(ctx!, w, h, elapsed, particles); break
        }
        if (sceneIdx !== 2) updateAndDrawParticles(ctx!, particles)

        // 自动切换
        if (autoPlayRef.current && elapsed >= SCENES[sceneIdx].duration) {
          goToScene(sceneIdx + 1)
        }
      } else {
        // 结尾场景：四心缩小排列
        drawEndingScene(ctx!, w, h, elapsed)
      }

      ctx!.restore()
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [resize, goToScene])

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#0a050f]"
      style={{ height: '100dvh' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-10 text-white/40 hover:text-white/80 transition-colors text-sm flex items-center gap-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        返回
      </button>

      {/* 场景名称和公式 */}
      {currentScene < 4 && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-[18%] text-center transition-all duration-1000 ${
            showFormula ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-pink-200/60 text-xs tracking-widest mb-2">
            {SCENES[currentScene].name}
          </div>
          <div className="text-pink-300/80 text-sm font-mono tracking-wider whitespace-pre-line">
            {SCENES[currentScene].formula}
          </div>
        </div>
      )}

      {/* 场景指示器 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {[0, 1, 2, 3].map(i => (
          <button
            key={i}
            onClick={() => { autoPlayRef.current = false; goToScene(i) }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentScene === i || (currentScene === 4 && i === 3)
                ? 'bg-pink-400 scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* 结尾画面叠加层 */}
      {showEnding && (
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-[25%] z-10">
          <div className="text-pink-200/90 text-xl font-light tracking-[0.3em] mb-2 animate-fade-in">
            数学之美，献给你
          </div>
          <div className="text-pink-400/50 text-xs tracking-wider mb-8">
            Happy Valentine&apos;s Day 2026
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => { autoPlayRef.current = true; goToScene(0) }}
              className="px-4 py-2 rounded-full border border-pink-400/40 text-pink-300/80 text-sm hover:bg-pink-400/10 transition-colors"
            >
              重新播放
            </button>
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={() => navigator.share({ title: '数学表白函数', url: window.location.href })}
                className="px-4 py-2 rounded-full border border-pink-400/40 text-pink-300/80 text-sm hover:bg-pink-400/10 transition-colors"
              >
                分享
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
