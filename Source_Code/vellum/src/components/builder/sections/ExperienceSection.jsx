import TextField from '../../ui/TextField.jsx'
import { ItemCard, AddButton } from '../../ui/RepeatingItem.jsx'
import BulletListEditor from '../BulletListEditor.jsx'
import { LIMITS, validateText, validateDate, validateDateRange, firstError } from '../../../lib/validation.js'

function emptyExperience() {
  return {
    id: crypto.randomUUID(),
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    bullets: [],
  }
}

export default function ExperienceSection({ value = [], onChange }) {
  function updateItem(id, patch) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function removeItem(id) {
    onChange(value.filter((item) => item.id !== id))
  }

  function addItem() {
    onChange([...value, emptyExperience()])
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((item) => (
        <ItemCard key={item.id} onRemove={() => removeItem(item.id)}>
          <div className="grid sm:grid-cols-2 gap-3">
            <TextField
              label="Job title"
              maxLength={LIMITS.title}
              validate={(v) => validateText(v, { label: 'Job title', required: true, max: LIMITS.title })}
              value={item.title}
              onChange={(e) => updateItem(item.id, { title: e.target.value })}
              placeholder="Lead Product Designer"
            />
            <TextField
              label="Company"
              maxLength={LIMITS.title}
              validate={(v) => validateText(v, { label: 'Company', required: true, max: LIMITS.title })}
              value={item.company}
              onChange={(e) => updateItem(item.id, { company: e.target.value })}
              placeholder="Nova Health"
            />
            <TextField
              label="Location"
              maxLength={LIMITS.shortText}
              validate={(v) => validateText(v, { label: 'Location', max: LIMITS.shortText })}
              value={item.location}
              onChange={(e) => updateItem(item.id, { location: e.target.value })}
              placeholder="San Francisco, CA"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label="Start"
                maxLength={12}
                validate={(v) => validateText(v, { label: 'Start date', required: true, max: 12 }) || validateDate(v, { label: 'Start date' })}
                value={item.startDate}
                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                placeholder="2022"
              />
              <TextField
                label="End"
                maxLength={12}
                validate={(v) =>
                  item.current ? '' : firstError(validateDate(v, { label: 'End date' }), validateDateRange(item.startDate, v))
                }
                value={item.current ? '' : item.endDate}
                disabled={item.current}
                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                placeholder={item.current ? 'Present' : '2024'}
                className={item.current ? 'opacity-50' : ''}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[12.5px] text-muted">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) => updateItem(item.id, { current: e.target.checked, endDate: '' })}
              className="accent-brass"
            />
            I currently work here
          </label>

          <BulletListEditor
            bullets={item.bullets}
            onChange={(bullets) => updateItem(item.id, { bullets })}
            placeholder="Redesigned the core intake flow, cutting completion time by 34%."
            jobContext={{ title: item.title, company: item.company }}
          />
        </ItemCard>
      ))}
      <AddButton onClick={addItem}>Add work experience</AddButton>
    </div>
  )
}
