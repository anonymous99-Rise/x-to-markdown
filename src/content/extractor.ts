import type { XPost } from '../core/types'

export function statusIdFromUrl(url = location.href): string | undefined {
  return new URL(url).pathname.match(/\/status\/(\d+)/)?.[1]
}

export function isPostPage(): boolean { return Boolean(statusIdFromUrl()) }

function matchingArticle(id: string): HTMLElement | undefined {
  return Array.from(document.querySelectorAll<HTMLElement>('article[data-testid="tweet"]'))
    .find((article) => Array.from(article.querySelectorAll<HTMLAnchorElement>('a[href*="/status/"]'))
      .some((link) => link.pathname.match(/\/status\/(\d+)/)?.[1] === id))
}

export function extractXPost(): XPost {
  const id = statusIdFromUrl()
  if (!id) throw new Error('请打开一条 X 帖子的详情页')
  const article = matchingArticle(id)
  if (!article) throw new Error('帖子仍在加载，请稍后再试')

  const text = article.querySelector<HTMLElement>('[data-testid="tweetText"]')
  const userName = article.querySelector<HTMLElement>('[data-testid="User-Name"]')
  const username = Array.from(userName?.querySelectorAll('span') || [])
    .map((span) => span.textContent?.trim()).find((value) => value?.startsWith('@')) || '@unknown'
  const authorName = Array.from(userName?.querySelectorAll('span') || [])
    .map((span) => span.textContent?.trim()).find((value) => value && !value.startsWith('@')) || username
  const time = article.querySelector<HTMLTimeElement>('time')
  const images = Array.from(article.querySelectorAll<HTMLImageElement>('[data-testid="tweetPhoto"] img'))
    .map((image) => ({ src: image.currentSrc || image.src, alt: image.alt || undefined }))
    .filter((image, index, all) => Boolean(image.src) && all.findIndex((item) => item.src === image.src) === index)

  return {
    id, authorName, username, publishedAt: time?.dateTime,
    sourceUrl: `${location.origin}/${username.replace(/^@/, '')}/status/${id}`,
    html: text?.innerHTML || '<p>此帖子没有文本内容。</p>', images,
  }
}
