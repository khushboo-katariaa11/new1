import React, { useState } from 'react';
import { 
  Play, Clock, Users, Star, Globe, Award, BookOpen, 
  CheckCircle, Download, ExternalLink, ShoppingCart,
  ChevronDown, ChevronUp, PlayCircle, FileText, HelpCircle
} from 'lucide-react';
import { Course, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { mockReviews } from '../utils/mockData';

interface CourseDetailProps {
  course: Course;
  onEnroll: () => void;
  onStartLearning: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onEnroll, onStartLearning }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const { user } = useAuth();
  const { addToCart, cart, isEnrolled } = useCourse();
  
  const isInCart = cart.some(item => item.courseId === course.id);
  const isUserEnrolled = user ? isEnrolled(course.id, user.id) : false;
  const courseReviews = mockReviews.filter(review => review.courseId === course.id);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAddToCart = () => {
    if (!isInCart && !isUserEnrolled) {
      addToCart(course);
    }
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  const getLessonIcon = (lesson: any) => {
    if (lesson.quiz) return <HelpCircle className="h-4 w-4 text-orange-500" />;
    if (lesson.assignment) return <FileText className="h-4 w-4 text-purple-500" />;
    return <PlayCircle className="h-4 w-4 text-blue-500" />;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.shortDescription}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-gray-300">({course.totalRatings.toLocaleString()} ratings)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-5 w-5 text-gray-300" />
                  <span>{course.totalStudents.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-gray-300" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-5 w-5 text-gray-300" />
                  <span>{course.language}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">Created by {course.instructor.name}</p>
                  <p className="text-sm text-gray-300">{course.instructor.bio}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-8">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Preview
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-gray-900">
                        ${course.price.toFixed(2)}
                      </span>
                      {course.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${course.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {isUserEnrolled ? (
                    <button
                      onClick={onStartLearning}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-3"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={onEnroll}
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                      >
                        Enroll Now
                      </button>
                      <button
                        onClick={handleAddToCart}
                        disabled={isInCart}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                          isInCart
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
                      </button>
                    </div>
                  )}

                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} on-demand video</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Downloadable resources</span>
                    </div>
                    {course.hasCertificate && (
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
                  <p className="text-gray-700 leading-relaxed">{course.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Who this course is for</h3>
                  <ul className="space-y-2">
                    {course.targetAudience.map((audience, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course content</h2>
                <div className="bg-white rounded-lg border border-gray-200">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="border-b border-gray-200 last:border-b-0">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getLessonIcon(lesson)}
                          <div>
                            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {lesson.isPreview && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Preview
                            </span>
                          )}
                          <span className="text-sm text-gray-500">{lesson.duration}</span>
                        </div>
                      </div>
                      {lesson.resources && lesson.resources.length > 0 && (
                        <div className="px-4 pb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Resources:</h5>
                            <div className="space-y-1">
                              {lesson.resources.map((resource) => (
                                <div key={resource.id} className="flex items-center space-x-2 text-sm">
                                  {resource.type === 'link' ? (
                                    <ExternalLink className="h-4 w-4 text-blue-500" />
                                  ) : (
                                    <Download className="h-4 w-4 text-green-500" />
                                  )}
                                  <span className="text-gray-700">{resource.title}</span>
                                  {resource.size && (
                                    <span className="text-gray-500">({resource.size})</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'instructor' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructor</h2>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.instructor.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {course.instructor.rating}
                          </div>
                          <div className="text-sm text-gray-600">Instructor Rating</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {course.totalRatings.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Reviews</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {course.instructor.totalStudents?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Students</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">3</div>
                          <div className="text-sm text-gray-600">Courses</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student feedback</h2>
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {course.rating}
                      </div>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(course.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">Course Rating</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1 w-16">
                            {[...Array(rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {courseReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <button className="hover:text-gray-700">Helpful ({review.helpful})</button>
                            <button className="hover:text-gray-700">Report</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Related Courses */}
          <div className="lg:col-span-1 mt-12 lg:mt-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">More courses by this instructor</h3>
              <div className="space-y-4">
                {/* This would be populated with related courses */}
                <div className="text-sm text-gray-600">
                  More courses coming soon...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;