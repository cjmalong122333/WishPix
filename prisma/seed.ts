import { ensureDatabaseSeeded } from "../lib/db-seed";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding WishPix SQLite database...");
  await ensureDatabaseSeeded();
  const [educatorCount, kioskCount, sessionCount, generationCount, moderationCount] =
    await Promise.all([
      prisma.educator.count(),
      prisma.kiosk.count(),
      prisma.session.count(),
      prisma.generation.count(),
      prisma.moderationItem.count(),
    ]);
  console.log(
    `Seeded successfully: ${educatorCount} educators, ${kioskCount} kiosks, ${sessionCount} sessions, ${generationCount} generations, ${moderationCount} moderation items.`
  );
}

main()
  .catch((err) => {
    console.error("Failed to seed database:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
