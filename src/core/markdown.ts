import TurndownService from 'turndown'
import type { XPost } from './types'

const yaml = (value: string): string => JSON.stringify(value.replace(/\r?\n/g, ' '))

export function postToMarkdown(post: XPost, savedAt = new Date()): string {
  const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-' })
  const text = turndown.turndown(post.html).trim()
  const media = post.images.map((image) => `![${image.alt || ''}](${image.src})`).join('\n\n')
  const metadata = [
    '---', `author: ${yaml(post.authorName)}`, `username: ${yaml(post.username)}`,
    `post_id: ${yaml(post.id)}`, `published_at: ${yaml(post.publishedAt || '')}`,
    `source: ${yaml(post.sourceUrl)}`, 'platform: "x"',
    `saved_at: ${yaml(savedAt.toISOString())}`, '---',
  ].join('\n')
  return `${metadata}\n\n# ${post.authorName} (${post.username})\n\n${text}${media ? `\n\n${media}` : ''}\n`
}
