import React, { createContext, useContext, useState } from 'react';
import { Course, CartItem, Enrollment, Certificate, Payment } from '../types';
import { mockCourses, mockCertificates } from '../utils/mockData';

interface CourseContextType {
  courses: Course[];
  cart: CartItem[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  payments: Payment[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  enrollInCourse: (courseId: string, userId: string, paymentId: string) => void;
  isEnrolled: (courseId: string, userId: string) => boolean;
  getEnrollment: (courseId: string, userId: string) => Enrollment | undefined;
  updateProgress: (courseId: string, userId: string, lessonId: string) => void;
  completeCourse: (courseId: string, userId: string) => Certificate | null;
  publishCourse: (courseId: string) => void;
  approveCourse: (courseId: string) => void;
  rejectCourse: (courseId: string, reason: string) => void;
  processPayment: (courseId: string, userId: string, amount: number, paymentMethod: string) => Payment;
  getEnrolledCourses: (userId: string) => Course[];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [payments, setPayments] = useState<Payment[]>([]);

  const addToCart = (course: Course) => {
    if (!cart.find(item => item.courseId === course.id)) {
      setCart([...cart, { courseId: course.id, course }]);
    }
  };

  const removeFromCart = (courseId: string) => {
    setCart(cart.filter(item => item.courseId !== courseId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const processPayment = (courseId: string, userId: string, amount: number, paymentMethod: string): Payment => {
    const payment: Payment = {
      id: `pay_${Date.now()}`,
      userId,
      courseId,
      amount,
      platformFee: amount * 0.4, // 40% platform fee
      instructorEarnings: amount * 0.6, // 60% instructor earnings
      paymentMethod: paymentMethod as 'card' | 'paypal' | 'bank',
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    setPayments(prev => [...prev, payment]);
    return payment;
  };

  const enrollInCourse = (courseId: string, userId: string, paymentId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Check if payment exists and is completed
    const payment = payments.find(p => p.id === paymentId && p.status === 'completed');
    if (!payment) {
      console.error('Payment not found or not completed');
      return;
    }

    // Check if already enrolled
    if (isEnrolled(courseId, userId)) {
      console.error('User already enrolled in this course');
      return;
    }

    const enrollment: Enrollment = {
      id: Date.now().toString(),
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      completedQuizzes: [],
      completedAssignments: [],
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      certificateIssued: false,
      totalTimeSpent: 0,
      paymentId,
      amountPaid: course.price
    };
    
    setEnrollments([...enrollments, enrollment]);
    removeFromCart(courseId);

    // Update course student count
    setCourses(prev => prev.map(c => 
      c.id === courseId 
        ? { ...c, totalStudents: c.totalStudents + 1 }
        : c
    ));
  };

  const isEnrolled = (courseId: string, userId: string) => {
    return enrollments.some(e => e.courseId === courseId && e.userId === userId);
  };

  const getEnrollment = (courseId: string, userId: string) => {
    return enrollments.find(e => e.courseId === courseId && e.userId === userId);
  };

  const getEnrolledCourses = (userId: string): Course[] => {
    const userEnrollments = enrollments.filter(e => e.userId === userId);
    return userEnrollments.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      return course;
    }).filter(Boolean) as Course[];
  };

  const updateProgress = (courseId: string, userId: string, lessonId: string) => {
    setEnrollments(enrollments.map(enrollment => {
      if (enrollment.courseId === courseId && enrollment.userId === userId) {
        const completedLessons = [...enrollment.completedLessons];
        if (!completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        }
        
        const course = courses.find(c => c.id === courseId);
        const progress = course ? (completedLessons.length / course.lessons.length) * 100 : 0;
        
        return {
          ...enrollment,
          completedLessons,
          progress,
          lastAccessedAt: new Date().toISOString()
        };
      }
      return enrollment;
    }));
  };

  const completeCourse = (courseId: string, userId: string): Certificate | null => {
    const course = courses.find(c => c.id === courseId);
    const enrollment = getEnrollment(courseId, userId);
    
    if (!course || !enrollment || !course.hasCertificate) return null;

    const certificate: Certificate = {
      id: `cert_${Date.now()}`,
      userId,
      courseId,
      courseName: course.title,
      instructorName: course.instructor.name,
      issuedAt: new Date().toISOString(),
      completionDate: new Date().toISOString(),
      grade: 'A',
      certificateUrl: `/certificates/cert_${Date.now()}.pdf`,
      verificationCode: `LH-${course.category.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`
    };

    setCertificates(prev => [...prev, certificate]);
    
    // Update enrollment to mark certificate as issued
    setEnrollments(prev => prev.map(e => 
      e.id === enrollment.id 
        ? { ...e, certificateIssued: true, certificateId: certificate.id }
        : e
    ));

    return certificate;
  };

  const publishCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            isPublished: false, // Set to false initially, admin needs to approve
            isDraft: false,
            isApproved: false // Requires admin approval
          }
        : course
    ));
  };

  const approveCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            isApproved: true, 
            isPublished: true, // Make it live when approved
            rejectionReason: undefined 
          }
        : course
    ));
  };

  const rejectCourse = (courseId: string, reason: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            isApproved: false, 
            isPublished: false,
            rejectionReason: reason 
          }
        : course
    ));
  };

  return (
    <CourseContext.Provider value={{
      courses,
      cart,
      enrollments,
      certificates,
      payments,
      addToCart,
      removeFromCart,
      clearCart,
      enrollInCourse,
      isEnrolled,
      getEnrollment,
      getEnrolledCourses,
      updateProgress,
      completeCourse,
      publishCourse,
      approveCourse,
      rejectCourse,
      processPayment
    }}>
      {children}
    </CourseContext.Provider>
  );
};