/**
 * CSS Extractor Script for Author Section (By Author Extended)
 *
 * HOW TO USE:
 * 1. Open https://www.top10.com/hosting in Chrome
 * 2. Press F12 to open DevTools
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Press Enter
 * 6. The CSS will be copied to your clipboard and also logged in console
 */

(function() {
  // List of classes from the by-author HTML template
  const targetClasses = [
    // Main container
    'by-author',
    'by-author__extended',

    // Author credentials
    'by-author__author-credentials',
    'by-author__image',
    'by-author__author-metadata',
    'by-author__author-name',
    'by-author__by',
    'by-author__author',

    // Pubdate / Last Updated
    'by-author__pubdate',
    'css-1eneqdx',
    'check-mark',
    'css-4qp2h0',
    'css-1nuluvx',
    'css-66vicj',

    // Bio
    'by-author__bio',

    // Social section
    'by-author__social',
    'social-share',
    'social-share__button',
    'social-share__icon',
    'btn-blogUrl',
    'btn-twitter',
    'btn-linkedIn',
    'btn-facebook',
    'btn-instagram',
  ];

  // Function to get all CSS rules for a selector
  function getCSSRulesForSelector(selector) {
    const rules = [];

    // Iterate through all stylesheets
    for (const sheet of document.styleSheets) {
      try {
        const cssRules = sheet.cssRules || sheet.rules;
        if (!cssRules) continue;

        for (const rule of cssRules) {
          // Handle regular rules
          if (rule.type === CSSRule.STYLE_RULE) {
            if (rule.selectorText && rule.selectorText.includes(selector)) {
              rules.push({
                selector: rule.selectorText,
                css: rule.cssText
              });
            }
          }
          // Handle media queries
          else if (rule.type === CSSRule.MEDIA_RULE) {
            for (const mediaRule of rule.cssRules) {
              if (mediaRule.selectorText && mediaRule.selectorText.includes(selector)) {
                rules.push({
                  selector: `@media ${rule.conditionText} { ${mediaRule.selectorText} }`,
                  css: `@media ${rule.conditionText} { ${mediaRule.cssText} }`,
                  isMedia: true,
                  mediaQuery: rule.conditionText
                });
              }
            }
          }
        }
      } catch (e) {
        // Skip cross-origin stylesheets
        continue;
      }
    }

    return rules;
  }

  // Collect all CSS
  const allCSS = new Map();
  const mediaQueries = new Map();

  for (const className of targetClasses) {
    const selector = '.' + className;
    const rules = getCSSRulesForSelector(selector);

    for (const rule of rules) {
      if (rule.isMedia) {
        if (!mediaQueries.has(rule.mediaQuery)) {
          mediaQueries.set(rule.mediaQuery, new Set());
        }
        // Extract just the rule without the media wrapper
        const innerRule = rule.css.replace(`@media ${rule.mediaQuery} { `, '').replace(/ }$/, '');
        mediaQueries.get(rule.mediaQuery).add(innerRule);
      } else {
        allCSS.set(rule.selector, rule.css);
      }
    }
  }

  // Build the output
  let output = `/* ============================================
   Author Section CSS - Extracted from top10.com
   Generated: ${new Date().toISOString()}
   ============================================ */

`;

  // Add regular rules
  output += '/* Regular Styles */\n';
  for (const [selector, css] of allCSS) {
    output += css + '\n\n';
  }

  // Add media queries
  for (const [media, rules] of mediaQueries) {
    output += `\n@media ${media} {\n`;
    for (const rule of rules) {
      output += '  ' + rule + '\n';
    }
    output += '}\n';
  }

  // Copy to clipboard
  navigator.clipboard.writeText(output).then(() => {
    console.log('✅ CSS copied to clipboard!');
  }).catch(() => {
    console.log('❌ Could not copy to clipboard. Please copy manually from below:');
  });

  // Log stats
  console.log(`\n📊 CSS Extraction Stats:`);
  console.log(`   - Classes searched: ${targetClasses.length}`);
  console.log(`   - Rules found: ${allCSS.size}`);
  console.log(`   - Media queries: ${mediaQueries.size}`);
  console.log(`\n📋 Extracted CSS:\n`);
  console.log(output);

  // Also return for easy access
  return output;
})();
