/**
 * CSS Extraction Script for Partner With Us Page
 *
 * Usage:
 * 1. Open https://www.top10.com/partner-with-us in Chrome
 * 2. Open DevTools (F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire script
 * 5. Press Enter
 * 6. The CSS will be copied to your clipboard and also downloaded as a file
 */

(function() {
  // Classes to extract CSS for (from the partner-with-us page)
  const targetClasses = [
    'partner-with-us__header',
    'partner-with-us__body',
    'header-title-container',
    'intro-paragraph',
    'partner-with-us-form-section',
    'partner-with-us-container',
    'wrapper-container',
    'partner-with-us-form',
    'partner-with-us-form__form',
    'partner-with-us-form__row',
    'partner-with-us-form__button-row',
    'partner-with-us-form__button',
    'partner-with-us-privacy-url',
    'partner-with-us-privacy-consent',
    'partner-with-us-form__submit-message',
    'partner-with-us-form__submit-message__content',
    'partner-with-us-form__submit-message__content__message',
    'partner-with-us-form__submit-message__content__message__main',
    'partner-with-us-form__submit-message__content__message__main--highlighted',
    'partner-with-us-form__submit-message__content__message__secondary',
    'partner-with-us-form__submit-message__close-button',
    'title',
    'title--highlighted',
    'logos-title',
    'customers-logos',
    'customers-logos__container',
    'customers-logos__logo',
    'customers-logos__image',
    'customers-logos__next-mask',
    'customers-logos__prev-mask',
    'become-a-partner__button-container',
    'become-a-partner__button-cta-text',
    'become-a-partner__button',
    'dropdown__container',
    'dropdown',
    'dropdown__item',
    'dropdown__item--open',
    'dropdown__item__title',
    'dropdown__item__accordion',
    'dropdown__item__text',
    'dropdown__item__text--hidden',
    'dropdown__item__button',
  ];

  // Function to get all CSS rules from stylesheets
  function getAllCSSRules() {
    const rules = [];

    // Get rules from stylesheets
    for (const sheet of document.styleSheets) {
      try {
        const cssRules = sheet.cssRules || sheet.rules;
        for (const rule of cssRules) {
          rules.push(rule.cssText);
        }
      } catch (e) {
        // Cross-origin stylesheets will throw an error
        console.log('Could not access stylesheet:', sheet.href);
      }
    }

    // Get rules from <style> tags
    const styleTags = document.querySelectorAll('style');
    for (const style of styleTags) {
      if (style.textContent) {
        rules.push(style.textContent);
      }
    }

    return rules;
  }

  // Function to extract CSS for specific classes
  function extractCSSForClasses(cssRules, classes) {
    const extractedRules = new Set();
    const classPatterns = classes.map(c => new RegExp(`\\.${c.replace(/--/g, '--').replace(/__/g, '__')}[^\\w-]|^\\.${c}$`, 'i'));

    for (const rule of cssRules) {
      for (const pattern of classPatterns) {
        if (pattern.test(rule)) {
          extractedRules.add(rule);
          break;
        }
      }

      // Also check for simple class matches
      for (const className of classes) {
        if (rule.includes(`.${className}`) || rule.includes(`.${className} `) ||
            rule.includes(`.${className}:`) || rule.includes(`.${className},`) ||
            rule.includes(`.${className}{`) || rule.includes(`.${className}[`)) {
          extractedRules.add(rule);
          break;
        }
      }
    }

    return Array.from(extractedRules);
  }

  // Get computed styles for an element
  function getComputedStylesForElement(element) {
    const styles = window.getComputedStyle(element);
    const relevantStyles = {};

    // Key properties to extract
    const properties = [
      'display', 'flex-direction', 'justify-content', 'align-items', 'flex-wrap',
      'width', 'max-width', 'min-width', 'height', 'max-height', 'min-height',
      'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'background', 'background-color', 'background-image',
      'color', 'font-family', 'font-size', 'font-weight', 'line-height', 'text-align',
      'border', 'border-radius', 'box-shadow',
      'position', 'top', 'right', 'bottom', 'left', 'z-index',
      'gap', 'grid-template-columns', 'grid-template-rows',
      'overflow', 'text-decoration', 'cursor', 'transition', 'transform'
    ];

    for (const prop of properties) {
      const value = styles.getPropertyValue(prop);
      if (value && value !== 'none' && value !== 'auto' && value !== 'normal' && value !== '0px') {
        relevantStyles[prop] = value;
      }
    }

    return relevantStyles;
  }

  // Extract styles from DOM elements
  function extractStylesFromDOM() {
    const extractedStyles = {};

    for (const className of targetClasses) {
      const elements = document.querySelectorAll(`.${className}`);
      if (elements.length > 0) {
        extractedStyles[className] = getComputedStylesForElement(elements[0]);
      }
    }

    return extractedStyles;
  }

  // Convert extracted styles to CSS string
  function stylesToCSS(styles) {
    let css = '/* Partner With Us Page - Extracted Styles */\n\n';

    for (const [className, props] of Object.entries(styles)) {
      if (Object.keys(props).length > 0) {
        css += `.${className} {\n`;
        for (const [prop, value] of Object.entries(props)) {
          css += `  ${prop}: ${value};\n`;
        }
        css += '}\n\n';
      }
    }

    return css;
  }

  // Main execution
  console.log('Extracting CSS for Partner With Us page...');

  // Method 1: Extract from stylesheets
  const allRules = getAllCSSRules();
  const extractedRules = extractCSSForClasses(allRules, targetClasses);

  // Method 2: Extract computed styles from DOM
  const domStyles = extractStylesFromDOM();
  const computedCSS = stylesToCSS(domStyles);

  // Combine results
  const finalCSS = `/* ========================================
   PARTNER WITH US PAGE STYLES
   Extracted from https://www.top10.com/partner-with-us
   ======================================== */

/* From Stylesheets */
${extractedRules.join('\n\n')}

/* From Computed Styles */
${computedCSS}`;

  // Copy to clipboard
  navigator.clipboard.writeText(finalCSS).then(() => {
    console.log('CSS copied to clipboard!');
  }).catch(err => {
    console.log('Could not copy to clipboard:', err);
  });

  // Download as file
  const blob = new Blob([finalCSS], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'partner-with-us.css';
  a.click();
  URL.revokeObjectURL(url);

  console.log('CSS file downloaded!');
  console.log('Total rules extracted:', extractedRules.length);
  console.log('Total computed styles:', Object.keys(domStyles).length);

  return finalCSS;
})();
