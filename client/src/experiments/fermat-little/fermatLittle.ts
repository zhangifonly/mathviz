/**
 * 费马小定理核心算法（纯函数，便于测试）
 *
 * 费马小定理：若 p 是素数且 a 不被 p 整除，则 a^(p-1) ≡ 1 (mod p)。
 * 等价地对任意整数 a 有 a^p ≡ a (mod p)。
 * 这里用快速幂计算模幂，并据此实现费马素性测试，
 * 再展示卡迈克尔数这类能骗过测试的伪素数。
 */

/** 快速幂：计算 (a^e) mod m，时间 O(log e)，避免大数溢出 */
export function powMod(a: number, e: number, m: number): number {
  if (m === 1) return 0
  let result = 1
  let base = a % m
  if (base < 0) base += m
  let exp = e
  while (exp > 0) {
    if (exp & 1) result = (result * base) % m
    base = (base * base) % m
    exp = Math.floor(exp / 2)
  }
  return result
}

/** 朴素素性判定，用于对照与生成测试用例 */
export function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n % 2 === 0) return n === 2
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) return false
  }
  return true
}

/** 最大公约数，用于判断底数与模数是否互素 */
export function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    ;[x, y] = [y, x % y]
  }
  return x
}

/** 验证费马小定理：p 素数且 gcd(a,p)=1 时应恒为 true，返回 a^(p-1) mod p 是否为 1 */
export function verifyFermat(a: number, p: number): boolean {
  if (gcd(a, p) !== 1) return false
  return powMod(a, p - 1, p) === 1
}

/** 费马素性测试：以底数 a 检测 n，通过（返回 true）表示 n 可能是素数 */
export function fermatTest(n: number, a: number): boolean {
  if (n < 2) return false
  if (gcd(a, n) !== 1) return false
  return powMod(a, n - 1, n) === 1
}

/** 幂表：返回 a^k mod p，k=0..p-1，用于观察乘法的周期循环 */
export function powModTable(a: number, p: number): number[] {
  const row: number[] = []
  for (let k = 0; k < p; k++) row.push(powMod(a, k, p))
  return row
}

/** 乘法阶：最小正整数 d 使 a^d ≡ 1 (mod m)，不存在返回 0 */
export function multiplicativeOrder(a: number, m: number): number {
  if (gcd(a, m) !== 1) return 0
  let cur = 1 % m
  for (let d = 1; d <= m; d++) {
    cur = (cur * a) % m
    if (cur === 1) return d
  }
  return 0
}

/** 可选的素数样本（用于交互切换模数 p） */
export const SAMPLES = [5, 7, 11, 13]

/** 已知的卡迈克尔数（合数却对所有互素底数通过费马测试的伪素数） */
export const CARMICHAEL = [561, 1105, 1729]
