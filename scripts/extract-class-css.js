const fs = require('fs');
const path = require('path');

// Read the template HTML
const html = fs.readFileSync(path.join(__dirname, '../top10_templates/02_category_tv-services/index.html'), 'utf8');

// Read the list of used classes
const usedClasses = fs.readFileSync(path.join(__dirname, 'used-classes.txt'), 'utf8').split('\n').filter(c => c.trim());

console.log('Looking for CSS for', usedClasses.length, 'classes...\n');

// Extract all style blocks
const styleBlocks = html.match(/<style[^>]*>([^<]+)<\/style>/g) || [];
console.log('Found', styleBlocks.length, 'style blocks in template\n');

// Combine all CSS
let allTemplateCss = '';
styleBlocks.forEach(block => {
  const cssMatch = block.match(/<style[^>]*>([^<]+)<\/style>/);
  if (cssMatch) {
    allTemplateCss += cssMatch[1] + '\n';
  }
});

// Function to clean CSS
function cleanCss(css) {
  // Remove vendor prefixes
  css = css.replace(/display:\s*-webkit-box;\s*/g, '');
  css = css.replace(/display:\s*-webkit-flex;\s*/g, '');
  css = css.replace(/display:\s*-ms-flexbox;\s*/g, '');
  css = css.replace(/-webkit-[a-z-]+:\s*[^;]+;\s*/g, '');
  css = css.replace(/-ms-[a-z-]+:\s*[^;]+;\s*/g, '');
  css = css.replace(/-moz-[a-z-]+:\s*[^;]+;\s*/g, '');
  css = css.replace(/margin-inline-end/g, 'margin-right');

  // Fix invalid values
  css = css.replace(/:\s*A\s*;/g, ': #000;');
  css = css.replace(/1px solid A/g, '1px solid #e0e0e0');

  // Remove JavaScript
  css = css.replace(/color:\s*function\([^}]+\}/g, '');

  // Clean up whitespace
  css = css.replace(/\n\s*\n/g, '\n');
  css = css.replace(/{\s+/g, '{ ');
  css = css.replace(/;\s+/g, '; ');
  css = css.replace(/\s+}/g, ' }');

  return css.trim();
}

// Find CSS for each class
let outputCss = '/* CSS for Category Page Components - Extracted from template */\n\n';
const foundClasses = [];
const notFoundClasses = [];

usedClasses.forEach(className => {
  // Skip dynamic/template classes
  if (className.includes('${') || className.includes('{')) return;

  // Create regex to find this class
  const escapedClass = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Look for .className { ... } pattern
  const patterns = [
    new RegExp(`\\.${escapedClass}\\s*\\{[^}]+\\}`, 'g'),
    new RegExp(`\\.${escapedClass}\\s*[^{]*\\{[^}]+\\}`, 'g'),
    new RegExp(`\\.${escapedClass}[^{]*\\{[^}]*\\}`, 'gs')
  ];

  let found = false;
  patterns.forEach(regex => {
    const matches = allTemplateCss.match(regex);
    if (matches && matches.length > 0) {
      found = true;
      matches.forEach(match => {
        const cleaned = cleanCss(match);
        if (cleaned.length > 10 && !outputCss.includes(cleaned)) {
          outputCss += cleaned + '\n\n';
        }
      });
    }
  });

  // Also look for @media rules containing this class
  const mediaRegex = new RegExp(`@media[^{]+\\{[^}]*\\.${escapedClass}[^}]*\\}[^}]*\\}`, 'gs');
  const mediaMatches = allTemplateCss.match(mediaRegex);
  if (mediaMatches) {
    found = true;
    mediaMatches.forEach(match => {
      const cleaned = cleanCss(match);
      if (cleaned.length > 10 && !outputCss.includes(cleaned)) {
        outputCss += cleaned + '\n\n';
      }
    });
  }

  if (found) {
    foundClasses.push(className);
  } else {
    notFoundClasses.push(className);
  }
});

// Write output
fs.writeFileSync(path.join(__dirname, '../styles/extracted/component-classes.css'), outputCss);

console.log('Found CSS for', foundClasses.length, 'classes');
console.log('Not found:', notFoundClasses.length, 'classes');
console.log('\nNot found classes:');
notFoundClasses.forEach(c => console.log('  -', c));
console.log('\nOutput written to styles/extracted/component-classes.css');
