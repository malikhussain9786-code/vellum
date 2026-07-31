// Resizes and compresses an uploaded photo before it's stored. Phone
// camera photos are commonly 3-5MB; storing that raw in localStorage
// (shared 5-10MB quota per browser origin, across ALL of a user's
// resumes) would risk hitting storage limits after just one or two
// photos. Resizing to a sensible max dimension and re-encoding as JPEG
// keeps each stored photo to roughly 20-60KB regardless of the original.

export function resizeAndCompressImage(file, { maxDimension = 420, quality = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not process that image.'))
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
