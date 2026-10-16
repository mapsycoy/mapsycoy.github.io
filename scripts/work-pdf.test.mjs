import test from "node:test";
import assert from "node:assert/strict";
import { getWorkPdfUrls } from "../src/utils/workPdf.mjs";

const id = "1Example_File-Id";
const base = `https://drive.google.com/file/d/${id}`;
for (const input of [`${base}/view?usp=sharing`, `${base}/preview`, base, `${base}/`, `https://drive.google.com/open?id=${id}`, `https://drive.google.com/uc?export=download&id=${id}`]) {
  test(`normalizes ${input}`, () => {
    assert.deepEqual(getWorkPdfUrls(input), { previewUrl: `${base}/preview`, originalUrl: `${base}/view` });
  });
}
test("preserves a resource key, discards unrelated parameters and fragments", () => {
  assert.deepEqual(getWorkPdfUrls(`  ${base}/view?usp=sharing&resourcekey=0-Example_key#page=2  `), {
    previewUrl: `${base}/preview?resourcekey=0-Example_key`, originalUrl: `${base}/view?resourcekey=0-Example_key`,
  });
});
for (const input of [undefined, "", "javascript:alert(1)", "data:text/html,test", "<iframe src='https://drive.google.com'></iframe>", `http://drive.google.com/file/d/${id}/view`, `https://drive.google.com.evil.test/file/d/${id}/view`, `https://evil.test@drive.google.com/file/d/${id}/view`, `https://drive.google.com:444/file/d/${id}/view`, "https://drive.google.com/drive/folders/Example", "https://drive.google.com/open?id=a&id=b", `${base}/view?id=other`, `${base}/view?resourcekey=a&resourcekey=b`, `${base}/view?resourcekey=%3Cscript%3E`, "https://drive.google.com/file/d/a%2Fb/view", "https://drive.google.com/file/d/a/view/extra", "https://drive.google.com/file/d/a\n/view", "https://drive.google.com\\evil.test/file/d/a/view", "https://raw.githubusercontent.com/user/repo/main/file.pdf"]) {
  test(`rejects ${String(input)}`, () => assert.equal(getWorkPdfUrls(input), null));
}
