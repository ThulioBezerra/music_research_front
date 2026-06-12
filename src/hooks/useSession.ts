import { useState, useCallback } from "react"
import { startSession, completeSession } from "../api/session.ts"
import { sendPlays, sendResponses } from "../api/events.ts"
import type { StimulusItem } from "../api/types.ts"

export interface UseSessionState {
  sessionId: string | null
  anonToken: string | null
  stimuli: StimulusItem[]
  loading: boolean
  error: string | null
}

export function useSession() {
  const [state, setState] = useState<UseSessionState>({
    sessionId: null,
    anonToken: null,
    stimuli: [],
    loading: false,
    error: null,
  })

  const initSession = useCallback(
    async (demographics?: Record<string, unknown>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const result = await startSession({ demographics })
        const newState: UseSessionState = {
          sessionId: result.session_id,
          anonToken: result.anon_token,
          stimuli: result.stimuli,
          loading: false,
          error: null,
        }
        setState(newState)
        return result
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Erro ao iniciar sessão"
        setState((prev) => ({ ...prev, loading: false, error: message }))
        throw err
      }
    },
    [],
  )

  const logPlay = useCallback(
    async (
      sessionId: string,
      trackId: string,
      orderIndex: number,
      options?: { playedFull?: boolean },
    ) => {
      const event = {
        session_id: sessionId,
        track_id: trackId,
        order_index: orderIndex,
        started_ts: new Date().toISOString(),
        played_full: options?.playedFull ?? false,
        play_count: 1,
        clientEventId: crypto.randomUUID(),
      }
      return sendPlays([event])
    },
    [],
  )

  const logResponses = useCallback(
    async (
      sessionId: string,
      responses: Array<{ questionId: string; answer: string }>,
    ) => {
      const events = responses.map((r) => ({
        session_id: sessionId,
        question_id: r.questionId,
        answer: r.answer,
        clientEventId: crypto.randomUUID(),
      }))
      return sendResponses(events)
    },
    [],
  )

  const finishSession = useCallback(async (sessionId: string) => {
    return completeSession({
      session_id: sessionId,
      exit_ts: new Date().toISOString(),
    })
  }, [])

  return { ...state, initSession, logPlay, logResponses, finishSession }
}
