const fs = require('fs');

// Read all component files
const files = [
  'components/top10/category/CategoryHeader.tsx',
  'components/top10/category/ProductCard.tsx',
  'components/top10/category/ProductList.tsx',
  'components/top10/category/BestOfList.tsx',
  'components/top10/category/CategoryContent.tsx',
  'components/top10/category/FAQSection.tsx',
  'components/top10/category/RelatedArticles.tsx',
  'app/tv-services/page.tsx'
];

const allClasses = new Set();

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Find all className values
    const matches = content.match(/className="([^"]+)"/g) || [];
    matches.forEach(m => {
      const classes = m.replace('className="', '').replace('"', '').split(' ');
      classes.forEach(c => {
        if (c.trim()) allClasses.add(c.trim());
      });
    });
    // Find className with curly braces
    const braceMatches = content.match(/className=\{([^}]+)\}/g) || [];
    braceMatches.forEach(m => {
      // Extract string literals from the expression
      const strMatches = m.match(/'([^']+)'/g) || [];
      strMatches.forEach(s => {
        const classes = s.replace(/'/g, '').split(' ');
        classes.forEach(c => {
          if (c.trim()) allClasses.add(c.trim());
        });
      });
    });
  } catch(e) {
    console.log('Error reading', file, e.message);
  }
});

console.log('=== ALL CSS CLASSES USED IN COMPONENTS ===');
const sortedClasses = [...allClasses].sort();
sortedClasses.forEach(c => console.log(c));
console.log('');
console.log('Total:', allClasses.size, 'classes');

// Save to file for reference
fs.writeFileSync('scripts/used-classes.txt', sortedClasses.join('\n'));
