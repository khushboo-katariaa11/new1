import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { supabase } from '../lib/supabase';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Star,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Clock,
  Award,
  Target,
  Zap,
  Video,
  FileText,
  Settings
} from 'lucide-react';
import AssignmentManager from '../components/instructor/AssignmentManager';
import LiveMeetingScheduler from '../components/instructor/LiveMeetingScheduler';
import RevenueAnalytics from '../components/instructor/RevenueAnalytics';
import StudentTracker from '../components/instructor/StudentTracker';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
  activeStudents: number;
}

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { courses, enrollments, payments, refreshData } = useCourse();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    completionRate: 0,
    activeStudents: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignmentManager, setShowAssignmentManager] = useState(false);
  const [showLiveMeetingScheduler, setShowLiveMeetingScheduler] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter courses by instructor
  const instructorCourses = courses.filter(course => course.instructor.id === user?.id);
  const instructorPayments = payments.filter(payment => 
    instructorCourses.some(course => course.id === payment.courseId)
  );

  useEffect(() => {
    if (user) {
      loadInstructorData();
    }
  }, [user, courses, enrollments, payments]);

  const loadInstructorData = async () => {
    try {
      setLoading(true);
      
      // Calculate dashboard statistics
      const totalCourses = instructorCourses.length;
      const totalStudents = instructorCourses.reduce((sum, course) => sum + course.totalStudents, 0);
      const totalRevenue = instructorPayments.reduce((sum, payment) => sum + payment.instructorEarnings, 0);
      const averageRating = instructorCourses.length > 0 
        ? instructorCourses.reduce((sum, course) => sum + course.rating, 0) / instructorCourses.length 
        : 0;
      const completionRate = Math.floor(Math.random() * 30) + 70; // Mock completion rate
      const activeStudents = Math.floor(totalStudents * 0.6); // Mock active students

      setStats({
        totalCourses,
        totalStudents,
        totalRevenue,
        averageRating,
        completionRate,
        activeStudents
      });

    } catch (error) {
      console.error('Error loading instructor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'My Courses' },
    { id: 'students', label: 'Students' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'tools', label: 'Teaching Tools' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button 
                onClick={() => window.location.href = '/create-course'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Course</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCourses}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+2</span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= stats.averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Performance */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-xl font-semibold text-gray-900">Your Courses</h2>
                      <p className="text-gray-600 mt-1">Manage and track your course performance</p>
                    </div>
                    <div className="p-6">
                      {instructorCourses.length > 0 ? (
                        <div className="space-y-4">
                          {instructorCourses.map((course) => (
                            <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                    <span className="flex items-center">
                                      <Users className="w-4 h-4 mr-1" />
                                      {course.totalStudents} students
                                    </span>
                                    <span className="flex items-center">
                                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                      {course.rating}
                                    </span>
                                    <span className="flex items-center">
                                      <DollarSign className="w-4 h-4 mr-1" />
                                      ${course.price}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                          <p className="text-gray-600 mb-6">Create your first course to start teaching</p>
                          <button 
                            onClick={() => window.location.href = '/create-course'}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Create Your First Course
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                    <p className="text-gray-600 mt-1">Common tasks and shortcuts</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <button 
                        onClick={() => window.location.href = '/create-course'}
                        className="w-full flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                      >
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Create Course</p>
                          <p className="text-sm text-gray-600">Start a new course</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => setShowLiveMeetingScheduler(true)}
                        className="w-full flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                      >
                        <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition-colors">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Schedule Live Class</p>
                          <p className="text-sm text-gray-600">Create live sessions</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => setShowAssignmentManager(true)}
                        className="w-full flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                      >
                        <div className="bg-purple-600 p-2 rounded-lg group-hover:bg-purple-700 transition-colors">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Manage Assignments</p>
                          <p className="text-sm text-gray-600">Create and grade assignments</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors group">
                        <div className="bg-yellow-600 p-2 rounded-lg group-hover:bg-yellow-700 transition-colors">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">View Analytics</p>
                          <p className="text-sm text-gray-600">Course performance</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
                  <button 
                    onClick={() => window.location.href = '/create-course'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Course</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instructorCourses.map((course) => (
                    <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
                        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.totalStudents}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-400" />
                            {course.rating}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ${course.price}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                            Edit Course
                          </button>
                          <button className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded hover:border-blue-300 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <StudentTracker courses={instructorCourses} enrollments={enrollments} />
            )}

            {activeTab === 'analytics' && (
              <RevenueAnalytics 
                stats={{
                  totalCourses: stats.totalCourses,
                  totalStudents: stats.totalStudents,
                  totalRevenue: stats.totalRevenue,
                  averageRating: stats.averageRating,
                  totalReviews: instructorCourses.reduce((sum, course) => sum + course.totalRatings, 0),
                  monthlyEarnings: Array(12).fill(0).map(() => Math.random() * 5000 + 2000),
                  coursePerformance: instructorCourses.map(course => ({
                    courseId: course.id,
                    courseName: course.title,
                    students: course.totalStudents,
                    revenue: course.revenue || 0,
                    rating: course.rating,
                    completion: Math.floor(Math.random() * 30) + 70
                  })),
                  pendingPayouts: 0,
                  totalPayouts: stats.totalRevenue
                }}
                payments={instructorPayments}
                courses={instructorCourses}
              />
            )}

            {activeTab === 'tools' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Teaching Tools</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <Video className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Live Classes</h4>
                    <p className="text-sm text-gray-600 mb-4">Schedule and conduct live video sessions with your students</p>
                    <button 
                      onClick={() => setShowLiveMeetingScheduler(true)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Schedule Live Class
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Assignments</h4>
                    <p className="text-sm text-gray-600 mb-4">Create, manage, and grade student assignments</p>
                    <button 
                      onClick={() => setShowAssignmentManager(true)}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Manage Assignments
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="bg-green-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
                    <p className="text-sm text-gray-600 mb-4">Track student progress and course performance</p>
                    <button 
                      onClick={() => setActiveTab('analytics')}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Analytics
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="bg-yellow-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <MessageSquare className="h-6 w-6 text-yellow-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Student Q&A</h4>
                    <p className="text-sm text-gray-600 mb-4">Answer student questions and provide support</p>
                    <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors">
                      View Questions
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="bg-red-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Certificates</h4>
                    <p className="text-sm text-gray-600 mb-4">Manage and issue course completion certificates</p>
                    <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                      Manage Certificates
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="bg-indigo-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                      <Settings className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Course Settings</h4>
                    <p className="text-sm text-gray-600 mb-4">Configure course settings and preferences</p>
                    <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                      Course Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Manager Modal */}
        {showAssignmentManager && (
          <AssignmentManager
            courses={instructorCourses}
            selectedCourse={null}
            onClose={() => setShowAssignmentManager(false)}
          />
        )}

        {/* Live Meeting Scheduler Modal */}
        {showLiveMeetingScheduler && (
          <LiveMeetingScheduler
            courses={instructorCourses}
            selectedCourse={null}
            onClose={() => setShowLiveMeetingScheduler(false)}
          />
        )}
      </div>
    </div>
  );
}