import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Setting default hero tagline...\n');

  const settings = await prisma.homepageSettings.findFirst();

  if (settings) {
    await prisma.homepageSettings.update({
      where: { id: settings.id },
      data: {
        heroTagline: 'Compare and shop the <span>Top10</span> best services & products for you',
      },
    });
    console.log('✅ Updated heroTagline in HomepageSettings');
  } else {
    await prisma.homepageSettings.create({
      data: {
        heroTagline: 'Compare and shop the <span>Top10</span> best services & products for you',
      },
    });
    console.log('✅ Created HomepageSettings with heroTagline');
  }

  console.log('\n✅ Done!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
