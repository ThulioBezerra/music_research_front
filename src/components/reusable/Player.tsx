import { useState } from "react"

type Props = {
  trackId: string
  onPlay?: (trackId: string) => void
}

const PlayIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
)

export const SpotifyPlayer = ({ trackId, onPlay }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    onPlay?.(trackId)
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg flex items-center space-x-4 border border-gray-700">
      <button
        onClick={handlePlay}
        disabled={isPlaying}
        className="p-2 rounded-full bg-green-500 text-black disabled:bg-gray-600 hover:bg-green-400 transition-all"
      >
        <PlayIcon />
      </button>
      <div>
        <p className="font-semibold">Música Viral (Player)</p>
        <p className="text-sm text-gray-400">
          {isPlaying ? "Reproduzindo..." : "Clique para tocar"}
        </p>
      </div>
    </div>
  )
}
