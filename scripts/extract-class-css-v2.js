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

// Function to clean CSS
function cleanCss(css) {
  // Remove vendor prefixes line by line
  const lines = css.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed.match(/^-webkit-/)) return '';
    if (trimmed.match(/^-ms-/)) return '';
    if (trimmed.match(/^-moz-/)) return '';
    if (trimmed.match(/^display:\s*-webkit/)) return '';
    if (trimmed.match(/^display:\s*-ms/)) return '';
    return line;
  }).filter(line => line.trim().length > 0);

  css = lines.join('\n');

  // Fix margin-inline-end
  css = css.replace(/margin-inline-end/g, 'margin-right');
  css = css.replace(/padding-inline-start/g, 'padding-left');
  css = css.replace(/padding-inline-end/g, 'padding-right');

  // Fix invalid values
  css = css.replace(/:\s*A\s*;/g, ': #000;');
  css = css.replace(/:\s*A\s*}/g, ': #000 }');
  css = css.replace(/1px solid A/g, '1px solid #e0e0e0');

  // Remove JavaScript code
  css = css.replace(/color:\s*function\([^}]+\}/g, '');

  return css.trim();
}

// Process each style block and extract complete CSS rules
let outputCss = '/* CSS for Category Page Components - Extracted from template */\n\n';
const foundClasses = new Set();
const addedRules = new Set();

styleBlocks.forEach(block => {
  const cssMatch = block.match(/<style[^>]*>([^<]+)<\/style>/);
  if (!cssMatch) return;

  let css = cleanCss(cssMatch[1]);

  // Check if this CSS contains any of our used classes
  usedClasses.forEach(className => {
    const escapedClass = className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (css.includes('.' + className)) {
      foundClasses.add(className);

      // Add the entire cleaned CSS block if not already added
      const ruleKey = css.substring(0, 100);
      if (!addedRules.has(ruleKey)) {
        addedRules.add(ruleKey);

        // Validate braces are balanced
        const opens = (css.match(/\{/g) || []).length;
        const closes = (css.match(/\}/g) || []).length;

        if (opens === closes && opens > 0) {
          outputCss += css + '\n\n';
        } else if (opens > closes) {
          // Try to fix by adding closing braces
          css += '}'.repeat(opens - closes);
          outputCss += css + '\n\n';
        }
      }
    }
  });
});

// Write output
fs.writeFileSync(path.join(__dirname, '../styles/extracted/component-classes.css'), outputCss);

console.log('Found CSS for', foundClasses.size, 'classes');
console.log('Total rules:', addedRules.size);

// Verify brace balance
const finalCss = fs.readFileSync(path.join(__dirname, '../styles/extracted/component-classes.css'), 'utf8');
const opens = (finalCss.match(/\{/g) || []).length;
const closes = (finalCss.match(/\}/g) || []).length;
console.log('Brace balance - Open:', opens, 'Close:', closes, 'Diff:', opens - closes);

console.log('\nOutput written to styles/extracted/component-classes.css');
