/**
 * 密码学场景渲染器
 * 渲染凯撒密码、RSA、哈希函数等密码学算法的可视化动画
 */

import { useEffect, useState, useMemo } from 'react'
import type { SceneRendererProps } from '../SceneRendererFactory'
import MathFormula from '../../../../components/MathFormula/MathFormula'

// 标题场景
function TitleScene({ sceneId }: { sceneId: string }) {
  const titles: Record<string, { title: string; subtitle: string }> = {
    'intro-welcome': { title: '密码学', subtitle: '信息安全的数学基础' },
    'summary-intro': { title: '总结回顾', subtitle: '密码学的核心原理' },
    'summary-end': { title: '感谢观看', subtitle: '探索密码学之美' },
  }
  const { title, subtitle } = titles[sceneId] || { title: '密码学', subtitle: '' }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
      <p className="text-xl md:text-2xl text-white/70">{subtitle}</p>
    </div>
  )
}

// 凯撒密码场景
function CaesarCipherScene({ animate = true }: { animate?: boolean }) {
  const [shift, setShift] = useState(3)
  const [currentIndex, setCurrentIndex] = useState(0)
  const plaintext = 'HELLO'
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const encrypt = (text: string, shift: number): string => {
    return text
      .split('')
      .map(char => {
        const index = alphabet.indexOf(char)
        if (index === -1) return char
        return alphabet[(index + shift) % 26]
      })
      .join('')
  }

  const ciphertext = encrypt(plaintext, shift)

  useEffect(() => {
    if (!animate) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % plaintext.length)
      if (currentIndex === plaintext.length - 1) {
        setShift(prev => (prev % 25) + 1)
      }
    }, 800)

    return () => clearInterval(timer)
  }, [animate, currentIndex, plaintext.length])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-4">
      <h3 className="text-white text-2xl font-bold">凯撒密码 (位移 {shift})</h3>

      {/* 字母表圆盘 */}
      <div className="relative w-80 h-80">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* 外圈 - 明文 */}
          {alphabet.split('').map((char, i) => {
            const angle = (i / 26) * Math.PI * 2 - Math.PI / 2
            const x = 100 + 80 * Math.cos(angle)
            const y = 100 + 80 * Math.sin(angle)
            return (
              <text
                key={`outer-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-green-400 text-sm font-bold"
              >
                {char}
              </text>
            )
          })}

          {/* 内圈 - 密文 */}
          {alphabet.split('').map((_, i) => {
            const angle = (i / 26) * Math.PI * 2 - Math.PI / 2
            const x = 100 + 50 * Math.cos(angle)
            const y = 100 + 50 * Math.sin(angle)
            const shiftedChar = alphabet[(i + shift) % 26]
            return (
              <text
                key={`inner-${i}`}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-orange-400 text-sm font-bold"
              >
                {shiftedChar}
              </text>
            )
          })}

          {/* 中心圆 */}
          <circle cx="100" cy="100" r="30" className="fill-white/10" />
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white text-lg font-bold"
          >
            +{shift}
          </text>
        </svg>
      </div>

      {/* 加密演示 */}
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2">
          <span className="text-white/60">明文:</span>
          <div className="flex gap-1">
            {plaintext.split('').map((char, i) => (
              <span
                key={i}
                className={`text-2xl font-mono px-2 py-1 rounded ${
                  i === currentIndex ? 'bg-green-500 text-black' : 'text-green-400'
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        <div className="text-white text-2xl">↓</div>

        <div className="flex gap-2">
          <span className="text-white/60">密文:</span>
          <div className="flex gap-1">
            {ciphertext.split('').map((char, i) => (
              <span
                key={i}
                className={`text-2xl font-mono px-2 py-1 rounded ${
                  i === currentIndex ? 'bg-orange-500 text-black' : 'text-orange-400'
                }`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// RSA 加密场景
function RSAScene({ animate = true }: { animate?: boolean }) {
  const [step, setStep] = useState(0)

  // 简单的 RSA 示例 (小数字)
  const p = 61
  const q = 53
  const n = p * q // 3233
  const phi = (p - 1) * (q - 1) // 3120
  const e = 17 // 公钥指数
  const d = 2753 // 私钥指数 (满足 e*d ≡ 1 mod phi)

  const message = 123
  const encrypted = Math.pow(message, e) % n
  const decrypted = Math.pow(encrypted, d) % n

  const steps = [
    { title: '1. 选择两个质数', content: `p = ${p}, q = ${q}` },
    { title: '2. 计算 n 和 φ(n)', content: `n = p × q = ${n}\nφ(n) = (p-1)(q-1) = ${phi}` },
    { title: '3. 选择公钥 e', content: `e = ${e} (与 φ(n) 互质)` },
    { title: '4. 计算私钥 d', content: `d = ${d} (满足 e×d ≡ 1 mod φ(n))` },
    { title: '5. 加密', content: `明文 m = ${message}\n密文 c = m^e mod n = ${encrypted}` },
    { title: '6. 解密', content: `密文 c = ${encrypted}\n明文 m = c^d mod n = ${decrypted}` },
  ]

  useEffect(() => {
    if (!animate) return

    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [animate, steps.length])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-4">
      <h3 className="text-white text-2xl font-bold">RSA 加密算法</h3>

      {/* 流程图 */}
      <div className="flex items-center gap-4">
        <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-4 min-w-[120px]">
          <div className="text-green-400 font-bold text-center">明文</div>
          <div className="text-white text-2xl text-center mt-2">{message}</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-white text-sm">公钥 (e, n)</div>
          <div className="text-2xl text-white">→</div>
          <div className="text-white/60 text-xs">m^e mod n</div>
        </div>

        <div className="bg-orange-500/20 border-2 border-orange-500 rounded-lg p-4 min-w-[120px]">
          <div className="text-orange-400 font-bold text-center">密文</div>
          <div className="text-white text-2xl text-center mt-2">{encrypted}</div>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-white text-sm">私钥 (d, n)</div>
          <div className="text-2xl text-white">→</div>
          <div className="text-white/60 text-xs">c^d mod n</div>
        </div>

        <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-4 min-w-[120px]">
          <div className="text-blue-400 font-bold text-center">解密</div>
          <div className="text-white text-2xl text-center mt-2">{decrypted}</div>
        </div>
      </div>

      {/* 步骤说明 */}
      <div className="bg-white/10 rounded-lg p-6 max-w-2xl">
        <h4 className="text-white font-bold text-lg mb-2">{steps[step].title}</h4>
        <pre className="text-white/80 whitespace-pre-wrap">{steps[step].content}</pre>
      </div>

      {/* 进度指示器 */}
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === step ? 'bg-purple-500' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// 哈希函数场景
function HashFunctionScene({ animate = true }: { animate?: boolean }) {
  const [input, setInput] = useState('Hello')
  const [animating, setAnimating] = useState(false)

  // 简单的哈希函数模拟 (非真实的加密哈希)
  const simpleHash = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0').toUpperCase()
  }

  const inputs = useMemo(() => ['Hello', 'hello', 'Hello!', 'World', 'Hello World'], [])

  useEffect(() => {
    if (!animate) return

    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setInput(prev => {
          const currentIndex = inputs.indexOf(prev)
          return inputs[(currentIndex + 1) % inputs.length]
        })
        setAnimating(false)
      }, 300)
    }, 2500)

    return () => clearInterval(timer)
  }, [animate, inputs])

  const hash = simpleHash(input)

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 p-4">
      <h3 className="text-white text-2xl font-bold">哈希函数</h3>

      {/* 哈希过程可视化 */}
      <div className="flex flex-col items-center gap-6">
        {/* 输入 */}
        <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 min-w-[300px]">
          <div className="text-green-400 font-bold text-center mb-2">输入</div>
          <div className="text-white text-3xl text-center font-mono">{input}</div>
        </div>

        {/* 哈希函数 */}
        <div className={`transition-all duration-300 ${animating ? 'scale-110' : 'scale-100'}`}>
          <div className="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-4">
            <div className="text-purple-400 font-bold text-center">Hash Function</div>
            <div className="text-white/60 text-sm text-center mt-1">SHA-256 (模拟)</div>
          </div>
        </div>

        {/* 输出 */}
        <div className="bg-orange-500/20 border-2 border-orange-500 rounded-lg p-6 min-w-[300px]">
          <div className="text-orange-400 font-bold text-center mb-2">哈希值</div>
          <div className="text-white text-2xl text-center font-mono">{hash}</div>
        </div>
      </div>

      {/* 特性说明 */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-white font-bold mb-2">✓ 确定性</div>
          <div className="text-white/60 text-sm">相同输入总是产生相同输出</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-white font-bold mb-2">✓ 雪崩效应</div>
          <div className="text-white/60 text-sm">微小改变导致完全不同的哈希</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-white font-bold mb-2">✓ 单向性</div>
          <div className="text-white/60 text-sm">无法从哈希值反推原文</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4">
          <div className="text-white font-bold mb-2">✓ 抗碰撞</div>
          <div className="text-white/60 text-sm">难以找到两个相同哈希的输入</div>
        </div>
      </div>
    </div>
  )
}

// 公式场景
function FormulaScene({ formulaType }: { formulaType: string }) {
  const formulas: Record<string, { formula: string; description: string }> = {
    'caesar': {
      formula: 'E_n(x) = (x + n) \\bmod 26',
      description: '凯撒密码加密公式，n 为位移量',
    },
    'rsa-encrypt': {
      formula: 'c = m^e \\bmod n',
      description: 'RSA 加密：用公钥 (e, n) 加密明文 m',
    },
    'rsa-decrypt': {
      formula: 'm = c^d \\bmod n',
      description: 'RSA 解密：用私钥 (d, n) 解密密文 c',
    },
    'rsa-key': {
      formula: 'e \\cdot d \\equiv 1 \\pmod{\\phi(n)}, \\quad \\phi(n) = (p-1)(q-1)',
      description: 'RSA 密钥关系：e 和 d 互为模 φ(n) 的逆元',
    },
    'hash': {
      formula: 'h = H(m), \\quad H: \\{0,1\\}^* \\to \\{0,1\\}^n',
      description: '哈希函数：将任意长度消息映射到固定长度',
    },
    'modular': {
      formula: 'a \\equiv b \\pmod{n} \\iff n \\mid (a - b)',
      description: '模运算：密码学的基础数学工具',
    },
  }

  const { formula, description } = formulas[formulaType] || formulas['caesar']

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
    'app-internet': {
      title: '互联网安全',
      items: ['HTTPS/TLS', '数字签名', 'SSH 密钥', 'VPN 加密'],
      icon: '🔒',
    },
    'app-blockchain': {
      title: '区块链',
      items: ['比特币', '以太坊', '数字货币', '智能合约'],
      icon: '⛓️',
    },
    'app-password': {
      title: '密码存储',
      items: ['密码哈希', '加盐处理', '双因素认证', '生物识别'],
      icon: '🔑',
    },
  }

  const app = apps[sceneId] || apps['app-internet']

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="text-6xl">{app.icon}</div>
      <h2 className="text-3xl font-bold text-white">{app.title}</h2>
      <ul className="space-y-2 text-white/80 text-lg">
        {app.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 主渲染器
export default function CryptographySceneRenderer({ scene }: SceneRendererProps) {
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
    if (sceneConfig.id.includes('caesar')) {
      return <FormulaScene formulaType="caesar" />
    }
    if (sceneConfig.id.includes('rsa-encrypt')) {
      return <FormulaScene formulaType="rsa-encrypt" />
    }
    if (sceneConfig.id.includes('rsa-decrypt')) {
      return <FormulaScene formulaType="rsa-decrypt" />
    }
    if (sceneConfig.id.includes('rsa-key') || sceneConfig.id.includes('rsa') && sceneConfig.id.includes('key')) {
      return <FormulaScene formulaType="rsa-key" />
    }
    if (sceneConfig.id.includes('hash')) {
      return <FormulaScene formulaType="hash" />
    }
    if (sceneConfig.id.includes('modular')) {
      return <FormulaScene formulaType="modular" />
    }
    return <FormulaScene formulaType="caesar" />
  }

  // 根据 section 决定显示什么
  switch (sectionId) {
    case 'intro':
    case 'caesar':
    case 'substitution':
      return <CaesarCipherScene animate />

    case 'rsa':
    case 'public-key':
      return <RSAScene animate />

    case 'hash':
    case 'hash-function':
      return <HashFunctionScene animate />

    case 'applications':
      return <ApplicationScene sceneId={sceneConfig.id} />

    case 'summary':
      if (sceneConfig.id.includes('caesar')) {
        return <CaesarCipherScene animate />
      }
      if (sceneConfig.id.includes('rsa')) {
        return <RSAScene animate />
      }
      if (sceneConfig.id.includes('hash')) {
        return <HashFunctionScene animate />
      }
      return <CaesarCipherScene animate />

    default:
      return <CaesarCipherScene animate />
  }
}
