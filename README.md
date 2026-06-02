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
- 支持分类筛选：全部、简约、专业、高科技、炫酷、复古、手帐
- 应用外壳采用低噪声工具型 gallery/editor 风格
- 点击模板进入编辑器
- 左侧输入标题、正文、署名
- 正文支持 Markdown：标题、列表、引用、粗体、斜体、行内代码
- 右侧实时显示手机预览
- 支持切换模板并保留文本
- 支持 PNG 导出
- 支持 PDF 打印导出

## 测试

```bash
npm test
```

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
