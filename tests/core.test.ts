import { describe, expect, it } from 'vitest'
import { postBasename, safeBasename } from '../src/core/filename'
import { imageExtension, localImageName, normalizeXImageUrl, replaceImage } from '../src/core/images'

describe('file naming', () => {
  it('creates stable post names', () => expect(postBasename('@openai', '123')).toBe('openai-123'))
  it('removes invalid filename characters', () => expect(safeBasename('a:/b?')).toBe('a b'))
})

describe('image archive helpers', () => {
  it('requests the original X image', () => {
    expect(normalizeXImageUrl('https://pbs.twimg.com/media/abc?format=jpg&name=small'))
      .toBe('https://pbs.twimg.com/media/abc?format=jpg&name=orig')
  })
  it('detects content types and URL formats', () => {
    expect(imageExtension('image/png', 'https://pbs.twimg.com/a?format=jpg')).toBe('png')
    expect(imageExtension(null, 'https://pbs.twimg.com/a?format=jpeg')).toBe('jpg')
  })
  it('numbers local images and rewrites their targets', () => {
    expect(localImageName(2, 'webp')).toBe('images/003.webp')
    expect(replaceImage('![x](https://a)', 'https://a', 'images/001.jpg')).toBe('![x](./images/001.jpg)')
  })
})
