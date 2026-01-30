// scripts/scraper/layers.ts
// =====================================================================
// CÔNG THỨC VÀNG 8 LỚP - Golden Formula for Web Scraping
// =====================================================================
// Lớp 1: CSS ID (#id)          → JSON-LD, unique elements
// Lớp 2: data-testid / data-*  → Stable test attributes
// Lớp 3: page.evaluate()       → innerHTML, JS logic
// Lớp 4: CSS Class BEM (.class)→ Meaningful class names
// Lớp 5: Combined selectors    → Parent > child chains
// Lớp 6: Playwright locator    → text, role, has-text
// Lớp 7: XPath                 → Complex DOM traversal
// Lớp 8: Brute force           → Debug / fallback
// =====================================================================

import { Page } from 'playwright';

// =====================================================================
// LỚP 1: CSS ID (#id) - Parse JSON-LD structured data
// Ưu tiên số 1 vì data sạch nhất, parse JSON trực tiếp
// =====================================================================
export async function layer1_parseJsonLD(page: Page, scriptId: string): Promise<any | null> {
  try {
    const data = await page.evaluate((id) => {
      const el = document.querySelector(`#${id}`);
      if (!el || !el.textContent) return null;
      try {
        return JSON.parse(el.textContent);
      } catch {
        return null;
      }
    }, scriptId);
    return data;
  } catch {
    return null;
  }
}

// =====================================================================
// LỚP 2: data-testid / data-role / data-* attributes
// Stable selectors do dev đặt cho testing, ít bị thay đổi
// =====================================================================
export async function layer2_byTestId(page: Page, testId: string): Promise<string | null> {
  try {
    const el = page.locator(`[data-testid="${testId}"]`).first();
    if (await el.count() === 0) return null;
    return (await el.textContent())?.trim() || null;
  } catch {
    return null;
  }
}

export async function layer2_byTestIdAttr(page: Page, testId: string, attr: string): Promise<string | null> {
  try {
    const el = page.locator(`[data-testid="${testId}"]`).first();
    if (await el.count() === 0) return null;
    return await el.getAttribute(attr);
  } catch {
    return null;
  }
}

export async function layer2_byDataRole(page: Page, role: string): Promise<string | null> {
  try {
    const el = page.locator(`[data-role="${role}"]`).first();
    if (await el.count() === 0) return null;
    return (await el.textContent())?.trim() || null;
  } catch {
    return null;
  }
}

export async function layer2_allByTestId(page: Page, testId: string): Promise<string[]> {
  try {
    const els = page.locator(`[data-testid="${testId}"]`);
    const count = await els.count();
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await els.nth(i).textContent();
      if (text?.trim()) results.push(text.trim());
    }
    return results;
  } catch {
    return [];
  }
}

export async function layer2_byDataAttr(page: Page, attr: string, value: string): Promise<string | null> {
  try {
    const el = page.locator(`[${attr}="${value}"]`).first();
    if (await el.count() === 0) return null;
    return (await el.textContent())?.trim() || null;
  } catch {
    return null;
  }
}

// =====================================================================
// LỚP 3: page.evaluate() - JS execution for innerHTML, complex logic
// Quan trọng cho mainContent (HTML), đếm sao, parse highlights
// =====================================================================
export async function layer3_innerHTML(page: Page, selector: string): Promise<string | null> {
  try {
    return await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? el.innerHTML.trim() : null;
    }, selector);
  } catch {
    return null;
  }
}

export async function layer3_evaluate<T>(page: Page, fn: () => T): Promise<T | null> {
  try {
    return await page.evaluate(fn);
  } catch {
    return null;
  }
}

export async function layer3_evaluateArg<T, A>(page: Page, fn: (arg: A) => T, arg: A): Promise<T | null> {
  try {
    return await page.evaluate(fn, arg);
  } catch {
    return null;
  }
}

// =====================================================================
// LỚP 4: CSS Class (.class) - BEM naming convention
// Tốt cho listing page (.mini-reviews__*), tránh hash classes
// =====================================================================
export async function layer4_byClass(page: Page, className: string): Promise<string | null> {
  try {
    const el = page.locator(`.${className}`).first();
    if (await el.count() === 0) return null;
    return (await el.textContent())?.trim() || null;
  } catch {
    return null;
  }
}

export async function layer4_allByClass(page: Page, className: string): Promise<string[]> {
  try {
    const els = page.locator(`.${className}`);
    const count = await els.count();
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await els.nth(i).textContent();
      if (text?.trim()) results.push(text.trim());
    }
    return results;
  } catch {
    return [];
  }
}

