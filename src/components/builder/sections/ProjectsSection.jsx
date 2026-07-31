import TextField from '../../ui/TextField.jsx'
import Textarea from '../../ui/Textarea.jsx'
import TagInput from '../../ui/TagInput.jsx'
import { ItemCard, AddButton } from '../../ui/RepeatingItem.jsx'

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
            value={item.name}
            onChange={(e) => updateItem(item.id, { name: e.target.value })}
            placeholder="Clarity — accessible design tokens"
          />
          <Textarea
            label="Description"
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
