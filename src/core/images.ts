const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif',
  'image/webp': 'webp', 'image/avif': 'avif',
}

export function normalizeXImageUrl(source: string): string {
  const url = new URL(source)
  url.searchParams.set('name', 'orig')
  return url.toString()
}

export function imageExtension(contentType: string | null, source: string): string {
  const type = contentType?.split(';')[0]?.trim().toLowerCase()
  if (type && EXTENSIONS[type]) return EXTENSIONS[type]
  const format = new URL(source).searchParams.get('format')?.toLowerCase()
  return format === 'jpeg' ? 'jpg' : format && /^[a-z0-9]{2,5}$/.test(format) ? format : 'jpg'
}

export function localImageName(index: number, extension: string): string {
  return `images/${String(index + 1).padStart(3, '0')}.${extension}`
}

export function replaceImage(markdown: string, remote: string, local: string): string {
  return markdown.split(`](${remote})`).join(`](./${local})`)
}
