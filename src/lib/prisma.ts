import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@absojadata.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.create({
      data: {
        fullName: 'ABSOJADATA Admin',
        phoneNumber: '+2348000000001',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        wallet: {
          create: { balance: 0 },
        },
      },
    });

    console.log(`Admin user created: ${admin.email}`);
  }

  const defaultPlans = [
    { network: 'MTN', category: 'daily', name: 'Daily 100MB', size: '100MB', validity: '1 day', price: 50, sellingPrice: 70 },
    { network: 'MTN', category: 'daily', name: 'Daily 500MB', size: '500MB', validity: '1 day', price: 110, sellingPrice: 150 },
    { network: 'MTN', category: 'weekly', name: 'Weekly 1.5GB', size: '1.5GB', validity: '7 days', price: 300, sellingPrice: 420 },
    { network: 'MTN', category: 'monthly', name: 'Monthly 1GB', size: '1GB', validity: '30 days', price: 350, sellingPrice: 500 },
    { network: 'MTN', category: 'monthly', name: 'Monthly 5GB', size: '5GB', validity: '30 days', price: 1500, sellingPrice: 1900 },
    { network: 'Airtel', category: 'daily', name: 'Daily 200MB', size: '200MB', validity: '1 day', price: 70, sellingPrice: 100 },
    { network: 'Airtel', category: 'monthly', name: 'Monthly 1GB', size: '1GB', validity: '30 days', price: 400, sellingPrice: 550 },
    { network: 'Airtel', category: 'monthly', name: 'Monthly 5GB', size: '5GB', validity: '30 days', price: 1800, sellingPrice: 2200 },
    { network: 'Glo', category: 'daily', name: 'Daily 500MB', size: '500MB', validity: '1 day', price: 120, sellingPrice: 160 },
    { network: 'Glo', category: 'monthly', name: 'Monthly 2GB', size: '2GB', validity: '30 days', price: 650, sellingPrice: 900 },
    { network: 'Glo', category: 'monthly', name: 'Monthly 10GB', size: '10GB', validity: '30 days', price: 3000, sellingPrice: 3800 },
    { network: '9mobile', category: 'daily', name: 'Daily 250MB', size: '250MB', validity: '1 day', price: 75, sellingPrice: 120 },
    { network: '9mobile', category: 'monthly', name: 'Monthly 1GB', size: '1GB', validity: '30 days', price: 390, sellingPrice: 520 },
    { network: '9mobile', category: 'monthly', name: 'Monthly 5GB', size: '5GB', validity: '30 days', price: 1700, sellingPrice: 2100 },
  ];

  for (const plan of defaultPlans) {
    const existing = await prisma.networkPlan.findFirst({
      where: {
        network: plan.network,
        name: plan.name,
      },
    });

    if (!existing) {
      await prisma.networkPlan.create({ data: plan });
    }
  }

  console.log('Default plans seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
