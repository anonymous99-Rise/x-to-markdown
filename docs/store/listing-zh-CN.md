# Chrome Web Store 商店资料（简体中文）

## 名称

X to Markdown

## 摘要

将你有权访问的单条 X 帖子保存为 Markdown，可选下载图片并生成离线 ZIP。

## 分类与语言

- 分类：生产力工具
- 默认语言：中文（简体）

## 详细描述

X to Markdown 帮助你把当前打开且有权访问的单条 X 帖子保存到本地，方便个人阅读、研究和知识整理。

- 导出包含作者、发布时间和来源链接的 Markdown
- 保留正文、链接和图片信息
- 可选下载帖子图片，生成 Markdown 与 `images/` 目录组成的 ZIP
- 页面快捷入口和 Alt+Shift+X 快捷键
- 图片下载失败时保留原网络地址，不静默丢失内容

帖子解析、Markdown 生成和 ZIP 打包均在用户浏览器本地完成。本扩展不设置账号系统，不上传帖子内容、Cookie、Token 或浏览历史。

请仅保存你有权访问和使用的内容，并尊重作者、平台规则及适用法律。本产品由独立开发者王帅提供，与 X Corp. 不存在隶属、授权或背书关系。

## 单一用途

把用户主动打开且有权访问的单条 X 帖子转换为本地 Markdown 归档。

## 权限说明

- `activeTab`：读取用户当前主动打开的受支持帖子页面。
- `downloads`：保存用户触发生成的 Markdown 或 ZIP。
- `storage`：在浏览器本地保存是否下载图片的偏好。
- X 页面和媒体域名：识别帖子；仅在用户选择时下载帖子图片。

## 后台链接

- 主页：https://wangshan9870.github.io/x-to-markdown/
- 支持：https://wangshan9870.github.io/x-to-markdown/support/
- 隐私政策：https://wangshan9870.github.io/x-to-markdown/privacy/

## 审核人员说明

1. 打开任意无需额外权限即可访问的单条 X 帖子详情页。
2. 点击扩展图标导出 Markdown。
3. 开启“下载图片”后再次导出，检查 ZIP 中的 Markdown 和 `images/`。
4. 按 Alt+Shift+X 验证快捷保存。
