import './style.css'
import type { ContentRequest, ContentResponse, ExportRequest, ExportResponse, XPost } from '../core/types'

const $ = <T extends HTMLElement>(selector: string): T => document.querySelector<T>(selector)!
const loading = $('#loading'), ready = $('#ready'), unsupported = $('#unsupported')
const author = $('#author'), preview = $('#preview'), feedback = $('#feedback'), errorMessage = $('#error-message')
const save = $<HTMLButtonElement>('#save'), checkbox = $<HTMLInputElement>('#download-images'), label = $('#save-label')
let tabId: number | undefined
let post: XPost | undefined

function show(target: HTMLElement): void { [loading, ready, unsupported].forEach((item) => item.classList.add('hidden')); target.classList.remove('hidden') }
async function page(request: ContentRequest): Promise<ContentResponse> {
  if (!tabId) return { success: false, error: '没有找到当前标签页' }
  try { return await chrome.tabs.sendMessage(tabId, request) as ContentResponse }
  catch { return { success: false, error: '请刷新帖子页面后再试' } }
}
function update(): void { label.textContent = checkbox.checked ? '保存完整帖子' : '保存 Markdown' }
function resultText(result: ExportResponse): string {
  if (!result.success) return result.error
  if (!checkbox.checked) return 'Markdown 已交给浏览器保存'
  return result.failedImages ? `已保存 ${result.downloadedImages} 张，${result.failedImages} 张保留网络地址` : `完整帖子已保存，共 ${result.downloadedImages} 张图片`
}
async function inspect(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); tabId = tab?.id
  const result = await page({ type: 'INSPECT_POST' })
  if (!result.success) { errorMessage.textContent = result.error; show(unsupported); return }
  post = result.post; author.textContent = `${post.authorName} · ${post.username}`
  const plain = new DOMParser().parseFromString(post.html, 'text/html').body.textContent?.trim() || '仅媒体帖子'
  preview.textContent = plain.slice(0, 110); show(ready)
}
save.addEventListener('click', async () => {
  if (!post) return; save.disabled = true; feedback.textContent = checkbox.checked ? '正在下载图片并打包…' : '正在生成 Markdown…'
  const extracted = await page({ type: 'EXTRACT_POST' })
  if (!extracted.success || !extracted.markdown) { feedback.textContent = extracted.success ? '生成失败，请刷新后再试' : extracted.error; save.disabled = false; return }
  try {
    const request: ExportRequest = { type: 'EXPORT_POST', post: extracted.post, markdown: extracted.markdown, downloadImages: checkbox.checked }
    const result = await chrome.runtime.sendMessage(request) as ExportResponse; feedback.textContent = resultText(result); if (!result.success) save.disabled = false
  } catch { feedback.textContent = '下载未完成，请检查浏览器下载权限'; save.disabled = false }
})
checkbox.addEventListener('change', () => { update(); void chrome.storage.local.set({ downloadImages: checkbox.checked }) })
void chrome.storage.local.get('downloadImages').then((value) => { checkbox.checked = value.downloadImages === true; update() })
void inspect()
