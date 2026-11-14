import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  Brain,
  CheckCircle2,
  CloudRain,
  Headphones,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Waves,
  Wind,
  X,
} from 'lucide-react'
import { Button } from '@umituz/web-design-system'
import { soundEngine, type AmbientSoundType } from './soundEngine'

interface FocusTimerModalProps {
  isOpen: boolean
  onClose: () => void
}

type FocusMode = 'pomodoro' | 'deepwork' | 'shortbreak' | 'longbreak'

const MODE_DURATIONS: Record<FocusMode, number> = {
  pomodoro: 25 * 60,
  deepwork: 50 * 60,
  shortbreak: 5 * 60,
  longbreak: 15 * 60,
}

export function FocusTimerModal({ isOpen, onClose }: FocusTimerModalProps): ReactNode {
  const [mode, setMode] = useState<FocusMode>('pomodoro')
  const [secondsLeft, setSecondsLeft] = useState(MODE_DURATIONS.pomodoro)
  const [isActive, setIsActive] = useState(false)
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('none')
  const [volume, setVolume] = useState(0.5)
  const [completedSessions, setCompletedSessions] = useState(2)
  const [totalMinutesFocused, setTotalMinutesFocused] = useState(65)
  const [isMinimized, setIsMinimized] = useState(false)

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1)
      }, 1000)
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false)
      soundEngine.stop()
      setCompletedSessions((prev) => prev + 1)
      const minutesAdded = Math.round(MODE_DURATIONS[mode] / 60)
      setTotalMinutesFocused((prev) => prev + minutesAdded)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, secondsLeft, mode])

  // Sound handler
  const handleSoundChange = (type: AmbientSoundType) => {
    setAmbientSound(type)
    if (isActive) {
      soundEngine.play(type, volume)
    }
  }

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    soundEngine.setVolume(newVol)
  }

  const toggleTimer = () => {
    if (!isActive) {
      setIsActive(true)
      if (ambientSound !== 'none') {
        soundEngine.play(ambientSound, volume)
      }
    } else {
      setIsActive(false)
      soundEngine.stop()
    }
  }

  const resetTimer = () => {
    setIsActive(false)
    soundEngine.stop()
    setSecondsLeft(MODE_DURATIONS[mode])
  }

  const switchMode = (newMode: FocusMode) => {
    setIsActive(false)
    soundEngine.stop()
    setMode(newMode)
    setSecondsLeft(MODE_DURATIONS[newMode])
  }

  if (!isOpen) return null

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const progressPercent = Math.round(((MODE_DURATIONS[mode] - secondsLeft) / MODE_DURATIONS[mode]) * 100)

  // Minimized floating pill view
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-primary/40 bg-card p-2 px-4 shadow-xl backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-xs font-bold tabular-nums text-foreground">
          <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500 animate-ping' : 'bg-muted-foreground'}`} />
          {formattedTime}
        </span>
        <button
          type="button"
          onClick={toggleTimer}
          className="rounded-full p-1 text-primary hover:bg-primary/10"
        >
          {isActive ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="rounded-full p-1 text-muted-foreground hover:bg-muted"
        >
          <Maximize2 size={13} />
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Brain size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Deep Work & Focus Engine</h2>
              <p className="text-[11px] text-muted-foreground">Procedural ambient sounds & Pomodoro telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Minimize to floating pill"
            >
              <Minimize2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.stop()
                onClose()
              }}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-4 gap-1.5 rounded-xl border border-border bg-muted/30 p-1">
          {(
            [
              { key: 'pomodoro', label: '25m Focus' },
              { key: 'deepwork', label: '50m Deep' },
              { key: 'shortbreak', label: '5m Break' },
              { key: 'longbreak', label: '15m Break' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => switchMode(item.key)}
              className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                mode === item.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Circular / Large Timer Display */}
        <div className="flex flex-col items-center justify-center py-4 space-y-2">
          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums text-foreground font-mono">
            {formattedTime}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{progressPercent}% interval elapsed</span>
            <span>·</span>
            <span className="capitalize">{mode} mode</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 pt-3">
            <Button
              size="default"
              onClick={toggleTimer}
              className="h-10 px-6 font-semibold"
            >
              {isActive ? <Pause size={16} className="mr-1.5" /> : <Play size={16} className="mr-1.5" />}
              {isActive ? 'Pause' : 'Start Focus'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="h-10 w-10"
              title="Reset"
            >
              <RotateCcw size={15} />
            </Button>
          </div>
        </div>

        {/* Procedural Web Audio Ambient Sounds */}
        <div className="space-y-2.5 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Headphones size={13} className="text-primary" />
              Procedural Ambient Sound (Web Audio)
            </span>
            <span className="text-[10px] text-muted-foreground uppercase font-mono">
              {ambientSound === 'none' ? 'Muted' : ambientSound}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {[
              { key: 'none' as const, label: 'Mute', icon: X },
              { key: 'brown' as const, label: 'Brown', icon: Wind },
              { key: 'white' as const, label: 'White', icon: Sparkles },
              { key: 'rain' as const, label: 'Rain', icon: CloudRain },
              { key: 'alpha' as const, label: 'Alpha', icon: Waves },
            ].map((snd) => {
              const Icon = snd.icon
              const isSel = ambientSound === snd.key
              return (
                <button
                  key={snd.key}
                  type="button"
                  onClick={() => handleSoundChange(snd.key)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-[11px] font-medium transition-colors border ${
                    isSel
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/60 bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <Icon size={14} />
                  <span>{snd.label}</span>
                </button>
              )
            })}
          </div>

          {/* Volume slider */}
          {ambientSound !== 'none' && (
            <div className="flex items-center gap-2 pt-1 text-xs">
              <Volume2 size={13} className="text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-primary h-1.5"
                aria-label="Volume"
              />
              <span className="tabular-nums text-[10px] text-muted-foreground w-8 text-right font-mono">
                {Math.round(volume * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Telemetry Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>Today: {completedSessions} intervals completed</span>
          </div>
          <span className="font-semibold text-foreground tabular-nums">
            {totalMinutesFocused} mins deep work
          </span>
        </div>
      </div>
    </div>
  )
}
