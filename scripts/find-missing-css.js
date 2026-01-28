const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../top10_templates/02_category_tv-services/index.html'), 'utf8');

const missing = [
  'btn-facebook',
  'btn-twitter',
  'by-author',
  'by-author__author',
  'by-author__author-credentials',
  'by-author__author-metadata',
  'by-author__author-name',
  'by-author__image',
  'by-author__pubdate',
  'css-1nxf808',
  'social-share__button',
  'social-share__icon'
];

missing.forEach(cls => {
  // Find style blocks containing this class
  const styleBlocks = html.match(/<style[^>]*>([^<]+)<\/style>/g) || [];

  let found = false;
  styleBlocks.forEach(block => {
    const cssMatch = block.match(/<style[^>]*>([^<]+)<\/style>/);
    if (cssMatch && cssMatch[1].includes('.' + cls)) {
      if (!found) {
        console.log('=== ' + cls + ' ===');
        found = true;
      }
      // Clean and print
      const css = cssMatch[1]
        .replace(/-webkit-[a-z-]+:[^;]+;/g, '')
        .replace(/-ms-[a-z-]+:[^;]+;/g, '')
        .replace(/-moz-[a-z-]+:[^;]+;/g, '')
        .replace(/display:\s*-webkit[^;]+;/g, '')
        .replace(/display:\s*-ms[^;]+;/g, '')
        .trim();
      console.log(css.substring(0, 500));
      console.log('---');
    }
  });

  if (!found) {
    console.log('=== ' + cls + ' NOT FOUND ===');
  }
  console.log('');
});
