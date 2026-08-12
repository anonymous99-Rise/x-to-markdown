const INVALID = /[\\/:*?"<>|\u0000-\u001f]/g
const RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i

export function safeBasename(value: string): string {
  const result = value.normalize('NFKC').replace(INVALID, ' ').replace(/\s+/g, ' ')
    .replace(/[. ]+$/g, '').trim().slice(0, 100)
  return result && !RESERVED.test(result) ? result : 'x-post'
}

export function postBasename(username: string, id: string): string {
  return safeBasename(`${username.replace(/^@/, '')}-${id}`)
}
