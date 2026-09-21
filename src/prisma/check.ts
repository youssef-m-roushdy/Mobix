import 'dotenv/config';
import { PrismaService } from './prisma.service';

async function main() {
  const prisma = new PrismaService();
  await prisma.$connect();
  const count = await prisma.organization.count();
  console.log('organizations:', count);
  await prisma.$disconnect();
}

main().catch(console.error);