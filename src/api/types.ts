export interface StimulusItem {
  orderIndex: number
  trackId: string
  title?: string
  artist?: string
  previewUrl?: string
  durationMs?: number
  source?: string
}

export interface StartSessionResponse {
  session_id: string
  anon_token: string
  stimuli: StimulusItem[]
  random_seed: number
}

export interface BatchResult {
  status: "created" | "skipped" | "error"
  id?: string
  clientEventId?: string
}

export interface PlayBatchResponse {
  results: BatchResult[]
}

export interface ResponseBatchResponse {
  results: BatchResult[]
}

export interface CompleteSessionResponse {
  session_id: string
  completed: boolean
  exit_ts: string
  total_seconds: number
}
