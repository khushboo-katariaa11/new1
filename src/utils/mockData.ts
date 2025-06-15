import { Course, Certificate, Enrollment, Review, InstructorStats, StudentStats, Activity, AdminStats, Payment, Payout, Notification, Streak, Achievement } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Development Course',
    description: 'Master React from basics to advanced concepts including hooks, context, routing, and state management. Build real-world projects and deploy them to production. This comprehensive course covers everything you need to become a professional React developer.',
    shortDescription: 'Master React from basics to advanced concepts with real-world projects',
    instructor: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      bio: 'Full-stack developer with 10+ years of experience',
      rating: 4.8,
      totalStudents: 45621
    },
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 89.99,
    originalPrice: 199.99,
    rating: 4.8,
    totalRatings: 12543,
    totalStudents: 45621,
    duration: '42 hours',
    level: 'Intermediate',
    category: 'Web Development',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    requirements: [
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Familiarity with ES6+ features',
      'A computer with internet connection',
      'Code editor (VS Code recommended)'
    ],
    whatYouWillLearn: [
      'Build modern React applications from scratch',
      'Master React Hooks and Context API',
      'Implement routing with React Router',
      'State management with Redux and Zustand',
      'Testing React components',
      'Deploy applications to production',
      'Performance optimization techniques',
      'Best practices and design patterns'
    ],
    targetAudience: [
      'Developers who want to learn React',
      'Frontend developers looking to advance their skills',
      'Students preparing for React developer roles',
      'Anyone interested in modern web development'
    ],
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to React',
        description: 'Learn what React is and why it\'s popular',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '15:30',
        order: 1,
        isPreview: true,
        resources: [
          {
            id: 'r1-1',
            title: 'React Documentation',
            type: 'link',
            url: 'https://react.dev'
          },
          {
            id: 'r1-2',
            title: 'Course Slides',
            type: 'pdf',
            url: '/slides/react-intro.pdf',
            size: '2.5 MB'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Setting up Development Environment',
        description: 'Install Node.js, create-react-app, and VS Code setup',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '22:15',
        order: 2,
        isPreview: true,
        resources: [
          {
            id: 'r1-3',
            title: 'Setup Guide',
            type: 'pdf',
            url: '/guides/setup.pdf',
            size: '1.8 MB'
          }
        ]
      },
      {
        id: '1-3',
        title: 'JSX and Components',
        description: 'Understanding JSX syntax and creating your first components',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '28:45',
        order: 3,
        isPreview: false,
        quiz: {
          id: 'q1-1',
          title: 'JSX and Components Quiz',
          questions: [
            {
              id: 'q1-1-1',
              question: 'What does JSX stand for?',
              type: 'multiple-choice',
              options: ['JavaScript XML', 'JavaScript Extension', 'Java Syntax Extension', 'JavaScript eXtended'],
              correctAnswer: 0,
              explanation: 'JSX stands for JavaScript XML, which allows you to write HTML-like syntax in JavaScript.'
            },
            {
              id: 'q1-1-2',
              question: 'React components must start with a capital letter.',
              type: 'true-false',
              correctAnswer: 0,
              explanation: 'React components must start with a capital letter to distinguish them from regular HTML elements.'
            }
          ],
          passingScore: 80,
          timeLimit: 10
        }
      },
      {
        id: '1-4',
        title: 'Props and State',
        description: 'Learn how to pass data between components and manage component state',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        duration: '32:20',
        order: 4,
        isPreview: false,
        assignment: {
          id: 'a1-1',
          title: 'Build a Todo Component',
          description: 'Create a todo list component that manages state and accepts props',
          instructions: 'Build a React component that displays a list of todos, allows adding new todos, and marking them as complete. Use props to customize the component title.',
          maxScore: 100
        }
      },
      {
        id: '1-5',
        title: 'React Hooks Deep Dive',
        description: 'Master useState, useEffect, and other essential hooks',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        duration: '45:10',
        order: 5,
        isPreview: false
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    isPublished: true,
    isDraft: false,
    isApproved: true,
    language: 'English',
    hasSubtitles: true,
    hasCertificate: true,
    totalLessons: 5,
    totalQuizzes: 1,
    totalAssignments: 1,
    revenue: 4109.55,
    platformFee: 1643.82,
    instructorEarnings: 2465.73
  },
  {
    id: '2',
    title: 'Machine Learning with Python',
    description: 'Comprehensive course covering machine learning algorithms, data preprocessing, model evaluation, and deployment using Python and scikit-learn. Learn to build and deploy ML models in production.',
    shortDescription: 'Learn machine learning with Python from beginner to advanced level',
    instructor: {
      id: '3',
      name: 'Dr. Michael Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      bio: 'Data Scientist and AI researcher with PhD in Computer Science',
      rating: 4.9,
      totalStudents: 23456
    },
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 129.99,
    originalPrice: 249.99,
    rating: 4.9,
    totalRatings: 8765,
    totalStudents: 23456,
    duration: '65 hours',
    level: 'Intermediate',
    category: 'Data Science',
    tags: ['Python', 'Machine Learning', 'Data Science', 'AI'],
    requirements: [
      'Basic Python programming knowledge',
      'Understanding of mathematics and statistics',
      'Jupyter Notebook or Python IDE',
      'Willingness to learn and practice'
    ],
    whatYouWillLearn: [
      'Implement machine learning algorithms from scratch',
      'Use scikit-learn for ML projects',
      'Data preprocessing and feature engineering',
      'Model evaluation and selection',
      'Deploy ML models to production',
      'Work with real-world datasets',
      'Deep learning fundamentals',
      'MLOps best practices'
    ],
    targetAudience: [
      'Python developers interested in ML',
      'Data analysts wanting to learn ML',
      'Students studying data science',
      'Professionals transitioning to AI/ML roles'
    ],
    lessons: [
      {
        id: '2-1',
        title: 'Introduction to Machine Learning',
        description: 'Overview of ML concepts and applications',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '18:20',
        order: 1,
        isPreview: true
      },
      {
        id: '2-2',
        title: 'Python for Data Science',
        description: 'Essential Python libraries: NumPy, Pandas, Matplotlib',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '35:10',
        order: 2,
        isPreview: false
      }
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    isPublished: true,
    isDraft: false,
    isApproved: true,
    language: 'English',
    hasSubtitles: true,
    hasCertificate: true,
    totalLessons: 2,
    totalQuizzes: 0,
    totalAssignments: 0,
    revenue: 3049.74,
    platformFee: 1219.90,
    instructorEarnings: 1829.84
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass',
    description: 'Complete guide to digital marketing including SEO, social media marketing, email marketing, content marketing, and analytics. Build a comprehensive marketing strategy.',
    shortDescription: 'Master digital marketing strategies for business growth',
    instructor: {
      id: '4',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      bio: 'Digital Marketing Expert with 8+ years in the industry',
      rating: 4.7,
      totalStudents: 67890
    },
    thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop',
    price: 79.99,
    originalPrice: 159.99,
    rating: 4.7,
    totalRatings: 15432,
    totalStudents: 67890,
    duration: '38 hours',
    level: 'Beginner',
    category: 'Marketing',
    tags: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing'],
    requirements: [
      'No prior marketing experience required',
      'Access to social media platforms',
      'Basic computer skills',
      'Enthusiasm to learn marketing'
    ],
    whatYouWillLearn: [
      'Create comprehensive marketing strategies',
      'Master SEO and content marketing',
      'Run effective social media campaigns',
      'Email marketing automation',
      'Google Ads and Facebook Ads',
      'Analytics and performance tracking',
      'Brand building and positioning',
      'Conversion optimization'
    ],
    targetAudience: [
      'Business owners and entrepreneurs',
      'Marketing professionals',
      'Students interested in marketing',
      'Anyone wanting to promote their business online'
    ],
    lessons: [
      {
        id: '3-1',
        title: 'Digital Marketing Fundamentals',
        description: 'Understanding the digital marketing landscape',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '12:45',
        order: 1,
        isPreview: true
      }
    ],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
    isPublished: true,
    isDraft: false,
    isApproved: true,
    language: 'English',
    hasSubtitles: true,
    hasCertificate: true,
    totalLessons: 1,
    totalQuizzes: 0,
    totalAssignments: 0,
    revenue: 5431.21,
    platformFee: 2172.48,
    instructorEarnings: 3258.73
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: 'e1',
    userId: '1',
    courseId: '1',
    progress: 60,
    completedLessons: ['1-1', '1-2', '1-3'],
    completedQuizzes: ['q1-1'],
    completedAssignments: [],
    enrolledAt: '2024-01-20T10:00:00Z',
    lastAccessedAt: '2024-01-25T14:30:00Z',
    certificateIssued: false,
    totalTimeSpent: 3600,
    currentLesson: '1-4',
    paymentId: 'pay_1',
    amountPaid: 89.99
  },
  {
    id: 'e2',
    userId: '1',
    courseId: '2',
    progress: 25,
    completedLessons: ['2-1'],
    completedQuizzes: [],
    completedAssignments: [],
    enrolledAt: '2024-01-22T09:00:00Z',
    lastAccessedAt: '2024-01-24T16:45:00Z',
    certificateIssued: false,
    totalTimeSpent: 1200,
    currentLesson: '2-2',
    paymentId: 'pay_2',
    amountPaid: 129.99
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert1',
    userId: '1',
    courseId: '3',
    courseName: 'Digital Marketing Masterclass',
    instructorName: 'Sarah Johnson',
    issuedAt: '2024-01-15T12:00:00Z',
    completionDate: '2024-01-15T12:00:00Z',
    grade: 'A',
    certificateUrl: '/certificates/cert1.pdf',
    verificationCode: 'LH-DM-2024-001'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'pay_1',
    userId: '1',
    courseId: '1',
    amount: 89.99,
    platformFee: 35.996,
    instructorEarnings: 53.994,
    paymentMethod: 'card',
    status: 'completed',
    transactionId: 'txn_1234567890',
    createdAt: '2024-01-20T10:00:00Z',
    processedAt: '2024-01-20T10:01:00Z'
  },
  {
    id: 'pay_2',
    userId: '1',
    courseId: '2',
    amount: 129.99,
    platformFee: 51.996,
    instructorEarnings: 77.994,
    paymentMethod: 'paypal',
    status: 'completed',
    transactionId: 'txn_0987654321',
    createdAt: '2024-01-22T09:00:00Z',
    processedAt: '2024-01-22T09:02:00Z'
  }
];

export const mockPayouts: Payout[] = [
  {
    id: 'payout_1',
    instructorId: '2',
    amount: 2465.73,
    status: 'completed',
    paymentMethod: 'stripe',
    createdAt: '2024-01-25T00:00:00Z',
    processedAt: '2024-01-25T12:00:00Z',
    transactionId: 'po_1234567890'
  },
  {
    id: 'payout_2',
    instructorId: '3',
    amount: 1829.84,
    status: 'pending',
    paymentMethod: 'paypal',
    createdAt: '2024-01-26T00:00:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: '2',
    type: 'payment_received',
    title: 'Payment Received',
    message: 'You received $53.99 from course enrollment',
    isRead: false,
    createdAt: '2024-01-20T10:01:00Z'
  },
  {
    id: 'notif_2',
    userId: '1',
    type: 'certificate_earned',
    title: 'Certificate Earned!',
    message: 'Congratulations! You earned a certificate for Digital Marketing Masterclass',
    isRead: false,
    createdAt: '2024-01-15T12:00:00Z'
  }
];

export const mockStreaks: Streak[] = [
  {
    userId: '1',
    currentStreak: 7,
    longestStreak: 15,
    lastActivityDate: '2024-01-25',
    streakStartDate: '2024-01-19',
    totalPoints: 1250,
    level: 3,
    achievements: [
      {
        id: 'ach_1',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        unlockedAt: '2024-01-20T10:30:00Z',
        points: 50
      },
      {
        id: 'ach_2',
        title: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        unlockedAt: '2024-01-25T14:30:00Z',
        points: 200
      }
    ]
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    courseId: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 5,
    comment: 'Excellent course! The instructor explains everything clearly and the projects are very practical.',
    createdAt: '2024-01-20T10:00:00Z',
    helpful: 15
  },
  {
    id: 'r2',
    courseId: '1',
    userId: '3',
    userName: 'Alice Wilson',
    userAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    rating: 4,
    comment: 'Great content and well-structured. Would recommend to anyone learning React.',
    createdAt: '2024-01-18T15:30:00Z',
    helpful: 8
  }
];

export const mockInstructorStats: InstructorStats = {
  totalCourses: 3,
  totalStudents: 137967,
  totalRevenue: 45230.50,
  averageRating: 4.8,
  totalReviews: 36740,
  monthlyEarnings: [3200, 4100, 3800, 4500, 5200, 4800, 5500, 6200, 5800, 6500, 7200, 6800],
  coursePerformance: [
    {
      courseId: '1',
      courseName: 'Complete React Development Course',
      students: 45621,
      revenue: 18450.30,
      rating: 4.8,
      completion: 78
    },
    {
      courseId: '2',
      courseName: 'Machine Learning with Python',
      students: 23456,
      revenue: 15680.20,
      rating: 4.9,
      completion: 65
    },
    {
      courseId: '3',
      courseName: 'Digital Marketing Masterclass',
      students: 67890,
      revenue: 11100.00,
      rating: 4.7,
      completion: 82
    }
  ],
  pendingPayouts: 2500.50,
  totalPayouts: 42730.00
};

export const mockStudentStats: StudentStats = {
  totalCourses: 3,
  completedCourses: 1,
  inProgressCourses: 2,
  totalCertificates: 1,
  totalTimeSpent: 4800,
  averageProgress: 42,
  streak: 7,
  longestStreak: 15,
  totalPoints: 1250,
  level: 3,
  recentActivity: [
    {
      id: 'a1',
      type: 'lesson_completed',
      courseId: '1',
      courseName: 'Complete React Development Course',
      description: 'Completed lesson: JSX and Components',
      timestamp: '2024-01-25T14:30:00Z',
      points: 50
    },
    {
      id: 'a2',
      type: 'quiz_completed',
      courseId: '1',
      courseName: 'Complete React Development Course',
      description: 'Completed quiz: JSX and Components Quiz',
      timestamp: '2024-01-25T14:45:00Z',
      points: 100
    },
    {
      id: 'a3',
      type: 'course_enrolled',
      courseId: '2',
      courseName: 'Machine Learning with Python',
      description: 'Enrolled in course',
      timestamp: '2024-01-22T09:00:00Z',
      points: 25
    },
    {
      id: 'a4',
      type: 'certificate_earned',
      courseId: '3',
      courseName: 'Digital Marketing Masterclass',
      description: 'Earned completion certificate',
      timestamp: '2024-01-15T12:00:00Z',
      points: 500
    },
    {
      id: 'a5',
      type: 'streak_maintained',
      courseId: '1',
      courseName: 'Complete React Development Course',
      description: 'Maintained 7-day learning streak',
      timestamp: '2024-01-25T14:30:00Z',
      points: 200
    }
  ]
};

export const mockAdminStats: AdminStats = {
  totalUsers: 125430,
  totalCourses: 8567,
  totalRevenue: 2456789.50,
  platformRevenue: 982715.80,
  instructorPayouts: 1474073.70,
  pendingCourses: 23,
  monthlyRevenue: [180000, 195000, 210000, 225000, 240000, 255000, 270000, 285000, 300000, 315000, 330000, 345000],
  userGrowth: [8500, 9200, 9800, 10500, 11200, 11800, 12500, 13200, 13800, 14500, 15200, 15800],
  courseGrowth: [650, 680, 710, 740, 770, 800, 830, 860, 890, 920, 950, 980],
  topCategories: [
    { category: 'Web Development', courseCount: 1250, revenue: 456789.50, students: 45620 },
    { category: 'Data Science', courseCount: 890, revenue: 398765.20, students: 32450 },
    { category: 'Marketing', courseCount: 750, revenue: 298456.80, students: 28930 },
    { category: 'Mobile Development', courseCount: 650, revenue: 245678.90, students: 22340 },
    { category: 'Design', courseCount: 580, revenue: 198765.40, students: 19870 }
  ],
  topInstructors: [
    { instructorId: '2', instructorName: 'Jane Smith', totalRevenue: 45230.50, totalStudents: 45621, courseCount: 3, rating: 4.8 },
    { instructorId: '3', instructorName: 'Dr. Michael Chen', totalRevenue: 38965.20, totalStudents: 23456, courseCount: 2, rating: 4.9 },
    { instructorId: '4', instructorName: 'Sarah Johnson', totalRevenue: 32456.80, totalStudents: 67890, courseCount: 4, rating: 4.7 }
  ],
  recentTransactions: mockPayments
};

export const categories = [
  'All Categories',
  'Web Development',
  'Data Science',
  'Marketing',
  'Mobile Development',
  'Design',
  'Finance',
  'Business',
  'Photography',
  'Music',
  'Languages'
];