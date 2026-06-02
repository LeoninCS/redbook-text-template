# redbook-text-template

小红书文本模板排版工具。给发布纯文本内容的小红书创作者使用：选择模板，输入文本，右侧手机预览，导出 PNG 或 PDF。

作者：布洛克琴  
GitHub：https://github.com/LeoninCS/redbook-text-template

线上地址：https://leonincs.github.io/redbook-text-template/

## 使用

```bash
python3 -m http.server 4173
```

访问 `http://localhost:4173`。

## 功能

- 首页模板库，当前提供 32 个视觉模板
- 支持分类筛选：全部、收藏、简约、专业、高科技、炫酷、复古、手帐
- 支持最近草稿、本地多作品管理、复制、重命名、删除
- 支持模板收藏，收藏模板会归入首页收藏分类
- 应用外壳采用低噪声工具型 gallery/editor 风格
- 点击模板进入编辑器
- 左侧以内容、样式、AI 辅助、导出四组折叠面板组织操作
- 内容面板输入标题、正文、署名
- 正文支持 Markdown：标题、列表、引用、粗体、斜体、行内代码
- 支持手动分页符：`---`、`***`、`<!-- pagebreak -->`
- 支持标题跟随正文、列表项成组分页、页间空白提示
- 右侧实时显示手机预览
- 支持字号、行距、边距、主色、背景强度、对齐方式微调
- 支持出图明暗模式：跟随模板、浅色、深色
- 支持切换模板并保留文本
- 支持多页 PNG ZIP 导出、页码范围、导出倍率
- 导出面板实时显示命中页数、倍率和输出尺寸
- 支持直接 PDF 文件导出
- 支持本地 AI 辅助：模板推荐、标题润色、小节提取、封面标题
- 模板数据提供 `tokens / layout / decoration` 三层结构，便于扩展

## 测试

```bash
npm test
```

当前测试覆盖模板库、Markdown、分页、导出、AI 建议和多类文本质量 fixture。

## GitHub Pages 部署

项目通过 GitHub Actions 发布到 GitHub Pages。推送到 `main` 分支后，工作流会先运行测试，再发布 `index.html` 和 `src/`。

## Spec Kit

当前规格在 `specs/001-redbook-template-tool/`。

风格研究归档在 `docs/style-archive/`。

常用流程：

```text
$speckit-constitution
$speckit-specify
$speckit-plan
$speckit-tasks
$speckit-implement
```
