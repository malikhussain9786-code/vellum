import TextField from '../../ui/TextField.jsx'
import { ItemCard, AddButton } from '../../ui/RepeatingItem.jsx'
import { LIMITS, validateText, validateDate, validateDateRange, firstError } from '../../../lib/validation.js'

function emptyEducation() {
  return { id: crypto.randomUUID(), degree: '', school: '', location: '', startDate: '', endDate: '', notes: '' }
}

export default function EducationSection({ value = [], onChange }) {
  function updateItem(id, patch) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }
  function removeItem(id) {
    onChange(value.filter((item) => item.id !== id))
  }
  function addItem() {
    onChange([...value, emptyEducation()])
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((item) => (
        <ItemCard key={item.id} onRemove={() => removeItem(item.id)}>
          <div className="grid sm:grid-cols-2 gap-3">
            <TextField
              label="Degree"
              maxLength={LIMITS.title}
              validate={(v) => validateText(v, { label: 'Degree', required: true, max: LIMITS.title })}
              value={item.degree}
              onChange={(e) => updateItem(item.id, { degree: e.target.value })}
              placeholder="B.S. in Computer Science"
            />
            <TextField
              label="School"
              maxLength={LIMITS.title}
              validate={(v) => validateText(v, { label: 'School', required: true, max: LIMITS.title })}
              value={item.school}
              onChange={(e) => updateItem(item.id, { school: e.target.value })}
              placeholder="University of Washington"
            />
            <TextField
              label="Location"
              maxLength={LIMITS.shortText}
              validate={(v) => validateText(v, { label: 'Location', max: LIMITS.shortText })}
              value={item.location}
              onChange={(e) => updateItem(item.id, { location: e.target.value })}
              placeholder="Seattle, WA"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label="Start"
                maxLength={12}
                validate={(v) => validateDate(v, { label: 'Start date' })}
                value={item.startDate}
                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                placeholder="2013"
              />
              <TextField
                label="End"
                maxLength={12}
                validate={(v) => firstError(validateDate(v, { label: 'End date' }), validateDateRange(item.startDate, v))}
                value={item.endDate}
                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                placeholder="2017"
              />
            </div>
          </div>
          <TextField
            label="Notes (optional)"
            maxLength={LIMITS.bullet}
            validate={(v) => validateText(v, { label: 'Notes', max: LIMITS.bullet })}
            value={item.notes}
            onChange={(e) => updateItem(item.id, { notes: e.target.value })}
            placeholder="Graduated with honors"
          />
        </ItemCard>
      ))}
      <AddButton onClick={addItem}>Add education</AddButton>
    </div>
  )
}
