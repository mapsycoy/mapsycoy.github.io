import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderTextBlock } from '../src/utils/workMarkdown.ts';

const code = (body, language = '') => `<pre class="work-code-block" tabindex="0"><code${language ? ` class="language-${language}"` : ''}>${body}</code></pre>`;

test('preserves blank lines, tabs, indentation and trailing spaces', () => {
  const source = '\n  if ready:\n\tprint(value)  \n\n\n';
  assert.equal(renderTextBlock('```python\n' + source + '```'), code(source, 'python'));
});

test('escapes HTML and leaves inline Markdown, entities and commands literal', () => {
  assert.equal(renderTextBlock('```\n<script>"x" & y</script>\n&lt;&gt;&amp;\n**bold** `code` [link](x)\n/admin_force_clear\n```'), code('&lt;script&gt;&quot;x&quot; &amp; y&lt;/script&gt;\n&amp;lt;&amp;gt;&amp;amp;\n**bold** `code` [link](x)\n/admin_force_clear\n'));
});

test('handles absent, text, python and unknown language without execution', () => {
  for (const language of ['', 'text', 'python', 'not-a-language']) {
    assert.equal(renderTextBlock('```' + language + '\nx < y & z\n```'), code('x &lt; y &amp; z\n', language));
  }
  assert.equal(renderTextBlock('```x"onclick="alert(1)\nx\n```'), code('x\n'));
});

test('supports tilde and longer fences, with shorter fences inside', () => {
  assert.equal(renderTextBlock('~~~~text\n```python\n~~~\n~~~~~'), code('```python\n~~~\n', 'text'));
  assert.equal(renderTextBlock('````\n```\n`````'), code('```\n'));
});

test('supports adjacent prose and fences without blank lines', () => {
  assert.equal(renderTextBlock('before\n```\nx\n```\nafter\n```text\ny\n```'), '<p>before</p>' + code('x\n') + '<p>after</p>' + code('y\n', 'text'));
});

test('handles empty, unclosed, indented fences and CRLF', () => {
  assert.equal(renderTextBlock('```\n```'), code(''));
  assert.equal(renderTextBlock('```python\n  x\n\n'), code('  x\n\n', 'python'));
  assert.equal(renderTextBlock('   ```text\r\n  x\r\n\r\n   ```'), code('  x\n\n', 'text'));
  assert.equal(renderTextBlock(''), '');
});

test('retains headings, lists, quotes, inline markup and dividers', () => {
  assert.equal(renderTextBlock('# Title\n\n- first\n- second\n\n1. one\n2. two\n\n> quote\n> more\n\n**bold** *em* `x < y`\n\n---'), '<h1>Title</h1><ul><li>first</li><li>second</li></ul><ol><li>one</li><li>two</li></ol><blockquote><p>quote<br>more</p></blockquote><p><strong>bold</strong> <em>em</em> <code>x &lt; y</code></p><hr>');
});

test('retains image captions, grids, links, color markup and video embeds', () => {
  assert.equal(renderTextBlock('![alt](/image.webp "caption")'), '<figure><img src="/image.webp" alt="" loading="lazy"><figcaption>caption</figcaption></figure>');
  assert.match(renderTextBlock('{{image-grid columns="2"}}\n![a](/a.webp)\n![b](/b.webp)\n{{/image-grid}}'), /^<div class="work-image-grid work-image-grid-2"><figure>/);
  assert.match(renderTextBlock('[Example](https://example.com/)'), /class="text-link-preview"/);
  assert.equal(renderTextBlock('Visit [Example](https://example.com/) and {{color:accent}}color{{/color}}.'), '<p>Visit <a href="https://example.com/" target="_blank" rel="noreferrer">Example</a> and <span class="work-text-color work-text-color-accent">color</span>.</p>');
  assert.match(renderTextBlock('![movie](https://vimeo.com/12345)'), /<iframe src="https:\/\/player.vimeo.com\/video\/12345/);
});
