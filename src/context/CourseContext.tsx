import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, CartItem, Enrollment, Certificate, Payment } from '../types';
import { supabase } from '../lib/supabase';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { paymentService } from '../services/paymentService';

interface CourseContextType {
  courses: Course[];
  cart: CartItem[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  payments: Payment[];
  loading: boolean;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  enrollInCourse: (courseId: string, userId: string, payment: Payment) => Promise<void>;
  isEnrolled: (courseId: string, userId: string) => boolean;
  getEnrollment: (courseId: string, userId: string) => Enrollment | undefined;
  updateProgress: (courseId: string, userId: string, lessonId: string) => Promise<void>;
  completeCourse: (courseId: string, userId: string) => Promise<Certificate | null>;
  publishCourse: (courseId: string) => void;
  approveCourse: (courseId: string) => void;
  rejectCourse: (courseId: string, reason: string) => void;
  processPayment: (courseId: string, userId: string, amount: number, paymentMethod: string) => Payment;
  getEnrolledCourses: (userId: string) => Course[];
  refreshData: () => Promise<void>;
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load courses
      const { data: coursesData } = await courseService.getAllCourses();
      if (coursesData) {
        setCourses(coursesData.map(transformCourseData));
      }

      // Load user-specific data if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await loadUserData(user.id);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Load enrollments
      const { data: enrollmentsData } = await enrollmentService.getUserEnrollments(userId);
      if (enrollmentsData) {
        setEnrollments(enrollmentsData.map(transformEnrollmentData));
      }

      // Load certificates
      const { data: certificatesData } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId);
      
      if (certificatesData) {
        setCertificates(certificatesData.map(transformCertificateData));
      }

      // Load payments
      const { data: paymentsData } = await paymentService.getUserPayments(userId);
      if (paymentsData) {
        setPayments(paymentsData.map(transformPaymentData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const transformCourseData = (dbCourse: any): Course => ({
    id: dbCourse.id,
    title: dbCourse.title,
    description: dbCourse.description,
    shortDescription: dbCourse.short_description,
    instructor: {
      id: dbCourse.instructor.id,
      name: dbCourse.instructor.name,
      avatar: dbCourse.instructor.avatar,
      bio: dbCourse.instructor.bio
    },
    thumbnail: dbCourse.thumbnail || 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: parseFloat(dbCourse.price) || 0,
    originalPrice: dbCourse.original_price ? parseFloat(dbCourse.original_price) : undefined,
    rating: parseFloat(dbCourse.rating) || 0,
    totalRatings: dbCourse.total_ratings || 0,
    totalStudents: dbCourse.total_students || 0,
    duration: dbCourse.duration || '0 hours',
    level: dbCourse.level || 'Beginner',
    category: dbCourse.category,
    tags: dbCourse.tags || [],
    lessons: [], // Will be loaded separately when needed
    requirements: dbCourse.requirements || [],
    whatYouWillLearn: dbCourse.what_you_will_learn || [],
    targetAudience: dbCourse.target_audience || [],
    createdAt: dbCourse.created_at,
    updatedAt: dbCourse.updated_at,
    isPublished: dbCourse.is_published,
    isDraft: dbCourse.is_draft,
    isApproved: dbCourse.is_approved,
    rejectionReason: dbCourse.rejection_reason,
    language: dbCourse.language || 'English',
    hasSubtitles: dbCourse.has_subtitles,
    hasCertificate: dbCourse.has_certificate,
    totalLessons: dbCourse.total_lessons || 0,
    totalQuizzes: dbCourse.total_quizzes || 0,
    totalAssignments: dbCourse.total_assignments || 0,
    revenue: parseFloat(dbCourse.revenue) || 0
  });

  const transformEnrollmentData = (dbEnrollment: any): Enrollment => ({
    id: dbEnrollment.id,
    userId: dbEnrollment.user_id,
    courseId: dbEnrollment.course_id,
    progress: parseFloat(dbEnrollment.progress) || 0,
    completedLessons: dbEnrollment.completed_lessons || [],
    completedQuizzes: dbEnrollment.completed_quizzes || [],
    completedAssignments: dbEnrollment.completed_assignments || [],
    enrolledAt: dbEnrollment.enrolled_at,
    lastAccessedAt: dbEnrollment.last_accessed_at,
    certificateIssued: dbEnrollment.certificate_issued,
    certificateId: dbEnrollment.certificate_id,
    totalTimeSpent: dbEnrollment.total_time_spent || 0,
    currentLesson: dbEnrollment.current_lesson,
    paymentId: dbEnrollment.payment_id,
    amountPaid: parseFloat(dbEnrollment.amount_paid) || 0
  });

  const transformCertificateData = (dbCertificate: any): Certificate => ({
    id: dbCertificate.id,
    userId: dbCertificate.user_id,
    courseId: dbCertificate.course_id,
    courseName: dbCertificate.course_name,
    instructorName: dbCertificate.instructor_name,
    issuedAt: dbCertificate.issued_at,
    completionDate: dbCertificate.completion_date,
    grade: dbCertificate.grade,
    certificateUrl: dbCertificate.certificate_url,
    verificationCode: dbCertificate.verification_code
  });

  const transformPaymentData = (dbPayment: any): Payment => ({
    id: dbPayment.id,
    userId: dbPayment.user_id,
    courseId: dbPayment.course_id,
    amount: parseFloat(dbPayment.amount),
    platformFee: parseFloat(dbPayment.platform_fee),
    instructorEarnings: parseFloat(dbPayment.instructor_earnings),
    paymentMethod: dbPayment.payment_method,
    status: dbPayment.status,
    transactionId: dbPayment.transaction_id,
    createdAt: dbPayment.created_at,
    processedAt: dbPayment.processed_at
  });

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
      platformFee: amount * 0.4,
      instructorEarnings: amount * 0.6,
      paymentMethod: paymentMethod as 'card' | 'paypal' | 'bank',
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    // Save to database
    paymentService.createPayment({
      userId,
      courseId,
      amount,
      paymentMethod: paymentMethod as 'card' | 'paypal' | 'bank'
    });

    setPayments(prev => [...prev, payment]);
    return payment;
  };

  const enrollInCourse = async (courseId: string, userId: string, payment: Payment) => {
    try {
      const course = courses.find(c => c.id === courseId);
      if (!course) throw new Error('Course not found');

      if (payment.status !== 'completed') {
        throw new Error('Payment not completed');
      }

      if (isEnrolled(courseId, userId)) {
        throw new Error('User already enrolled in this course');
      }

      // Create enrollment in database
      const { data: enrollmentData, error } = await enrollmentService.enrollInCourse(
        userId,
        courseId,
        payment.id,
        payment.amount
      );

      if (error) throw error;

      if (enrollmentData) {
        const newEnrollment = transformEnrollmentData(enrollmentData);
        setEnrollments(prev => [...prev, newEnrollment]);
        
        // Update course student count locally
        setCourses(prev => prev.map(c => 
          c.id === courseId 
            ? { ...c, totalStudents: c.totalStudents + 1 }
            : c
        ));

        // Remove from cart
        removeFromCart(courseId);

        // Award achievement for first enrollment
        await awardAchievement(userId, 'first_enrollment');
      }
    } catch (error) {
      console.error('Enrollment failed:', error);
      throw error;
    }
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
      return courses.find(c => c.id === enrollment.courseId);
    }).filter(Boolean) as Course[];
  };

