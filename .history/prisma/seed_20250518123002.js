// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";

const prisma = new PrismaClient();
const seedDataPath = "seed-data.json";

async function main() {
  const rawData = fs.readFileSync(seedDataPath, "utf-8");
  const data = JSON.parse(rawData);

  // Order matters to avoid FK constraint issues
  const order = [
    "User",
    "InstructorProfile",
    "StudentProfile",
    "Category",
    "Course",
    "Module",
    "Lesson",
    "Resource",
    "Quiz",
    "Question",
    "QuizAttempt",
    "Answer",
    "Enrollment",
    "Progress",
    "Note",
    "Certificate",
    "Review",
    "Cart",
    "Wishlist",
    "Coupon",
    "Order",
    "OrderItem",
    "Announcement",
    "Message",
    "Notification",
  ];

  for (const model of order) {
    const items = data[model];
    if (items?.length) {
      console.log(`Seeding ${model} (${items.length} records)...`);
      try {
        await prisma[model[0].toLowerCase() + model.slice(1)].createMany({
          data: items,
          skipDuplicates: true,
        });
      } catch (e) {
        console.error(`Failed seeding ${model}:`, e);
      }
    }
  }

  console.log("🌱 Seeding complete!");
}

main().finally(() => prisma.$disconnect());
