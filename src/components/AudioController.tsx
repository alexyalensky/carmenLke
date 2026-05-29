import { useEffect, useRef } from 'react'

import { useAudio } from '../context/AudioProvider'

import { useGame } from '../context/GameContext'



/** Reactive sound effects only (no background music) */

export function AudioController() {

  const { caseState } = useGame()

  const { playSfx } = useAudio()



  const prevClues = useRef(0)

  const prevWarrant = useRef<string | null>(null)

  const prevTravel = useRef<boolean | null>(null)

  const prevTime = useRef(caseState?.timeRemaining ?? 999)

  const urgentPlayed = useRef(false)



  useEffect(() => {

    if (!caseState) {

      prevClues.current = 0

      prevWarrant.current = null

      prevTravel.current = null

      prevTime.current = 999

      urgentPlayed.current = false

      return

    }



    if (caseState.knownClues.length > prevClues.current) {

      playSfx('clue')

    }

    prevClues.current = caseState.knownClues.length



    if (caseState.warrantSuspectId && caseState.warrantSuspectId !== prevWarrant.current) {

      playSfx('warrant')

    }

    prevWarrant.current = caseState.warrantSuspectId



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

  }, [caseState, playSfx])



  return null

}


