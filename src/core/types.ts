export interface PostImage { src: string; alt?: string }

export interface XPost {
  id: string
  authorName: string
  username: string
  publishedAt?: string
  sourceUrl: string
  html: string
  images: PostImage[]
}

export type ContentRequest =
  | { type: 'INSPECT_POST' }
  | { type: 'EXTRACT_POST' }
  | { type: 'QUICK_SAVE' }
export type ContentResponse =
  | { success: true; post: XPost; markdown?: string }
  | { success: false; error: string }

export type QuickSaveResponse =
  | { success: true }
  | { success: false; error: string }

export interface ExportRequest {
  type: 'EXPORT_POST'
  post: XPost
  markdown: string
  downloadImages: boolean
}
export type ExportResponse =
  | { success: true; downloadedImages: number; failedImages: number }
  | { success: false; error: string }
