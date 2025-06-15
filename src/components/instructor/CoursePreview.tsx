import React from 'react';
import { X, Play, Users, Star, Clock, BookOpen, Award, Eye, Edit, Share2 } from 'lucide-react';
import { Course } from '../../types';

interface CoursePreviewProps {
  course: Course;
  onClose: () => void;
  onPublish: () => void;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ course, onClose, onPublish }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Preview</h1>
              <p className="text-gray-600">Review your course before publishing</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="h-4 w-4" />
              <span>Edit Course</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share Preview</span>
            </button>
            <button
              onClick={onPublish}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Publish Course</span>
            </button>
          </div>
        </div>

        {/* Course Preview */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 hover:bg-opacity-30 transition-all">
                <Play className="h-12 w-12 text-white ml-1" />
              </button>
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {course.category}
              </span>
            </div>
            <div className="absolute top-4 right-4">
              <span className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                Preview Mode
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{course.shortDescription}</p>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{course.rating}</span>
                      <span className="text-gray-600">({course.totalRatings.toLocaleString()} ratings)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{course.totalStudents.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{course.totalLessons} lessons</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Created by {course.instructor.name}</p>
                      <p className="text-sm text-gray-600">{course.instructor.bio}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Course Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
                  <p className="text-gray-700 leading-relaxed">{course.description}</p>
                </div>

                {/* What You'll Learn */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Curriculum */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Course content</h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200">
                    {course.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="border-b border-gray-200 last:border-b-0">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Play className="h-4 w-4 text-blue-500" />
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
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Audience */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Who this course is for</h3>
                  <ul className="space-y-2">
                    {course.targetAudience.map((audience, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                        <span className="text-gray-700">{audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-8">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(course.price)}
                      </span>
                      {course.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatCurrency(course.originalPrice)}
                        </span>
                      )}
                    </div>
                    {course.originalPrice && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration} on-demand video</span>
                    </div>
                    {course.hasCertificate && (
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Lifetime access</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Ready to publish?</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Your course looks great! Once published, students can enroll and start learning.
                    </p>
                    <button
                      onClick={onPublish}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Publish Course
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;