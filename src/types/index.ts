export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  bio?: string;
  enrolledCourses?: string[];
  createdCourses?: string[];
  certificates?: Certificate[];
  totalStudents?: number;
  totalRevenue?: number;
  rating?: number;
  totalReviews?: number;
  streak?: number;
  lastLoginDate?: string;
  joinedDate?: string;
  isVerified?: boolean;
  paymentInfo?: PaymentInfo;
  accessibilitySettings?: AccessibilitySettings;
}

export interface AccessibilitySettings {
  disabilityType?: 'visual' | 'hearing' | 'motor' | 'cognitive' | 'none';
  visualSettings?: {
    type: 'blind' | 'partial' | 'colorBlind';
    colorBlindType?: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'protanomaly' | 'deuteranomaly' | 'tritanomaly' | 'monochromacy' | 'achromatopsia';
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    highContrast: boolean;
    screenReader: boolean;
    dyslexiaFont: boolean;
    // New partial vision features
    highContrastMode?: 'none' | 'black-yellow' | 'white-black' | 'yellow-black' | 'blue-white';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
    screenMagnifierCompatible?: boolean;
    generousSpacing?: boolean;
    largeClickTargets?: boolean;
    keyboardFocusIndicators?: boolean;
  };
  hearingSettings?: {
    captions: boolean;
    visualAlerts: boolean;
    signLanguage: boolean;
  };
  motorSettings?: {
    voiceNavigation: boolean;
    keyboardOnly: boolean;
    largeClickAreas: boolean;
    headMovement: boolean;
  };
  cognitiveSettings?: {
    simplifiedLayout: boolean;
    textToSpeech: boolean;
    consistentNavigation: boolean;
    reducedAnimations: boolean;
  };
}

export interface PaymentInfo {
  stripeAccountId?: string;
  paypalEmail?: string;
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    rating?: number;
    totalStudents?: number;
  };
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  tags: string[];
  lessons: Lesson[];
  requirements: string[];
  whatYouWillLearn: string[];
  targetAudience: string[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isDraft: boolean;
  isApproved: boolean;
  rejectionReason?: string;
  language: string;
  hasSubtitles: boolean;
  hasCertificate: boolean;
  totalLessons: number;
  totalQuizzes: number;
  totalAssignments: number;
  revenue?: number;
  platformFee?: number;
  instructorEarnings?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  isPreview: boolean;
  resources?: Resource[];
  quiz?: Quiz;
  assignment?: Assignment;
  isCompleted?: boolean;
  transcript?: string;
  captions?: Caption[];
}

export interface Caption {
  start: number;
  end: number;
  text: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'file';
  url: string;
  size?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate?: string;
  maxScore: number;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  completedQuizzes: string[];
  completedAssignments: string[];
  enrolledAt: string;
  lastAccessedAt: string;
  certificateIssued: boolean;
  certificateId?: string;
  totalTimeSpent: number;
  currentLesson?: string;
  paymentId?: string;
  amountPaid: number;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  issuedAt: string;
  completionDate: string;
  grade?: string;
  certificateUrl: string;
  verificationCode: string;
}

export interface CartItem {
  courseId: string;
  course: Course;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  platformFee: number;
  instructorEarnings: number;
  paymentMethod: 'card' | 'paypal' | 'bank';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: string;
  processedAt?: string;
}

export interface Payout {
  id: string;
  instructorId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod: 'stripe' | 'paypal' | 'bank';
  createdAt: string;
  processedAt?: string;
  transactionId?: string;
}

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  totalQuizzes: number;
  completedQuizzes: number;
  totalAssignments: number;
  completedAssignments: number;
  overallProgress: number;
  timeSpent: number;
  lastAccessed: string;
}

export interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  monthlyEarnings: number[];
  coursePerformance: CoursePerformance[];
  pendingPayouts: number;
  totalPayouts: number;
}

export interface CoursePerformance {
  courseId: string;
  courseName: string;
  students: number;
  revenue: number;
  rating: number;
  completion: number;
}

export interface StudentStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalCertificates: number;
  totalTimeSpent: number;
  averageProgress: number;
  recentActivity: Activity[];
  streak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
}

export interface Activity {
  id: string;
  type: 'lesson_completed' | 'quiz_completed' | 'course_enrolled' | 'certificate_earned' | 'streak_maintained';
  courseId: string;
  courseName: string;
  description: string;
  timestamp: string;
  points?: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  platformRevenue: number;
  instructorPayouts: number;
  pendingCourses: number;
  monthlyRevenue: number[];
  userGrowth: number[];
  courseGrowth: number[];
  topCategories: CategoryStats[];
  topInstructors: InstructorRanking[];
  recentTransactions: Payment[];
}

export interface CategoryStats {
  category: string;
  courseCount: number;
  revenue: number;
  students: number;
}

export interface InstructorRanking {
  instructorId: string;
  instructorName: string;
  totalRevenue: number;
  totalStudents: number;
  courseCount: number;
  rating: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'course_approved' | 'course_rejected' | 'payment_received' | 'new_enrollment' | 'certificate_earned';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakStartDate: string;
  totalPoints: number;
  level: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  points: number;
}