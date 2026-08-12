import { describe, expect, it } from 'vitest'
import { statusIdFromUrl } from '../src/content/extractor'

describe('statusIdFromUrl', () => {
  it('reads IDs from x.com and twitter.com URLs', () => {
    expect(statusIdFromUrl('https://x.com/openai/status/123456')).toBe('123456')
    expect(statusIdFromUrl('https://twitter.com/user/status/99/photo/1')).toBe('99')
  })
  it('rejects timelines', () => expect(statusIdFromUrl('https://x.com/home')).toBeUndefined())
})
