import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.systemConfig.findFirst();

  if (existing) {
    console.log("SystemConfig already exists. Skipping seed.");
    return;
  }

  await prisma.systemConfig.create({
    data: {
      name: "Claudia Atwell",
      email: "purchase@targett-group.info",
      companyName: "Targett Group Corporation",
      address: "1000 Nicollet Mall, Minneapolis, MN",
      postalCode: "55403",
      town: "Minneapolis",
      city: "Minneapolis",
      country: "United States",
      position: "Procurement Manager",
      phone: "+1 410-293-3994",
      message:
        "Dear Team, my name is Claudia Atwell, reaching out from Target's procurement division. We are currently evaluating potential suppliers for our upcoming project and came across your company. Could you please connect me with the appropriate contact person for business or product inquiries?",
    },
  });

  console.log("SystemConfig seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
