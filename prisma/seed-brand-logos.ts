import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const brandLogos = [
  { name: 'Better Help', logo: '/top10-images/betterhelp.20240618082918.svg' },
  { name: 'Peddle', logo: '/top10-images/300x100-Dark-NoBg3.20250211121928.svg' },
  { name: 'Sling', logo: '/top10-images/sling.20240618083121.svg' },
  { name: 'GoDaddy', logo: '/top10-images/300x100-Dark-NoBg.20250211121800.svg' },
  { name: 'ADT', logo: '/top10-images/300x100-Dark-NoBg1.20250211121842.svg' },
  { name: 'WIX', logo: '/top10-images/300x100-Dark-NoBg2.20250211121906.svg' },
];

async function main() {
  console.log('🔄 Adding brand logos to settings...\n');

  // Get current homepage settings
  let settings = await prisma.homepageSettings.findFirst();

  if (settings) {
    // Update existing
    await prisma.homepageSettings.update({
      where: { id: settings.id },
      data: { brandLogos: brandLogos }
    });
    console.log('✅ Updated brandLogos in HomepageSettings');
  } else {
    // Create new settings record
    await prisma.homepageSettings.create({
      data: {
        brandLogos: brandLogos
      }
    });
    console.log('✅ Created HomepageSettings with brandLogos');
  }

  console.log('\nBrand logos added:');
  brandLogos.forEach((logo, i) => {
    console.log(`  ${i + 1}. ${logo.name}`);
  });

  console.log('\n✅ Done! Refresh the admin settings page to see them.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
