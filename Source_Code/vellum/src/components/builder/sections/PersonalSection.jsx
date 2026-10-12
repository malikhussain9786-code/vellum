import TextField from '../../ui/TextField.jsx'
import PhotoUpload from '../PhotoUpload.jsx'
import { LIMITS, validateName, validateText, validateEmail, validatePhone, validateUrl } from '../../../lib/validation.js'

export default function PersonalSection({ value, onChange }) {
  function update(field) {
    return (e) => onChange({ ...value, [field]: e.target.value })
  }

  return (
    <div className="flex flex-col gap-5">
      <PhotoUpload value={value.photoUrl} onChange={(photoUrl) => onChange({ ...value, photoUrl })} />
      <div className="grid sm:grid-cols-2 gap-4">
      <TextField label="Full name" value={value.name} onChange={update('name')} placeholder="Amara Osei" maxLength={LIMITS.name.max} validate={(v) => validateName(v, 'Full name')} />
      <TextField label="Title / Role" value={value.title} onChange={update('title')} placeholder="Senior Product Designer" maxLength={LIMITS.shortText} validate={(v) => validateText(v, { label: 'Title', max: LIMITS.shortText })} />
      <TextField label="Email" type="email" value={value.email} onChange={update('email')} placeholder="you@email.com" maxLength={LIMITS.email.max} validate={(v) => validateEmail(v, { required: false })} />
      <TextField label="Phone" type="tel" value={value.phone} onChange={update('phone')} placeholder="(415) 555-0148" maxLength={20} validate={(v) => validatePhone(v)} />
      <TextField label="Location" value={value.location} onChange={update('location')} placeholder="San Francisco, CA" maxLength={LIMITS.shortText} validate={(v) => validateText(v, { label: 'Location', max: LIMITS.shortText })} />
      <TextField label="LinkedIn" value={value.linkedin} onChange={update('linkedin')} placeholder="linkedin.com/in/you" maxLength={LIMITS.url} validate={(v) => validateUrl(v, { label: 'LinkedIn link', host: 'linkedin.com' })} />
      <TextField label="Portfolio / Website" value={value.portfolio} onChange={update('portfolio')} placeholder="yoursite.com" maxLength={LIMITS.url} validate={(v) => validateUrl(v, { label: 'Website' })} className="sm:col-span-2" />
      </div>
    </div>
  )
}
