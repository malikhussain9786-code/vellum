import TextField from '../../ui/TextField.jsx'
import Textarea from '../../ui/Textarea.jsx'
import TagInput from '../../ui/TagInput.jsx'
import { ItemCard, AddButton } from '../../ui/RepeatingItem.jsx'
import { LIMITS, validateText, validateUrl } from '../../../lib/validation.js'

function emptyProject() {
  return { id: crypto.randomUUID(), name: '', description: '', technologies: [], link: '' }
}

export default function ProjectsSection({ value = [], onChange }) {
  function updateItem(id, patch) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }
  function removeItem(id) {
    onChange(value.filter((item) => item.id !== id))
  }
  function addItem() {
    onChange([...value, emptyProject()])
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((item) => (
        <ItemCard key={item.id} onRemove={() => removeItem(item.id)}>
          <TextField
            label="Project name"
            maxLength={LIMITS.title}
            validate={(v) => validateText(v, { label: 'Project name', required: true, max: LIMITS.title })}
            value={item.name}
            onChange={(e) => updateItem(item.id, { name: e.target.value })}
            placeholder="Clarity — accessible design tokens"
          />
          <Textarea
            label="Description"
            maxLength={LIMITS.longText}
            validate={(v) => validateText(v, { label: 'Description', max: LIMITS.longText })}
            rows={2}
            value={item.description}
            onChange={(e) => updateItem(item.id, { description: e.target.value })}
            placeholder="What it does and the impact it had."
          />
          <TagInput
            label="Technologies"
            value={item.technologies}
            onChange={(technologies) => updateItem(item.id, { technologies })}
            placeholder="Type and press Enter"
          />
          <TextField
            label="Link (optional)"
            maxLength={LIMITS.url}
            validate={(v) => validateUrl(v, { label: 'Project link' })}
            value={item.link}
            onChange={(e) => updateItem(item.id, { link: e.target.value })}
            placeholder="github.com/you/project"
          />
        </ItemCard>
      ))}
      <AddButton onClick={addItem}>Add project</AddButton>
    </div>
  )
}
