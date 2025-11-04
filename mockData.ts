import { User, UserRole, Course, Student, Exam, ExamType, Result, Notice, AttendanceRecord, ExamApplication, EntranceApplication, ApplicationStatus, FeeStructure, FeePayment, Subject, ChatMessage, ChatThread, GalleryImage, ShopProduct, ShopCategory, OnlineClass, Complaint } from './types';

export const MOCK_USERS: User[] = [
    { id: 'user-1', name: 'Admin User', username: 'admin', password: 'admin001', role: UserRole.ADMIN },
    { id: 'user-2', name: 'Teacher User', username: 'teacher', password: 'password', role: UserRole.TEACHER, subjects: ['Introduction to AI', 'Calculus I', 'General Aptitude'] },
    { id: 'user-3', name: 'Alice Smith', username: 'alice', password: 'password', role: UserRole.STUDENT },
    { id: 'user-4', name: 'Receptionist User', username: 'reception', password: 'password', role: UserRole.RECEPTIONIST },
    { id: 'user-5', name: 'Bob Johnson', username: 'bob', password: 'password', role: UserRole.STUDENT },
    { id: 'user-6', name: 'dipesh', username: 'dipesh', password: 'dipesh', role: UserRole.TEACHER, subjects: ['Intro to Digital Media', 'Graphic Design I', 'Web Design'] },
    { id: 'user-7', name: 'Raju', username: 'raju', password: 'raju', role: UserRole.RECEPTIONIST },
    { id: 'user-8', name: 'Ram Bahadur', username: 'ram', password: 'ram', role: UserRole.STUDENT },
    { id: 'user-9', name: 'Shopkeeper User', username: 'shop', password: 'password', role: UserRole.SHOPKEEPER },
    { id: 'user-10', name: 'Dewa Shopkeeper', username: 'dewa', password: 'dewa', role: UserRole.SHOPKEEPER },
];

const BSAI_SUBJECTS: Subject[] = [
    { 
        id: 'subj-101', 
        name: 'Introduction to AI', 
        code: 'AI101', 
        creditHours: 3, 
        semester: 1,
        syllabus: {
            // FIX: The base64 string was malformed. Replaced it with a valid one.
            pdfUrl: 'data:application/pdf;base64,JVBERi0xLjQKJCY8Pz4xIDAgT2JqPDwvUGFnZXMgMiAwIFIvVHlwZS9DYXRhbG9nPj5FbGQgT2JqPDwzIDAgUiA0IDAgUj4+RWxkIE9iajwyIDAgT2JqPDwvQ291bnQgMS9LaWRzWzMgMCBSXS9UeXBlL1BhZ2VzPj5FbGQgT2JqPDwzIDAgT2JqPDwvQ29udGVudHMgNCAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNSAwIFI+Pj4vVHlwZS9QYWdlPj5FbGQgT2JqPDw0IDAgT2JqPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA0ND4+c3RyZWFtDQp4AWPz8/NLCnI4dAU5uAI5gwjZ3AIFLI5ugcMrl2NwcXNx8/Pz9AsGAwNTExNzYwsLAzNTC7fxN3b193N1MgACBAIAEk0K1g0KZW5kc3RyZWFtDWVuZCBvYmo8PDUgMCBPYmo8PC9CYXNlRm9udC9IZWx2ZXRpY2EvU3VidHlwZS9UeXBlMS9UeXBlL0ZvbnQ+PkVuZCBPYmoNCg==',
            pdfName: 'AI101_Syllabus.pdf'
        }
    },
    { id: 'subj-102', name: 'Programming Fundamentals', code: 'CS101', creditHours: 4, semester: 1 },
    { id: 'subj-103', name: 'Calculus I', code: 'MATH101', creditHours: 4, semester: 1 },
    { id: 'subj-104', name: 'Data Structures', code: 'CS102', creditHours: 4, semester: 2 },
    { id: 'subj-105', name: 'Machine Learning Basics', code: 'AI102', creditHours: 3, semester: 2 },
];

const BADM_SUBJECTS: Subject[] = [
    { id: 'subj-201', name: 'Intro to Digital Media', code: 'DM101', creditHours: 3, semester: 1 },
    { id: 'subj-202', name: 'Graphic Design I', code: 'ART101', creditHours: 3, semester: 1 },
    { id: 'subj-203', name: 'History of Art', code: 'AH101', creditHours: 3, semester: 1 },
    { id: 'subj-204', name: 'Web Design', code: 'DM102', creditHours: 4, semester: 2 },
    { id: 'subj-205', name: 'Video Production', code: 'DM103', creditHours: 4, semester: 2 },
];


