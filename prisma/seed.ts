import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing database...');
  await prisma.lessonRecord.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.classMember.deleteMany();
  await prisma.classGroup.deleteMany();
  await prisma.student.deleteMany();
  await prisma.course.deleteMany();
  await prisma.teacherProfile.deleteMany();

  console.log('Creating Teacher Profile...');
  await prisma.teacherProfile.create({
    data: {
      fullName: 'Nguyễn Đình Linh',
      email: 'linh.nguyen@example.com',
      phone: '0901234567',
      bankName: 'MBBANK',
      bankAccount: '0901234567',
      bankAccountName: 'NGUYEN DINH LINH',
    },
  });

  console.log('Creating Courses...');
  const cIELTS = await prisma.course.create({
    data: {
      name: 'IELTS Intensive',
      code: 'IELTS-INT',
      level: 'IELTS',
      description: 'Luyện thi chứng chỉ IELTS 6.5 - 7.5+',
    },
  });

  const cPreIELTS = await prisma.course.create({
    data: {
      name: 'Pre-IELTS Foundation',
      code: 'PRE-IELTS',
      level: 'IELTS',
      description: 'Xây dựng nền tảng từ vựng và ngữ pháp học thuật',
    },
  });

  const cC1 = await prisma.course.create({
    data: {
      name: 'Cambridge C1 Advanced (CAE)',
      code: 'CAM-C1',
      level: 'C1',
      description: 'Khóa học tiếng Anh cao cấp trình độ C1',
    },
  });

  const cB2 = await prisma.course.create({
    data: {
      name: 'Cambridge B2 First (FCE)',
      code: 'CAM-B2',
      level: 'B2',
      description: 'Luyện thi chứng chỉ quốc tế Cambridge B2',
    },
  });

  const cB1 = await prisma.course.create({
    data: {
      name: 'Cambridge B1 Preliminary (PET)',
      code: 'CAM-B1',
      level: 'B1',
      description: 'Khóa học củng cố nền tảng giao tiếp và thi B1',
    },
  });

  const cG6 = await prisma.course.create({
    data: {
      name: 'Tiếng Anh Thiếu Nhi G6',
      code: 'ENG-G6',
      level: 'G6',
      description: 'Chương trình phát triển toàn diện cho học sinh lớp 6',
    },
  });

  const cGeneral = await prisma.course.create({
    data: {
      name: 'Giao Tiếp & Câu Lạc Bộ',
      code: 'CLUB',
      level: 'GENERAL',
      description: 'Hoạt động câu lạc bộ và giao tiếp tiếng Anh định kỳ',
    },
  });

  console.log('Creating Students...');
  const studentsData = [
    { name: 'Yến Ngọc', email: 'yenngoc@gmail.com', phone: '0981112233', parentName: 'Chị Mai', parentEmail: 'maiparent.yn@gmail.com' },
    { name: 'Mạnh', email: 'manh.ielts@gmail.com', phone: '0982223344', parentName: 'Anh Dũng', parentEmail: 'dungparent.m@gmail.com' },
    { name: 'Nghi', email: 'nghi.ielts@gmail.com', phone: '0983334455', parentName: 'Chị Lan', parentEmail: 'lanparent.n@gmail.com' },
    { name: 'Minh Hiền', email: 'minhhien@gmail.com', phone: '0984445566', parentName: 'Chị Hương', parentEmail: 'huongparent.mh@gmail.com' },
    { name: 'Dương', email: 'duong.ielts@gmail.com', phone: '0985556677', parentName: 'Anh Hùng', parentEmail: 'hungparent.d@gmail.com' },
    { name: 'Burin', email: 'burin@gmail.com', phone: '0986667788', parentName: 'Chị Thảo', parentEmail: 'thaoparent.b@gmail.com' },
    { name: 'Fa', email: 'fa.pre@gmail.com', phone: '0987778899', parentName: 'Anh Nam', parentEmail: 'namparent.fa@gmail.com' },
    { name: 'Sarah', email: 'sarah.c1@gmail.com', phone: '0988889900', parentName: 'Chị Ngọc', parentEmail: 'ngocparent.s@gmail.com' },
    { name: 'Andy', email: 'andy.c1@gmail.com', phone: '0989990011', parentName: 'Anh Tuấn', parentEmail: 'tuanparent.a@gmail.com' },
    { name: 'Tony', email: 'tony.c1@gmail.com', phone: '0971112233', parentName: 'Chị Thủy', parentEmail: 'thuyparent.t@gmail.com' },
    { name: 'Chi', email: 'chi.c1@gmail.com', phone: '0972223344', parentName: 'Anh Bình', parentEmail: 'binhparent.c@gmail.com' },
    { name: 'Ane', email: 'ane.b2@gmail.com', phone: '0973334455', parentName: 'Chị Vy', parentEmail: 'vyparent.ane@gmail.com' },
    { name: 'Sunday', email: 'sunday.b2@gmail.com', phone: '0974445566', parentName: 'Anh Phúc', parentEmail: 'phucparent.sun@gmail.com' },
    { name: 'Lyna', email: 'lyna.b2@gmail.com', phone: '0975556677', parentName: 'Chị Trâm', parentEmail: 'tramparent.ly@gmail.com' },
    { name: 'Linh', email: 'linh.b2@gmail.com', phone: '0976667788', parentName: 'Anh Khoa', parentEmail: 'khoaparent.l@gmail.com' },
    { name: 'My', email: 'my.b2@gmail.com', phone: '0977778899', parentName: 'Chị Hồng', parentEmail: 'hongparent.m@gmail.com' },
    { name: 'Khoa', email: 'khoa.b2@gmail.com', phone: '0978889900', parentName: 'Anh Đạt', parentEmail: 'datparent.k@gmail.com' },
    { name: 'David', email: 'david.b1@gmail.com', phone: '0979990011', parentName: 'Chị Phương', parentEmail: 'phuongparent.d@gmail.com' },
    { name: 'Linda', email: 'linda.b1@gmail.com', phone: '0961112233', parentName: 'Anh Minh', parentEmail: 'minhparent.l@gmail.com' },
    { name: 'Fin', email: 'fin.english@gmail.com', phone: '0962223344', parentName: 'Chị Oanh', parentEmail: 'oanhparent.fin@gmail.com' },
  ];

  const studentsMap: Record<string, any> = {};
  for (const s of studentsData) {
    const created = await prisma.student.create({ data: s });
    studentsMap[s.name] = created;
  }

  console.log('Creating Class Groups & Members...');
  const classesData = [
    {
      name: 'ANEX Office (Văn phòng)',
      category: 'OFFICE',
      color: '#64748b',
      locationOrLink: 'Văn phòng ANEX',
      courseId: null,
      members: [],
    },
    {
      name: 'IELTS 6.5 - Yến Ngọc',
      category: 'TUTORING',
      color: '#3b82f6',
      locationOrLink: 'Google Meet',
      courseId: cIELTS.id,
      members: ['Yến Ngọc'],
    },
    {
      name: 'IELTS 6.5 - Mạnh & Nghi',
      category: 'TUTORING',
      color: '#0284c7',
      locationOrLink: 'Google Meet',
      courseId: cIELTS.id,
      members: ['Mạnh', 'Nghi'],
    },
    {
      name: 'IELTS - Minh Hiền',
      category: 'TUTORING',
      color: '#0ea5e9',
      locationOrLink: 'Google Meet',
      courseId: cIELTS.id,
      members: ['Minh Hiền'],
    },
    {
      name: 'IELTS - Dương',
      category: 'TUTORING',
      color: '#38bdf8',
      locationOrLink: 'Google Meet',
      courseId: cIELTS.id,
      members: ['Dương'],
    },
    {
      name: 'Pre-IELTS - Burin & Fa',
      category: 'TUTORING',
      color: '#6366f1',
      locationOrLink: 'Google Meet',
      courseId: cPreIELTS.id,
      members: ['Burin', 'Fa'],
    },
    {
      name: 'C1 - Sarah + Andy',
      category: 'TUTORING',
      color: '#8b5cf6',
      locationOrLink: 'Google Meet',
      courseId: cC1.id,
      members: ['Sarah', 'Andy'],
    },
    {
      name: 'C1 - Tony + Chi',
      category: 'TUTORING',
      color: '#a855f7',
      locationOrLink: 'Google Meet',
      courseId: cC1.id,
      members: ['Tony', 'Chi'],
    },
    {
      name: 'B2 - Ane & Sunday',
      category: 'TUTORING',
      color: '#10b981',
      locationOrLink: 'Google Meet',
      courseId: cB2.id,
      members: ['Ane', 'Sunday'],
    },
    {
      name: 'B2 - Lyna + Linh',
      category: 'TUTORING',
      color: '#059669',
      locationOrLink: 'Google Meet',
      courseId: cB2.id,
      members: ['Lyna', 'Linh'],
    },
    {
      name: 'B2 - My + Khoa',
      category: 'TUTORING',
      color: '#14b8a6',
      locationOrLink: 'Google Meet',
      courseId: cB2.id,
      members: ['My', 'Khoa'],
    },
    {
      name: 'B1 - David + Linda',
      category: 'TUTORING',
      color: '#f59e0b',
      locationOrLink: 'Google Meet',
      courseId: cB1.id,
      members: ['David', 'Linda'],
    },
    {
      name: 'G6 - David + Andy',
      category: 'TUTORING',
      color: '#ec4899',
      locationOrLink: 'Phòng học trực tiếp',
      courseId: cG6.id,
      members: ['David', 'Andy'],
    },
    {
      name: 'Lớp Fin',
      category: 'TUTORING',
      color: '#f97316',
      locationOrLink: 'Google Meet',
      courseId: cGeneral.id,
      members: ['Fin'],
    },
    {
      name: 'Heineken English Club (Bi-weekly)',
      category: 'CLUB',
      color: '#84cc16',
      locationOrLink: 'Heineken Office / Cafe',
      courseId: cGeneral.id,
      members: [],
    },
  ];

  const classMap: Record<string, any> = {};
  for (const c of classesData) {
    const createdClass = await prisma.classGroup.create({
      data: {
        name: c.name,
        category: c.category,
        color: c.color,
        locationOrLink: c.locationOrLink,
        courseId: c.courseId,
      },
    });
    classMap[c.name] = createdClass;

    for (const mem of c.members) {
      if (studentsMap[mem]) {
        await prisma.classMember.create({
          data: {
            classGroupId: createdClass.id,
            studentId: studentsMap[mem].id,
          },
        });
      }
    }
  }

  console.log('Creating Enrollments with realistic session counts...');
  // Yến Ngọc: 24 buổi, đã học 22 buổi -> CÒN 2 BUỔI (Sắp hết, cảnh báo!)
  await prisma.enrollment.create({
    data: {
      studentId: studentsMap['Yến Ngọc'].id,
      classGroupId: classMap['IELTS 6.5 - Yến Ngọc'].id,
      title: 'Gói IELTS 6.5 Mục tiêu (Đợt 1)',
      totalSessions: 24,
      pricePerSession: 300000,
      totalAmount: 7200000,
      paidAmount: 7200000,
      paymentStatus: 'PAID',
      notes: 'Đã hoàn thành 22 buổi. Cần gia hạn đợt 2!',
    },
  });

  // Tạo 22 records bài học cho Yến Ngọc
  for (let i = 1; i <= 22; i++) {
    await prisma.lessonRecord.create({
      data: {
        classGroupId: classMap['IELTS 6.5 - Yến Ngọc'].id,
        studentId: studentsMap['Yến Ngọc'].id,
        sessionNumber: i,
        topic: `IELTS Task ${i % 2 === 0 ? 'Writing 2' : 'Speaking Part 2'} - Topic ${i}`,
        skillsCovered: i % 2 === 0 ? 'Writing, Vocabulary' : 'Speaking, Fluency',
        teacherNotes: `Buổi ${i}: Nắm tốt cấu trúc, cần cải thiện phản xạ và tự nhiên hơn.`,
        homework: `Hoàn thành bài tập Unit ${i}`,
        performanceScore: 7.0 + (i % 3) * 0.5,
        attendance: 'PRESENT',
        date: new Date(Date.now() - (23 - i) * 3 * 86400000),
      },
    });
  }

  // Sarah: Gói 20 buổi, đã học 19 buổi -> CÒN 1 BUỔI (Cảnh báo đỏ!)
  await prisma.enrollment.create({
    data: {
      studentId: studentsMap['Sarah'].id,
      classGroupId: classMap['C1 - Sarah + Andy'].id,
      title: 'Khóa Cambridge C1 Advanced',
      totalSessions: 20,
      pricePerSession: 350000,
      totalAmount: 7000000,
      paidAmount: 7000000,
      paymentStatus: 'PAID',
      notes: 'Sắp hoàn tất khóa, còn 1 buổi.',
    },
  });

  for (let i = 1; i <= 19; i++) {
    await prisma.lessonRecord.create({
      data: {
        classGroupId: classMap['C1 - Sarah + Andy'].id,
        studentId: studentsMap['Sarah'].id,
        sessionNumber: i,
        topic: `C1 Advanced Paper ${i % 4 + 1}`,
        skillsCovered: 'Reading & Use of English, Listening',
        teacherNotes: 'Làm bài chắc chắn, từ vựng C1 phong phú.',
        attendance: 'PRESENT',
        performanceScore: 8.5,
        date: new Date(Date.now() - (20 - i) * 4 * 86400000),
      },
    });
  }

  // Mạnh & Nghi: Gói 30 buổi, đã học 12 buổi -> Còn 18 buổi
  for (const name of ['Mạnh', 'Nghi']) {
    await prisma.enrollment.create({
      data: {
        studentId: studentsMap[name].id,
        classGroupId: classMap['IELTS 6.5 - Mạnh & Nghi'].id,
        title: 'IELTS Nhóm 6.5 Foundation',
        totalSessions: 30,
        pricePerSession: 250000,
        totalAmount: 7500000,
        paidAmount: 7500000,
        paymentStatus: 'PAID',
      },
    });

    for (let i = 1; i <= 12; i++) {
      await prisma.lessonRecord.create({
        data: {
          classGroupId: classMap['IELTS 6.5 - Mạnh & Nghi'].id,
          studentId: studentsMap[name].id,
          sessionNumber: i,
          topic: `IELTS Listening & Reading Practice ${i}`,
          skillsCovered: 'Listening, Reading',
          teacherNotes: 'Tham gia sôi nổi, hoàn thành bài tập đúng hạn.',
          attendance: 'PRESENT',
          performanceScore: 7.0,
          date: new Date(Date.now() - (13 - i) * 3 * 86400000),
        },
      });
    }
  }

  // Tony & Chi (C1): Gói 20 buổi, đã học 10 buổi
  for (const name of ['Tony', 'Chi']) {
    await prisma.enrollment.create({
      data: {
        studentId: studentsMap[name].id,
        classGroupId: classMap['C1 - Tony + Chi'].id,
        title: 'C1 Master Class',
        totalSessions: 20,
        pricePerSession: 350000,
        totalAmount: 7000000,
        paidAmount: 7000000,
        paymentStatus: 'PAID',
      },
    });
  }

  // David & Linda (B1): Gói 20 buổi, đã học 5 buổi
  for (const name of ['David', 'Linda']) {
    await prisma.enrollment.create({
      data: {
        studentId: studentsMap[name].id,
        classGroupId: classMap['B1 - David + Linda'].id,
        title: 'B1 Preliminary Starter',
        totalSessions: 20,
        pricePerSession: 250000,
        totalAmount: 5000000,
        paidAmount: 5000000,
        paymentStatus: 'PAID',
      },
    });
  }

  console.log('Generating Timetable Schedules for the current week and next week...');
  // Helper to generate schedules
  // Current Monday
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon
  const diffToMon = (dayOfWeek + 6) % 7;
  const currentMon = new Date(today);
  currentMon.setDate(today.getDate() - diffToMon);
  currentMon.setHours(0, 0, 0, 0);

  const getSlot = (weekOffset: number, dayIdx: number, startHour: number, startMin: number, endHour: number, endMin: number) => {
    const dStart = new Date(currentMon);
    dStart.setDate(currentMon.getDate() + (weekOffset * 7) + dayIdx);
    dStart.setHours(startHour, startMin, 0, 0);

    const dEnd = new Date(dStart);
    dEnd.setHours(endHour, endMin, 0, 0);
    return { startTime: dStart, endTime: dEnd };
  };

  // Generate for 2 weeks: weekOffset 0 (this week) and 1 (next week)
  for (const w of [0, 1]) {
    // 1. ANEX Office (Mon-Fri 09:00 - 12:00)
    for (let day = 0; day < 5; day++) {
      const slot = getSlot(w, day, 9, 0, 12, 0);
      await prisma.schedule.create({
        data: {
          classGroupId: classMap['ANEX Office (Văn phòng)'].id,
          title: 'ANEX Office',
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'SCHEDULED',
        },
      });
    }

    // 2. Yến Ngọc: Mon 07:00-08:30 & Mon 21:00-22:00
    let slot = getSlot(w, 0, 7, 0, 8, 30);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS 6.5 - Yến Ngọc'].id,
        title: 'IELTS 6.5 - Yến Ngọc (Ca Sáng)',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });
    slot = getSlot(w, 0, 21, 0, 22, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS 6.5 - Yến Ngọc'].id,
        title: 'IELTS 6.5 - Yến Ngọc (Ca Tối)',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 3. Ane & Sunday (B2): Mon & Thu 17:30 - 19:00
    slot = getSlot(w, 0, 17, 30, 19, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['B2 - Ane & Sunday'].id,
        title: 'B2 - Ane & Sunday',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });
    slot = getSlot(w, 3, 17, 30, 19, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['B2 - Ane & Sunday'].id,
        title: 'B2 - Ane & Sunday',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 4. Lyna + Linh (B2): Mon, Wed, Fri 19:00 - 20:30
    for (const d of [0, 2, 4]) {
      slot = getSlot(w, d, 19, 0, 20, 30);
      await prisma.schedule.create({
        data: {
          classGroupId: classMap['B2 - Lyna + Linh'].id,
          title: 'B2 - Lyna + Linh',
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'SCHEDULED',
        },
      });
    }

    // 5. David + Linda (B1): Tue 17:30 - 19:00 & Thu 19:30 - 21:00
    slot = getSlot(w, 1, 17, 30, 19, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['B1 - David + Linda'].id,
        title: 'B1 - David + Linda',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });
    slot = getSlot(w, 3, 19, 30, 21, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['B1 - David + Linda'].id,
        title: 'B1 - David + Linda',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 6. Tony + Chi (C1): Tue 19:00 - 20:30
    slot = getSlot(w, 1, 19, 0, 20, 30);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['C1 - Tony + Chi'].id,
        title: 'C1 - Tony + Chi',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 7. Minh Hiền: Wed 07:00 - 08:00
    slot = getSlot(w, 2, 7, 0, 8, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS - Minh Hiền'].id,
        title: 'IELTS - Minh Hiền',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 8. Mạnh + Nghi: Wed & Fri 17:30 - 19:00, Sun 10:30 - 12:00
    slot = getSlot(w, 2, 17, 30, 19, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS 6.5 - Mạnh & Nghi'].id,
        title: 'IELTS 6.5 - Mạnh + Nghi',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });
    slot = getSlot(w, 4, 17, 30, 19, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS 6.5 - Mạnh & Nghi'].id,
        title: 'IELTS 6.5 - Mạnh + Nghi',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });
    slot = getSlot(w, 6, 10, 30, 12, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS 6.5 - Mạnh & Nghi'].id,
        title: 'IELTS 6.5 - Mạnh + Nghi',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 9. Dương (IELTS): Thu 14:30 - 16:00, Sat 14:30 - 15:30, Sun 13:00 - 14:30
    slot = getSlot(w, 3, 14, 30, 16, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS - Dương'].id,
        title: 'IELTS - Dương',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });
    slot = getSlot(w, 5, 14, 30, 15, 30);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS - Dương'].id,
        title: 'IELTS - Dương',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });
    slot = getSlot(w, 6, 13, 0, 14, 30);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['IELTS - Dương'].id,
        title: 'IELTS - Dương',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 10. My + Khoa (B2): Fri 20:30 - 22:00, Sat 15:30 - 17:00
    slot = getSlot(w, 4, 20, 30, 22, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['B2 - My + Khoa'].id,
        title: 'B2 - My + Khoa',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });
    slot = getSlot(w, 5, 15, 30, 17, 0);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['B2 - My + Khoa'].id,
        title: 'B2 - My + Khoa',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 11. Sarah + Andy (C1): Sat 07:00 - 08:30
    slot = getSlot(w, 5, 7, 0, 8, 30);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['C1 - Sarah + Andy'].id,
        title: 'C1 - Sarah + Andy',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 12. Burin & Fa (Pre-IELTS): Sat 13:00 - 14:30
    slot = getSlot(w, 5, 13, 0, 14, 30);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['Pre-IELTS - Burin & Fa'].id,
        title: 'Pre-IELTS - Burin & Fa',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 13. G6 - David + Andy: Sun 14:30 - 15:30
    slot = getSlot(w, 6, 14, 30, 15, 30);
    await prisma.schedule.create({
      data: {
        classGroupId: classMap['G6 - David + Andy'].id,
        title: 'G6 - David + Andy',
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'SCHEDULED',
      },
    });

    // 14. Fin: Tue & Thu 07:00 - 07:45 & 16:45 - 17:30
    for (const d of [1, 3]) {
      slot = getSlot(w, d, 7, 0, 7, 45);
      await prisma.schedule.create({
        data: {
          classGroupId: classMap['Lớp Fin'].id,
          title: 'Fin - Ca Sáng',
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'SCHEDULED',
        },
      });
      slot = getSlot(w, d, 16, 45, 17, 30);
      await prisma.schedule.create({
        data: {
          classGroupId: classMap['Lớp Fin'].id,
          title: 'Fin - Ca Chiều',
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'SCHEDULED',
        },
      });
    }

    // 15. Heineken English Club: Fri 14:30 - 17:30 (w = 0 only)
    if (w === 0) {
      slot = getSlot(w, 4, 14, 30, 17, 30);
      await prisma.schedule.create({
        data: {
          classGroupId: classMap['Heineken English Club (Bi-weekly)'].id,
          title: 'Heineken English Club',
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'SCHEDULED',
        },
      });
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
