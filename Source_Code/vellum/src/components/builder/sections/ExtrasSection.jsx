import TextField from '../../ui/TextField.jsx'
import Textarea from '../../ui/Textarea.jsx'
import { ItemCard, AddButton } from '../../ui/RepeatingItem.jsx'
import { LIMITS, validateText, validateDate } from '../../../lib/validation.js'

function emptyAward() {
  return { id: crypto.randomUUID(), title: '', org: '', date: '' }
}
function emptyPublication() {
  return { id: crypto.randomUUID(), title: '', publisher: '', date: '' }
}
function emptyVolunteer() {
  return { id: crypto.randomUUID(), role: '', org: '', date: '', description: '' }
}
function emptyCustomSection() {
  return { id: crypto.randomUUID(), sectionTitle: '', items: [] }
}
function emptyCustomItem() {
  return { id: crypto.randomUUID(), text: '' }
}

export default function ExtrasSection({ value, onChange }) {
  function updateField(field, next) {
    onChange({ ...value, [field]: next })
  }

  return (
    <div className="flex flex-col gap-8">
      <SubGroup title="Awards">
        <RepeatingSimple
          items={value.awards}
          onChange={(v) => updateField('awards', v)}
          makeEmpty={emptyAward}
          addLabel="Add award"
          fields={[
            { key: 'title', label: 'Award', placeholder: 'Design of the Year — Healthcare', max: LIMITS.title, required: true },
            { key: 'org', label: 'Organization', placeholder: 'Fast Company', max: LIMITS.title },
            { key: 'date', label: 'Date', placeholder: '2023', date: true },
          ]}
        />
      </SubGroup>

      <SubGroup title="Publications">
        <RepeatingSimple
          items={value.publications}
          onChange={(v) => updateField('publications', v)}
          makeEmpty={emptyPublication}
          addLabel="Add publication"
          fields={[
            { key: 'title', label: 'Title', placeholder: 'Article or paper title', max: LIMITS.title, required: true },
            { key: 'publisher', label: 'Publisher', placeholder: 'Where it was published', max: LIMITS.title },
            { key: 'date', label: 'Date', placeholder: '2024', date: true },
          ]}
        />
      </SubGroup>

      <SubGroup title="Volunteer work">
        <div className="flex flex-col gap-4">
          {value.volunteer.map((item) => (
            <ItemCard
              key={item.id}
              onRemove={() => updateField('volunteer', value.volunteer.filter((v) => v.id !== item.id))}
            >
              <div className="grid sm:grid-cols-3 gap-3">
                <TextField
                  label="Role"
                  maxLength={LIMITS.title}
                  validate={(v) => validateText(v, { label: 'Role', required: true, max: LIMITS.title })}
                  value={item.role}
                  onChange={(e) =>
                    updateField(
                      'volunteer',
                      value.volunteer.map((v) => (v.id === item.id ? { ...v, role: e.target.value } : v))
                    )
                  }
                  placeholder="Design Mentor"
                />
                <TextField
                  label="Organization"
                  maxLength={LIMITS.title}
                  validate={(v) => validateText(v, { label: 'Organization', max: LIMITS.title })}
                  value={item.org}
                  onChange={(e) =>
                    updateField(
                      'volunteer',
                      value.volunteer.map((v) => (v.id === item.id ? { ...v, org: e.target.value } : v))
                    )
                  }
                  placeholder="ADPList"
                />
                <TextField
                  label="Date"
                  maxLength={30}
                  validate={(v) => validateDate(v, { allowRange: true, allowPresent: true })}
                  value={item.date}
                  onChange={(e) =>
                    updateField(
                      'volunteer',
                      value.volunteer.map((v) => (v.id === item.id ? { ...v, date: e.target.value } : v))
                    )
                  }
                  placeholder="2020 — Present"
                />
              </div>
              <Textarea
                label="Description"
                maxLength={LIMITS.longText}
                validate={(v) => validateText(v, { label: 'Description', max: LIMITS.longText })}
                rows={2}
                value={item.description}
                onChange={(e) =>
                  updateField(
                    'volunteer',
                    value.volunteer.map((v) => (v.id === item.id ? { ...v, description: e.target.value } : v))
                  )
                }
                placeholder="What you did and the impact."
              />
            </ItemCard>
          ))}
          <AddButton onClick={() => updateField('volunteer', [...value.volunteer, emptyVolunteer()])}>
            Add volunteer work
          </AddButton>
        </div>
      </SubGroup>

      <SubGroup title="Custom sections" subtitle="For anything that doesn't fit above — publications lists, talks, patents, etc.">
        <div className="flex flex-col gap-4">
          {value.custom.map((section) => (
            <ItemCard
              key={section.id}
              onRemove={() => updateField('custom', value.custom.filter((s) => s.id !== section.id))}
            >
              <TextField
                label="Section title"
                maxLength={LIMITS.resumeTitle}
                validate={(v) => validateText(v, { label: 'Section title', required: true, max: LIMITS.resumeTitle })}
                value={section.sectionTitle}
                onChange={(e) =>
                  updateField(
                    'custom',
                    value.custom.map((s) => (s.id === section.id ? { ...s, sectionTitle: e.target.value } : s))
                  )
                }
                placeholder="Talks & Speaking"
              />
              <div className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      value={item.text}
                      onChange={(e) =>
                        updateField(
                          'custom',
                          value.custom.map((s) =>
                            s.id === section.id
                              ? { ...s, items: s.items.map((i) => (i.id === item.id ? { ...i, text: e.target.value } : i)) }
                              : s
                          )
                        )
                      }
                      placeholder="One line item"
                      maxLength={LIMITS.bullet}
                      aria-label="Line item"
                      className="flex-1 bg-white/[0.04] border border-white/15 focus:border-brass/50 rounded-[4px] px-3 py-2.5 text-[13px] text-ink-text placeholder:text-muted-dark outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          'custom',
                          value.custom.map((s) =>
                            s.id === section.id ? { ...s, items: s.items.filter((i) => i.id !== item.id) } : s
                          )
                        )
                      }
                      className="text-muted hover:text-rose text-[12px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      'custom',
                      value.custom.map((s) =>
                        s.id === section.id ? { ...s, items: [...s.items, emptyCustomItem()] } : s
                      )
                    )
                  }
                  className="text-[12px] text-brass-pale hover:text-brass text-left"
                >
                  + Add item
                </button>
              </div>
            </ItemCard>
          ))}
          <AddButton onClick={() => updateField('custom', [...value.custom, emptyCustomSection()])}>
            Add custom section
          </AddButton>
        </div>
      </SubGroup>
    </div>
  )
}

