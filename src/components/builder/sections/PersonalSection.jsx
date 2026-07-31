import TextField from '../../ui/TextField.jsx'
import PhotoUpload from '../PhotoUpload.jsx'

export default function PersonalSection({ value, onChange }) {
  function update(field) {
    return (e) => onChange({ ...value, [field]: e.target.value })
  }

  return (
    <div className="flex flex-col gap-5">
      <PhotoUpload value={value.photoUrl} onChange={(photoUrl) => onChange({ ...value, photoUrl })} />
      <div className="grid sm:grid-cols-2 gap-4">
      <TextField label="Full name" value={value.name} onChange={update('name')} placeholder="Amara Osei" />
      <TextField label="Title / Role" value={value.title} onChange={update('title')} placeholder="Senior Product Designer" />
      <TextField label="Email" type="email" value={value.email} onChange={update('email')} placeholder="you@email.com" />
      <TextField label="Phone" value={value.phone} onChange={update('phone')} placeholder="(415) 555-0148" />
      <TextField label="Location" value={value.location} onChange={update('location')} placeholder="San Francisco, CA" />
      <TextField label="LinkedIn" value={value.linkedin} onChange={update('linkedin')} placeholder="linkedin.com/in/you" />
      <TextField label="Portfolio / Website" value={value.portfolio} onChange={update('portfolio')} placeholder="yoursite.com" className="sm:col-span-2" />
      </div>
    </div>
  )
}
