import React, { useState } from 'react';
import { 
  Plus, X, Upload, Play, FileText, HelpCircle, 
  Save, Eye, Settings, ChevronDown, ChevronUp,
  CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react';
import { Course, Lesson } from '../types';
import { categories } from '../utils/mockData';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';

const CreateCourse: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basics');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const { publishCourse } = useCourse();
  const { user } = useAuth();
  
  const [courseData, setCourseData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    language: 'English',
    price: 0,
    originalPrice: 0,
    tags: [] as string[],
    requirements: [''],
    whatYouWillLearn: [''],
    targetAudience: [''],
    thumbnail: '',
    hasCertificate: true,
    hasSubtitles: false
  });

  const [lessons, setLessons] = useState<Partial<Lesson>[]>([
    {
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      order: 1,
      isPreview: false
    }
  ]);

  const [currentTag, setCurrentTag] = useState('');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    basics: true
  });

  const handleCourseDataChange = (field: string, value: any) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayField = (field: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayField = (field: string, index: number) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index)
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !courseData.tags.includes(currentTag.trim())) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addLesson = () => {
    setLessons(prev => [...prev, {
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      order: prev.length + 1,
      isPreview: false
    }]);
  };

  const updateLesson = (index: number, field: string, value: any) => {
    setLessons(prev => prev.map((lesson, i) => 
      i === index ? { ...lesson, [field]: value } : lesson
    ));
  };

  const removeLesson = (index: number) => {
    setLessons(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const validateCourse = () => {
    const errors = [];
    
    if (!courseData.title.trim()) errors.push('Course title is required');
    if (!courseData.shortDescription.trim()) errors.push('Short description is required');
    if (!courseData.description.trim()) errors.push('Course description is required');
    if (courseData.price < 0) errors.push('Price must be positive');
    if (courseData.whatYouWillLearn.filter(item => item.trim()).length === 0) {
      errors.push('At least one learning objective is required');
    }
    if (lessons.filter(lesson => lesson.title?.trim()).length === 0) {
      errors.push('At least one lesson is required');
    }
    
    return errors;
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate course ID if new course
      const newCourseId = courseId || `course_${Date.now()}`;
      setCourseId(newCourseId);
      
      // Create course object
      const newCourse: Partial<Course> = {
        id: newCourseId,
        ...courseData,
        instructor: {
          id: user?.id || '',
          name: user?.name || '',
          avatar: user?.avatar,
          bio: user?.bio
        },
        lessons: lessons.filter(lesson => lesson.title?.trim()) as Lesson[],
        rating: 0,
        totalRatings: 0,
        totalStudents: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: false,
        isDraft: true,
        isApproved: false,
        totalLessons: lessons.filter(lesson => lesson.title?.trim()).length,
        totalQuizzes: 0,
        totalAssignments: 0
      };
      
      console.log('Saving course draft:', newCourse);
      alert('Course draft saved successfully!');
      
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    const errors = validateCourse();
    if (errors.length > 0) {
      alert('Please fix the following errors before previewing:\n' + errors.join('\n'));
      return;
    }
    
    console.log('Previewing course...', { courseData, lessons });
    alert('Course preview functionality would open here');
  };

  const handlePublish = async () => {
    const errors = validateCourse();
    if (errors.length > 0) {
      alert('Please fix the following errors before publishing:\n' + errors.join('\n'));
      return;
    }
    
    setIsPublishing(true);
    
    try {
      // First save as draft if not already saved
      if (!courseId) {
        await handleSaveDraft();
      }
      
      // Simulate publishing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Publishing course...', { courseData, lessons });
      
      if (courseId) {
        publishCourse(courseId);
      }
      
      alert('Course published successfully! It will be reviewed by our team before going live.');
      
      // Reset form or redirect
      // In a real app, you might redirect to the instructor dashboard
      
    } catch (error) {
      console.error('Failed to publish course:', error);
      alert('Failed to publish course. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const tabs = [
    { id: 'basics', label: 'Course Basics' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'settings', label: 'Settings' }
  ];

  const isFormValid = () => {
    return courseData.title.trim() && 
           courseData.shortDescription.trim() && 
           courseData.description.trim() &&
           lessons.some(lesson => lesson.title?.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600 mt-2">Build and publish your course to share knowledge with students worldwide.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveDraft}
              disabled={isSaving || !courseData.title.trim()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Draft</span>
                </>
              )}
            </button>
            <button
              onClick={handlePreview}
              disabled={!isFormValid()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || !isFormValid()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Publish Course</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Course Completion</span>
              <span className="text-sm text-gray-500">
                {Math.round((
                  (courseData.title ? 1 : 0) +
                  (courseData.description ? 1 : 0) +
                  (lessons.filter(l => l.title).length > 0 ? 1 : 0) +
                  (courseData.price >= 0 ? 1 : 0)
                ) / 4 * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.round((
                    (courseData.title ? 1 : 0) +
                    (courseData.description ? 1 : 0) +
                    (lessons.filter(l => l.title).length > 0 ? 1 : 0) +
                    (courseData.price >= 0 ? 1 : 0)
                  ) / 4 * 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {/* Completion indicators */}
                    {tab.id === 'basics' && courseData.title && courseData.description && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {tab.id === 'curriculum' && lessons.filter(l => l.title).length > 0 && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {tab.id === 'pricing' && courseData.price >= 0 && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </button>
                ))}
              </nav>
              
              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Course Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lessons:</span>
                    <span className="font-medium">{lessons.filter(l => l.title?.trim()).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {lessons.reduce((total, lesson) => {
                        if (lesson.duration) {
                          const [minutes, seconds] = lesson.duration.split(':').map(Number);
                          return total + (minutes || 0) + ((seconds || 0) / 60);
                        }
                        return total;
                      }, 0).toFixed(0)} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${courseData.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              {activeTab === 'basics' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Course Basics</h2>

                  {/* Course Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      value={courseData.title}
                      onChange={(e) => handleCourseDataChange('title', e.target.value)}
                      placeholder="Enter your course title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Your title should be a mix of attention-grabbing, informative, and optimized for search
                    </p>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      value={courseData.shortDescription}
                      onChange={(e) => handleCourseDataChange('shortDescription', e.target.value)}
                      placeholder="Enter a short description of your course"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Description *
                    </label>
                    <textarea
                      value={courseData.description}
                      onChange={(e) => handleCourseDataChange('description', e.target.value)}
                      placeholder="Enter a detailed description of your course"
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>

                  {/* Category and Level */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={courseData.category}
                        onChange={(e) => handleCourseDataChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        {categories.slice(1).map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level *
                      </label>
                      <select
                        value={courseData.level}
                        onChange={(e) => handleCourseDataChange('level', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language *
                    </label>
                    <select
                      value={courseData.language}
                      onChange={(e) => handleCourseDataChange('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add a tag"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {courseData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Course Thumbnail */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Thumbnail
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload course thumbnail</p>
                      <p className="text-sm text-gray-500">Recommended size: 1280x720px</p>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Choose File
                      </button>
                    </div>
                  </div>

                  {/* What Students Will Learn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What will students learn in your course? *
                    </label>
                    <div className="space-y-2">
                      {courseData.whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayFieldChange('whatYouWillLearn', index, e.target.value)}
                            placeholder="Enter a learning objective"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          {courseData.whatYouWillLearn.length > 1 && (
                            <button
                              onClick={() => removeArrayField('whatYouWillLearn', index)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayField('whatYouWillLearn')}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add more</span>
                      </button>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <div className="space-y-2">
                      {courseData.requirements.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayFieldChange('requirements', index, e.target.value)}
                            placeholder="Enter a requirement"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          {courseData.requirements.length > 1 && (
                            <button
                              onClick={() => removeArrayField('requirements', index)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayField('requirements')}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add more</span>
                      </button>
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Who is this course for?
                    </label>
                    <div className="space-y-2">
                      {courseData.targetAudience.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayFieldChange('targetAudience', index, e.target.value)}
                            placeholder="Describe your target audience"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          {courseData.targetAudience.length > 1 && (
                            <button
                              onClick={() => removeArrayField('targetAudience', index)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayField('targetAudience')}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add more</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
                    <button
                      onClick={addLesson}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Lesson</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => toggleSection(`lesson-${index}`)}
                        >
                          <div className="flex items-center space-x-3">
                            <Play className="h-5 w-5 text-blue-500" />
                            <span className="font-medium text-gray-900">
                              Lesson {index + 1}: {lesson.title || 'Untitled Lesson'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLesson(index);
                              }}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {expandedSections[`lesson-${index}`] ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {expandedSections[`lesson-${index}`] && (
                          <div className="p-4 border-t border-gray-200 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Lesson Title *
                                </label>
                                <input
                                  type="text"
                                  value={lesson.title || ''}
                                  onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                  placeholder="Enter lesson title"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  value={lesson.duration || ''}
                                  onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                                  placeholder="e.g., 15:30"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={lesson.description || ''}
                                onChange={(e) => updateLesson(index, 'description', e.target.value)}
                                placeholder="Enter lesson description"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Video URL
                              </label>
                              <input
                                type="url"
                                value={lesson.videoUrl || ''}
                                onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                                placeholder="Enter video URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            </div>

                            <div className="flex items-center space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={lesson.isPreview || false}
                                  onChange={(e) => updateLesson(index, 'isPreview', e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Free preview</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Course Pricing</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={courseData.price}
                          onChange={(e) => handleCourseDataChange('price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={courseData.originalPrice}
                          onChange={(e) => handleCourseDataChange('originalPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Set a higher original price to show discount
                      </p>
                    </div>
                  </div>

                  {courseData.originalPrice > courseData.price && courseData.originalPrice > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">Discount Preview</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-green-900">
                          ${courseData.price.toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${courseData.originalPrice.toFixed(2)}
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                          {Math.round(((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Revenue Breakdown */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-3">Revenue Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Course Price:</span>
                        <span className="font-medium text-blue-900">${courseData.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Platform Fee (40%):</span>
                        <span className="font-medium text-blue-900">${(courseData.price * 0.4).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-blue-200 pt-2">
                        <span className="text-blue-700 font-medium">Your Earnings (60%):</span>
                        <span className="font-bold text-blue-900">${(courseData.price * 0.6).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Pricing Tips</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Research similar courses to set competitive pricing</li>
                      <li>• Consider offering early bird discounts</li>
                      <li>• Free courses can help build your reputation</li>
                      <li>• Premium pricing works for specialized, high-value content</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Course Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Certificate of Completion</h3>
                        <p className="text-sm text-gray-600">Students will receive a certificate when they complete the course</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={courseData.hasCertificate}
                          onChange={(e) => handleCourseDataChange('hasCertificate', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Subtitles Available</h3>
                        <p className="text-sm text-gray-600">Course videos include subtitles</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={courseData.hasSubtitles}
                          onChange={(e) => handleCourseDataChange('hasSubtitles', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-800 mb-2">Publishing Guidelines</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Ensure all lessons have clear titles and descriptions</li>
                      <li>• Upload high-quality video content</li>
                      <li>• Include downloadable resources where applicable</li>
                      <li>• Test your course before publishing</li>
                      <li>• Courses are reviewed before going live</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-2">Ready to Publish?</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Make sure you've completed all sections before publishing your course.
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        {courseData.title && courseData.description ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span>Course basics completed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {lessons.filter(l => l.title?.trim()).length > 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span>At least one lesson added</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {courseData.price >= 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                        )}
                        <span>Pricing configured</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;