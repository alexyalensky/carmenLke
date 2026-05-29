import { useState, type FormEvent } from 'react'
import type { MathProblem } from '../game/mathProblems'
import { gradeBandLabel } from '../game/mathProblems'
import type { Difficulty } from '../game/types'

interface MathChallengeProps {
  problem: MathProblem
  difficulty: Difficulty
  siteName: string
  skipCost: number
  investigateCost: number
  onCorrect: () => void
  onSkip: () => void
  onCancel: () => void
}

export function MathChallenge({
  problem,
  difficulty,
  siteName,
  skipCost,
  investigateCost,
  onCorrect,
  onSkip,
  onCancel,
}: MathChallengeProps) {
  const [answer, setAnswer] = useState('')
  const [wrong, setWrong] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const parsed = Number(answer.trim())
    if (!Number.isFinite(parsed)) {
      setWrong(true)
      return
    }
    if (parsed === problem.answer) {
      onCorrect()
      return
    }
    setWrong(true)
  }

  return (
    <div className="math-challenge-overlay" onClick={onCancel}>
      <div className="math-challenge" onClick={(e) => e.stopPropagation()} dir="rtl">
        <header className="math-challenge-header">
          <h3>🧮 תרגיל לפני הרמז</h3>
          <p>
            לפעמים העדים מבקשים תרגיל לפני שמדברים. פתרו נכון כדי לחקור את{' '}
            <strong>{siteName}</strong> ולקבל רמז.
            <span className="math-grade-band"> ({gradeBandLabel(difficulty)})</span>
          </p>
        </header>

        <p className="math-question" dir="ltr">
          {problem.question}
        </p>

        <form className="math-answer-form" onSubmit={submit}>
          <label htmlFor="math-answer">התשובה שלכם:</label>
          <input
            id="math-answer"
            type="number"
            inputMode="numeric"
            className="math-answer-input"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value)
              setWrong(false)
            }}
            autoFocus
          />
          {wrong && <p className="math-wrong">לא נכון — נסו שוב!</p>}
          <div className="math-challenge-actions">
            <button type="submit" className="btn-primary">
              בדיקה
            </button>
            <button type="button" className="btn-secondary math-skip-btn" onClick={onSkip}>
              פתרון בעזרה ({skipCost + investigateCost} יח׳)
            </button>
            <button type="button" className="btn-secondary" onClick={onCancel}>
              ביטול
            </button>
          </div>
          <p className="math-skip-hint">
            פתרון בעזרה: {skipCost} יחידות זמן + {investigateCost} לחקירה. פתרון נכון: רק{' '}
            {investigateCost} לחקירה.
          </p>
        </form>
      </div>
    </div>
  )
}
