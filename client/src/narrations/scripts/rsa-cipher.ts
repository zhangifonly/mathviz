import type { NarrationScript } from '../types'

/**
 * RSA 加密 - 口播稿件
 * 核心概念：公钥密码、模幂运算、大数分解难题
 * 目标受众：高中及以上
 */
export const rsaCipherNarration: NarrationScript = {
  id: 'rsa-cipher',
  title: 'RSA加密',
  subtitle: '公钥密码与大数分解',
  difficulty: 'advanced',
  targetAge: '高中以上',
  voice: 'yunxi',

  meta: {
    author: 'MathViz Team',
    version: '1.0.0',
    createdAt: '2026-07-18',
    updatedAt: '2026-07-18',
  },

  objectives: [
    '理解公钥与私钥分离的加密思想',
    '掌握 RSA 密钥的生成步骤',
    '认识模幂运算如何完成加解密',
    '了解大数分解难题带来的安全性',
  ],

  prerequisites: ['了解素数与因数', '了解取余运算'],

  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '公钥的魔法',
      trigger: { type: 'auto', delay: 1000 },
      lines: [
        { id: 'intro-1', text: '设想你想收到秘密信件，却又不想事先和别人交换钥匙。' },
        { id: 'intro-2', text: 'RSA 给出了神奇的答案：把锁公开挂出去，钥匙牢牢握在自己手里。' },
        { id: 'intro-3', text: '任何人都能用这把公开的锁把消息锁上，却只有你能打开。' },
      ],
    },
    {
      id: 'keygen',
      type: 'concept',
      title: '选素数生成密钥',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'key-1', text: '先挑两个素数 p 和 q，把它们相乘得到模数 n。' },
        { id: 'key-2', text: '再算出欧拉函数 φ，等于 p 减一乘以 q 减一。' },
        { id: 'key-3', text: '选一个与 φ 互质的数 e 做公钥，它的模逆 d 就是私钥。' },
      ],
    },
    {
      id: 'encrypt',
      type: 'concept',
      title: '加密：用公钥 e',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'enc-1', text: '把消息写成一个数字 m，用公钥做加密。' },
        { id: 'enc-2', text: '计算 m 的 e 次方再对 n 取余，得到密文 c。' },
        { id: 'enc-3', text: '这一步谁都能算，因为公钥 e 和模数 n 是公开的。' },
      ],
    },
    {
      id: 'decrypt',
      type: 'concept',
      title: '解密：用私钥 d',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'dec-1', text: '收到密文后，用私钥 d 把它还原。' },
        { id: 'dec-2', text: '计算 c 的 d 次方再对 n 取余，奇妙地又回到原来的 m。' },
        { id: 'dec-3', text: '想从公钥反推私钥，就得分解出 n 的两个素因子，这极其困难。' },
      ],
    },
    {
      id: 'interaction',
      type: 'interaction',
      title: '亲手加解密',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'int-1', text: '换一对素数，看密钥和模数如何随之改变。' },
        { id: 'int-2', text: '拖动滑块输入不同的数字消息，观察密文和还原结果。' },
      ],
    },
    {
      id: 'summary',
      type: 'summary',
      title: '总结',
      trigger: { type: 'auto', delay: 800 },
      lines: [
        { id: 'sum-1', text: 'RSA 用一对素数造出公钥和私钥，公开加密，私密解密。' },
        { id: 'sum-2', text: '它的安全来自大数分解的困难，守护着今天的互联网。' },
        { id: 'sum-3', text: '一个简单的数论定理撑起了整个数字世界，我们下次再见！' },
      ],
    },
  ],
}
