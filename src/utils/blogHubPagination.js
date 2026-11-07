export const clampPage = (value, count) => /^\d+$/.test(value ?? '') ? Math.min(count, Math.max(1, Number(value))) : 1;
export const pageItems = (page, count) => {
  const pages = [...new Set([1, count, page - 1, page, page + 1])].filter(p => p >= 1 && p <= count).sort((a, b) => a - b);
  return pages.flatMap((p, i) => i && p - pages[i - 1] > 1 ? ['…', p] : [p]);
};
export class BlogHubList extends HTMLElement {
  connectedCallback() {
    this.entries = [...this.querySelectorAll('[data-hub-entry]')];
    this.pageSize = Number(this.dataset.pageSize) || 8;
    this.pageCount = Math.max(1, Math.ceil(this.entries.length / this.pageSize));
    this.nav = this.querySelector('nav');
    this.onPop = () => this.render();
    this.onClick = event => {
      const link = event.target.closest('a[data-hub-page]');
      if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      history.pushState(history.state, '', link.href);
      window.dispatchEvent(new Event('blog-hub-pagechange'));
      this.querySelector('h2').focus({ preventScroll: true });
      this.scrollIntoView({ block: 'start', behavior: 'auto' });
    };
    this.addEventListener('click', this.onClick);
    window.addEventListener('popstate', this.onPop);
    window.addEventListener('blog-hub-pagechange', this.onPop);
    this.render();
  }
  disconnectedCallback() {
    this.removeEventListener('click', this.onClick);
    window.removeEventListener('popstate', this.onPop);
    window.removeEventListener('blog-hub-pagechange', this.onPop);
  }
  render() {
    const url = new URL(location.href);
    const page = clampPage(url.searchParams.get(this.dataset.pageParam), this.pageCount);
    this.entries.forEach((entry, i) => { entry.hidden = i < (page - 1) * this.pageSize || i >= page * this.pageSize; });
    this.nav.replaceChildren();
    this.nav.hidden = this.pageCount <= 1;
    if (this.pageCount <= 1) return;
    const ko = this.dataset.lang === 'ko';
    const link = (target, label, aria) => {
      const a = document.createElement('a');
      const next = new URL(location.href);
      if (target === 1) next.searchParams.delete(this.dataset.pageParam);
      else next.searchParams.set(this.dataset.pageParam, String(target));
      next.hash = this.id;
      a.href = next.href;
      a.dataset.hubPage = String(target);
      a.textContent = label;
      a.setAttribute('aria-label', aria);
      if (target === page) a.setAttribute('aria-current', 'page');
      this.nav.append(a);
    };
    if (page > 1) link(page - 1, '←', ko ? '이전 페이지' : 'Previous page');
    for (const item of pageItems(page, this.pageCount)) {
      if (item === '…') { const span = document.createElement('span'); span.textContent = item; span.setAttribute('aria-hidden', 'true'); this.nav.append(span); }
      else link(item, String(item), ko ? `${item} 페이지` : `Page ${item}`);
    }
    if (page < this.pageCount) link(page + 1, '→', ko ? '다음 페이지' : 'Next page');
    this.querySelector('.hub-page-status').textContent = ko ? `총 ${this.entries.length}편, ${this.pageCount}페이지 중 ${page}페이지` : `${this.entries.length} posts, page ${page} of ${this.pageCount}`;
  }
}
