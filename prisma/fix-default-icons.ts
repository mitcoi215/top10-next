import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Fixing default icons in categories...\n');

  // Find categories with default.svg icon
  const categoriesWithDefault = await prisma.category.findMany({
    where: {
      OR: [
        { icon: { contains: 'default.svg' } },
        { icon: { startsWith: '/icons/' } },
      ]
    }
  });

  console.log(`Found ${categoriesWithDefault.length} categories with default icons`);

  // Update each category to have empty icon
  for (const category of categoriesWithDefault) {
    await prisma.category.update({
      where: { id: category.id },
      data: { icon: '' }
    });
    console.log(`  - Cleared icon for: ${category.name}`);
  }

  console.log('\n✅ Done! Categories with default icons have been cleared.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
