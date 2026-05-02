'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, X, Clock, AlertTriangle } from 'lucide-react'
import { getInstrument, getSeverityBand } from '@/lib/instruments'
import type { InstrumentId, Instrument } from '@/lib/instruments'
import { ProgressDots } from '@/components/ui/ProgressDots'
import { Slider } from '@/components/ui/Slider'
import { createCheckin } from '@/lib/db/repositories/checkins'
import { cn } from '@/lib/utils'

type Phase = 'intro' | 'question' | 'complete'

interface SavedCheckin {
  score: number | null
  severityBandLabel: string | null
  severityBandDescription: string | null
  severityBandColor: string | null
  skippedCount: number
}

const SEVERITY_BG: Record<string, string> = {
  minimal: 'bg-emerald-50 border-emerald-200',
  mild: 'bg-yellow-50 border-yellow-200',
  moderate: 'bg-orange-50 border-orange-200',
  severe: 'bg-red-50 border-red-200',
}

const SEVERITY_TEXT: Record<string, string> = {
  minimal: 'text-emerald-800',
  mild: 'text-yellow-800',
  moderate: 'text-orange-800',
  severe: 'text-red-800',
}

const SEVERITY_DOT: Record<string, string> = {
  minimal: 'bg-emerald-500',
  mild: 'bg-yellow-500',
  moderate: 'bg-orange-500',
  severe: 'bg-red-500',
}

// ─── Close Confirmation Modal ────────────────────────────────────────────────

