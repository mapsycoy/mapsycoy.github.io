# PDF blocks in Works

1. Upload the PDF to Google Drive.
2. In Drive, choose **Share → General access → Anyone with the link → Viewer**, then **Copy link**. The website does not change sharing permissions.
3. Open `/admin/` → **Works** → select a work → **Content Blocks** → **Add PDF (Google Drive)**.
4. Paste the share link into **Google Drive PDF URL**. Optionally enter **Title / 제목** and **Caption / 설명** in Korean and English. A title is recommended to identify the document for screen readers; otherwise the viewer uses “PDF document” / “PDF 문서”.
5. Drag the block into the desired position and save using the usual CMS workflow.

Supported HTTPS links on `drive.google.com`:

- `/file/d/FILE_ID/view` (including `?usp=sharing`)
- `/file/d/FILE_ID/preview` or `/file/d/FILE_ID`
- `/open?id=FILE_ID` and `/uc?export=download&id=FILE_ID`

The renderer generates the official Drive `/preview` iframe and a persistent `/view` link that opens in a new tab. `resourcekey` is preserved when present; unrelated query parameters are removed. Folder links, arbitrary iframe HTML, GitHub raw URLs, credentials, non-HTTPS URLs, and other hosts are rejected. The URL identifies a Drive file; it cannot prove the file is a PDF or publicly shared, so check the preview while signed out before publishing.

Both `/works/[slug]/` and `/ko/works/[slug]/` / `/en/works/[slug]/` use the same component. The wrapper follows the site's light/dark colors; Google controls the document viewer's internal appearance. No additional package, server proxy, file upload, or API key is needed. The iframe fetches the document directly from Google Drive.

If an embed is blocked or the file is restricted, the original link remains available above the viewer. A restricted file still requires the owner to adjust sharing; the link does not bypass permissions.

Run `node --test scripts/work-pdf.test.mjs` for URL safety checks and `npm run build` for schema/rendering validation. For local preview, run `npm run dev -- --host 127.0.0.1 --port 4322`.

Frontmatter example (replace `FILE_ID` with the real file ID):

```yaml
contentBlocks:
  - type: pdf
    url: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    title:
      ko: 작품 소개서
      en: Project booklet
    caption:
      ko: 전시 자료
      en: Exhibition material
```
