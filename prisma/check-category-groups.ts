import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const groups = await prisma.categoryGroup.findMany({
    orderBy: { order: 'asc' },
    include: {
      categories: {
        select: { name: true, icon: true }
      }
    }
  });

  console.log('=== Category Groups ===\n');
  groups.forEach(g => {
    console.log(`${g.name}:`);
    console.log(`  icon: "${g.icon}"`);
    console.log(`  categories: ${g.categories.length}`);
    console.log('');
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