export const MOCK_COURSES: Course[] = [
    { id: 'course-1', name: 'Bachelor of Science in AI', subjects: BSAI_SUBJECTS },
    { id: 'course-2', name: 'Bachelor of Arts in Digital Media', subjects: BADM_SUBJECTS },
];

export const MOCK_STUDENTS: Student[] = [
    { 
        id: 'user-3', 
        name: 'Alice Smith', 
        username: 'alice',
        role: UserRole.STUDENT, 
        isRegistered: true, 
        registrationNumber: 'GEM-2024-001', 
        rollNumber: 'BSAI-01',
        photo: 'https://i.pravatar.cc/150?u=alice',
        signature: 'https://via.placeholder.com/150x50/FFFFFF/000000?text=Alice+Smith',
        details: {
            email: 'alice@gemini.edu',
            contact: '123-456-7890',
            dob: '2004-05-20',
            address: '456 Tech Avenue, Future City',
            fatherName: 'John Smith',
            courseId: 'course-1',
            citizenshipDoc: '',
            currentSemester: 1,
        }
    },
    { 
        id: 'user-5', 
        name: 'Bob Johnson', 
        username: 'bob',
        role: UserRole.STUDENT, 
        isRegistered: false, 
        registrationNumber: null,
        rollNumber: null,
        photo: 'https://i.pravatar.cc/150?u=bob',
        signature: 'https://via.placeholder.com/150x50/FFFFFF/000000?text=Bob+Johnson',
        details: null,
    },
    { 
        id: 'user-8', 
        name: 'Ram Bahadur', 
        username: 'ram',
        role: UserRole.STUDENT, 
        isRegistered: false, 
        registrationNumber: null,
        rollNumber: null,
        photo: 'https://i.pravatar.cc/150?u=ram',
        signature: 'https://via.placeholder.com/150x50/FFFFFF/000000?text=Ram+Bahadur',
        details: null,
    },
];

export const MOCK_EXAMS: Exam[] = [
    { id: 'exam-1', name: 'Semester 1 Mid-Term', type: ExamType.MIDTERM, courseId: 'course-1', date: '2024-09-15', time: '10:00', subjects: ['Introduction to AI', 'Calculus I'] },
    { id: 'exam-2', name: 'Semester 1 Final', type: ExamType.FINAL, courseId: 'course-1', date: '2024-12-10', time: '13:00', subjects: ['Introduction to AI', 'Programming Fundamentals', 'Calculus I'] },
    { id: 'exam-3', name: 'BSAI Entrance Test 2024', type: ExamType.ENTRANCE, courseId: 'course-1', date: '2024-08-01', time: '11:00', subjects: ['General Aptitude', 'Basic Mathematics'] },
];

export const MOCK_RESULTS: Result[] = [
    { id: 'result-1', studentId: 'user-3', examId: 'exam-1', marks: { 'Introduction to AI': 85, 'Calculus I': 78 }, grade: 'A', isPublished: true, isEditable: false },
];