function SubGroup({ title, subtitle, children }) {
  return (
    <div>
      <h3 className="font-display text-[15px] text-ink-text">{title}</h3>
      {subtitle && <p className="text-[11.5px] text-muted-dark mt-0.5 mb-3">{subtitle}</p>}
      <div className={subtitle ? '' : 'mt-3'}>{children}</div>
    </div>
  )
}

// Shared pattern for simple 3-field repeating lists (awards, publications).
function RepeatingSimple({ items, onChange, makeEmpty, addLabel, fields }) {
  function updateItem(id, patch) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }
  function removeItem(id) {
    onChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <ItemCard key={item.id} onRemove={() => removeItem(item.id)}>
          <div className="grid sm:grid-cols-3 gap-3">
            {fields.map((f) => (
              <TextField
                key={f.key}
                label={f.label}
                maxLength={f.date ? 12 : f.max}
                validate={(v) =>
                  f.date ? validateDate(v, { label: f.label }) : validateText(v, { label: f.label, required: f.required, max: f.max })
                }
                value={item[f.key]}
                onChange={(e) => updateItem(item.id, { [f.key]: e.target.value })}
                placeholder={f.placeholder}
              />
            ))}
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => onChange([...items, makeEmpty()])}>{addLabel}</AddButton>
    </div>
  )
}
