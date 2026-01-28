const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../top10_templates/02_category_tv-services/index.html'), 'utf8');

const styleMatches = html.match(/<style data-emotion="css [^"]+">([^<]+)<\/style>/g) || [];

console.log('Found', styleMatches.length, 'style blocks');

let allCss = '/* Extracted Emotion CSS from template - cleaned */\n\n';
const seenSelectors = new Set();

function cleanCss(css) {
  // Split into lines and filter out vendor-prefixed lines
  const lines = css.split('\n').map(line => {
    const trimmed = line.trim();
    // Skip vendor-prefixed property lines
    if (trimmed.match(/^-webkit-/)) return '';
    if (trimmed.match(/^-ms-/)) return '';
    if (trimmed.match(/^-moz-/)) return '';
    if (trimmed.match(/^display:\s*-webkit/)) return '';
    if (trimmed.match(/^display:\s*-ms/)) return '';
    if (trimmed.match(/^display:\s*-moz/)) return '';
    // Keep the line but remove inline vendor prefixes
    let cleaned = line
      .replace(/-webkit-[a-z-]+:[^;]+;/g, '')
      .replace(/-ms-[a-z-]+:[^;]+;/g, '')
      .replace(/-moz-[a-z-]+:[^;]+;/g, '');
    return cleaned;
  }).filter(line => line.trim().length > 0);

  css = lines.join('\n');

  // Fix margin-inline-end
  css = css.replace(/margin-inline-end/g, 'margin-right');

  // Remove JavaScript code
  css = css.replace(/color:function\([^}]+\}/g, '');
  css = css.replace(/return [^;]+;/g, '');

  // Fix invalid color values
  css = css.replace(/1px solid A/g, '1px solid #e0e0e0');
  css = css.replace(/:A;/g, ':#000;');
  css = css.replace(/:A}/g, ':#000}');

  // Clean up semicolons
  css = css.replace(/;;+/g, ';');
  css = css.replace(/\{\s*;/g, '{');
  css = css.replace(/;\s*\}/g, '}');

  return css;
}

styleMatches.forEach(style => {
  const cssMatch = style.match(/<style[^>]*>([^<]+)<\/style>/);
  if (cssMatch) {
    let css = cleanCss(cssMatch[1]);

    if (css.length > 10 && css.indexOf(':') > 0) {
      // Trim whitespace
      css = css.trim();

      const selectorMatch = css.match(/\.css-[a-z0-9]+/);
      if (selectorMatch) {
        const selector = selectorMatch[0];
        if (!seenSelectors.has(selector)) {
          seenSelectors.add(selector);
          allCss += css + '\n\n';
        }
      } else if (css.indexOf('@media') >= 0) {
        allCss += css + '\n\n';
      }
    }
  }
});

fs.writeFileSync(path.join(__dirname, '../styles/extracted/02_category_emotion.css'), allCss);
console.log('Extracted CSS - Unique selectors:', seenSelectors.size);
