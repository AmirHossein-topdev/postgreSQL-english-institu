const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("🗑️  Starting database cleanup...");

  try {
    // حذف به ترتیب درست (به خاطر Foreign Key Constraints)
    await prisma.enrollment.deleteMany();
    await prisma.classSession.deleteMany();
    await prisma.class.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.book.deleteMany();
    await prisma.user.deleteMany();

    console.log("✅ Database has been successfully cleared!");
  } catch (error) {
    console.error("❌ Error while clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
