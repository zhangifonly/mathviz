/**
 * 密码学基础讲解场景配置
 */

import type { NarrationLineScene, SceneState } from './types'

export const defaultCryptographyState: SceneState = {
  waveType: 'sine',
  frequency: 1,
  amplitude: 1,
  terms: 1,
  isAnimating: false,
  highlightedElements: [],
}

export const cryptographyScenes: NarrationLineScene[] = [
  // ========== intro 段落 (4行) ==========
  {
    lineId: 'intro-1',
    sectionId: 'intro',
    scene: { id: 'intro-welcome', type: 'title' },
    lineState: { show: { diagram: false } },
  },
  {
    lineId: 'intro-2',
    sectionId: 'intro',
    scene: { id: 'intro-history', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '密码学历史', position: 'top' },
    },
  },
  {
    lineId: 'intro-3',
    sectionId: 'intro',
    scene: { id: 'intro-digital', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数字时代的密码学', position: 'bottom' },
    },
  },
  {
    lineId: 'intro-4',
    sectionId: 'intro',
    scene: { id: 'intro-explore', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '探索数学原理', position: 'bottom' },
    },
  },

  // ========== history 段落 (4行) ==========
  {
    lineId: 'history-1',
    sectionId: 'history',
    scene: { id: 'history-ancient', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '古代密码', position: 'top' },
    },
  },
  {
    lineId: 'history-2',
    sectionId: 'history',
    scene: { id: 'history-classical', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '古典密码学', position: 'bottom' },
    },
  },
  {
    lineId: 'history-3',
    sectionId: 'history',
    scene: { id: 'history-modern', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '现代密码学', position: 'bottom' },
    },
  },
  {
    lineId: 'history-4',
    sectionId: 'history',
    scene: { id: 'history-math', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数学基础', position: 'bottom' },
    },
  },

  // ========== caesar-cipher 段落 (6行) ==========
  {
    lineId: 'caesar-1',
    sectionId: 'caesar-cipher',
    scene: { id: 'caesar-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '凯撒密码', position: 'top' },
    },
  },
  {
    lineId: 'caesar-2',
    sectionId: 'caesar-cipher',
    scene: { id: 'caesar-method', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '加密方法', position: 'bottom' },
    },
  },
  {
    lineId: 'caesar-3',
    sectionId: 'caesar-cipher',
    scene: { id: 'caesar-encrypt', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '加密公式', position: 'bottom' },
    },
  },
  {
    lineId: 'caesar-4',
    sectionId: 'caesar-cipher',
    scene: { id: 'caesar-decrypt', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '解密公式', position: 'bottom' },
    },
  },
  {
    lineId: 'caesar-5',
    sectionId: 'caesar-cipher',
    scene: { id: 'caesar-key', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '密钥概念', position: 'bottom' },
    },
  },
  {
    lineId: 'caesar-6',
    sectionId: 'caesar-cipher',
    scene: { id: 'caesar-weakness', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '暴力破解', position: 'bottom' },
    },
  },

  // ========== frequency-analysis 段落 (4行) ==========
  {
    lineId: 'frequency-1',
    sectionId: 'frequency-analysis',
    scene: { id: 'freq-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '频率分析', position: 'top' },
    },
  },
  {
    lineId: 'frequency-2',
    sectionId: 'frequency-analysis',
    scene: { id: 'freq-distribution', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '字母频率分布', position: 'bottom' },
    },
  },
  {
    lineId: 'frequency-3',
    sectionId: 'frequency-analysis',
    scene: { id: 'freq-attack', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '统计攻击', position: 'bottom' },
    },
  },
  {
    lineId: 'frequency-4',
    sectionId: 'frequency-analysis',
    scene: { id: 'freq-limitation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '替换密码的局限', position: 'bottom' },
    },
  },

  // ========== modular-arithmetic 段落 (5行) ==========
  {
    lineId: 'modular-1',
    sectionId: 'modular-arithmetic',
    scene: { id: 'mod-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '模运算', position: 'top' },
    },
  },
  {
    lineId: 'modular-2',
    sectionId: 'modular-arithmetic',
    scene: { id: 'mod-definition', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '模运算定义', position: 'bottom' },
    },
  },
  {
    lineId: 'modular-3',
    sectionId: 'modular-arithmetic',
    scene: { id: 'mod-properties', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '模运算性质', position: 'bottom' },
    },
  },
  {
    lineId: 'modular-4',
    sectionId: 'modular-arithmetic',
    scene: { id: 'mod-inverse', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '模逆元', position: 'bottom' },
    },
  },
  {
    lineId: 'modular-5',
    sectionId: 'modular-arithmetic',
    scene: { id: 'mod-coprime', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '互质条件', position: 'bottom' },
    },
  },

  // ========== rsa-basics 段落 (9行) ==========
  {
    lineId: 'rsa-1',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'RSA加密', position: 'top' },
    },
  },
  {
    lineId: 'rsa-2',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-security', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '大整数分解', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-3',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-n', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '计算 n', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-4',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-phi', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '欧拉函数', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-5',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-e', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '公钥指数 e', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-6',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-d', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '私钥指数 d', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-7',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-encrypt', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '加密过程', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-8',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-decrypt', type: 'formula' },
    lineState: {
      show: { diagram: true, formula: true },
      annotation: { text: '解密过程', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-9',
    sectionId: 'rsa-basics',
    scene: { id: 'rsa-clever', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'RSA的巧妙之处', position: 'bottom' },
    },
  },

  // ========== rsa-example 段落 (8行) ==========
  {
    lineId: 'rsa-example-1',
    sectionId: 'rsa-example',
    scene: { id: 'example-primes', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '选择质数', position: 'top' },
    },
  },
  {
    lineId: 'rsa-example-2',
    sectionId: 'rsa-example',
    scene: { id: 'example-n', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算 n', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-example-3',
    sectionId: 'rsa-example',
    scene: { id: 'example-phi', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算 φ(n)', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-example-4',
    sectionId: 'rsa-example',
    scene: { id: 'example-e', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '选择 e', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-example-5',
    sectionId: 'rsa-example',
    scene: { id: 'example-d', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '计算 d', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-example-6',
    sectionId: 'rsa-example',
    scene: { id: 'example-keys', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '公钥与私钥', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-example-7',
    sectionId: 'rsa-example',
    scene: { id: 'example-encrypt', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '加密示例', position: 'bottom' },
    },
  },
  {
    lineId: 'rsa-example-8',
    sectionId: 'rsa-example',
    scene: { id: 'example-decrypt', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '解密验证', position: 'bottom' },
    },
  },

  // ========== hash-functions 段落 (6行) ==========
  {
    lineId: 'hash-1',
    sectionId: 'hash-functions',
    scene: { id: 'hash-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '哈希函数', position: 'top' },
    },
  },
  {
    lineId: 'hash-2',
    sectionId: 'hash-functions',
    scene: { id: 'hash-properties', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '三大性质', position: 'bottom' },
    },
  },
  {
    lineId: 'hash-3',
    sectionId: 'hash-functions',
    scene: { id: 'hash-oneway', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '单向性', position: 'bottom' },
    },
  },
  {
    lineId: 'hash-4',
    sectionId: 'hash-functions',
    scene: { id: 'hash-collision', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '抗碰撞性', position: 'bottom' },
    },
  },
  {
    lineId: 'hash-5',
    sectionId: 'hash-functions',
    scene: { id: 'hash-avalanche', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '雪崩效应', position: 'bottom' },
    },
  },
  {
    lineId: 'hash-6',
    sectionId: 'hash-functions',
    scene: { id: 'hash-algorithms', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '常见算法', position: 'bottom' },
    },
  },

  // ========== hash-applications 段落 (5行) ==========
  {
    lineId: 'hash-app-1',
    sectionId: 'hash-applications',
    scene: { id: 'hash-app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '哈希应用', position: 'top' },
    },
  },
  {
    lineId: 'hash-app-2',
    sectionId: 'hash-applications',
    scene: { id: 'hash-app-password', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '密码存储', position: 'bottom' },
    },
  },
  {
    lineId: 'hash-app-3',
    sectionId: 'hash-applications',
    scene: { id: 'hash-app-signature', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数字签名', position: 'bottom' },
    },
  },
  {
    lineId: 'hash-app-4',
    sectionId: 'hash-applications',
    scene: { id: 'hash-app-integrity', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '完整性校验', position: 'bottom' },
    },
  },
  {
    lineId: 'hash-app-5',
    sectionId: 'hash-applications',
    scene: { id: 'hash-app-blockchain', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '区块链', position: 'bottom' },
    },
  },

  // ========== symmetric-vs-asymmetric 段落 (6行) ==========
  {
    lineId: 'symmetric-1',
    sectionId: 'symmetric-vs-asymmetric',
    scene: { id: 'sym-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '对称与非对称', position: 'top' },
    },
  },
  {
    lineId: 'symmetric-2',
    sectionId: 'symmetric-vs-asymmetric',
    scene: { id: 'sym-symmetric', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '对称加密', position: 'bottom' },
    },
  },
  {
    lineId: 'symmetric-3',
    sectionId: 'symmetric-vs-asymmetric',
    scene: { id: 'sym-pros-cons', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '优缺点', position: 'bottom' },
    },
  },
  {
    lineId: 'symmetric-4',
    sectionId: 'symmetric-vs-asymmetric',
    scene: { id: 'sym-asymmetric', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '非对称加密', position: 'bottom' },
    },
  },
  {
    lineId: 'symmetric-5',
    sectionId: 'symmetric-vs-asymmetric',
    scene: { id: 'sym-key-exchange', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '密钥分发问题', position: 'bottom' },
    },
  },
  {
    lineId: 'symmetric-6',
    sectionId: 'symmetric-vs-asymmetric',
    scene: { id: 'sym-hybrid', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '混合加密', position: 'bottom' },
    },
  },

  // ========== applications 段落 (6行) ==========
  {
    lineId: 'applications-1',
    sectionId: 'applications',
    scene: { id: 'app-intro', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '密码学应用', position: 'top' },
    },
  },
  {
    lineId: 'applications-2',
    sectionId: 'applications',
    scene: { id: 'app-https', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'HTTPS协议', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-3',
    sectionId: 'applications',
    scene: { id: 'app-payment', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '电子支付', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-4',
    sectionId: 'applications',
    scene: { id: 'app-messaging', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '即时通讯', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-5',
    sectionId: 'applications',
    scene: { id: 'app-crypto', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数字货币', position: 'bottom' },
    },
  },
  {
    lineId: 'applications-6',
    sectionId: 'applications',
    scene: { id: 'app-others', type: 'application' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '其他应用', position: 'bottom' },
    },
  },

  // ========== quantum-threat 段落 (4行) ==========
  {
    lineId: 'quantum-1',
    sectionId: 'quantum-threat',
    scene: { id: 'quantum-intro', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '量子计算威胁', position: 'top' },
    },
  },
  {
    lineId: 'quantum-2',
    sectionId: 'quantum-threat',
    scene: { id: 'quantum-shor', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: 'Shor算法', position: 'bottom' },
    },
  },
  {
    lineId: 'quantum-3',
    sectionId: 'quantum-threat',
    scene: { id: 'quantum-post', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '后量子密码学', position: 'bottom' },
    },
  },
  {
    lineId: 'quantum-4',
    sectionId: 'quantum-threat',
    scene: { id: 'quantum-research', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '研究方向', position: 'bottom' },
    },
  },

  // ========== summary 段落 (5行) ==========
  {
    lineId: 'summary-1',
    sectionId: 'summary',
    scene: { id: 'summary-intro', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '总结回顾', position: 'top' },
    },
  },
  {
    lineId: 'summary-2',
    sectionId: 'summary',
    scene: { id: 'summary-foundation', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '信息安全基石', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-3',
    sectionId: 'summary',
    scene: { id: 'summary-evolution', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '发展历程', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-4',
    sectionId: 'summary',
    scene: { id: 'summary-math', type: 'animation' },
    lineState: {
      show: { diagram: true },
      annotation: { text: '数学基础', position: 'bottom' },
    },
  },
  {
    lineId: 'summary-5',
    sectionId: 'summary',
    scene: { id: 'summary-end', type: 'title' },
    lineState: {
      show: { diagram: false },
      annotation: { text: '感谢观看!', position: 'bottom' },
    },
  },
]
