import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";


const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(" Initializing Seeding");

  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log(`Admin created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin already exists");
  }

  const categories = [
  {
    name: "Electrical",
    description: "Professional electrical installation, wiring, lighting, and repair services.",
  },
  {
    name: "Plumbing",
    description: "Expert plumbing solutions including leak repairs, pipe installation, and drain cleaning.",
  },
  {
    name: "Cleaning",
    description: "Reliable residential and commercial cleaning services for a spotless environment.",
  },
  {
    name: "Painting",
    description: "Interior and exterior painting services with quality finishes for homes and offices.",
  },
];

  for (const category of categories) {
    const exists = await prisma.category.findUnique({
      where: { name: category.name },
    });

    if (!exists) {
      await prisma.category.create({ data: category });
      console.log(`Category created: ${category.name}`);
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((er) => {
    console.error("Seeding failed:", er);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });