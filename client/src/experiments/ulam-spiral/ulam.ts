/**
 * 素数螺旋（乌拉姆螺旋）核心算法（纯函数，便于测试）
 *
 * 把自然数 1,2,3... 按正方形螺旋填入网格，标出素数，
 * 素数会神秘地聚集在某些对角线上。
 */

export interface Cell {
  n: number
  x: number // 网格坐标（中心为 0）
  y: number
  prime: boolean
}

/** 埃拉托斯特尼筛法：返回 [0,limit] 的素数布尔表 */
export function sieve(limit: number): boolean[] {
  const isPrime = new Array(limit + 1).fill(true)
  isPrime[0] = false
  if (limit >= 1) isPrime[1] = false
  for (let i = 2; i * i <= limit; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= limit; j += i) isPrime[j] = false
    }
  }
  return isPrime
}

/** 单个数的素性判定 */
export function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n % 2 === 0) return n === 2
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false
  return true
}

/**
 * 生成乌拉姆螺旋：从中心 1 开始，向右、上、左、下逐圈展开。
 * @param count 填入的数字个数
 */
export function ulamSpiral(count: number): Cell[] {
  const primes = sieve(count)
  const cells: Cell[] = []
  let x = 0
  let y = 0
  let dx = 1
  let dy = 0
  let stepLen = 1
  let stepsDone = 0
  let legCount = 0
  for (let n = 1; n <= count; n++) {
    cells.push({ n, x, y, prime: primes[n] ?? false })
    x += dx
    y += dy
    stepsDone++
    if (stepsDone === stepLen) {
      stepsDone = 0
      // 左转：(dx,dy) → (-dy,dx)
      ;[dx, dy] = [-dy, dx]
      legCount++
      // 每走两条边，步长 +1
      if (legCount % 2 === 0) stepLen++
    }
  }
  return cells
}

/** 统计素数个数 */
export function countPrimes(cells: Cell[]): number {
  return cells.filter((c) => c.prime).length
}
