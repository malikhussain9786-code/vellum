import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ResumeDocument from '../resume/ResumeDocument.jsx'
import { templates } from '../../lib/documentThemes.js'
import Button from '../ui/Button.jsx'

export default function ResumeCard({ resume, onRename, onDelete }) {
  const navigate = useNavigate()
  const theme = templates.find((t) => t.id === resume.templateId) || templates[0]

  const [editing, setEditing] = useState(false)
  const [titleDraft, setTitleDraft] = useState(resume.title)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  function commitRename() {
    const trimmed = titleDraft.trim()
    setEditing(false)
    if (trimmed && trimmed !== resume.title) onRename(trimmed)
    else setTitleDraft(resume.title)
  }

  const lastUpdated = new Date(resume.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="bg-white rounded-[10px] overflow-hidden shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] flex flex-col">
      <button
        className="h-[220px] overflow-hidden relative bg-white w-full text-left"
        onClick={() => navigate(`/builder/${resume.id}`)}
        aria-label={`Open ${resume.title}`}
      >
        <div className="origin-top-left scale-[0.4] w-[250%] pointer-events-none">
          <ResumeDocument data={resume.data} theme={theme} />
        </div>
      </button>

      <div className="px-4 py-3.5 border-t border-black/5 bg-white">
        {editing ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => e.key === 'Enter' && commitRename()}
            className="text-[13px] font-semibold text-ink w-full outline-none border-b border-brass-deep/40"
          />
        ) : (
          <button
            className="text-[13px] font-semibold text-ink text-left hover:text-brass-deep transition-colors"
            onClick={() => setEditing(true)}
          >
            {resume.title}
          </button>
        )}
        <div className="text-[10px] text-graphite/50 mt-1 font-mono">
          {theme.name} · Updated {lastUpdated}
        </div>

        <div className="flex items-center justify-between mt-3">
          <Button
            variant="dark"
            size="md"
            className="text-[11px] px-3.5 py-2"
            onClick={() => navigate(`/builder/${resume.id}`)}
          >
            Open
          </Button>

          {confirmingDelete ? (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-graphite/60">Delete?</span>
              <button className="text-rose font-semibold" onClick={onDelete}>
                Yes
              </button>
              <button className="text-graphite/60" onClick={() => setConfirmingDelete(false)}>
                No
              </button>
            </div>
          ) : (
            <button
              className="text-[11px] text-graphite/40 hover:text-rose transition-colors"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
