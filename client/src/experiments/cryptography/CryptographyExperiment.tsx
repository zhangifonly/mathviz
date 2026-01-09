import { useState, useMemo, useEffect, useCallback } from 'react'
import Plot from 'react-plotly.js'
import MathFormula from '../../components/MathFormula/MathFormula'
import { NarrationPresenter } from '../../components/NarrationPresenter'
import { useNarrationOptional } from '../../contexts/NarrationContext'
import { cryptographyNarration } from '../../narrations/scripts/cryptography'

type CipherType = 'caesar' | 'substitution' | 'rsa' | 'hash'

export default function CryptographyExperiment() {
  const [cipherType, setCipherType] = useState<CipherType>('caesar')
  const [plaintext, setPlaintext] = useState('HELLO')
  const [caesarShift, setCaesarShift] = useState(3)
  const [ciphertext, setCiphertext] = useState('')
  const [showPresenter, setShowPresenter] = useState(false)

  // RSA 参数
  const [rsaP, setRsaP] = useState(61)
  const [rsaQ, setRsaQ] = useState(53)
  const [rsaE, setRsaE] = useState(17)
  const [rsaN, setRsaN] = useState(0)
  const [rsaPhi, setRsaPhi] = useState(0)
  const [rsaD, setRsaD] = useState(0)
  const [rsaMessage, setRsaMessage] = useState(123)
  const [rsaEncrypted, setRsaEncrypted] = useState(0)

  // 讲解系统
  const narration = useNarrationOptional()

  // 加载讲解稿件
  useEffect(() => {
    if (narration) {
      narration.loadScript(cryptographyNarration)
    }
  }, [narration])

  // 开始讲解
  const handleStartNarration = useCallback(() => {
    if (narration) {
      narration.startNarration()
      narration.setPresenterMode(true)
      setShowPresenter(true)
    }
  }, [narration])

  // 退出讲解
  const handleExitPresenter = useCallback(() => {
    if (narration) {
      narration.setPresenterMode(false)
    }
    setShowPresenter(false)
  }, [narration])

  // 凯撒密码加密
  const caesarEncrypt = useCallback((text: string, shift: number): string => {
    return text
      .toUpperCase()
      .split('')
      .map((char) => {
        if (char >= 'A' && char <= 'Z') {
          const code = char.charCodeAt(0) - 65
          const shifted = (code + shift) % 26
          return String.fromCharCode(shifted + 65)
        }
        return char
      })
      .join('')
  }, [])

  // 凯撒密码解密
  const caesarDecrypt = useCallback((text: string, shift: number): string => {
    return caesarEncrypt(text, 26 - shift)
  }, [caesarEncrypt])

  // 简单哈希函数（用于演示）
  const simpleHash = useCallback((text: string): number => {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }, [])

  // 计算最大公约数
  const gcd = useCallback((a: number, b: number): number => {
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }, [])

  // 扩展欧几里得算法求模逆
  const modInverse = useCallback((a: number, m: number): number => {
    if (gcd(a, m) !== 1) return -1

    let m0 = m
    let x0 = 0
    let x1 = 1

    while (a > 1) {
      const q = Math.floor(a / m)
      let t = m

      m = a % m
      a = t
      t = x0

      x0 = x1 - q * x0
      x1 = t
    }

    if (x1 < 0) x1 += m0

    return x1
  }, [gcd])

  // 模幂运算
  const modPow = useCallback((base: number, exp: number, mod: number): number => {
    let result = 1
    base = base % mod
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod
      }
      exp = Math.floor(exp / 2)
      base = (base * base) % mod
    }
    return result
  }, [])

  // 更新密文
  useEffect(() => {
    switch (cipherType) {
      case 'caesar':
        setCiphertext(caesarEncrypt(plaintext, caesarShift))
        break
      case 'substitution':
        // 简单替换密码（固定映射）
        const substitutionMap: Record<string, string> = {
          A: 'Q',
          B: 'W',
          C: 'E',
          D: 'R',
          E: 'T',
          F: 'Y',
          G: 'U',
          H: 'I',
          I: 'O',
          J: 'P',
          K: 'A',
          L: 'S',
          M: 'D',
          N: 'F',
          O: 'G',
          P: 'H',
          Q: 'J',
          R: 'K',
          S: 'L',
          T: 'Z',
          U: 'X',
          V: 'C',
          W: 'V',
          X: 'B',
          Y: 'N',
          Z: 'M',
        }
        setCiphertext(
          plaintext
            .toUpperCase()
            .split('')
            .map((c) => substitutionMap[c] || c)
            .join('')
        )
        break
      case 'hash':
        setCiphertext(simpleHash(plaintext).toString(16).toUpperCase())
        break
      default:
        setCiphertext('')
    }
  }, [cipherType, plaintext, caesarShift, caesarEncrypt, simpleHash])

  // 计算 RSA 参数
  useEffect(() => {
    const n = rsaP * rsaQ
    const phi = (rsaP - 1) * (rsaQ - 1)
    const d = modInverse(rsaE, phi)

    setRsaN(n)
    setRsaPhi(phi)
    setRsaD(d)

    if (d > 0 && rsaMessage < n) {
      const encrypted = modPow(rsaMessage, rsaE, n)
      setRsaEncrypted(encrypted)
    }
  }, [rsaP, rsaQ, rsaE, rsaMessage, modInverse, modPow])

  // 字母频率分析
  const letterFrequency = useMemo(() => {
    const freq: Record<string, number> = {}
    const text = ciphertext.toUpperCase()

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (char >= 'A' && char <= 'Z') {
        freq[char] = (freq[char] || 0) + 1
      }
    }

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }, [ciphertext])

  // 英语字母标准频率（百分比）
  const englishFrequency = useMemo(
    () => [
      ['E', 12.7],
      ['T', 9.1],
      ['A', 8.2],
      ['O', 7.5],
      ['I', 7.0],
      ['N', 6.7],
      ['S', 6.3],
      ['H', 6.1],
      ['R', 6.0],
      ['D', 4.3],
    ],
    []
  )

  // 密码类型信息
  const cipherInfo: Record<
    CipherType,
    { name: string; formula: string; description: string }
  > = {
    caesar: {
      name: '凯撒密码',
      formula: 'C = (P + k) \\bmod 26',
      description: '最简单的替换密码，将每个字母向后移动固定位数',
    },
    substitution: {
      name: '替换密码',
      formula: 'C = \\pi(P)',
      description: '使用固定的字母映射表进行替换',
    },
    rsa: {
      name: 'RSA 加密',
      formula: 'C = M^e \\bmod n',
      description: '基于大整数分解困难性的公钥密码系统',
    },
    hash: {
      name: '哈希函数',
      formula: 'H = hash(M)',
      description: '将任意长度输入映射为固定长度输出的单向函数',
    },
  }

  return (
    <>
      {showPresenter && <NarrationPresenter onExit={handleExitPresenter} />}
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">密码学基础</h1>
            <p className="text-gray-600">探索信息安全的数学原理</p>
          </div>
          <button
            onClick={handleStartNarration}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
          >
            开始讲解
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {cipherType !== 'rsa' && (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold mb-3">加密演示</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        明文
                      </label>
                      <input
                        type="text"
                        value={plaintext}
                        onChange={(e) => setPlaintext(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="输入明文..."
                      />
                    </div>

                    {cipherType === 'caesar' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          位移量: {caesarShift}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="25"
                          value={caesarShift}
                          onChange={(e) => setCaesarShift(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        密文
                      </label>
                      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-lg">
                        {ciphertext || '(空)'}
                      </div>
                    </div>

                    {cipherType === 'caesar' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          解密
                        </label>
                        <div className="w-full px-3 py-2 bg-green-50 border border-green-300 rounded-lg font-mono text-lg">
                          {caesarDecrypt(ciphertext, caesarShift)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {(cipherType === 'caesar' || cipherType === 'substitution') && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <h3 className="text-lg font-semibold mb-3">字母频率分析</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          密文频率
                        </h4>
                        <Plot
                          data={[
                            {
                              x: letterFrequency.map((f) => f[0]),
                              y: letterFrequency.map((f) => f[1]),
                              type: 'bar',
                              marker: { color: '#8b5cf6' },
                            },
                          ]}
                          layout={{
                            autosize: true,
                            height: 250,
                            margin: { t: 20, r: 20, b: 40, l: 40 },
                            xaxis: { title: { text: '字母' } },
                            yaxis: { title: { text: '出现次数' } },
                          }}
                          config={{ responsive: true, displaylogo: false }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          英语标准频率
                        </h4>
                        <Plot
                          data={[
                            {
                              x: englishFrequency.map((f) => f[0]),
                              y: englishFrequency.map((f) => f[1]),
                              type: 'bar',
                              marker: { color: '#10b981' },
                            },
                          ]}
                          layout={{
                            autosize: true,
                            height: 250,
                            margin: { t: 20, r: 20, b: 40, l: 40 },
                            xaxis: { title: { text: '字母' } },
                            yaxis: { title: { text: '频率 (%)' } },
                          }}
                          config={{ responsive: true, displaylogo: false }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {cipherType === 'rsa' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">RSA 加密演示</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        质数 p
                      </label>
                      <input
                        type="number"
                        value={rsaP}
                        onChange={(e) => setRsaP(parseInt(e.target.value) || 61)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        质数 q
                      </label>
                      <input
                        type="number"
                        value={rsaQ}
                        onChange={(e) => setRsaQ(parseInt(e.target.value) || 53)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">n = p × q</span>
                      <span className="font-mono">{rsaN}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">φ(n) = (p-1)(q-1)</span>
                      <span className="font-mono">{rsaPhi}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      公钥指数 e
                    </label>
                    <input
                      type="number"
                      value={rsaE}
                      onChange={(e) => setRsaE(parseInt(e.target.value) || 17)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">私钥指数 d</span>
                      <span className="font-mono">{rsaD > 0 ? rsaD : '无效'}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      d × e ≡ 1 (mod φ(n))
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      明文消息 M (0 &lt; M &lt; n)
                    </label>
                    <input
                      type="number"
                      value={rsaMessage}
                      onChange={(e) => setRsaMessage(parseInt(e.target.value) || 123)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">加密: C = M^e mod n</span>
                      <span className="font-mono">{rsaEncrypted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">解密: M = C^d mod n</span>
                      <span className="font-mono">
                        {rsaD > 0 ? modPow(rsaEncrypted, rsaD, rsaN) : '无效'}
                      </span>
                    </div>
                  </div>

                  {rsaD <= 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      警告: e 和 φ(n) 不互质，无法计算私钥 d
                    </div>
                  )}
                </div>
              </div>
            )}

            {cipherType === 'caesar' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">凯撒密码轮盘</h3>
                <Plot
                  data={[
                    {
                      type: 'scatter',
                      mode: 'text',
                      x: Array.from({ length: 26 }, (_, i) =>
                        Math.cos((i * 2 * Math.PI) / 26)
                      ),
                      y: Array.from({ length: 26 }, (_, i) =>
                        Math.sin((i * 2 * Math.PI) / 26)
                      ),
                      text: Array.from({ length: 26 }, (_, i) =>
                        String.fromCharCode(65 + i)
                      ),
                      textfont: { size: 16, color: '#6366f1' },
                      hoverinfo: 'text',
                    },
                    {
                      type: 'scatter',
                      mode: 'text',
                      x: Array.from({ length: 26 }, (_, i) =>
                        Math.cos((i * 2 * Math.PI) / 26) * 0.6
                      ),
                      y: Array.from({ length: 26 }, (_, i) =>
                        Math.sin((i * 2 * Math.PI) / 26) * 0.6
                      ),
                      text: Array.from({ length: 26 }, (_, i) =>
                        String.fromCharCode(65 + ((i + caesarShift) % 26))
                      ),
                      textfont: { size: 16, color: '#8b5cf6' },
                      hoverinfo: 'text',
                    },
                  ]}
                  layout={{
                    autosize: true,
                    height: 400,
                    showlegend: false,
                    xaxis: { visible: false, range: [-1.5, 1.5] },
                    yaxis: { visible: false, range: [-1.5, 1.5], scaleanchor: 'x' },
                    margin: { t: 20, r: 20, b: 20, l: 20 },
                  }}
                  config={{ responsive: true, displaylogo: false }}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 text-center mt-2">
                  外圈：明文字母 | 内圈：密文字母（位移 {caesarShift}）
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">密码类型</h3>
              <div className="space-y-2">
                {(['caesar', 'substitution', 'rsa', 'hash'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCipherType(type)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      cipherType === type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cipherInfo[type].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">
                {cipherInfo[cipherType].name}
              </h3>
              <div className="p-3 bg-purple-50 rounded-lg mb-2">
                <MathFormula formula={cipherInfo[cipherType].formula} />
              </div>
              <p className="text-sm text-gray-600">
                {cipherInfo[cipherType].description}
              </p>
            </div>

            {cipherType === 'caesar' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">暴力破解</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Array.from({ length: 26 }, (_, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded text-sm ${
                        i === caesarShift
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">位移 {i}:</span>{' '}
                      <span className="font-mono">{caesarDecrypt(ciphertext, i)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cipherType === 'rsa' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-3">密钥信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded">
                    <div className="font-medium mb-1">公钥</div>
                    <div className="font-mono text-xs">
                      (n={rsaN}, e={rsaE})
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <div className="font-medium mb-1">私钥</div>
                    <div className="font-mono text-xs">
                      (n={rsaN}, d={rsaD > 0 ? rsaD : '无效'})
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">安全性分析</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {cipherType === 'caesar' && (
                  <>
                    <p>凯撒密码只有 26 种可能的密钥，极易被暴力破解。</p>
                    <p>频率分析也能快速破解凯撒密码。</p>
                  </>
                )}
                {cipherType === 'substitution' && (
                  <>
                    <p>替换密码有 26! ≈ 4×10^26 种可能的密钥。</p>
                    <p>但仍然容易受到频率分析攻击。</p>
                  </>
                )}
                {cipherType === 'rsa' && (
                  <>
                    <p>RSA 的安全性基于大整数分解的困难性。</p>
                    <p>实际应用中，n 通常是 2048 位或更长的数字。</p>
                    <p>目前没有已知的高效算法能分解如此大的数字。</p>
                  </>
                )}
                {cipherType === 'hash' && (
                  <>
                    <p>哈希函数是单向的，无法从哈希值反推原文。</p>
                    <p>好的哈希函数应该避免碰撞（不同输入产生相同输出）。</p>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold mb-3">实际应用</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {cipherType === 'caesar' && (
                  <p>凯撒密码主要用于教学，展示密码学的基本概念。</p>
                )}
                {cipherType === 'substitution' && (
                  <p>替换密码的变体（如 Enigma 机）曾在二战中使用。</p>
                )}
                {cipherType === 'rsa' && (
                  <>
                    <p>HTTPS 协议使用 RSA 进行密钥交换。</p>
                    <p>数字签名、电子邮件加密（PGP）都使用 RSA。</p>
                  </>
                )}
                {cipherType === 'hash' && (
                  <>
                    <p>密码存储：存储密码的哈希值而非明文。</p>
                    <p>区块链：比特币使用 SHA-256 哈希函数。</p>
                    <p>文件完整性校验：验证下载文件是否被篡改。</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
