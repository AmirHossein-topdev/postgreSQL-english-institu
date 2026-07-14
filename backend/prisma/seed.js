const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  console.log("Creating Users...");

  // Admin
  const admin = await prisma.user.upsert({
    where: { employeeCode: "10001" },
    update: {},
    create: {
      employeeCode: "10001",
      name: "مدیر سیستم",
      password: hashedPassword,
      role: "Admin",
      email: "admin@langcenter.com",
      phone: "09123456789",
      address: "تهران، خیابان انقلاب",
      profileImage: "default-avatar.png",
      status: "ACTIVE",
      birthday: "1985-05-15",
    },
  });

  // Teachers
  const teacher1 = await prisma.user.upsert({
    where: { employeeCode: "20001" },
    update: {},
    create: {
      employeeCode: "20001",
      name: "استاد احمد رضایی",
      password: hashedPassword,
      role: "Teacher",
      email: "ahmad.rezaei@langcenter.com",
      phone: "09127654321",
      address: "تهران، سعادت آباد",
      profileImage: "profiles/teacher1.jpg",
      status: "ACTIVE",
      birthday: "1978-03-22",
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { employeeCode: "20002" },
    update: {},
    create: {
      employeeCode: "20002",
      name: "خانم سارا محمدی",
      password: hashedPassword,
      role: "Teacher",
      email: "sara.mohammadi@langcenter.com",
      phone: "09351234567",
      address: "اصفهان، خیابان امام",
      profileImage: "profiles/teacher2.jpg",
      status: "ACTIVE",
      birthday: "1982-11-08",
    },
  });

  // Students
  const student1 = await prisma.user.upsert({
    where: { employeeCode: "30001" },
    update: {},
    create: {
      employeeCode: "30001",
      name: "علی حسینی",
      password: hashedPassword,
      role: "Student",
      email: "ali.hosseini@langcenter.com",
      phone: "09119876543",
      address: "تهران، پاسداران",
      profileImage: "profiles/student1.jpg",
      status: "ACTIVE",
      birthday: "2005-07-12",
    },
  });

  const student2 = await prisma.user.upsert({
    where: { employeeCode: "30002" },
    update: {},
    create: {
      employeeCode: "30002",
      name: "فاطمه کریمی",
      password: hashedPassword,
      role: "Student",
      email: "fatemeh.karimi@langcenter.com",
      phone: "09213456789",
      address: "مشهد، خیابان احمدآباد",
      profileImage: "profiles/student2.jpg",
      status: "ACTIVE",
      birthday: "2006-01-25",
    },
  });

  const student3 = await prisma.user.upsert({
    where: { employeeCode: "30003" },
    update: {},
    create: {
      employeeCode: "30003",
      name: "محمد رضایی",
      password: hashedPassword,
      role: "Student",
      email: "mohammad.rezaei@langcenter.com",
      phone: "09134567890",
      address: "شیراز، حافظیه",
      profileImage: "profiles/student3.jpg",
      status: "ACTIVE",
      birthday: "2004-09-10",
    },
  });

  console.log("Creating Teacher Profiles...");
  await prisma.teacher.upsert({
    where: { userId: teacher1.id },
    update: {},
    create: {
      userId: teacher1.id,
      specialization: "IELTS, TOEFL, Conversation",
      hireDate: new Date("2022-01-15"),
      salary: 45000000,
      resume: "بیش از ۱۰ سال تجربه تدریس زبان انگلیسی در سطوح مختلف.",
    },
  });

  await prisma.teacher.upsert({
    where: { userId: teacher2.id },
    update: {},
    create: {
      userId: teacher2.id,
      specialization: "Grammar, Writing, Kids",
      hireDate: new Date("2023-03-01"),
      salary: 38000000,
      resume: "متخصص تدریس کودکان و گرامر پیشرفته.",
    },
  });

  console.log("Creating Student Profiles...");
  await prisma.student.upsert({
    where: { userId: student1.id },
    update: {},
    create: {
      userId: student1.id,
      level: "B1",
      emergencyPhone: "09127654321",
    },
  });

  await prisma.student.upsert({
    where: { userId: student2.id },
    update: {},
    create: {
      userId: student2.id,
      level: "A2",
      emergencyPhone: "09351234567",
    },
  });

  await prisma.student.upsert({
    where: { userId: student3.id },
    update: {},
    create: {
      userId: student3.id,
      level: "B2",
      emergencyPhone: "09134567890",
    },
  });

  console.log("Creating Classes...");

  const class1 = await prisma.class.upsert({
    where: { id: "class-ielts-1" },
    update: {},
    create: {
      id: "class-ielts-1",
      name: "کلاس IELTS مقدماتی",
      level: "B1",
      teacherId: teacher1.id,
      term: "بهار ۱۴۰۵",
      tuition: 8500000,
      schedule: "یکشنبه و سه‌شنبه ۱۸:۰۰ - ۲۰:۰۰",
      room: "اتاق ۱۰۱",
      status: "UNDER_REGISTRATION",
      createdById: admin.id,
      isConfirmed: true,
      confirmedAt: new Date(),
      startDate: new Date("2025-04-05"),
      endDate: new Date("2025-07-05"),
      capacity: 12,
      totalSessions: 24,
      description:
        "آماده‌سازی کامل برای آزمون آیلتس با تمرکز بر هر چهار مهارت.",
    },
  });

  const class2 = await prisma.class.upsert({
    where: { id: "class-conv-1" },
    update: {},
    create: {
      id: "class-conv-1",
      name: "مکالمه انگلیسی سطح متوسط",
      level: "B1",
      teacherId: teacher2.id,
      term: "بهار ۱۴۰۵",
      tuition: 6500000,
      schedule: "دوشنبه و چهارشنبه ۱۷:۰۰ - ۱۹:۰۰",
      room: "اتاق ۲۰۳",
      status: "ACTIVE",
      createdById: admin.id,
      isConfirmed: true,
      confirmedAt: new Date(),
      startDate: new Date("2025-03-20"),
      endDate: new Date("2025-06-20"),
      capacity: 10,
      totalSessions: 20,
      description: "تمرکز روی مکالمه روزمره و fluency.",
    },
  });

  console.log("Creating Class Sessions...");

  // Sessions for Class 1
  for (let i = 1; i <= 24; i++) {
    await prisma.classSession.upsert({
      where: {
        classId_sessionNumber: { classId: class1.id, sessionNumber: i },
      },
      update: {},
      create: {
        classId: class1.id,
        sessionNumber: i,
        date: new Date(2025, 3, 5 + (i - 1) * 3),
        topic: i % 4 === 0 ? "تمرین کامل تست آیلتس" : `جلسه ${i}`,
        isCompleted: i < 8,
      },
    });
  }

  // Sessions for Class 2
  for (let i = 1; i <= 20; i++) {
    await prisma.classSession.upsert({
      where: {
        classId_sessionNumber: { classId: class2.id, sessionNumber: i },
      },
      update: {},
      create: {
        classId: class2.id,
        sessionNumber: i,
        date: new Date(2025, 2, 20 + (i - 1) * 2),
        topic: `مکالمه موضوع ${i}`,
        isCompleted: i < 5,
      },
    });
  }

  console.log("Creating Enrollments...");

  await prisma.enrollment.upsert({
    where: { userId_classId: { userId: student1.id, classId: class1.id } },
    update: {},
    create: {
      userId: student1.id,
      classId: class1.id,
      status: "IN_PROGRESS",
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_classId: { userId: student2.id, classId: class2.id } },
    update: {},
    create: {
      userId: student2.id,
      classId: class2.id,
      status: "IN_PROGRESS",
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_classId: { userId: student3.id, classId: class1.id } },
    update: {},
    create: {
      userId: student3.id,
      classId: class1.id,
      status: "IN_PROGRESS",
    },
  });

  console.log("Creating Books...");

  const books = [
    {
      productId: 1001,
      category: "IELTS",
      name: "Cambridge IELTS 18",
      level: "B2",
      price: 1250000,
      img: "books/ielts18.jpg",
      stock: 45,
      description: "آخرین کتاب کمبریج برای آمادگی آیلتس",
      language: "English",
      status: "AVAILABLE",
    },
    {
      productId: 1002,
      category: "Conversation",
      name: "English File Intermediate",
      level: "B1",
      price: 980000,
      img: "books/englishfile.jpg",
      stock: 32,
      description: "بهترین منبع برای تقویت مکالمه",
      language: "English",
      status: "AVAILABLE",
    },
    {
      productId: 1003,
      category: "Kids",
      name: "Family and Friends 3",
      level: "A2",
      price: 750000,
      img: "books/familyfriends3.jpg",
      stock: 28,
      description: "کتاب کودکان سطح متوسط",
      language: "English",
      status: "AVAILABLE",
    },
    {
      productId: 1004,
      category: "Grammar",
      name: "English Grammar in Use",
      level: "B1",
      price: 890000,
      img: "books/grammarinuse.jpg",
      stock: 50,
      description: "مرجع کامل گرامر انگلیسی",
      language: "English",
      status: "AVAILABLE",
    },
    {
      productId: 1005,
      category: "TOEFL",
      name: "Official TOEFL iBT Tests",
      level: "C1",
      price: 1450000,
      img: "books/toefl.jpg",
      stock: 18,
      description: "تست‌های رسمی تافل",
      language: "English",
      status: "AVAILABLE",
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { productId: book.productId },
      update: {},
      create: book,
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
