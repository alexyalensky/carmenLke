import { useEffect, useRef } from 'react'

import { useAudio } from '../context/AudioProvider'

import { useGame } from '../context/GameContext'

/** Reactive sound effects only (no background music) */
export function AudioController() {
  const { caseState, realTimeRemainingSeconds } = useGame()
  const { playSfx } = useAudio()

  const prevClues = useRef(0)
  const prevSelected = useRef<string | null>(null)
  const prevTravel = useRef<boolean | null>(null)
  const prevTime = useRef(caseState?.timeRemaining ?? 999)
  const urgentPlayed = useRef(false)
  const realTimeUrgentPlayed = useRef(false)

  useEffect(() => {
    if (!caseState) {
      prevClues.current = 0
      prevSelected.current = null
      prevTravel.current = null
      prevTime.current = 999
      urgentPlayed.current = false
      realTimeUrgentPlayed.current = false
      return
    }

    if (caseState.knownClues.length > prevClues.current) {
      playSfx('clue')
    }
    prevClues.current = caseState.knownClues.length

    if (caseState.selectedSuspectId && caseState.selectedSuspectId !== prevSelected.current) {
      playSfx('warrant')
    }
    prevSelected.current = caseState.selectedSuspectId

    if (
      caseState.lastTravelWasCorrect !== null &&
      caseState.lastTravelWasCorrect !== prevTravel.current
    ) {
      playSfx(caseState.lastTravelWasCorrect ? 'travelOk' : 'travelBad')
    }
    prevTravel.current = caseState.lastTravelWasCorrect

    if (caseState.timeRemaining <= 8 && !urgentPlayed.current) {
      playSfx('urgent')
      urgentPlayed.current = true
    }
    prevTime.current = caseState.timeRemaining

    if (
      realTimeRemainingSeconds != null &&
      realTimeRemainingSeconds <= 60 &&
      !realTimeUrgentPlayed.current
    ) {
      playSfx('urgent')
      realTimeUrgentPlayed.current = true
    }
  }, [caseState, playSfx, realTimeRemainingSeconds])

  return null
}
