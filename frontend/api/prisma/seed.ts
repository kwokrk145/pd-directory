import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [
    {
      email: "alice@example.com",
      firstName: "Alice",
      lastName: "Nguyen",
      passwordHash,
      experiences: {
        create: [
          {
            title: "Software Engineer Intern",
            organization: "Acme Labs",
            startDate: "2024-06",
            endDate: "2024-08",
            description: "Built internal tooling for developer workflows.",
          },
        ],
      },
    },
    {
      email: "brian@example.com",
      firstName: "Brian",
      lastName: "Johnson",
      passwordHash,
      experiences: {
        create: [
          {
            title: "Research Assistant",
            organization: "University Lab",
            startDate: "2023-09",
            endDate: "2024-05",
            description: "Worked on data visualization and ETL scripts.",
          },
        ],
      },
    },
    {
      email: "carla@example.com",
      firstName: "Carla",
      lastName: "Rivera",
      passwordHash,
      experiences: {
        create: [
          {
            title: "Product Design Lead",
            organization: "Startup Studio",
            startDate: "2022-01",
            endDate: "Present",
            description: "Led design systems and cross-functional roadmaps.",
          },
        ],
      },
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash: user.passwordHash,
      },
      create: user,
    });
  }

  const count = await prisma.user.count();
  console.log(`Seed complete. Users in database: ${count}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
