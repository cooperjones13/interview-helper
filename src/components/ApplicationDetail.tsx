import { useEffect, useRef, type ReactNode } from 'react'
import type { Application } from '../types'
import { STAGES } from '../types'
import { PositioningPanel } from './PositioningPanel'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-widest">
        {label}
      </span>
      <span className="text-[14px] text-ink">{children}</span>
    </div>
  )
}

interface Props {
  application: Application
  onClose: () => void
}

export function ApplicationDetail({ application, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    function handleCancel(e: Event) {
      e.preventDefault()   // prevent browser closing dialog before React updates state
      onCloseRef.current()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [])

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickedOutside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom
    if (clickedOutside) onClose()
  }

  const stage = STAGES.find(s => s.id === application.stage) ?? STAGES[0]

  const formattedDate = application.appliedDate
    ? new Date(application.appliedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-labelledby="detail-title"
      className="w-full max-w-4xl max-h-[90vh] bg-canvas rounded-card border border-border shadow-card-drag flex flex-col outline-none"
    >
      {/* Stop clicks inside the modal from hitting the backdrop handler */}
      <div onClick={e => e.stopPropagation()} className="flex flex-col flex-1 min-h-0">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h2
              id="detail-title"
              className="text-[17px] font-semibold text-ink truncate"
            >
              {application.company}
            </h2>
            <span className="text-ink-muted shrink-0">·</span>
            <span className="text-[15px] text-ink-muted truncate">{application.role}</span>
          </div>

          <span
            className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium"
            style={{
              backgroundColor: `color-mix(in srgb, ${stage.color} 15%, transparent)`,
              color: stage.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
              aria-hidden="true"
            />
            {stage.label}
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-button text-ink-muted hover:text-ink hover:bg-column transition-colors focus-visible:ring-2 focus-visible:ring-accent"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-[1fr_340px] gap-5 items-start">

            {/* Left column */}
            <div className="flex flex-col gap-4">
              <section className="bg-card border border-border rounded-card p-5">
                <h3 className="text-[11px] font-semibold text-ink-muted uppercase tracking-widest mb-5">
                  Overview
                </h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                  <Field label="Company">{application.company}</Field>
                  <Field label="Role">{application.role}</Field>
                  {application.location && (
                    <Field label="Location">{application.location}</Field>
                  )}
                  {application.salary && (
                    <Field label="Salary">{application.salary}</Field>
                  )}
                  {formattedDate && (
                    <Field label="Applied">{formattedDate}</Field>
                  )}
                  {application.jobUrl && (
                    <Field label="Job posting">
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent rounded"
                      >
                        View posting ↗
                      </a>
                    </Field>
                  )}
                </div>
              </section>

              {application.notes && (
                <section className="bg-card border border-border rounded-card p-5">
                  <h3 className="text-[11px] font-semibold text-ink-muted uppercase tracking-widest mb-3">
                    Notes
                  </h3>
                  <p className="text-[14px] text-ink leading-relaxed whitespace-pre-wrap">
                    {application.notes}
                  </p>
                </section>
              )}

              <section className="bg-card border border-border rounded-card p-5">
                <h3 className="text-[11px] font-semibold text-ink-muted uppercase tracking-widest mb-3">
                  Job description
                </h3>
                {application.jdText ? (
                  <p className="text-[14px] text-ink leading-relaxed whitespace-pre-wrap">
                    {application.jdText}
                  </p>
                ) : (
                  <p className="text-[13px] text-ink-muted/60">
                    No job description added — paste the JD here to enable AI analysis.
                  </p>
                )}
              </section>
            </div>

            {/* Right column */}
            <PositioningPanel />
          </div>
        </div>
      </div>
    </dialog>
  )
}
