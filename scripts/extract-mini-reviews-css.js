/**
 * CSS Extractor Script for Mini Reviews Section
 *
 * HOW TO USE:
 * 1. Open https://www.10rating/hosting in Chrome
 * 2. Press F12 to open DevTools
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Press Enter
 * 6. The CSS will be copied to your clipboard and also logged in console
 */

(function() {
  // List of classes from the mini-reviews HTML template
  const targetClasses = [
    // Main container
    'charticle__closer-look',
    'charticle__mini-reviews-container',
    'mini-reviews__container',
    'mini-reviews__title',
    'mini-reviews__items',
    'mini-reviews__item',

    // Header section
    'mini-reviews__header',
    'mini-reviews__header-desktop',
    'mini-reviews__header-desktop--top',
    'mini-reviews__header-desktop__details',
    'mini-reviews__header-desktop__links',
    'mini-reviews__header__title-container',
    'mini-reviews__header-title',

    // Index counter
    'index-counter',
    'line-separator',
    'css-1kxyc3m',

    // Logo
    'mini-reviews__logo-container',
    'mini-reviews__logo-image',

    // Product name & highlight
    'mini-reviews__product-name',
    'mini-reviews__product-highlight',

    // Left section
    'mini-reviews__left-section',

    // Review link
    'mini-reviews__review-link',
    'mini-reviews__review-link--text',

    // CTA Button
    'cta-button',
    'mini-reviews__cta-button',
    'cta-button__text',
    'secondary',
    'nilink',

    // Carousel/Image
    'container',
    'carousel--single-image',
    'carousel--image',
    'image-element',

    // Body section
    'mini-reviews__body',

    // Bullet points
    'mini-reviews__bullet-points',
    'mini-reviews__bullet-points__item',
    'mini-reviews__bullet-points__icon',
    'mini-reviews__bullet-points__content',
    'mini-reviews__bullet-points__display-name',
    'mini-reviews__bullet-points__value',

    // Show more section
    'show-more__container',
    'show-more__wrapper',
    'show-more__active',
    'show-more__content',
    'show-more__toggle',
    'show-more__text',
    'show-more__arrow',

    // Description
    'mini-reviews__product-description',
    'charticle__wysiwyg',

    // Pros and Cons
    'pros-and-cons',
    'pros-and-cons__section',
    'pros-and-cons__title',
    'pros-and-cons__list',
    'pros-and-cons__pro',
    'pros-and-cons__con',
    'pros-and-cons__icon',
    'pros-and-cons__text',
    'pro-icon',
    'con-icon',

    // Wide CTA Footer
    'wide-cta-button__footer',
    'wide-cta-button__footer__product-content',
    'wide-cta-button__footer__buttons',
    'wide-cta-button__icon-container',
    'wide-cta-button__icon-image',
    'wide-cta-button__product-name',
    'wide-cta-button__cta-button',
    'multi-buttons',
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
   Mini Reviews CSS - Extracted from 10rating
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
