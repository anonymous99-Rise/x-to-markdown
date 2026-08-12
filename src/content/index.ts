import { postToMarkdown } from '../core/markdown'
import type { ContentRequest, ContentResponse, ExportRequest, ExportResponse } from '../core/types'
import { extractXPost, isPostPage } from './extractor'

chrome.runtime.onMessage.addListener((request: ContentRequest, _sender, reply: (value: ContentResponse) => void) => {
  try {
    const post = extractXPost()
    reply(request.type === 'EXTRACT_POST'
      ? { success: true, post, markdown: postToMarkdown(post) }
      : { success: true, post })
  } catch (error) {
    reply({ success: false, error: error instanceof Error ? error.message : '无法读取当前帖子' })
  }
  return false
})

function summary(result: ExportResponse, images: boolean): string {
  if (!result.success) return result.error
  if (!images) return 'Markdown 已保存'
  return result.failedImages
    ? `已保存 ${result.downloadedImages} 张，${result.failedImages} 张保留网络地址`
    : `完整帖子已保存 · ${result.downloadedImages} 张图片`
}

function mountQuickSave(): void {
  if (!isPostPage() || document.querySelector('#x-read-entry')) return
  const host = document.createElement('div')
  host.id = 'x-read-entry'
  const shadow = host.attachShadow({ mode: 'closed' })
  shadow.innerHTML = `<style>
    :host{all:initial}.wrap{position:fixed;right:24px;bottom:148px;z-index:2147483647;display:grid;justify-items:end;gap:9px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    button{width:48px;height:48px;border:1px solid #2f3336;border-radius:50%;color:#fff;background:#0f1419;box-shadow:0 8px 24px #0004;font:700 17px/1 sans-serif;cursor:pointer;transition:transform .16s,background .16s}button:hover{transform:translateY(-2px);background:#1d9bf0}button:focus-visible{outline:3px solid #8ecdf7;outline-offset:3px}button:disabled{opacity:.65;cursor:wait;transform:none}
    .note{max-width:260px;padding:9px 12px;border:1px solid #cfd9de;border-radius:12px;color:#0f1419;background:#fffffff2;box-shadow:0 7px 22px #0002;font-size:12px;line-height:1.45;opacity:0;transform:translateY(4px);pointer-events:none;transition:.16s}.note.show{opacity:1;transform:none}@media(prefers-reduced-motion:reduce){button,.note{transition:none}}
  </style><div class="wrap"><div class="note" role="status" aria-live="polite"></div><button type="button" title="快速保存当前 X 帖子" aria-label="快速保存当前 X 帖子">存</button></div>`
  const button = shadow.querySelector<HTMLButtonElement>('button')!
  const note = shadow.querySelector<HTMLElement>('.note')!
  let timer: number | undefined
  const show = (message: string): void => {
    note.textContent = message; note.classList.add('show')
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => note.classList.remove('show'), 5000)
  }
  button.addEventListener('click', async () => {
    button.disabled = true; button.textContent = '…'
    try {
      const stored = await chrome.storage.local.get('downloadImages')
      const downloadImages = stored.downloadImages === true
      show(downloadImages ? '正在下载图片并打包…' : '正在生成 Markdown…')
      const post = extractXPost()
      const request: ExportRequest = { type: 'EXPORT_POST', post, markdown: postToMarkdown(post), downloadImages }
      show(summary(await chrome.runtime.sendMessage(request) as ExportResponse, downloadImages))
    } catch (error) { show(error instanceof Error ? error.message : '保存失败，请稍后重试') }
    finally { button.disabled = false; button.textContent = '存' }
  })
  document.documentElement.append(host)
}

mountQuickSave()
