import { apiRequest } from "./client.ts"
import type {
  StartSessionResponse,
  CompleteSessionResponse,
} from "./types.ts"

export function startSession(data: {
  token?: string
  demographics?: Record<string, unknown>
  seed?: number
}) {
  return apiRequest<StartSessionResponse>("/api/session/start", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function getStimuli(sessionId: string) {
  return apiRequest<{
    session_id: string
    stimuli: import("./types.ts").StimulusItem[]
    random_seed: number
  }>(`/api/session/${sessionId}/stimuli`)
}

export function completeSession(data: {
  session_id: string
  exit_ts?: string
}) {
  return apiRequest<CompleteSessionResponse>("/api/session/complete", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
