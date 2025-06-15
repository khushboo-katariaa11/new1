import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { 
  ChevronLeft, ChevronRight, PlayCircle, PauseCircle, 
  Volume2, VolumeX, Maximize, Settings, List, 
  CheckCircle, Clock, FileText, HelpCircle, Download,
  Star, MessageSquare, BookOpen, Award, Users, Bell,
  Video, Calendar, Send, Upload, Eye
} from 'lucide-react';
import { Course, Lesson, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';

interface CoursePlayerProps {
  course: Course;
  onBack: () => void;
}

const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onBack }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: any }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showClassroom, setShowClassroom] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showAssignments, setShowAssignments] = useState(false);
  
  const { user } = useAuth();
  const { updateProgress, getEnrollment } = useCourse();
  
  const currentLesson = course.lessons[currentLessonIndex];
  const enrollment = user ? getEnrollment(course.id, user.id) : null;

  // Mock classroom data
  const classroomNotifications = [
    {
      id: 'cn1',
      type: 'live_class',
      title: 'Live Class: React Hooks Deep Dive',
      message: 'Join us tomorrow at 2:00 PM for an interactive session on React Hooks',
      scheduledAt: '2024-01-26T14:00:00Z',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 'cn2',
      type: 'assignment',
      title: 'Assignment Due: Todo App',
      message: 'Your Todo App assignment is due in 2 days. Make sure to submit before the deadline.',
      dueDate: '2024-01-30T23:59:59Z'
    },
    {
      id: 'cn3',
      type: 'announcement',
      title: 'Course Update',
      message: 'New bonus materials have been added to the course. Check them out!',
      timestamp: '2024-01-24T10:00:00Z'
    }
  ];

  // Mock chat messages
  const chatMessages = [
    {
      id: 'msg1',
      senderId: user?.id,
      senderName: user?.name,
      message: 'Hi! I have a question about useEffect dependencies.',
      timestamp: '2024-01-25T14:00:00Z',
      isInstructor: false
    },
    {
      id: 'msg2',
      senderId: course.instructor.id,
      senderName: course.instructor.name,
      message: 'Great question! Dependencies in useEffect determine when the effect should re-run. Let me explain...',
      timestamp: '2024-01-25T14:15:00Z',
      isInstructor: true
    }
  ];

  // Mock assignments
  const assignments = [
    {
      id: 'a1',
      title: 'Build a Todo App',
      description: 'Create a fully functional todo application using React hooks',
      dueDate: '2024-01-30T23:59:59Z',
      maxScore: 100,
      submitted: false,
      instructions: 'Build a todo app with add, edit, delete, and mark complete functionality. Use React hooks for state management.'
    },
    {
      id: 'a2',
      title: 'Component Refactoring Exercise',
      description: 'Refactor the provided class component to use functional components and hooks',
      dueDate: '2024-02-05T23:59:59Z',
      maxScore: 75,
      submitted: true,
      grade: 85,
      feedback: 'Great work! Your implementation is clean and follows best practices.'
    }
  ];
  
  useEffect(() => {
    // Load user's progress
    if (enrollment && enrollment.currentLesson) {
      const lessonIndex = course.lessons.findIndex(l => l.id === enrollment.currentLesson);
      if (lessonIndex !== -1) {
        setCurrentLessonIndex(lessonIndex);
      }
    }
  }, [enrollment, course.lessons]);

  const handleProgress = (state: any) => {
    setPlayed(state.played);
    
    // Mark lesson as completed when 90% watched
    if (state.played > 0.9 && user && !enrollment?.completedLessons.includes(currentLesson.id)) {
      updateProgress(course.id, user.id, currentLesson.id);
    }
  };

  const handleLessonChange = (index: number) => {
    setCurrentLessonIndex(index);
    setPlayed(0);
    setPlaying(false);
    setShowQuiz(false);
    setQuizSubmitted(false);
    setQuizAnswers({});
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      handleLessonChange(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      handleLessonChange(currentLessonIndex - 1);
    }
  };

  const handleQuizAnswer = (questionId: string, answer: any) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (user) {
      updateProgress(course.id, user.id, currentLesson.id);
    }
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending chat message:', chatMessage);
      setChatMessage('');
      // In real app, this would send the message via API
    }
  };

  const handleJoinLiveClass = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleSubmitAssignment = (assignmentId: string) => {
    console.log('Submitting assignment:', assignmentId);
    alert('Assignment submitted successfully!');
  };

  const calculateQuizScore = () => {
    if (!currentLesson.quiz) return 0;
    
    let correct = 0;
    currentLesson.quiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / currentLesson.quiz.questions.length) * 100);
  };

  const isLessonCompleted = (lessonId: string) => {
    return enrollment?.completedLessons.includes(lessonId) || false;
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.quiz) return <HelpCircle className="h-4 w-4 text-orange-500" />;
    if (lesson.assignment) return <FileText className="h-4 w-4 text-purple-500" />;
    return <PlayCircle className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? 'mr-80' : ''}`}>
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-semibold">{course.title}</h1>
              <p className="text-sm text-gray-300">{currentLesson.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowClassroom(!showClassroom)}
              className={`p-2 rounded-lg transition-colors ${
                showClassroom ? 'bg-purple-600' : 'hover:bg-gray-700'
              }`}
              title="Classroom"
            >
              <Users className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-colors ${
                showChat ? 'bg-green-600' : 'hover:bg-gray-700'
              }`}
              title="Chat with Instructor"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowAssignments(!showAssignments)}
              className={`p-2 rounded-lg transition-colors ${
                showAssignments ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
              title="Assignments"
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg transition-colors ${
                showNotes ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
              title="Notes"
            >
              <BookOpen className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Toggle Sidebar"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black relative">
          <ReactPlayer
            url={currentLesson.videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            onProgress={handleProgress}
            onDuration={setDuration}
            controls={true}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
          
          {/* Custom Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePreviousLesson}
                disabled={currentLessonIndex === 0}
                className="p-2 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPlaying(!playing)}
                className="p-3 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
              >
                {playing ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
              </button>
              <button
                onClick={handleNextLesson}
                disabled={currentLessonIndex === course.lessons.length - 1}
                className="p-2 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all"
                >
                  {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
              <button className="p-2 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentLesson.title}</h2>
                <p className="text-gray-600">{currentLesson.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {isLessonCompleted(currentLesson.id) && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
                <span className="text-sm text-gray-500">{currentLesson.duration}</span>
              </div>
            </div>

            {/* Resources */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resources</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {currentLesson.resources.map((resource) => (
                    <div key={resource.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Download className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{resource.title}</p>
                        {resource.size && (
                          <p className="text-sm text-gray-500">{resource.size}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz */}
            {currentLesson.quiz && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Quiz: {currentLesson.quiz.title}</h3>
                  <button
                    onClick={() => setShowQuiz(!showQuiz)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    {showQuiz ? 'Hide Quiz' : 'Take Quiz'}
                  </button>
                </div>

                {showQuiz && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    {!quizSubmitted ? (
                      <div className="space-y-6">
                        {currentLesson.quiz.questions.map((question, index) => (
                          <div key={question.id} className="space-y-3">
                            <h4 className="font-medium text-gray-900">
                              {index + 1}. {question.question}
                            </h4>
                            
                            {question.type === 'multiple-choice' && question.options && (
                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <label key={optionIndex} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name={question.id}
                                      value={optionIndex}
                                      onChange={(e) => handleQuizAnswer(question.id, parseInt(e.target.value))}
                                      className="text-orange-600"
                                    />
                                    <span>{option}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                            
                            {question.type === 'true-false' && (
                              <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value="0"
                                    onChange={(e) => handleQuizAnswer(question.id, 0)}
                                    className="text-orange-600"
                                  />
                                  <span>True</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value="1"
                                    onChange={(e) => handleQuizAnswer(question.id, 1)}
                                    className="text-orange-600"
                                  />
                                  <span>False</span>
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        <button
                          onClick={handleQuizSubmit}
                          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Submit Quiz
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {calculateQuizScore()}%
                        </div>
                        <p className="text-gray-700 mb-4">
                          {calculateQuizScore() >= (currentLesson.quiz.passingScore || 80) 
                            ? 'Congratulations! You passed the quiz.' 
                            : 'You need to score at least ' + (currentLesson.quiz.passingScore || 80) + '% to pass.'}
                        </p>
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setQuizAnswers({});
                          }}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Retake Quiz
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Assignment */}
            {currentLesson.assignment && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment: {currentLesson.assignment.title}</h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">{currentLesson.assignment.description}</p>
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                    <p className="text-gray-700">{currentLesson.assignment.instructions}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Max Score: {currentLesson.assignment.maxScore} points
                    </span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Submit Assignment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Course Content</h3>
            <div className="text-sm text-gray-600 mt-1">
              {enrollment ? Math.round(enrollment.progress) : 0}% Complete
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${enrollment ? enrollment.progress : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  index === currentLessonIndex ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
                onClick={() => handleLessonChange(index)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {isLessonCompleted(lesson.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      getLessonIcon(lesson)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm ${
                      index === currentLessonIndex ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {lesson.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{lesson.duration}</span>
                      {lesson.isPreview && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                          Preview
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Summary */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {enrollment?.completedLessons.length || 0}/{course.lessons.length}
              </div>
              <div className="text-sm text-gray-600 mb-3">Lessons Completed</div>
              {enrollment && enrollment.progress === 100 && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Award className="h-5 w-5" />
                  <span className="text-sm font-medium">Course Completed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Classroom Panel */}
      {showClassroom && (
        <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Classroom</span>
            </h4>
            <button
              onClick={() => setShowClassroom(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {classroomNotifications.map((notification) => (
                <div key={notification.id} className="bg-gray-50 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 text-sm">{notification.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  {notification.type === 'live_class' && notification.meetingLink && (
                    <button
                      onClick={() => handleJoinLiveClass(notification.meetingLink)}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <Video className="h-3 w-3" />
                      <span>Join Class</span>
                    </button>
                  )}
                  {notification.dueDate && (
                    <p className="text-xs text-orange-600 mt-1">
                      Due: {new Date(notification.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat with Instructor</span>
            </h4>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.isInstructor ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isInstructor 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.isInstructor ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
              />
              <button 
                onClick={handleSendChatMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Panel */}
      {showAssignments && (
        <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h4 className="font-medium text-gray-900 flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Assignments</span>
            </h4>
            <button
              onClick={() => setShowAssignments(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 text-sm">{assignment.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Max Score: {assignment.maxScore} points
                      </p>
                    </div>
                    <div className="ml-2">
                      {assignment.submitted ? (
                        <div className="text-center">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Submitted
                          </span>
                          {assignment.grade && (
                            <div className="text-sm font-medium text-green-600 mt-1">
                              {assignment.grade}/{assignment.maxScore}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubmitAssignment(assignment.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                  {assignment.feedback && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                      <p className="text-green-800">{assignment.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notes Panel */}
      {showNotes && (
        <div className="fixed bottom-4 right-4 w-80 h-64 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Notes</h4>
            <button
              onClick={() => setShowNotes(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Take notes while watching..."
            className="flex-1 p-3 resize-none border-none outline-none"
          />
          <div className="p-3 border-t border-gray-200">
            <button className="w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Save Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;