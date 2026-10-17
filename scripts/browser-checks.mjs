// Run through CUA: import this module, then checkDesktop(tab, viewport).
// Uses supported CUA APIs only; no Playwright package or browser installation.
export async function checkDesktop(tab, viewport) {
  const checks = [];
  const assert = (ok, name, details) => {
    checks.push({name, ok: !!ok, ...(details ? {details} : {})});
    if (!ok) throw new Error('RAYAX check failed: ' + name);
  };
  try {
    await tab.reload();
    await viewport.set({width: 1440, height: 1000});
    const layout = await tab.playwright.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      main: document.querySelector('main.container').getBoundingClientRect().width,
      header: document.querySelector('.header-main').getBoundingClientRect().width,
      sticky: getComputedStyle(document.querySelector('#site-header')).position,
      smallText: [...document.querySelectorAll('body *')].some(e => e.getClientRects().length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && +getComputedStyle(e).fontSize.replace('px', '') < 12),
      keyValues: [...document.querySelectorAll('.quick-specs b')].every(e => getComputedStyle(e).textAlign === 'right'),
      old: document.querySelector('.original-price').getBoundingClientRect().top,
      current: document.querySelector('.final-price').getBoundingClientRect().top,
      video: document.querySelector('#product-video').duration
    }));
    assert(!layout.overflow && layout.main === layout.header, 'aligned shell without horizontal overflow');
    assert(layout.sticky === 'sticky' && !layout.smallText && layout.keyValues && layout.old < layout.current, 'approved desktop layout and typography');
    assert(layout.video === 12, 'local video metadata', {duration: layout.video});
    await tab.playwright.locator('#open-cart').click();
    assert(await tab.playwright.locator('#cart-dialog').isVisible(), 'cart opens');
    const cart = await tab.playwright.evaluate(() => ({top: document.querySelector('#cart-dialog').getBoundingClientRect().top, expected: document.querySelector('.header-main').getBoundingClientRect().bottom}));
    assert(Math.abs(cart.top - cart.expected) < 2, 'cart anchored below main header');
    await tab.playwright.getByRole('button', {name: 'بستن سبد', exact: true}).click();
    await tab.playwright.locator('#account-button').click();
    assert(await tab.playwright.locator('#profile-dialog').isVisible(), 'profile opens');
    await tab.playwright.getByRole('button', {name: 'بستن پروفایل', exact: true}).click();
    await tab.playwright.getByRole('tab', {name: 'مشخصات فنی', exact: true}).click();
    assert(await tab.playwright.locator('#specifications').isVisible(), 'specification tab');
    await tab.playwright.locator('#tab-reviews').click();
    const initialCount = await tab.playwright.evaluate(() => document.querySelectorAll('#review-list .review').length);
    await tab.playwright.locator('#more-reviews').click();
    const feed = await tab.playwright.evaluate(() => ({count: document.querySelectorAll('#review-list .review').length, removed: !document.querySelector('#buyers-only, [data-review-sort], [data-report-review]')}));
    assert(feed.count > initialCount && feed.removed, 'simplified review feed and more results');
    await tab.playwright.locator('#tab-overview').click();
    await tab.playwright.locator('#article-toggle').click();
    assert(await tab.playwright.locator('#article-more').isVisible(), 'article expands');
    await tab.playwright.locator('#article-toggle').click();
    assert(!(await tab.playwright.locator('#article-more').isVisible()), 'article collapses');
    await tab.reload();
    return checks;
  } finally {
    await viewport.reset();
  }
}
