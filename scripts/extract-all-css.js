const fs = require('fs');
const path = require('path');

// Read the template HTML file
const htmlPath = path.join(__dirname, '../top10_templates/02_category_tv-services/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract all <style> tag contents
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
let allCSS = '';
let match;
let count = 0;
let skipped = 0;

while ((match = styleRegex.exec(html)) !== null) {
  let css = match[1];

  // Skip if it contains JavaScript code
  if (css.includes('function(') ||
      css.includes('null==') ||
      css.includes('void 0') ||
      css.includes('window.') ||
      css.includes('document.')) {
    skipped++;
    continue;
  }

  // Remove @font-face rules (we don't have the font files)
  css = css.replace(/@font-face\s*\{[^}]*\}/g, '');

  // Remove invalid pseudo-element selectors like ":after svg"
  css = css.replace(/(:after|:before|::after|::before)\s+[a-zA-Z][^{]*\{[^}]*\}/g, '');

  // Clean up empty lines
  css = css.replace(/^\s*[\r\n]/gm, '');

  if (css.trim()) {
    allCSS += css + '\n';
    count++;
  }
}

// Write to output file
const outputPath = path.join(__dirname, '../styles/extracted/all-template-css.css');

// Create directory if not exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, allCSS);

console.log('Extracted ' + count + ' style blocks (skipped ' + skipped + ' with JS)');
console.log('Output: ' + outputPath);
console.log('File size: ' + (fs.statSync(outputPath).size / 1024).toFixed(2) + ' KB');
