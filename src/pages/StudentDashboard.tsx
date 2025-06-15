import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Clock, Award, TrendingUp, Play, Calendar,
  BarChart3, Target, CheckCircle, Star, Download, Flame,
  MessageSquare, Video, FileText, Users, Bell, Settings,
  Search, Filter, Eye, Send, Upload, HelpCircle, X,
  Brain, Timer, Bookmark, Share2, PenTool, Map
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { supabase } from '../lib/supabase';
import StreakTracker from '../components/streak/StreakTracker';
import CertificateGenerator from '../components/certificate/CertificateGenerator';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [showLessonDetails, setShowLessonDetails] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [lessonNotes, setLessonNotes] = useState('');
  const [mindMapNodes, setMindMapNodes] = useState<any[]>([]);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>([]);
  const [stats, setStats] = useState<any>({});
  const [userStreak, setUserStreak] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { courses, enrollments, certificates, getEnrolledCourses, updateProgress } = useCourse();
  
  const enrolledCourses = user ? getEnrolledCourses(user.id) : [];
  const userCertificates = certificates.filter(cert => cert.userId === user?.id);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user stats
      const { data: streakData } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (streakData) {
        setUserStreak({
          userId: streakData.user_id,
          currentStreak: streakData.current_streak,
          longestStreak: streakData.longest_streak,
          lastActivityDate: streakData.last_activity_date,
          streakStartDate: streakData.streak_start_date,
          totalPoints: streakData.total_points,
          level: streakData.level,
          achievements: []
        });
      }

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user?.id)
        .order('unlocked_at', { ascending: false });

      if (achievementsData && userStreak) {
        setUserStreak(prev => ({
          ...prev,
          achievements: achievementsData.map(ach => ({
            id: ach.id,
            title: ach.title,
            description: ach.description,
            icon: ach.icon,
            unlockedAt: ach.unlocked_at,
            points: ach.points
          }))
        }));
      }

      // Calculate stats
      const inProgressCourses = enrolledCourses.filter(course => {
        const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
        return enrollment && enrollment.progress < 100;
      });

      const completedCourses = enrolledCourses.filter(course => {
        const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
        return enrollment && enrollment.progress === 100;
      });

      const totalTimeSpent = enrollments
        .filter(e => e.userId === user?.id)
        .reduce((total, e) => total + e.totalTimeSpent, 0);

      const averageProgress = enrollments.length > 0 
        ? enrollments.filter(e => e.userId === user?.id).reduce((sum, e) => sum + e.progress, 0) / enrollments.filter(e => e.userId === user?.id).length
        : 0;

      setStats({
        totalCourses: enrolledCourses.length,
        completedCourses: completedCourses.length,
        inProgressCourses: inProgressCourses.length,
        totalCertificates: userCertificates.length,
        totalTimeSpent,
        averageProgress,
        streak: userStreak?.currentStreak || 0,
        longestStreak: userStreak?.longestStreak || 0,
        totalPoints: userStreak?.totalPoints || 0,
        level: userStreak?.level || 1
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const inProgressCourses = enrolledCourses.filter(course => {
    const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
    return enrollment && enrollment.progress < 100;
  });

  const completedCourses = enrolledCourses.filter(course => {
    const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
    return enrollment && enrollment.progress === 100;
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLessonClick = (course: any, lesson: any) => {
    setSelectedCourse(course.id);
    setSelectedLesson(lesson);
    setShowLessonDetails(true);
    
    // Load lesson notes if available
    const savedNotes = localStorage.getItem(`lesson_notes_${lesson.id}`);
    if (savedNotes) {
      setLessonNotes(savedNotes);
    }

    // Load mind map if available
    const savedMindMap = localStorage.getItem(`mind_map_${lesson.id}`);
    if (savedMindMap) {
      setMindMapNodes(JSON.parse(savedMindMap));
    } else {
      // Initialize with basic nodes
      setMindMapNodes([
        { id: 1, text: lesson.title, x: 200, y: 100, isMain: true },
        { id: 2, text: 'Key Concepts', x: 100, y: 200, isMain: false },
        { id: 3, text: 'Examples', x: 300, y: 200, isMain: false }
      ]);
    }
  };

  const saveNotes = () => {
    if (selectedLesson) {
      localStorage.setItem(`lesson_notes_${selectedLesson.id}`, lessonNotes);
      alert('Notes saved successfully!');
    }
  };

  const saveMindMap = () => {
    if (selectedLesson) {
      localStorage.setItem(`mind_map_${selectedLesson.id}`, JSON.stringify(mindMapNodes));
      alert('Mind map saved successfully!');
    }
  };

  const addMindMapNode = () => {
    const newNode = {
      id: Date.now(),
      text: 'New Concept',
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 150,
      isMain: false
    };
    setMindMapNodes([...mindMapNodes, newNode]);
  };

  const updateMindMapNode = (id: number, text: string) => {
    setMindMapNodes(nodes => nodes.map(node => 
      node.id === id ? { ...node, text } : node
    ));
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarkedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const startStudyTimer = () => {
    setIsTimerRunning(true);
  };

  const stopStudyTimer = () => {
    setIsTimerRunning(false);
  };

  const resetStudyTimer = () => {
    setStudyTimer(0);
    setIsTimerRunning(false);
  };

  const markLessonComplete = async () => {
    if (selectedLesson && selectedCourse && user) {
      try {
        await updateProgress(selectedCourse, user.id, selectedLesson.id);
        alert('Lesson marked as complete! 🎉');
        setShowLessonDetails(false);
      } catch (error) {
        console.error('Failed to mark lesson complete:', error);
        alert('Failed to mark lesson complete. Please try again.');
      }
    }
  };

  const handleCertificateDownload = () => {
    console.log('Certificate downloaded');
  };

  const handleCertificateShare = () => {
    console.log('Certificate shared');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'My Courses' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'streak', label: 'Learning Streak' },
    { id: 'settings', label: 'Settings' }
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

  if (selectedCertificate) {
    const certificate = userCertificates.find(cert => cert.id === selectedCertificate);
    if (certificate) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </button>
            <CertificateGenerator
              certificate={certificate}
              onDownload={handleCertificateDownload}
              onShare={handleCertificateShare}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Track your learning progress.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCourses || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedCourses || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCertificates || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Streak</p>
                <p className="text-3xl font-bold text-gray-900">{stats.streak || 0}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <Flame className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-3xl font-bold text-gray-900">{Math.floor((stats.totalTimeSpent || 0) / 3600)}h</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
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
              <div className="space-y-8">
                {/* Progress Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                      <span className="text-sm font-bold text-gray-900">{Math.round(stats.averageProgress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${stats.averageProgress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Continue Learning */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {inProgressCourses.slice(0, 2).map((course) => {
                      const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
                      return (
                        <div key={course?.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <img
                              src={course?.thumbnail}
                              alt={course?.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">{course?.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">{course?.instructor.name}</p>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex-1 mr-4">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${enrollment?.progress || 0}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1">
                                    {Math.round(enrollment?.progress || 0)}% complete
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleLessonClick(course, { id: 'lesson-1', title: 'Continue Learning', description: 'Pick up where you left off' })}
                                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                  <Play className="h-4 w-4" />
                                  <span>Continue</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-8">
                {/* In Progress */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    In Progress ({inProgressCourses.length})
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgressCourses.map((course) => {
                      const enrollment = enrollments.find(e => e.courseId === course.id && e.userId === user?.id);
                      return (
                        <div key={course?.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <img
                            src={course?.thumbnail}
                            alt={course?.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{course?.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{course?.instructor.name}</p>
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Progress</span>
                                <span className="text-xs font-medium text-gray-900">
                                  {Math.round(enrollment?.progress || 0)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${enrollment?.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <button 
                                onClick={() => handleLessonClick(course, { 
                                  id: 'lesson-1', 
                                  title: 'Continue Learning', 
                                  description: 'Pick up where you left off',
                                  duration: '15:30',
                                  difficulty: 'Intermediate',
                                  estimatedTime: '20 minutes'
                                })}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                View Lesson Details
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Completed */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Completed ({completedCourses.length})
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCourses.map((course) => (
                      <div key={course?.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img
                            src={course?.thumbnail}
                            alt={course?.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2">{course?.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{course?.instructor.name}</p>
                          <div className="space-y-2">
                            <button 
                              onClick={() => {
                                const cert = userCertificates.find(c => c.courseId === course?.id);
                                if (cert) setSelectedCertificate(cert.id);
                              }}
                              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                            >
                              <Award className="h-4 w-4" />
                              <span>View Certificate</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Certificates ({userCertificates.length})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCertificates.map((certificate) => (
                    <div key={certificate.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="text-center">
                        <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Award className="h-8 w-8 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{certificate.courseName}</h4>
                        <p className="text-sm text-gray-600 mb-2">by {certificate.instructorName}</p>
                        <p className="text-xs text-gray-500 mb-4">
                          Completed on {new Date(certificate.completionDate).toLocaleDateString()}
                        </p>
                        {certificate.grade && (
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                            Grade: {certificate.grade}
                          </div>
                        )}
                        <div className="space-y-2">
                          <button
                            onClick={() => setSelectedCertificate(certificate.id)}
                            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            View Certificate
                          </button>
                          <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center space-x-2">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'streak' && userStreak && (
              <StreakTracker streak={userStreak} />
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Student Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Profile Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                          <input
                            type="text"
                            defaultValue={user?.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            defaultValue={user?.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Learning Preferences</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Email notifications for new lessons</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Reminder for live classes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Weekly progress reports</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Accessibility Settings</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Current Settings:</span>
                            <span className="text-sm font-medium">{user?.accessibilitySettings?.disabilityType || 'None'}</span>
                          </div>
                        </div>
                        <button className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Update Accessibility Settings
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Privacy Settings</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Show my progress to instructors</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-700">Allow other students to see my certificates</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lesson Details Modal */}
        {showLessonDetails && selectedLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-6xl w-full h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedLesson.title}</h3>
                  <p className="text-gray-600">{selectedLesson.description}</p>
                </div>
                <button
                  onClick={() => setShowLessonDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* Video Player Placeholder */}
                  <div className="bg-gray-900 rounded-lg mb-6 h-64 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg">Video Player</p>
                      <p className="text-sm opacity-75">Duration: {selectedLesson.duration || '15:30'}</p>
                    </div>
                  </div>

                  {/* Lesson Info */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Duration</span>
                      </div>
                      <p className="text-blue-700">{selectedLesson.duration || '15:30'}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Difficulty</span>
                      </div>
                      <p className="text-green-700">{selectedLesson.difficulty || 'Intermediate'}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Timer className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-900">Est. Study Time</span>
                      </div>
                      <p className="text-purple-700">{selectedLesson.estimatedTime || '20 minutes'}</p>
                    </div>
                  </div>

                  {/* Study Timer */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Study Timer</h4>
                        <p className="text-2xl font-bold text-gray-900">{formatTime(studyTimer)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={startStudyTimer}
                          disabled={isTimerRunning}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Start
                        </button>
                        <button
                          onClick={stopStudyTimer}
                          disabled={!isTimerRunning}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Stop
                        </button>
                        <button
                          onClick={resetStudyTimer}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <button
                      onClick={() => toggleBookmark(selectedLesson.id)}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-colors ${
                        bookmarkedLessons.includes(selectedLesson.id)
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>Bookmark</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="h-4 w-4" />
                      <span>Resources</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <HelpCircle className="h-4 w-4" />
                      <span>Ask Question</span>
                    </button>
                  </div>

                  {/* Mark Complete Button */}
                  <button
                    onClick={markLessonComplete}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Mark Lesson as Complete
                  </button>
                </div>

                {/* Sidebar */}
                <div className="w-80 border-l border-gray-200 flex flex-col">
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="flex">
                      <button className="flex-1 py-3 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
                        Notes
                      </button>
                      <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Mind Map
                      </button>
                      <button className="flex-1 py-3 px-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Quiz
                      </button>
                    </nav>
                  </div>

                  {/* Notes Section */}
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Lesson Notes</h4>
                      <button
                        onClick={saveNotes}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Save
                      </button>
                    </div>
                    <textarea
                      value={lessonNotes}
                      onChange={(e) => setLessonNotes(e.target.value)}
                      placeholder="Take notes while watching the lesson..."
                      className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Mind Map Section (Hidden by default) */}
                  <div className="hidden flex-1 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Mind Map</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={addMindMapNode}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Add Node
                        </button>
                        <button
                          onClick={saveMindMap}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div className="relative bg-gray-50 rounded-lg h-64 overflow-hidden">
                      {mindMapNodes.map((node) => (
                        <div
                          key={node.id}
                          className={`absolute p-2 rounded-lg text-sm cursor-move ${
                            node.isMain 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white border border-gray-300'
                          }`}
                          style={{ left: node.x, top: node.y }}
                        >
                          <input
                            type="text"
                            value={node.text}
                            onChange={(e) => updateMindMapNode(node.id, e.target.value)}
                            className={`bg-transparent border-none outline-none text-xs ${
                              node.isMain ? 'text-white placeholder-blue-200' : 'text-gray-900'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quiz Section (Hidden by default) */}
                  <div className="hidden flex-1 p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Lesson Quiz</h4>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <HelpCircle className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-orange-900">Quiz Available</span>
                      </div>
                      <p className="text-sm text-orange-700 mb-3">
                        Test your understanding with 5 questions about this lesson.
                      </p>
                      <div className="space-y-2 text-sm text-orange-700">
                        <div className="flex justify-between">
                          <span>Questions:</span>
                          <span>5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time Limit:</span>
                          <span>10 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Passing Score:</span>
                          <span>80%</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                        Start Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;