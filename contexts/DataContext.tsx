import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UniversityInfo, Course, Student, Exam, Result, Notice, AttendanceRecord, ExamApplication, EntranceApplication, ApplicationStatus, User, FeeStructure, FeePayment, Subject, SyllabusMaterial, ChatThread, ChatMessage, GalleryImage, ShopProduct, OnlineClass, Complaint, ComplaintStatus, StudentDetails } from '../types';
import { DEFAULT_UNIVERSITY_INFO } from '../constants';
import { MOCK_COURSES, MOCK_STUDENTS, MOCK_EXAMS, MOCK_RESULTS, MOCK_NOTICES, MOCK_ATTENDANCE, MOCK_EXAM_APPLICATIONS, MOCK_ENTRANCE_APPLICATIONS, MOCK_FEE_STRUCTURES, MOCK_FEE_PAYMENTS, MOCK_CHAT_THREADS, MOCK_CHAT_MESSAGES, MOCK_GALLERY_IMAGES, MOCK_SHOP_PRODUCTS, MOCK_ONLINE_CLASSES, MOCK_COMPLAINTS } from '../mockData';

interface DataContextType {
    universityInfo: UniversityInfo;
    updateUniversityInfo: (info: UniversityInfo) => void;
    courses: Course[];
    addCourse: (course: Omit<Course, 'id'>) => void;
    deleteCourse: (courseId: string) => void;
    addSubjectToCourse: (courseId: string, subjectData: Omit<Subject, 'id'>) => void;
    deleteSubjectFromCourse: (courseId: string, subjectId: string) => void;
    updateSubjectSyllabus: (courseId: string, subjectId: string, syllabusData: SyllabusMaterial) => void;
    students: Student[];
    getStudentByRegNo: (regNo: string) => Student | undefined;
    updateStudentRegistration: (studentId: string, data: Partial<Student>) => void;
    addStudentProfile: (user: User, contactInfo: { type: 'mobile' | 'email'; value: string }) => void;
    deleteStudentData: (studentId: string) => void;
    exams: Exam[];
    addExam: (exam: Omit<Exam, 'id'>) => void;
    deleteExam: (examId: string) => void;
    results: Result[];
    addResult: (result: Omit<Result, 'id'>) => void;
    updateResult: (result: Result) => void;
    toggleResultEdit: (resultId: string) => void;
    notices: Notice[];
    addNotice: (notice: Omit<Notice, 'id'>) => void;
    deleteNotice: (noticeId: string) => void;
    attendanceRecords: AttendanceRecord[];
    addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
    examApplications: ExamApplication[];
    addExamApplication: (app: Omit<ExamApplication, 'id' | 'status'>) => void;
    updateExamApplicationStatus: (id: string, status: ApplicationStatus) => void;
    entranceApplications: EntranceApplication[];
    addEntranceApplication: (app: Omit<EntranceApplication, 'id' | 'status'>) => EntranceApplication;
    updateEntranceApplicationStatus: (id: string, status: ApplicationStatus) => void;
    updateEntranceApplicationResult: (applicationId: string, marks: { [subject: string]: number }, grade: string) => void;
    feeStructures: FeeStructure[];
    addFeeStructure: (structure: Omit<FeeStructure, 'id' | 'totalFee'>) => void;
    deleteFeeStructure: (feeStructureId: string) => void;
    feePayments: FeePayment[];
    addFeePayment: (studentId: string, feeStructureId: string, amount: number) => void;
    chatThreads: ChatThread[];
    chatMessages: ChatMessage[];
    addChatMessage: (threadId: string, senderId: string, senderName: string, content: string) => void;
    startChatThread: (participantIds: string[], participantNames: { [id: string]: string }) => string;
    galleryImages: GalleryImage[];
    addGalleryImage: (imageUrl: string, caption: string) => void;
    deleteGalleryImage: (imageId: string) => void;
    shopProducts: ShopProduct[];
    addShopProduct: (product: Omit<ShopProduct, 'id'>) => void;
    updateShopProduct: (product: ShopProduct) => void;
    deleteShopProduct: (productId: string) => void;
    onlineClasses: OnlineClass[];
    startClass: (teacherId: string, teacherName: string, subject: string, courseId: string) => OnlineClass;
    endClass: (classId: string) => void;
    updateWhiteboardState: (classId: string, state: string) => void;
    updateDocContent: (classId: string, content: string) => void;
    complaints: Complaint[];
    addComplaint: (complaintData: Omit<Complaint, 'id' | 'status' | 'date'>) => void;
    updateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [universityInfo, setUniversityInfo] = useState<UniversityInfo>(DEFAULT_UNIVERSITY_INFO);
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [exams, setExams] = useState<Exam[]>(MOCK_EXAMS);
    const [results, setResults] = useState<Result[]>(MOCK_RESULTS);
    const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
    const [examApplications, setExamApplications] = useState<ExamApplication[]>(MOCK_EXAM_APPLICATIONS);
    const [entranceApplications, setEntranceApplications] = useState<EntranceApplication[]>(MOCK_ENTRANCE_APPLICATIONS);
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(MOCK_FEE_STRUCTURES);
    const [feePayments, setFeePayments] = useState<FeePayment[]>(MOCK_FEE_PAYMENTS);
    const [chatThreads, setChatThreads] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(MOCK_GALLERY_IMAGES);
    const [shopProducts, setShopProducts] = useState<ShopProduct[]>(MOCK_SHOP_PRODUCTS);
    const [onlineClasses, setOnlineClasses] = useState<OnlineClass[]>(MOCK_ONLINE_CLASSES);
    const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);

    const updateUniversityInfo = (info: UniversityInfo) => setUniversityInfo(info);
    const addCourse = (course: Omit<Course, 'id'>) => setCourses(prev => [...prev, { ...course, id: `course-${Date.now()}` }]);
    const deleteCourse = (courseId: string) => {
        setCourses(prev => prev.filter(c => c.id !== courseId));
    };
    const addSubjectToCourse = (courseId: string, subjectData: Omit<Subject, 'id'>) => {
        const newSubject: Subject = { ...subjectData, id: `subj-${Date.now()}`};
        setCourses(prev => prev.map(c => c.id === courseId ? { ...c, subjects: [...c.subjects, newSubject] } : c));
    };
     const deleteSubjectFromCourse = (courseId: string, subjectId: string) => {
        setCourses(prev => prev.map(c => {
            if (c.id === courseId) {
                return { ...c, subjects: c.subjects.filter(s => s.id !== subjectId) };
            }
            return c;
        }));
    };
    const updateSubjectSyllabus = (courseId: string, subjectId: string, syllabusData: SyllabusMaterial) => {
        setCourses(prev => prev.map(course => {
            if (course.id === courseId) {
                const updatedSubjects = course.subjects.map(subject => {
                    if (subject.id === subjectId) {
                        return { 
                            ...subject, 
                            syllabus: { ...subject.syllabus, ...syllabusData }
                        };
                    }
                    return subject;
                });
                return { ...course, subjects: updatedSubjects };
            }
            return course;
        }));
    };
    const getStudentByRegNo = (regNo: string) => students.find(s => s.registrationNumber === regNo);
    const updateStudentRegistration = (studentId: string, data: Partial<Student>) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, ...data, isRegistered: true } : s));
    };
    const addStudentProfile = (user: User, contactInfo: { type: 'mobile' | 'email'; value: string }) => {
        const newStudentDetails: StudentDetails = {
            contact: contactInfo.type === 'mobile' ? contactInfo.value : '',
            email: contactInfo.type === 'email' ? contactInfo.value : '',
            dob: '',
            address: '',
            fatherName: '',
            courseId: '',
            citizenshipDoc: '',
            currentSemester: 1,
        };

        const newStudent: Student = {
            ...user,
            isRegistered: false,
            registrationNumber: null,
            rollNumber: null,
            photo: 'https://via.placeholder.com/150',
            signature: 'https://via.placeholder.com/150x50/FFFFFF/000000?text=Signature',
            details: newStudentDetails,
        };
        setStudents(prev => [...prev, newStudent]);
    }
    const deleteStudentData = (studentId: string) => {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        setResults(prev => prev.filter(r => r.studentId !== studentId));
        setAttendanceRecords(prev => prev.filter(a => a.studentId !== studentId));
        setExamApplications(prev => prev.filter(e => e.studentId !== studentId));
        setFeePayments(prev => prev.filter(p => p.studentId !== studentId));
    };
    const addExam = (exam: Omit<Exam, 'id'>) => setExams(prev => [...prev, { ...exam, id: `exam-${Date.now()}` }]);
    const deleteExam = (examId: string) => {
        setExams(prev => prev.filter(e => e.id !== examId));
        setResults(prev => prev.filter(r => r.examId !== examId));
        setExamApplications(prev => prev.filter(app => app.examId !== examId));
    };
    const addResult = (result: Omit<Result, 'id'>) => setResults(prev => [...prev, { ...result, id: `result-${Date.now()}` }]);
    const updateResult = (result: Result) => setResults(prev => prev.map(r => r.id === result.id ? result : r));
    const toggleResultEdit = (resultId: string) => {
        setResults(prev => prev.map(r => r.id === resultId ? { ...r, isEditable: !r.isEditable } : r));
    };
    const addNotice = (notice: Omit<Notice, 'id'>) => setNotices(prev => [{ ...notice, id: `notice-${Date.now()}` }, ...prev]);
    const deleteNotice = (noticeId: string) => {
        setNotices(prev => prev.filter(n => n.id !== noticeId));
    };
    const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
        const existing = attendanceRecords.find(r => r.studentId === record.studentId && r.date === record.date && r.subject === record.subject);
        if (existing) {
            setAttendanceRecords(prev => prev.map(r => r.id === existing.id ? { ...r, status: record.status } : r));
        } else {
            setAttendanceRecords(prev => [...prev, { ...record, id: `att-${Date.now()}` }]);
        }
    };
    const addExamApplication = (app: Omit<ExamApplication, 'id' | 'status'>) => {
        setExamApplications(prev => [...prev, { ...app, id: `exam-app-${Date.now()}`, status: ApplicationStatus.PENDING }]);
    };
    const updateExamApplicationStatus = (id: string, status: ApplicationStatus) => {
        setExamApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    };
    const addEntranceApplication = (app: Omit<EntranceApplication, 'id' | 'status'>): EntranceApplication => {
        const newApp = { ...app, id: `ent-app-${Date.now()}`, status: ApplicationStatus.PENDING };
        setEntranceApplications(prev => [...prev, newApp]);
        return newApp;
    };
    const updateEntranceApplicationStatus = (id: string, status: ApplicationStatus) => {
        setEntranceApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
    };
     const updateEntranceApplicationResult = (applicationId: string, marks: { [subject: string]: number }, grade: string) => {
        setEntranceApplications(prev => prev.map(app => 
            app.id === applicationId ? { ...app, marks, grade } : app
        ));
    };
    const addFeeStructure = (structure: Omit<FeeStructure, 'id' | 'totalFee'>) => {
        const totalFee = structure.tuitionFee + structure.examinationFee + structure.registrationFee + structure.libraryFee + structure.extraActivitiesFee;
        const newStructure: FeeStructure = {
            ...structure,
            id: `fs-${Date.now()}`,
            totalFee,
        };
        setFeeStructures(prev => [...prev, newStructure]);
    };
    const deleteFeeStructure = (feeStructureId: string) => {
        setFeeStructures(prev => prev.filter(fs => fs.id !== feeStructureId));
    };
    const addFeePayment = (studentId: string, feeStructureId: string, amount: number) => {
        const feeStructure = feeStructures.find(fs => fs.id === feeStructureId);
        if (!feeStructure) return;

        const existingPaymentIndex = feePayments.findIndex(p => p.studentId === studentId && p.feeStructureId === feeStructureId);

        if (existingPaymentIndex > -1) {
            const updatedPayments = [...feePayments];
            const existingPayment = updatedPayments[existingPaymentIndex];
            const newAmountPaid = existingPayment.amountPaid + amount;
            existingPayment.amountPaid = newAmountPaid;
            existingPayment.status = newAmountPaid >= feeStructure.totalFee ? 'Paid' : 'Partially Paid';
            existingPayment.paymentDate = new Date().toISOString();
            setFeePayments(updatedPayments);
        } else {
            const newPayment: FeePayment = {
                id: `fp-${Date.now()}`,
                studentId,
                feeStructureId,
                amountPaid: amount,
                paymentDate: new Date().toISOString(),
                status: amount >= feeStructure.totalFee ? 'Paid' : 'Partially Paid',
            };
            setFeePayments(prev => [...prev, newPayment]);
        }
    };

    const addChatMessage = (threadId: string, senderId: string, senderName: string, content: string) => {
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            threadId,
            senderId,
            senderName,
            content,
            timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, newMessage]);
        setChatThreads(prev => prev.map(thread => 
            thread.id === threadId ? { ...thread, lastMessage: newMessage } : thread
        ).sort((a,b) => new Date(b.lastMessage?.timestamp || 0).getTime() - new Date(a.lastMessage?.timestamp || 0).getTime()));
    };

    const startChatThread = (participantIds: string[], participantNames: { [id: string]: string }): string => {
        const existingThread = chatThreads.find(thread => 
            thread.participantIds.length === participantIds.length &&
            thread.participantIds.every(id => participantIds.includes(id))
        );
        if (existingThread) {
            return existingThread.id;
        }

        const newThread: ChatThread = {
            id: `thread-${Date.now()}`,
            participantIds,
            participantNames,
            lastMessage: null
        };
        setChatThreads(prev => [newThread, ...prev]);
        return newThread.id;
    };

    const addGalleryImage = (imageUrl: string, caption: string) => {
        const newImage: GalleryImage = {
            id: `gal-${Date.now()}`,
            imageUrl,
            caption
        };
        setGalleryImages(prev => [newImage, ...prev]);
    };

    const deleteGalleryImage = (imageId: string) => {
        setGalleryImages(prev => prev.filter(img => img.id !== imageId));
    };

    const addShopProduct = (product: Omit<ShopProduct, 'id'>) => {
        const newProduct: ShopProduct = { ...product, id: `prod-${Date.now()}` };
        setShopProducts(prev => [newProduct, ...prev]);
    };

    const updateShopProduct = (updatedProduct: ShopProduct) => {
        setShopProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteShopProduct = (productId: string) => {
        setShopProducts(prev => prev.filter(p => p.id !== productId));
    };

    const startClass = (teacherId: string, teacherName: string, subject: string, courseId: string): OnlineClass => {
        // Deactivate any previous class by the same teacher for the same subject
        const updatedClasses = onlineClasses.map(c => {
            if (c.teacherId === teacherId && c.subject === subject) {
                return { ...c, isActive: false };
            }
            return c;
        });

        const newClass: OnlineClass = {
            id: `class-${Date.now()}`,
            teacherId,
            teacherName,
            subject,
            courseId,
            isActive: true,
            whiteboardState: '',
            docContent: '',
        };
        setOnlineClasses([...updatedClasses, newClass]);
        return newClass;
    };

    const endClass = (classId: string) => {
        setOnlineClasses(prev => prev.map(c => c.id === classId ? { ...c, isActive: false } : c));
    };

    const updateWhiteboardState = (classId: string, state: string) => {
        setOnlineClasses(prev => prev.map(c => 
            c.id === classId ? { ...c, whiteboardState: state } : c
        ));
    };

    const updateDocContent = (classId: string, content: string) => {
        setOnlineClasses(prev => prev.map(c => 
            c.id === classId ? { ...c, docContent: content } : c
        ));
    };

    const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'date'>) => {
        const newComplaint: Complaint = {
            ...complaintData,
            id: `comp-${Date.now()}`,
            date: new Date().toISOString(),
            status: ComplaintStatus.PENDING,
        };
        setComplaints(prev => [newComplaint, ...prev]);
    };

    const updateComplaint = (complaintId: string, updates: Partial<Complaint>) => {
        setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, ...updates } : c));
    };

    return (
        <DataContext.Provider value={{
            universityInfo, updateUniversityInfo, courses, addCourse, deleteCourse, addSubjectToCourse, deleteSubjectFromCourse, updateSubjectSyllabus, students, getStudentByRegNo,
            updateStudentRegistration, addStudentProfile, deleteStudentData, exams, addExam, deleteExam, results, addResult, updateResult,
            toggleResultEdit, notices, addNotice, deleteNotice, attendanceRecords, addAttendanceRecord, examApplications, addExamApplication, updateExamApplicationStatus,
            entranceApplications, addEntranceApplication, updateEntranceApplicationStatus, updateEntranceApplicationResult,
            feeStructures, addFeeStructure, deleteFeeStructure, feePayments, addFeePayment,
            chatThreads, chatMessages, addChatMessage, startChatThread,
            galleryImages, addGalleryImage, deleteGalleryImage,
            shopProducts, addShopProduct, updateShopProduct, deleteShopProduct,
            onlineClasses, startClass, endClass, updateWhiteboardState, updateDocContent,
            complaints, addComplaint, updateComplaint
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};