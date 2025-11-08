// FIX: Removed self-import of UserRole which caused a declaration conflict.


export enum UserRole {
    ADMIN = 'Admin',
    TEACHER = 'Teacher',
    STUDENT = 'Student',
    RECEPTIONIST = 'Receptionist',
    SHOPKEEPER = 'Shopkeeper',
    EXAMINER = 'Examiner',
    ACCOUNTING = 'Accounting',
    RESEARCHER = 'Researcher',
}

export interface User {
    id: string;
    name: string;
    username: string;
    password?: string;
    role: UserRole;
    subjects?: string[]; // Names of subjects a teacher can manage
}

export interface UniversityInfo {
    name: string;
    logo: string;
    address: string;
    contact: string;
    bankName?: string;
    accountNumber?: string;
    branchName?: string;
}

export interface SyllabusMaterial {
    pdfUrl?: string;
    pdfName?: string;
    docUrl?: string;
    docName?: string;
    imageUrl?: string;
    imageName?: string;
}

export interface Subject {
    id: string;
    name: string;
    code: string;
    creditHours: number;
    semester: number;
    syllabus?: SyllabusMaterial;
}

export interface Course {
    id: string;
    name: string;
    subjects: Subject[];
}

export interface StudentDetails {
    email: string;
    contact: string;
    dob: string;
    address: string;
    fatherName: string;
    courseId: string;
    citizenshipDoc: string;
    currentSemester: number;
}

export interface Student extends User {
    isRegistered: boolean;
    registrationNumber: string | null;
    rollNumber: string | null;
    photo: string;
    signature: string;
    details: StudentDetails | null;
    hostelInfo: {
        hostelId: string;
        roomId: string;
        roomNumber: string;
    } | null;
}

export enum ExamType {
    SEMESTER = 'Semester',
    MIDTERM = 'Mid-Term',
    FINAL = 'Final',
    ENTRANCE = 'Entrance',
    SCHOLARSHIP = 'Scholarship',
    TERMINAL = 'Terminal',
    OTHER = 'Other',
}

export interface Exam {
    id: string;
    name: string;
    type: ExamType;
    courseId: string;
    date: string; // ISO string
    time: string;
    subjects: string[]; // Subject names
}

export interface Result {
    id: string;
    studentId: string;
    examId: string;
    marks: { [subject: string]: number };
    grade: string;
    isPublished: boolean;
    isEditable: boolean;
}

export interface Notice {
    id: string;
    title: string;
    content: string;
    date: string; // ISO string
    author: string;
    imageUrl?: string;
    pdfUrl?: string;
    pdfName?: string;
    docUrl?: string;
    docName?: string;
}

export interface AttendanceRecord {
    id: string;
    studentId: string;
    courseId: string;
    subject: string;
    date: string; // ISO string
    status: 'Present' | 'Absent';
}

export enum ApplicationStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
    ADMITTED = 'Admitted',
}

export interface ExamApplication {
    id: string;
    studentId: string;
    examId: string;
    registrationNumber: string;
    status: ApplicationStatus;
}

export interface EntranceApplication {
    id: string;
    applicantName: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    courseId: string;
    previousEducation: {
        institution: string;
        degree: string;
        year: number;
        grade: string;
    };
    documents: {
        photo: string;
        previousMarksheet: string;
        citizenshipDoc: string;
    };
    status: ApplicationStatus;
    marks?: { [subject: string]: number };
    grade?: string;
}

export interface FeeStructure {
    id: string;
    courseId: string;
    semester: number;
    tuitionFee: number;
    examinationFee: number;
    registrationFee: number;
    libraryFee: number;
    extraActivitiesFee: number;
    totalFee: number;
}

export interface FeePayment {
    id: string;
    studentId: string;
    feeStructureId: string;
    amountPaid: number;
    paymentDate: string; // ISO string
    status: 'Paid' | 'Partially Paid' | 'Due';
}

export interface ChatMessage {
    id: string;
    threadId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string; // ISO string
}

export interface ChatThread {
    id: string;
    participantIds: string[];
    participantNames: { [id: string]: string };
    lastMessage: ChatMessage | null;
}

export interface GalleryImage {
    id: string;
    imageUrl: string; // base64 string
    caption: string;
}

export enum ShopCategory {
    BOOK = 'Book',
    NOTES = 'Notes',
    MERCHANDISE = 'Merchandise',
}

export interface ShopProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: ShopCategory;
    courseId?: string; // For books/notes
    subjectName?: string; // For books/notes
}

export interface OnlineClass {
    id: string;
    teacherId: string;
    teacherName: string;
    subject: string;
    courseId: string;
    isActive: boolean;
    whiteboardState?: string;
    docContent?: string;
}

export enum ComplaintStatus {
    PENDING = 'Pending',
    IN_REVIEW = 'In Review',
    RESOLVED = 'Resolved',
}

export interface Complaint {
    id: string;
    studentId: string;
    studentName: string;
    title: string;
    description: string;
    date: string; // ISO string
    status: ComplaintStatus;
    response?: string;
}

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    timestamp: string;
    content: string;
}

export interface CampusPost {
    id: string;
    authorId: string;
    authorName: string;
    authorRole: UserRole;
    timestamp: string;
    textContent: string;
    mediaType?: 'image' | 'video' | 'document';
    mediaUrl?: string;
    mediaName?: string;
    likes: string[]; // Array of user IDs
    comments: Comment[];
}

export interface AcademicEvent {
    id: string;
    date: string; // ISO string for AD date
    title: string;
    description: string;
    category: 'Holiday' | 'Exam' | 'Event' | 'Deadline';
}

export interface Hostel {
    id: string;
    name: string;
}

export interface Room {
    id: string;
    hostelId: string;
    roomNumber: string;
    capacity: number;
}

export interface HostelBooking {
    id: string;
    studentId: string;
    roomId: string;
}

export interface ProjectSubmission {
    id: string;
    studentId: string;
    studentName: string;
    courseId: string;
    subject: string;
    title: string;
    description: string;
    fileUrl: string; // base64
    fileName: string;
    submissionDate: string; // ISO string
    grade?: string;
    feedback?: string;
}

export enum ResourceCategory {
    RESEARCH_PAPER = 'Research Paper',
    E_BOOK = 'E-Book',
    JOURNAL = 'Journal',
    ARTICLE = 'Article',
    OTHER = 'Other',
}

export interface Resource {
    id: string;
    title: string;
    authorId: string;
    authorName: string;
    uploadDate: string; // ISO string
    category: ResourceCategory;
    description: string;
    fileUrl: string; // base64
    fileName: string;
}