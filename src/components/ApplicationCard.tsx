import type { CSSProperties } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Application, StageConfig } from '../types'
import { STAGES } from '../types'

function getStageConfig(stage: Application['stage']): StageConfig {
  return STAGES.find(s => s.id === stage) ?? STAGES[0]
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fitScoreColor(score: number) {
  if (score >= 70) return 'var(--color-stage-offer)'
  if (score >= 40) return 'var(--color-stage-interview)'
  return 'var(--color-stage-rejected)'
}

function IconDoc({ title }: { title: string }) {
  return (
    <svg width="13" height="14" viewBox="0 0 13 14" fill="none" aria-hidden="true">
      <title>{title}</title>
      <rect x="1" y="1" width="9" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.25"/>
      <line x1="3" y1="4.5" x2="8" y2="4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="3" y1="6.5" x2="8" y2="6.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="3" y1="8.5" x2="6" y2="8.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  )
}

function IconChat({ title }: { title: string }) {
  return (
    <svg width="14" height="13" viewBox="0 0 14 13" fill="none" aria-hidden="true">
      <title>{title}</title>
      <path
        d="M12.5 1H1.5C1.22 1 1 1.22 1 1.5V8.5C1 8.78 1.22 9 1.5 9H4.5L7 12L9.5 9H12.5C12.78 9 13 8.78 13 8.5V1.5C13 1.22 12.78 1 12.5 1Z"
        stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"
      />
    </svg>
  )
}

interface CardVisualProps {
  application: Application
  fitScore?: number
  aiStatus?: { letter: boolean; prep: boolean }
  isOverlay?: boolean
}

function CardVisual({ application, fitScore, aiStatus, isOverlay = false }: CardVisualProps) {
  const stage = getStageConfig(application.stage)
  const date = formatDate(application.appliedDate)

  return (
    <div
      className={[
        'bg-card border border-border rounded-card p-3.5 select-none',
        isOverlay
          ? 'shadow-card-drag rotate-1'
          : 'shadow-card transition-shadow duration-150 hover:shadow-card-drag',
      ].join(' ')}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: stage.color }}
          aria-hidden="true"
        />
        <span className="text-[15px] font-semibold text-ink leading-tight truncate flex-1">
          {application.company}
        </span>
        {fitScore !== undefined && (
          <span
            className="shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded"
            style={{
              color: fitScoreColor(fitScore),
              backgroundColor: `color-mix(in srgb, ${fitScoreColor(fitScore)} 12%, transparent)`,
            }}
          >
            {fitScore}
          </span>
        )}
      </div>

      <p className="text-[13px] font-medium text-ink-muted leading-snug mb-2.5 truncate">
        {application.role}
      </p>

      <div className="flex items-center gap-1.5 text-[12px] text-ink-muted flex-wrap">
        {application.location && <span>{application.location}</span>}
        {application.salary && (
          <>
            <span className="text-border select-none">·</span>
            <span>{application.salary}</span>
          </>
        )}
        {date && (
          <>
            <span className="text-border select-none">·</span>
            <span>{date}</span>
          </>
        )}
        {(aiStatus?.letter || aiStatus?.prep) && (
          <span className="ml-auto flex items-center gap-1 text-ink-muted/60" aria-label="AI content available">
            {aiStatus.letter && (
              <span title="Cover letter generated">
                <IconDoc title="Cover letter" />
              </span>
            )}
            {aiStatus.prep && (
              <span title="Interview prep generated">
                <IconChat title="Interview prep" />
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

interface ApplicationCardProps {
  application: Application
  fitScore?: number
  aiStatus?: { letter: boolean; prep: boolean }
  onClick?: () => void
}

export function ApplicationCard({ application, fitScore, aiStatus, onClick }: ApplicationCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
    data: { stage: application.stage },
  })

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.() } }}
      className="w-full sm:w-[260px] cursor-grab active:cursor-grabbing rounded-card focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      {...listeners}
      {...attributes}
    >
      <CardVisual application={application} fitScore={fitScore} aiStatus={aiStatus} />
    </div>
  )
}

export function ApplicationCardOverlay({ application, fitScore, aiStatus }: ApplicationCardProps) {
  return <CardVisual application={application} fitScore={fitScore} aiStatus={aiStatus} isOverlay />
}