export async function layer4_byClassAttr(page: Page, className: string, attr: string): Promise<string | null> {
  try {
    const el = page.locator(`.${className}`).first();
    if (await el.count() === 0) return null;
    return await el.getAttribute(attr);
  } catch {
    return null;
  }
}

// =====================================================================
// LỚP 5: Combined / Multiple selectors (parent > child)
// Dùng khi data nằm trong cấu trúc lặp (bảng, danh sách)
// =====================================================================
export async function layer5_combined(page: Page, selector: string): Promise<string | null> {
  try {
    const el = page.locator(selector).first();
    if (await el.count() === 0) return null;
    return (await el.textContent())?.trim() || null;
  } catch {
    return null;
  }
}

export async function layer5_combinedAll(page: Page, selector: string): Promise<string[]> {
  try {
    const els = page.locator(selector);
    const count = await els.count();
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await els.nth(i).textContent();
      if (text?.trim()) results.push(text.trim());
    }
    return results;
  } catch {
    return [];
  }
}

export async function layer5_combinedAttr(page: Page, selector: string, attr: string): Promise<string | null> {
  try {
    const el = page.locator(selector).first();
    if (await el.count() === 0) return null;
    return await el.getAttribute(attr);
  } catch {
    return null;
  }
}

// =====================================================================
// LỚP 6: Playwright locator (text, role, has-text)
// Dùng cho WYSIWYG content, tìm theo text
// =====================================================================
export async function layer6_byText(page: Page, text: string): Promise<string | null> {
  try {
    const el = page.getByText(text, { exact: true }).first();
    if (await el.count() === 0) return null;
    return (await el.textContent())?.trim() || null;
  } catch {
    return null;
  }
}

export async function layer6_hasText(page: Page, selector: string, text: string): Promise<string | null> {
  try {
    const el = page.locator(selector, { hasText: text }).first();
    if (await el.count() === 0) return null;
    return (await el.textContent())?.trim() || null;
  } catch {
    return null;
  }
}

export async function layer6_siblingAfterText(page: Page, tag: string, headingText: string): Promise<string | null> {
  try {
    return await page.evaluate(({ tag, text }) => {
      const headings = document.querySelectorAll(tag);
      for (const h of headings) {
        if (h.textContent?.trim().includes(text)) {
          let sibling = h.nextElementSibling;
          while (sibling && sibling.tagName === 'BR') {
            sibling = sibling.nextElementSibling;
          }
          return sibling?.textContent?.trim() || null;
        }
      }
      return null;
    }, { tag, text: headingText });
  } catch {
    return null;
  }
}

// =====================================================================
// LỚP 7: XPath - Complex DOM traversal
// Dùng cho tables phức tạp, DOM lồng sâu
// =====================================================================
export async function layer7_xpath(page: Page, xpath: string): Promise<string | null> {
  try {
    const el = page.locator(`xpath=${xpath}`).first();
    if (await el.count() === 0) return null;
    return (await el.textContent())?.trim() || null;
  } catch {
    return null;
  }
}

export async function layer7_xpathAll(page: Page, xpath: string): Promise<string[]> {
  try {
    const els = page.locator(`xpath=${xpath}`);
    const count = await els.count();
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await els.nth(i).textContent();
      if (text?.trim()) results.push(text.trim());
    }
    return results;
  } catch {
    return [];
  }
}

// =====================================================================
// LỚP 8: Brute force - Debug / Fallback
// Chỉ dùng khi các lớp trên thất bại
// =====================================================================
export async function layer8_bruteForce(page: Page, tag: string): Promise<{ text: string; className: string; id: string }[]> {
  try {
    return await page.evaluate((t) => {
      const els = document.querySelectorAll(t);
      return Array.from(els).map(el => ({
        text: el.textContent?.trim()?.substring(0, 100) || '',
        className: el.className || '',
        id: el.id || '',
      }));
    }, tag);
  } catch {
    return [];
  }
}

// =====================================================================
// UTILITY: Meta tag helpers
// =====================================================================
export async function getMetaContent(page: Page, nameOrProperty: string): Promise<string | null> {
  try {
    return await page.evaluate((key) => {
      const el = document.querySelector(`meta[name="${key}"]`) ||
                 document.querySelector(`meta[property="${key}"]`);
      return el?.getAttribute('content') || null;
    }, nameOrProperty);
  } catch {
    return null;
  }
}

export async function getCanonical(page: Page): Promise<string | null> {
  try {
    return await page.evaluate(() => {
      const el = document.querySelector('link[rel="canonical"]');
      return el?.getAttribute('href') || null;
    });
  } catch {
    return null;
  }
}
