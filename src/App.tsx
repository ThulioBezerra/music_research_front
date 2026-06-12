import { useState } from "react"
import { Step0_Consent } from "./components/steps/step0"
import { Step1_UserInfo } from "./components/steps/step1"
import { Step2_MediaUsage } from "./components/steps/step2"
import { Step3_LikertGeneral } from "./components/steps/step3"
import { Step4_MusicPlayer } from "./components/steps/step4"
import { Step5_ThankYou } from "./components/steps/step5"
import { useSession } from "./hooks/useSession"

type SubmissionStatus = "idle" | "uploading" | "success" | "error"

export type FormData = {
  hasConsented: boolean
  age: string
  location: string
  institution: string
  sex: string
  socialMedia: {
    tiktok: boolean
    instagram: boolean
    youtube: boolean
  }
  screenTime: string
  musicTime: string
  likert: Record<string, number>
  musicAnswers: {
    songId: number
    spotifyId: string
    heardBefore: string
    knowArtist: string
    knowAlbum: string
    heardComplete: string
    stoppedToListen: string
    heard3Songs: string
    encouragedToListenAlbum: string
  }[]
}

const initialFormData: FormData = {
  hasConsented: false,
  age: "",
  location: "",
  institution: "",
  sex: "",
  socialMedia: { tiktok: false, instagram: false, youtube: false },
  screenTime: "",
  musicTime: "",
  likert: {},
  musicAnswers: [],
}

const LIKERT_KEYS = [
  "influence",
  "friends",
  "viral",
  "listenedViral",
  "recommended",
  "multitask",
  "discovery",
  "exclusiveTime",
  "timeDecreased",
  "annoyedFast",
  "recognizePart",
  "playlistsImpacted",
] as const

const MUSIC_QUESTION_KEYS = [
  "heardBefore",
  "knowArtist",
  "knowAlbum",
  "heardComplete",
  "stoppedToListen",
  "heard3Songs",
  "encouragedToListenAlbum",
] as const

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatus>("idle")
  const session = useSession()

  const updateForm = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const handleStartMusicTest = async () => {
    setSubmissionStatus("uploading")
    try {
      const demographics: Record<string, unknown> = {
        age: formData.age,
        sex: formData.sex,
        location: formData.location,
        institution: formData.institution || undefined,
        socialMedia: formData.socialMedia,
        screenTime: formData.screenTime,
        musicTime: formData.musicTime,
      }

      await session.initSession(demographics)

      if (session.sessionId) {
        const likertResponses = LIKERT_KEYS
          .filter((key) => formData.likert[key] !== undefined)
          .map((key) => ({
            questionId: `likert_${key}`,
            answer: String(formData.likert[key] ?? ""),
          }))

        if (likertResponses.length > 0) {
          await session.logResponses(session.sessionId, likertResponses)
        }
      }

      setSubmissionStatus("success")
      setCurrentStimulusIndex(0)
      nextStep()
    } catch {
      setSubmissionStatus("error")
    }
  }

  const handlePlay = (trackId: string, orderIndex: number) => {
    if (session.sessionId) {
      session.logPlay(session.sessionId, trackId, orderIndex)
    }
  }

  const handleMusicSubmit = async (
    musicAnswer: FormData["musicAnswers"][0],
  ) => {
    const newMusicAnswers = [...formData.musicAnswers, musicAnswer]
    updateForm({ musicAnswers: newMusicAnswers })

    if (session.sessionId) {
      const responses = MUSIC_QUESTION_KEYS.map((key) => ({
        questionId: `track_${currentStimulusIndex}_${key}`,
        answer: musicAnswer[key],
      }))
      await session.logResponses(session.sessionId, responses)
    }

    if (currentStimulusIndex < session.stimuli.length - 1) {
      setCurrentStimulusIndex((prev) => prev + 1)
    } else {
      if (session.sessionId) {
        await session.finishSession(session.sessionId)
      }
      nextStep()
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step0_Consent
            formData={formData}
            updateForm={updateForm}
            nextStep={nextStep}
          />
        )
      case 1:
        return (
          <Step1_UserInfo
            formData={formData}
            updateForm={updateForm}
            nextStep={nextStep}
          />
        )
      case 2:
        return (
          <Step2_MediaUsage
            formData={formData}
            updateForm={updateForm}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 3:
        return (
          <Step3_LikertGeneral
            formData={formData}
            updateForm={updateForm}
            nextStep={handleStartMusicTest}
            prevStep={prevStep}
            loading={submissionStatus === "uploading"}
            error={
              submissionStatus === "error"
                ? session.error ?? "Erro ao iniciar sessão"
                : null
            }
          />
        )
      case 4: {
        if (session.stimuli.length === 0) {
          return (
            <div className="text-center text-gray-400 p-8">
              Nenhum estímulo disponível.
            </div>
          )
        }
        const stimulus = session.stimuli[currentStimulusIndex]
        return (
          <Step4_MusicPlayer
            key={currentStimulusIndex}
            stimulus={stimulus}
            totalStimuli={session.stimuli.length}
            currentIndex={currentStimulusIndex}
            onSubmit={handleMusicSubmit}
            onPlay={handlePlay}
          />
        )
      }
      case 5:
        return <Step5_ThankYou formData={formData} />
      default:
        return (
          <Step0_Consent
            formData={formData}
            updateForm={updateForm}
            nextStep={nextStep}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-800 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl bg-black/40 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-10">
        {renderStep()}
      </div>
    </div>
  )
}

export default App
