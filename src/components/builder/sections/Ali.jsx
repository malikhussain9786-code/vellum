import TextField from '../../ui/TextField.jsx'
import { ItemCard, AddButton } from '../../ui/RepeatingItem.jsx'

function emptyCertificate() {
  return { id: crypto.randomUUID(), name: '', org: '', date: '' }
}

export default function CertificatesSection({ value = [], onChange }) {
  function updateItem(id, patch) {
    onChange(value.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }
  function removeItem(id) {
    onChange(value.filter((item) => item.id !== id))
  }
  function addItem() {
    onChange([...value, emptyCertificate()])
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((item) => (
        <ItemCard key={item.id} onRemove={() => removeItem(item.id)}>
          <div className="grid sm:grid-cols-3 gap-3">
            <TextField
              label="Certificate"
              value={item.name}
              onChange={(e) => updateItem(item.id, { name: e.target.value })}
              placeholder="Certified Usability Analyst"
            />
            <TextField
              label="Organization"
              value={item.org}
              onChange={(e) => updateItem(item.id, { org: e.target.value })}
              placeholder="HFI"
            />
            <TextField
              label="Date"
              value={item.date}
              onChange={(e) => updateItem(item.id, { date: e.target.value })}
              placeholder="2021"
            />
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={addItem}>Add certificate</AddButton>
    </div>
  )
}
