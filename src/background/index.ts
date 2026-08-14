import JSZip from 'jszip'
import { postBasename } from '../core/filename'
import { imageExtension, localImageName, normalizeXImageUrl, replaceImage } from '../core/images'
import type { ContentRequest, ExportRequest, ExportResponse, QuickSaveResponse } from '../core/types'

const DEFAULT_ACTION_TITLE = '保存 X 帖子'

async function showCommandError(tabId: number, message: string): Promise<void> {
  await Promise.all([
    chrome.action.setBadgeBackgroundColor({ tabId, color: '#c62828' }),
    chrome.action.setBadgeText({ tabId, text: '!' }),
    chrome.action.setTitle({ tabId, title: `快捷保存失败：${message}` }),
  ])
  setTimeout(() => {
    void chrome.action.setBadgeText({ tabId, text: '' })
    void chrome.action.setTitle({ tabId, title: DEFAULT_ACTION_TITLE })
  }, 5000)
}

async function save(url: string, filename: string): Promise<void> {
  await chrome.downloads.download({ url, filename, saveAs: true })
}

async function run(request: ExportRequest): Promise<ExportResponse> {
  const base = postBasename(request.post.username, request.post.id)
  if (!request.downloadImages) {
    await save(`data:text/markdown;charset=utf-8,${encodeURIComponent(request.markdown)}`, `${base}.md`)
    return { success: true, downloadedImages: 0, failedImages: 0 }
  }

  const zip = new JSZip()
  let markdown = request.markdown
  let downloadedImages = 0
  let failedImages = 0
  for (const [index, source] of [...new Set(request.post.images.map((image) => image.src))].entries()) {
    try {
      const original = normalizeXImageUrl(source)
      const response = await fetch(original, { credentials: 'omit', referrerPolicy: 'no-referrer' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const local = localImageName(index, imageExtension(response.headers.get('content-type'), original))
      zip.file(local, await response.arrayBuffer())
      markdown = replaceImage(markdown, source, local)
      downloadedImages += 1
    } catch { failedImages += 1 }
  }
  zip.file(`${base}.md`, markdown)
  const data = await zip.generateAsync({ type: 'base64', compression: 'DEFLATE' })
  await save(`data:application/zip;base64,${data}`, `${base}.zip`)
  return { success: true, downloadedImages, failedImages }
}

chrome.runtime.onMessage.addListener((request: ExportRequest, _sender, reply: (value: ExportResponse) => void) => {
  if (request.type !== 'EXPORT_POST') return false
  void run(request).then(reply).catch((error) => reply({
    success: false, error: error instanceof Error ? error.message : '帖子导出失败',
  }))
  return true
})

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'quick-save') return
  void (async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return
    try {
      const request: ContentRequest = { type: 'QUICK_SAVE' }
      const response = await chrome.tabs.sendMessage(tab.id, request) as QuickSaveResponse
      if (!response.success) await showCommandError(tab.id, response.error)
    } catch {
      await showCommandError(tab.id, '请打开 X 帖子详情页，或刷新页面后再试')
    }
  })()
})
