import type { FormData } from "../../App"
import { LikertScale } from "../reusable/LikertScale"

type Props = {
  formData: FormData
  updateForm: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
  loading?: boolean
  error?: string | null
}

const questions: { key: string; text: string }[] = [
  {
    key: "influence",
    text: "Sinto minhas decisões e consumos influenciados pelo que vejo nas redes sociais.",
  },
  {
    key: "friends",
    text: "Tendo a ter interesse em consumir as mesmas músicas curtidas e compartilhadas pelos seus amigos.",
  },
  {
    key: "viral",
    text: "Geralmente consumo e descubro músicas que são virais em trends, danças, memes, entre outros.",
  },
  {
    key: "listenedViral",
    text: "Já escutei/postei uma música por ela ser viral.",
  },
  {
    key: "recommended",
    text: "Já escutei uma música que me foi recomendada e passei a escutá-la, mesmo não sendo de meu gosto preferencial.",
  },
  {
    key: "multitask",
    text: "Geralmente, escuto música fazendo alguma coisa.",
  },
  {
    key: "discovery",
    text: "Tenho descoberto mais músicas diferentes pela recomendação do que por minha busca em si.",
  },
  {
    key: "exclusiveTime",
    text: "Dedico tempo exclusivo para o consumo de música.",
  },
  {
    key: "timeDecreased",
    text: "Sinto ter diminuído o tempo que dedico apenas a escutar músicas.",
  },
  {
    key: "annoyedFast",
    text: "Enjoo rápido de músicas que viralizam muito.",
  },
  {
    key: "recognizePart",
    text: "Existem músicas que não conheço por completo, mas reconheço a parte viral se escutar.",
  },
  {
    key: "playlistsImpacted",
    text: "Minhas playlists e bibliotecas de músicas são impactadas pelo que vejo de músicas em alta.",
  },
]

export const Step3_LikertGeneral = ({
  formData,
  updateForm,
  nextStep,
  prevStep,
  loading = false,
  error = null,
}: Props) => {
  const handleLikertChange = (key: string, value: number) => {
    updateForm({
      likert: { ...formData.likert, [key]: value },
    })
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Suas Percepções</h2>
      <p className="text-center text-gray-400">
        Responda de 1 (Discordo Totalmente) a 5 (Concordo Totalmente).
      </p>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {questions.map((q) => (
          <LikertScale
            key={q.key}
            question={q.text}
            name={q.key}
            value={formData.likert[q.key] ?? 0}
            onChange={(val) => handleLikertChange(q.key, val)}
          />
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-500 transition-all disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={loading}
          className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Iniciando...
            </>
          ) : (
            "Iniciar Teste de Músicas"
          )}
        </button>
      </div>
    </form>
  )
}
