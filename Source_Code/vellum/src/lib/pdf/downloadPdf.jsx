import { pdf } from '@react-pdf/renderer'
import PdfResumeDocument from './PdfResumeDocument.jsx'

export async function downloadResumePdf({ data, theme, filename }) {
  const blob = await pdf(<PdfResumeDocument data={data} theme={theme} />).toBlob()

  const safeName = (filename || 'resume').replace(/[^a-z0-9\- _]/gi, '').trim() || 'resume'
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${safeName}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Release the object URL shortly after — immediate revoke can cancel
  // the download in some browsers before it finishes reading the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
