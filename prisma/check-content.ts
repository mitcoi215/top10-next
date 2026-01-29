import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const article = await prisma.article.findUnique({
    where: { slug: 'hostgator-alternatives-top-website-hosting-services' },
    select: { content: true }
  });

  if (article?.content) {
    console.log('Content length:', article.content.length);
    console.log('Has newlines (\\n):', article.content.includes('\n'));
    console.log('Newline count:', (article.content.match(/\n/g) || []).length);
    console.log('\nFirst 300 chars:');
    console.log(JSON.stringify(article.content.substring(0, 300)));
  } else {
    console.log('Article not found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
