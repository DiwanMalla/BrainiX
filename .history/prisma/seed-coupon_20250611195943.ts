import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create the BRAINIX10 coupon
    const coupon = await prisma.coupon.upsert({
      where: { code: "BRAINIX10" },
      update: {},
      create: {
        code: "BRAINIX10",
        description: "10% off on all courses",
        discountType: "PERCENTAGE",
        discountValue: 10,
        startDate: new Date(),
        endDate: new Date("2026-12-31"), // Valid until end of 2026
        isActive: true,
        minOrderValue: 0, // No minimum order value
        maxDiscountAmount: 500, // Maximum discount capped at $500
      },
    });

    console.log("Coupon created:", coupon);
  } catch (error) {
    console.error("Error seeding coupon:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
