import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
import Header from './components/common/Header';
import Home from './pages/Home';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import CoursePlayer from './pages/CoursePlayer';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateCourse from './pages/CreateCourse';
import Cart from './pages/Cart';
import AuthModal from './components/auth/AuthModal';
import AccessibilityToolbar from './components/accessibility/AccessibilityToolbar';
import { useAuth } from './context/AuthContext';
import { useCourse } from './context/CourseContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const { user } = useAuth();
  const { courses, isEnrolled } = useCourse();

  const selectedCourse = selectedCourseId 
    ? courses.find(course => course.id === selectedCourseId)
    : null;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthModalMode('signup');
    setAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    setCurrentPage('catalog');
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentPage('course-detail');
  };

  const handleEnrollInCourse = () => {
    // This will be handled by the CourseDetail component now
    console.log('Enrollment handled by CourseDetail component');
  };

  const handleStartLearning = () => {
    if (selectedCourseId) {
      setCurrentPage('course-player');
    }
  };

  const handleBackFromPlayer = () => {
    setCurrentPage('course-detail');
  };

  const handleBackFromDetail = () => {
    setCurrentPage('catalog');
    setSelectedCourseId(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            courses={courses}
            onCourseClick={handleCourseClick}
            onGetStarted={handleGetStarted}
          />
        );
      case 'catalog':
        return (
          <CourseCatalog
            courses={courses}
            onCourseClick={handleCourseClick}
            searchQuery={searchQuery}
          />
        );
      case 'course-detail':
        return selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            onEnroll={handleEnrollInCourse}
            onStartLearning={handleStartLearning}
          />
        ) : (
          <div>Course not found</div>
        );
      case 'course-player':
        return selectedCourse ? (
          <CoursePlayer
            course={selectedCourse}
            onBack={handleBackFromPlayer}
          />
        ) : (
          <div>Course not found</div>
        );
      case 'cart':
        return <Cart />;
      case 'dashboard':
        if (user?.role === 'admin') {
          return <AdminDashboard />;
        } else if (user?.role === 'instructor') {
          return <InstructorDashboard />;
        } else {
          return <StudentDashboard />;
        }
      case 'create-course':
        return user?.role === 'instructor' ? (
          <CreateCourse />
        ) : (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600">Only instructors can create courses.</p>
            </div>
          </div>
        );
      default:
        return (
          <Home
            courses={courses}
            onCourseClick={handleCourseClick}
            onGetStarted={handleGetStarted}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Skip Link for Screen Readers */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {currentPage !== 'course-player' && (
        <Header
          onSearch={handleSearch}
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      
      <main id="main-content" role="main">
        {renderCurrentPage()}
      </main>
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
      
      <AccessibilityToolbar />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <AccessibilityProvider>
          <AppContent />
        </AccessibilityProvider>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;