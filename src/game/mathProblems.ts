import type { Difficulty } from './types'

export interface MathProblem {
  question: string
  answer: number
}

function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function makeAdd(a: number, b: number): MathProblem {
  return { question: `${a} + ${b} = ?`, answer: a + b }
}

function makeSub(a: number, b: number): MathProblem {
  return { question: `${a} − ${b} = ?`, answer: a - b }
}

function makeMul(a: number, b: number): MathProblem {
  return { question: `${a} × ${b} = ?`, answer: a * b }
}

function makeDiv(dividend: number, divisor: number): MathProblem {
  return { question: `${dividend} ÷ ${divisor} = ?`, answer: dividend / divisor }
}

/** Grade 2–4: addition, subtraction, basic multiplication and division */
function generateEasy(): MathProblem {
  const kind = pick(['add', 'add', 'sub', 'sub', 'mul', 'div'] as const)

  if (kind === 'add') {
    return makeAdd(randInt(5, 99), randInt(5, 99))
  }
  if (kind === 'sub') {
    const a = randInt(10, 99)
    return makeSub(a, randInt(1, a - 1))
  }
  if (kind === 'mul') {
    return makeMul(randInt(2, 10), randInt(2, 10))
  }

  const divisor = randInt(2, 10)
  const quotient = randInt(2, 10)
  return makeDiv(divisor * quotient, divisor)
}

/** Grade 4–6: larger numbers, order of operations, simple percentages */
function generateMedium(): MathProblem {
  const kind = pick([
    'add',
    'sub',
    'mul',
    'div',
    'mul2',
    'order',
    'percent',
    'half',
  ] as const)

  if (kind === 'add') {
    return makeAdd(randInt(50, 999), randInt(50, 999))
  }
  if (kind === 'sub') {
    const a = randInt(100, 999)
    return makeSub(a, randInt(10, a - 1))
  }
  if (kind === 'mul') {
    return makeMul(randInt(2, 12), randInt(2, 12))
  }
  if (kind === 'mul2') {
    const b = randInt(2, 9)
    return makeMul(randInt(12, 99), b)
  }
  if (kind === 'div') {
    const divisor = randInt(2, 12)
    const quotient = randInt(3, 25)
    return makeDiv(divisor * quotient, divisor)
  }
  if (kind === 'order') {
    const b = randInt(2, 9)
    const c = randInt(2, 9)
    const a = randInt(2, 20)
    return { question: `${a} + ${b} × ${c} = ?`, answer: a + b * c }
  }
  if (kind === 'percent') {
    const pct = pick([10, 20, 25, 50])
    const base = randInt(2, 20) * (100 / pct)
    return { question: `כמה זה ${pct}% מתוך ${base}?`, answer: (base * pct) / 100 }
  }

  const n = randInt(2, 50) * 2
  return { question: `מהו חצי מ-${n}?`, answer: n / 2 }
}

/** Grade 6–8: algebra, powers, roots, harder percentages, negatives */
function generateHard(): MathProblem {
  const kind = pick([
    'mul',
    'div',
    'order',
    'percent',
    'algebra',
    'power',
    'sqrt',
    'neg',
    'fraction',
  ] as const)

  if (kind === 'mul') {
    return makeMul(randInt(11, 25), randInt(11, 25))
  }
  if (kind === 'div') {
    const divisor = randInt(3, 15)
    const quotient = randInt(5, 30)
    return makeDiv(divisor * quotient, divisor)
  }
  if (kind === 'order') {
    const b = randInt(3, 12)
    const c = randInt(3, 12)
    const a = randInt(5, 40)
    return { question: `${a} + ${b} × ${c} = ?`, answer: a + b * c }
  }
  if (kind === 'percent') {
    const pct = pick([15, 20, 30, 35, 40, 75])
    const multiplier = randInt(2, 12)
    const base = multiplier * (100 / gcd(pct, 100))
    return { question: `כמה זה ${pct}% מתוך ${base}?`, answer: (base * pct) / 100 }
  }
  if (kind === 'algebra') {
    const form = pick(['add', 'sub', 'mul'] as const)
    if (form === 'add') {
      const x = randInt(5, 40)
      const a = randInt(3, 25)
      return { question: `אם x + ${a} = ${x + a}, מהו x?`, answer: x }
    }
    if (form === 'sub') {
      const x = randInt(10, 50)
      const a = randInt(3, x - 1)
      return { question: `אם x − ${a} = ${x - a}, מהו x?`, answer: x }
    }
    const x = randInt(3, 12)
    const a = randInt(3, 9)
    return { question: `אם ${a} × x = ${a * x}, מהו x?`, answer: x }
  }
  if (kind === 'power') {
    const base = randInt(2, 12)
    return { question: `${base}² = ?`, answer: base * base }
  }
  if (kind === 'sqrt') {
    const root = randInt(2, 12)
    return { question: `√${root * root} = ?`, answer: root }
  }
  if (kind === 'neg') {
    const a = randInt(5, 30)
    const b = randInt(a + 1, a + 25)
    return makeSub(a, b)
  }

  const num = pick([3, 4])
  const denom = num === 3 ? 4 : 5
  const whole = randInt(2, 15) * denom
  return {
    question: `כמה זה ${num}/${denom} מתוך ${whole}?`,
    answer: (whole * num) / denom,
  }
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function generateMathProblem(difficulty: Difficulty): MathProblem {
  switch (difficulty) {
    case 'easy':
      return generateEasy()
    case 'medium':
      return generateMedium()
    case 'hard':
      return generateHard()
  }
}

export function gradeBandLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'כיתות ב׳–ד׳'
    case 'medium':
      return 'כיתות ד׳–ו׳'
    case 'hard':
      return 'כיתות ו׳–ח׳'
  }
}

/** Share of investigations (when math setting is on) that show a problem */
export const MATH_CHALLENGE_CHANCE = 0.32

export function rollMathChallenge(): boolean {
  return Math.random() < MATH_CHALLENGE_CHANCE
}
