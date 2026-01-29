// Seed script to add bottom content (comparison table) to a category
// Run with: npx ts-node prisma/seed-bottom-content.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bottomContent = [
  {
    id: "comparison-table-hosting-2024",
    type: "comparison-table",
    data: {
      title: "How to Compare the Best Web Hosting Services",
      description: "Compare pricing, features, uptime guarantees, and more across the top hosting providers.",
      columns: [
        { key: "best_for", label: "Best For" },
        { key: "starting_price", label: "Starting Price" },
        { key: "moneyback", label: "Moneyback Guarantee" },
        { key: "uptime", label: "Uptime" },
        { key: "storage", label: "Storage" },
        { key: "bandwidth", label: "Bandwidth" }
      ],
      rows: [
        {
          provider: "Bluehost",
          values: {
            best_for: "Overall web hosting service",
            starting_price: "From $2.75/month",
            moneyback: "30 days",
            uptime: "99.99%",
            storage: "Limited (10GB)",
            bandwidth: "Unmetered"
          }
        },
        {
          provider: "Hostinger",
          values: {
            best_for: "Long-term savings",
            starting_price: "From $1.99/month for 4 years",
            moneyback: "30 days",
            uptime: "99.9%",
            storage: "50GB SSD",
            bandwidth: "100GB"
          }
        },
        {
          provider: "GoDaddy",
          values: {
            best_for: "Unlimited storage and bandwidth",
            starting_price: "From $5.99/month for 3 years",
            moneyback: "30 days",
            uptime: "99.9%",
            storage: "Unlimited",
            bandwidth: "Unlimited"
          }
        },
        {
          provider: "IONOS",
          values: {
            best_for: "Affordable hosting plans",
            starting_price: "From $1/month for 1 year",
            moneyback: "30 days",
            uptime: "99.9%",
            storage: "50GB SSD",
            bandwidth: "Unlimited"
          }
        },
        {
          provider: "HostGator",
          values: {
            best_for: "Heavy email use",
            starting_price: "From $2.75/month for 3 years",
            moneyback: "30 days",
            uptime: "99%",
            storage: "Unlimited",
            bandwidth: "Unmetered"
          }
        },
        {
          provider: "DreamHost",
          values: {
            best_for: "Guaranteed uptime",
            starting_price: "From $2.59/month for 3 years",
            moneyback: "97 days",
            uptime: "100%",
            storage: "Unlimited",
            bandwidth: "Unmetered"
          }
        },
        {
          provider: "Web.com",
          values: {
            best_for: "Unlimited data transfer",
            starting_price: "From $2.75/month for 3 years",
            moneyback: "No",
            uptime: "99.9%",
            storage: "Unlimited",
            bandwidth: "Unmetered"
          }
        },
        {
          provider: "Network Solutions",
          values: {
            best_for: "24/7 chat support",
            starting_price: "From $5.69/month for 1 year",
            moneyback: "No",
            uptime: "99.9%",
            storage: "15GB",
            bandwidth: "Not specified"
          }
        },
        {
          provider: "HostPapa",
          values: {
            best_for: "Small to medium-sized businesses",
            starting_price: "From $3.95 per month",
            moneyback: "30 days",
            uptime: "99.9%",
            storage: "Ample",
            bandwidth: "Unlimited"
          }
        },
        {
          provider: "A2 Hosting",
          values: {
            best_for: "Lots of server space",
            starting_price: "From $2.99/month for 1 year",
            moneyback: "30 days",
            uptime: "99.9%",
            storage: "100GB SSD",
            bandwidth: "Unlimited"
          }
        }
      ]
    }
  }
];

async function main() {
  // Update the hosting category with the bottom content
  const category = await prisma.category.update({
    where: { slug: 'hosting' },
    data: {
      bottomContent: JSON.stringify(bottomContent),
    },
  });

  console.log(`✅ Updated category "${category.name}" with comparison table data`);
  console.log(`   - 10 providers added`);
  console.log(`   - 6 columns: Best For, Starting Price, Moneyback, Uptime, Storage, Bandwidth`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
