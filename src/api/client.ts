import { API_BASE_URL } from "./config.ts"

export class ApiError extends Error {
  status: number
  body: string | undefined

  constructor(status: number, message: string, body?: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.text().catch(() => undefined)
    throw new ApiError(response.status, response.statusText, body)
  }

  return response.json() as Promise<T>
}