function CloseModal({
  onKeep,
  onDiscard,
}: {
  onKeep: () => void
  onDiscard: () => void
}) {
  const discardRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    discardRef.current?.focus()
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="close-modal-title"
    >
      <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-sm p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 id="close-modal-title" className="text-lg font-semibold text-foreground">
            Discard this check-in?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your answers will not be saved.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            ref={discardRef}
            onClick={onDiscard}
            className="w-full min-h-[3rem] rounded-xl bg-destructive text-destructive-foreground font-medium text-base transition-opacity hover:opacity-90 active:opacity-80"
          >
            Discard
          </button>
          <button
            onClick={onKeep}
            className="w-full min-h-[3rem] rounded-xl border border-border bg-background text-foreground font-medium text-base transition-colors hover:bg-accent"
          >
            Keep going
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Intro Screen ────────────────────────────────────────────────────────────

function IntroScreen({
  instrument,
  onBegin,
  onClose,
}: {
  instrument: Instrument
  onBegin: () => void
  onClose: () => void
}) {
  const isCasual = instrument.id === 'sleep' || instrument.id === 'stress'
  const minutes = Math.round(instrument.estimatedSeconds / 60) || 1

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={onClose}
          aria-label="Close check-in"
          className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-lg mx-auto w-full gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {instrument.shortName}
            </span>
            {isCasual && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                Quick check-in
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-foreground leading-snug">
            {instrument.name}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {instrument.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 bg-muted/40 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-muted-foreground mt-0.5 flex-none" />
            <span className="text-sm text-foreground">
              About {minutes} {minutes === 1 ? 'minute' : 'minutes'}
            </span>
          </div>
          {!isCasual && (
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground mt-0.5 flex-none text-sm font-medium w-4 text-center">"</span>
              <span className="text-sm text-foreground italic leading-relaxed">
                {instrument.recallWindow}
              </span>
            </div>
          )}
          <div className="flex items-start gap-3">
            <span className="text-muted-foreground mt-0.5 flex-none text-sm w-4 text-center">·</span>
            <span className="text-sm text-muted-foreground">
              You can stop or skip any question at any time.
            </span>
          </div>
        </div>

        {!isCasual && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {instrument.attribution}
          </p>
        )}
      </div>

      {/* Begin button */}
      <div className="px-6 pb-8 max-w-lg mx-auto w-full">
        <button
          onClick={onBegin}
          className="w-full min-h-[3.5rem] rounded-2xl bg-primary text-primary-foreground font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80"
        >
          Begin
        </button>
      </div>
    </div>
  )
}

// ─── Question Screen ─────────────────────────────────────────────────────────

function QuestionScreen({
  instrument,
  questionIndex,
  responses,
  onSelect,
  onBack,
  onClose,
}: {
  instrument: Instrument
  questionIndex: number
  responses: Record<string, number | null>
  onSelect: (key: string, value: number | null) => void
  onBack: () => void
  onClose: () => void
}) {
  const question = instrument.questions[questionIndex]
  const total = instrument.questions.length
  const currentValue = responses[question.key]
  const isSlider = instrument.id === 'sleep' || instrument.id === 'stress'
  // slider needs an explicit unset state vs "value 0"
  const [sliderValue, setSliderValue] = useState<number>(
    currentValue !== undefined && currentValue !== null ? currentValue : 5
  )
  const [sliderTouched, setSliderTouched] = useState(
    currentValue !== undefined && currentValue !== null
  )

  // Reset slider state when question changes
  useEffect(() => {
    const v = responses[question.key]
    if (v !== undefined && v !== null) {
      setSliderValue(v)
      setSliderTouched(true)
    } else {
      setSliderValue(5)
      setSliderTouched(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionIndex])

  const handleSliderConfirm = () => {
    onSelect(question.key, sliderValue)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center px-4 pt-4 pb-2 gap-2">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex-none"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 flex justify-center">
          <ProgressDots
            total={total}
            current={questionIndex}
            aria-label={`Question ${questionIndex + 1} of ${total}`}
          />
        </div>
        <button
          onClick={onClose}
          aria-label="Close check-in"
          className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex-none"
        >
          <X size={20} />
        </button>
      </div>

      {/* Screen reader live region */}
      <div aria-live="polite" className="sr-only">
        Question {questionIndex + 1} of {total}: {question.text}
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col justify-center px-6 py-6 max-w-lg mx-auto w-full">
        <fieldset className="border-none p-0 m-0 w-full">
          <legend className="sr-only">
            Question {questionIndex + 1} of {total}: {question.text}
          </legend>

          <div className="flex flex-col gap-6 mb-8">
            {instrument.recallWindow && !isSlider && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {instrument.recallWindow}
              </p>
            )}
            {isSlider && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {instrument.recallWindow}
              </p>
            )}
            <p
              aria-hidden="true"
              className="text-2xl font-medium text-foreground leading-snug"
            >
              {question.text}
            </p>
            {question.isCritical && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-3">
                <AlertTriangle size={15} className="flex-none mt-0.5 text-orange-500" />
                <span>
                  If you&apos;re having thoughts of hurting yourself, please reach out to a crisis line or trusted person. In the US: 988 Suicide &amp; Crisis Lifeline — call or text <strong>988</strong>.
                </span>
              </div>
            )}
          </div>

          {isSlider ? (
            <div className="flex flex-col gap-6">
              <Slider
                value={sliderValue}
                onChange={(v) => { setSliderValue(v); setSliderTouched(true) }}
                min={0}
                max={10}
                minLabel="0"
                maxLabel="10"
              />
              <button
                onClick={handleSliderConfirm}
                disabled={!sliderTouched}
                className={cn(
                  "w-full min-h-[3.5rem] rounded-2xl font-semibold text-base transition-all",
                  sliderTouched
                    ? "bg-primary text-primary-foreground hover:opacity-90 active:opacity-80"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {questionIndex === total - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2" role="group">
              {question.scale.map((option, i) => {
                const isSelected = currentValue === option.value
                return (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-4 min-h-[3.5rem] px-4 py-3 rounded-xl border cursor-pointer transition-all select-none",
                      "hover:bg-accent hover:border-primary/40",
                      isSelected
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-foreground"
                    )}
                  >
                    <input
                      type="radio"
                      name={`question-${question.key}`}
                      value={option.value}
                      checked={isSelected}
                      onChange={() => onSelect(question.key, option.value)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className="text-xs font-mono text-muted-foreground w-4 flex-none"
                    >
                      {i + 1}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex-none w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "border-primary bg-primary" : "border-border bg-background"
                      )}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-primary-foreground" />
                      )}
                    </span>
                    <span className="text-base font-medium leading-snug">{option.label}</span>
                    {option.description && (
                      <span className="text-sm text-muted-foreground">{option.description}</span>
                    )}
                  </label>
                )
              })}

              {/* Prefer not to answer */}
              <div className="mt-1 pt-3 border-t border-border/50">
                <button
                  onClick={() => onSelect(question.key, null)}
                  className="w-full min-h-[2.75rem] px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-left"
                >
                  Prefer not to answer
                </button>
              </div>
            </div>
          )}
        </fieldset>
      </div>
    </div>
  )
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  instrument,
  result,
  responses,
  onDone,
}: {
  instrument: Instrument
  result: SavedCheckin
  responses: Record<string, number | null>
  onDone: () => void
}) {
  const isCasual = instrument.id === 'sleep' || instrument.id === 'stress'
  const color = result.severityBandColor ?? 'minimal'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col px-6 py-10 max-w-lg mx-auto w-full gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {instrument.shortName} — complete
          </p>
          <h1 className="text-2xl font-semibold text-foreground leading-snug">
            Your results
          </h1>
        </div>

        {/* Score card */}
        <div
          className={cn(
            "rounded-2xl border p-5 flex flex-col gap-3",
            result.severityBandColor ? SEVERITY_BG[color] : "bg-muted/40 border-border"
          )}
        >
          {result.score !== null ? (
            <>
              <div className="flex items-center gap-3">
                {result.severityBandColor && (
                  <span
                    className={cn("w-3 h-3 rounded-full flex-none", SEVERITY_DOT[color])}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "text-xl font-bold",
                    result.severityBandColor ? SEVERITY_TEXT[color] : "text-foreground"
                  )}
                >
                  {result.severityBandLabel ?? 'Score recorded'}
                </span>
                <span className="ml-auto text-lg font-semibold text-muted-foreground">
                  {result.score}
                  {!isCasual && (
                    <span className="text-sm font-normal">
                      /{instrument.questions.length * (instrument.questions[0]?.scale.at(-1)?.value ?? 3)}
                    </span>
                  )}
                </span>
              </div>
              {result.severityBandDescription && (
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    result.severityBandColor ? SEVERITY_TEXT[color] : "text-foreground"
                  )}
                >
                  {result.severityBandDescription}
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium text-foreground">Score not available</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.skippedCount} of {instrument.questions.length}{' '}
                {result.skippedCount === 1 ? 'question was' : 'questions were'} skipped — a total
                score requires all questions to be answered.
              </p>
            </div>
          )}
        </div>

        {/* Crisis reminder if q9 was non-zero */}
        {instrument.id === 'phq9' && responses['phq9_q9'] !== undefined && responses['phq9_q9'] !== null && responses['phq9_q9'] > 0 && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 leading-relaxed">
            <AlertTriangle size={16} className="flex-none mt-0.5 text-red-500" />
            <span>
              You indicated some thoughts of self-harm. If you&apos;re struggling, please reach out — 988 Suicide &amp; Crisis Lifeline: call or text <strong>988</strong> (US).
            </span>
          </div>
        )}

        {/* Individual responses */}
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Your responses
          </h2>
          <div className="flex flex-col divide-y divide-border/60">
            {instrument.questions.map((q, i) => {
              const val = responses[q.key]
              const scaleLabel = val !== null && val !== undefined
                ? q.scale.find((s) => s.value === val)?.label
                : null
              return (
                <div key={q.key} className="py-3 flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Q{i + 1}</p>
                  <p className="text-sm text-foreground leading-snug">{q.text}</p>
                  <p className={cn("text-sm font-medium", scaleLabel ? "text-foreground" : "text-muted-foreground")}>
                    {scaleLabel ?? (val !== null && val !== undefined ? String(val) : 'Skipped')}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Done button */}
      <div className="px-6 pb-8 max-w-lg mx-auto w-full">
        <button
          onClick={onDone}
          className="w-full min-h-[3.5rem] rounded-2xl bg-primary text-primary-foreground font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80"
        >
          Done
        </button>
      </div>
    </div>
  )
}

// ─── Main Controller ──────────────────────────────────────────────────────────

export default function CheckinFlow({ instrumentId }: { instrumentId: InstrumentId }) {
  const router = useRouter()
  const instrument = getInstrument(instrumentId)

  const [phase, setPhase] = useState<Phase>('intro')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, number | null>>({})
  const [showCloseModal, setShowCloseModal] = useState(false)
  const [result, setResult] = useState<SavedCheckin | null>(null)
  const startTimestampRef = useRef<Date | null>(null)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClose = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    setShowCloseModal(true)
  }, [])

  const handleDiscard = useCallback(() => {
    router.back()
  }, [router])

  const handleBegin = useCallback(() => {
    startTimestampRef.current = new Date()
    setPhase('question')
    setQuestionIndex(0)
  }, [])

  const handleBack = useCallback(() => {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    if (questionIndex === 0) {
      setPhase('intro')
    } else {
      setQuestionIndex((i) => i - 1)
    }
  }, [questionIndex])

  const advance = useCallback(
    async (key: string, value: number | null, updatedResponses: Record<string, number | null>) => {
      const isLast = questionIndex === instrument.questions.length - 1

      if (!isLast) {
        setQuestionIndex((i) => i + 1)
        return
      }

      // Final question — compute and persist
      const allResponses = { ...updatedResponses, [key]: value }
      const skippedCount = Object.values(allResponses).filter((v) => v === null).length
      const hasSkipped = skippedCount > 0

      let score: number | null = null
      let severityBandLabel: string | null = null
      let severityBandDescription: string | null = null
      let severityBandColor: string | null = null

      if (!hasSkipped) {
        score = instrument.scoring(allResponses as Record<string, number>)
        try {
          const band = getSeverityBand(instrument, score)
          severityBandLabel = band.label
          severityBandDescription = band.description
          severityBandColor = band.color
        } catch {
          // score out of band range — leave nulls
        }
      }

      const durationSeconds = startTimestampRef.current
        ? Math.round((Date.now() - startTimestampRef.current.getTime()) / 1000)
        : 0

      await createCheckin(
        {
          timestamp: new Date(),
          type: instrument.id,
          score,
          severityBand: severityBandLabel,
          durationSeconds,
        },
        instrument.questions.map((q) => ({
          questionId: q.key,
          value: allResponses[q.key] ?? null,
        }))
      )

      setResult({ score, severityBandLabel, severityBandDescription, severityBandColor, skippedCount })
      setPhase('complete')
    },
    [questionIndex, instrument]
  )

  const handleSelect = useCallback(
    (key: string, value: number | null) => {
      const updated = { ...responses, [key]: value }
      setResponses(updated)

      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
      advanceTimerRef.current = setTimeout(() => {
        advance(key, value, updated)
      }, 250)
    },
    [responses, advance]
  )

  // Keyboard support (question phase only)
  useEffect(() => {
    if (phase !== 'question') return

    const question = instrument.questions[questionIndex]
    const isSlider = instrument.id === 'sleep' || instrument.id === 'stress'

    const onKeyDown = (e: KeyboardEvent) => {
      if (showCloseModal) return

      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === 'Backspace') {
        e.preventDefault()
        handleBack()
        return
      }

      if (isSlider) return

      const num = parseInt(e.key, 10)
      if (!isNaN(num) && num >= 1 && num <= question.scale.length) {
        const option = question.scale[num - 1]
        handleSelect(question.key, option.value)
        return
      }

      if (e.key === 'Enter') {
        const current = responses[question.key]
        if (current !== undefined) {
          handleSelect(question.key, current)
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [phase, questionIndex, instrument, responses, showCloseModal, handleClose, handleBack, handleSelect])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    }
  }, [])

  return (
    <>
      {showCloseModal && (
        <CloseModal
          onKeep={() => setShowCloseModal(false)}
          onDiscard={handleDiscard}
        />
      )}

      {phase === 'intro' && (
        <IntroScreen
          instrument={instrument}
          onBegin={handleBegin}
          onClose={handleClose}
        />
      )}

      {phase === 'question' && (
        <QuestionScreen
          instrument={instrument}
          questionIndex={questionIndex}
          responses={responses}
          onSelect={handleSelect}
          onBack={handleBack}
          onClose={handleClose}
        />
      )}

      {phase === 'complete' && result && (
        <ResultsScreen
          instrument={instrument}
          result={result}
          responses={responses}
          onDone={() => router.push('/')}
        />
      )}
    </>
  )
}
