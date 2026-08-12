import type { ManifestV3Export } from '@crxjs/vite-plugin'

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: 'X 帖子存档',
  description: '把当前 X 帖子和图片保存为本地 Markdown 归档。',
  version: '0.1.0',
  permissions: ['activeTab', 'downloads', 'storage'],
  host_permissions: ['https://x.com/*', 'https://twitter.com/*', 'https://pbs.twimg.com/*'],
  background: { service_worker: 'src/background/index.ts', type: 'module' },
  action: { default_title: '保存 X 帖子', default_popup: 'src/popup/index.html' },
  content_scripts: [{
    matches: ['https://x.com/*', 'https://twitter.com/*'],
    js: ['src/content/index.ts'],
    run_at: 'document_idle',
  }],
}

export default manifest
