import { apiRequest } from "./client.ts"
import type { PlayBatchResponse, ResponseBatchResponse } from "./types.ts"

export function sendPlays(events: Array<{
  session_id: string
  track_id: string
  order_index: number
  started_ts: string
  ended_ts?: string
  played_full?: boolean
  play_count?: number
  clientEventId?: string
}>) {
  return apiRequest<PlayBatchResponse>("/api/play", {
    method: "POST",
    body: JSON.stringify(events),
  })
}

export function sendResponses(events: Array<{
  session_id: string
  question_id: string
  answer: string
  response_time_ms?: number
  clientEventId?: string
}>) {
  return apiRequest<ResponseBatchResponse>("/api/response", {
    method: "POST",
    body: JSON.stringify(events),
  })
}
