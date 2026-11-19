import TextField from '../../ui/TextField.jsx'
import { ItemCard, AddButton } from '../../ui/RepeatingItem.jsx'

function emptyAliItem() {
  return { id: crypto.randomUUID(), title: '', details: '', date: '' }
}

export default function AliSection({ value = [], onChange }) {
  function updateItem(id, patch) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }
  function removeItem(id) {
    onChange(value.filter((item) => item.id !== id))
  }
  function addItem() {
    onChange([...value, emptyAliItem()])
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((item) => (
        <ItemCard key={item.id} onRemove={() => removeItem(item.id)}>
          <div className="grid sm:grid-cols-3 gap-3">
            <TextField
              label="Title"
              value={item.title}
              onChange={(e) => updateItem(item.id, { title: e.target.value })}
              placeholder="Title"
            />
            <TextField
              label="Details"
              value={item.details}
              onChange={(e) => updateItem(item.id, { details: e.target.value })}
              placeholder="Details"
            />
            <TextField
              label="Date"
              value={item.date}
              onChange={(e) => updateItem(item.id, { date: e.target.value })}
              placeholder="2025"
            />
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addItem}>Add item</AddButton>
    </div>
  )
}