  const updateProgress = async (courseId: string, userId: string, lessonId: string) => {
    try {
      const enrollment = getEnrollment(courseId, userId);
      if (!enrollment) return;

      const course = courses.find(c => c.id === courseId);
      if (!course) return;

      const completedLessons = [...enrollment.completedLessons];
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      const progress = (completedLessons.length / course.totalLessons) * 100;

      // Update in database
      const { error } = await enrollmentService.updateProgress(
        enrollment.id,
        progress,
        completedLessons
      );

      if (!error) {
        // Update local state
        setEnrollments(prev => prev.map(e => 
          e.id === enrollment.id 
            ? { ...e, completedLessons, progress, lastAccessedAt: new Date().toISOString() }
            : e
        ));

        // Award achievements
        if (completedLessons.length === 1) {
          await awardAchievement(userId, 'first_lesson');
        }
        if (progress === 100) {
          await awardAchievement(userId, 'course_completion');
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const completeCourse = async (courseId: string, userId: string): Promise<Certificate | null> => {
    try {
      const course = courses.find(c => c.id === courseId);
      const enrollment = getEnrollment(courseId, userId);
      
      if (!course || !enrollment || !course.hasCertificate) return null;

      const verificationCode = `LH-${course.category.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(3, '0')}`;

      // Create certificate in database
      const { data: certificateData, error } = await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          course_id: courseId,
          course_name: course.title,
          instructor_name: course.instructor.name,
          completion_date: new Date().toISOString(),
          grade: 'A',
          verification_code: verificationCode
        })
        .select()
        .single();

      if (error) throw error;

      if (certificateData) {
        const newCertificate = transformCertificateData(certificateData);
        setCertificates(prev => [...prev, newCertificate]);
        
        // Update enrollment
        setEnrollments(prev => prev.map(e => 
          e.id === enrollment.id 
            ? { ...e, certificateIssued: true, certificateId: newCertificate.id }
            : e
        ));

        await awardAchievement(userId, 'certificate_earned');
        return newCertificate;
      }
    } catch (error) {
      console.error('Failed to complete course:', error);
    }
    
    return null;
  };

  const awardAchievement = async (userId: string, type: string) => {
    try {
      const achievements = {
        first_enrollment: {
          title: 'First Steps',
          description: 'Enrolled in your first course',
          icon: '🎯',
          points: 50
        },
        first_lesson: {
          title: 'Learning Begins',
          description: 'Completed your first lesson',
          icon: '📚',
          points: 25
        },
        course_completion: {
          title: 'Course Master',
          description: 'Completed an entire course',
          icon: '🏆',
          points: 200
        },
        certificate_earned: {
          title: 'Certified Learner',
          description: 'Earned your first certificate',
          icon: '🎓',
          points: 300
        }
      };

      const achievement = achievements[type as keyof typeof achievements];
      if (!achievement) return;

      await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          points: achievement.points
        });

      // Update user points
      await supabase
        .from('streaks')
        .upsert({
          user_id: userId,
          total_points: supabase.sql`total_points + ${achievement.points}`
        });
    } catch (error) {
      console.error('Failed to award achievement:', error);
    }
  };

  const publishCourse = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            isPublished: false,
            isDraft: false,
            isApproved: false
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
            isPublished: true,
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

  const refreshData = async () => {
    await loadInitialData();
  };

  return (
    <CourseContext.Provider value={{
      courses,
      cart,
      enrollments,
      certificates,
      payments,
      loading,
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
      processPayment,
      refreshData
    }}>
      {children}
    </CourseContext.Provider>
  );
};