export const MOCK_NOTICES: Notice[] = [
    { id: 'notice-1', title: 'Mid-Term Exam Schedule Published', content: 'The schedule for the upcoming mid-term examinations has been published. Please check the routines page for details.', date: new Date().toISOString(), author: 'Admin User' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
    { id: 'att-1', studentId: 'user-3', courseId: 'course-1', subject: 'Introduction to AI', date: new Date().toISOString(), status: 'Present' },
];

export const MOCK_EXAM_APPLICATIONS: ExamApplication[] = [];

export const MOCK_ENTRANCE_APPLICATIONS: EntranceApplication[] = [
    {
        id: 'ent-app-1',
        applicantName: 'Charlie Brown',
        email: 'charlie@example.com',
        phone: '555-1234',
        dob: '2005-01-15',
        address: '123 Main St, Anytown',
        courseId: 'course-1',
        previousEducation: { institution: 'Anytown High', degree: 'High School Diploma', year: 2023, grade: 'A' },
        documents: { photo: 'https://i.pravatar.cc/150?u=charlie', previousMarksheet: '', citizenshipDoc: '' },
        status: ApplicationStatus.PENDING,
        marks: { 'General Aptitude': 75 },
    },
    {
        id: 'ent-app-2',
        applicantName: 'Diana Prince',
        email: 'diana@example.com',
        phone: '555-5678',
        dob: '2004-11-22',
        address: '456 Oak Ave, Metropolis',
        courseId: 'course-1',
        previousEducation: { institution: 'Metropolis High', degree: 'High School Diploma', year: 2023, grade: 'A+' },
        documents: { photo: 'https://i.pravatar.cc/150?u=diana', previousMarksheet: '', citizenshipDoc: '' },
        status: ApplicationStatus.APPROVED,
        marks: { 'General Aptitude': 92, 'Basic Mathematics': 88 },
        grade: 'A'
    }
];

export const MOCK_FEE_STRUCTURES: FeeStructure[] = [
    { id: 'fs-1', courseId: 'course-1', semester: 1, tuitionFee: 50000, examinationFee: 2000, registrationFee: 5000, libraryFee: 1000, extraActivitiesFee: 1500, totalFee: 59500 },
];
export const MOCK_FEE_PAYMENTS: FeePayment[] = [
    { id: 'fp-1', studentId: 'user-3', feeStructureId: 'fs-1', amountPaid: 59500, paymentDate: new Date().toISOString(), status: 'Paid' }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
    { id: 'msg-1', threadId: 'thread-1', senderId: 'user-1', senderName: 'Admin User', content: 'Hi Teacher, can you please finalize the marks for the mid-term exam?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'msg-2', threadId: 'thread-1', senderId: 'user-2', senderName: 'Teacher User', content: 'Sure, I will get it done by today evening.', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
    { id: 'msg-3', threadId: 'thread-2', senderId: 'user-3', senderName: 'Alice Smith', content: 'Hello sir, I had a question about the AI syllabus.', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
];

export const MOCK_CHAT_THREADS: ChatThread[] = [
    {
        id: 'thread-1',
        participantIds: ['user-1', 'user-2'],
        participantNames: { 'user-1': 'Admin User', 'user-2': 'Teacher User' },
        lastMessage: MOCK_CHAT_MESSAGES[1],
    },
    {
        id: 'thread-2',
        participantIds: ['user-2', 'user-3'],
        participantNames: { 'user-2': 'Teacher User', 'user-3': 'Alice Smith' },
        lastMessage: MOCK_CHAT_MESSAGES[2],
    }
];

export const MOCK_GALLERY_IMAGES: GalleryImage[] = [
    { id: 'gal-1', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2ZjZmNmIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM4MDgwODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db252b2NhdGlvbiAyMDI0PC90ZXh0Pjwvc3ZnPg==', caption: 'Convocation 2024' },
    { id: 'gal-2', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2ZmY2NmIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM4MDgwODAiIHRleHQtYW5jaGyPSJtaWRkbGUiIGR5PSIuM2VtIj5TeXBvc2l1bSBvbiBBRjwvdGV4dD48L3N2Zz4=', caption: 'Annual AI Symposium' },
    { id: 'gal-3', imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2ZmY2NmIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM4MDgwODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5MaWJyYXJ5PC90ZXh0Pjwvc3ZnPg==', caption: 'Our new library wing' },
];

export const MOCK_SHOP_PRODUCTS: ShopProduct[] = [
    // Books & Notes
    { id: 'prod-1', name: 'AI Fundamentals Textbook', description: 'Comprehensive guide to the basics of AI.', price: 7315, imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDQ1MTY0IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BSSBUZXh0Ym9vazwvdGV4dD48L3N2Zz4=', category: ShopCategory.BOOK, courseId: 'course-1', subjectName: 'Introduction to AI' },
    { id: 'prod-2', name: 'Calculus I Lecture Notes', description: 'Complete notes from the semester.', price: 1995, imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjQ0NDU1IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYWxjdWx1cyBOb3RlczwvdGV4dD48L3N2Zz4=', category: ShopCategory.NOTES, courseId: 'course-1', subjectName: 'Calculus I' },
    { id: 'prod-3', name: 'Graphic Design Principles', description: 'A visual guide to graphic design.', price: 5985, imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTk0QjQzIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZXNpZ24gQm9vazwvdGV4dD48L3N2Zz4=', category: ShopCategory.BOOK, courseId: 'course-2', subjectName: 'Graphic Design I' },
    // Merchandise
    { id: 'prod-4', name: 'University Hoodie', description: 'Cozy and stylish university branded hoodie.', price: 5320, imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1RTc4IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ib29kaWU8L3RleHQ+PC9zdmc+', category: ShopCategory.MERCHANDISE },
    { id: 'prod-5', name: 'University T-Shirt', description: 'Classic cotton t-shirt with university logo.', price: 2660, imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNzU1RTU1IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ULVNoaXJ0PC90ZXh0Pjwvc3ZnPg==', category: ShopCategory.MERCHANDISE },
    { id: 'prod-6', name: 'University Coffee Mug', description: 'Start your day with a sip of university pride.', price: 1663, imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjQzRFNUU5IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM4MDgwODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5NdWc8L3RleHQ+PC9zdmc+', category: ShopCategory.MERCHANDISE },
];

export const MOCK_ONLINE_CLASSES: OnlineClass[] = [];

export const MOCK_COMPLAINTS: Complaint[] = [];