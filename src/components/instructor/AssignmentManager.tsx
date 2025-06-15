import React, { useState } from 'react';
import { X, Plus, FileText, Calendar, Clock, Users, Download, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Course } from '../../types';

interface AssignmentManagerProps {
  courses: Course[];
  selectedCourse: string | null;
  onClose: () => void;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  maxScore: number;
  courseId: string;
  submissions: Submission[];
  isPublished: boolean;
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl: string;
  status: 'submitted' | 'graded' | 'late';
  score?: number;
  feedback?: string;
}

const AssignmentManager: React.FC<AssignmentManagerProps> = ({ 
  courses, 
  selectedCourse, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [assignmentData, setAssignmentData] = useState({
    courseId: selectedCourse || '',
    title: '',
    description: '',
    instructions: '',
    dueDate: '',
    dueTime: '',
    maxScore: 100,
    allowLateSubmissions: true,
    fileTypes: ['pdf', 'doc', 'docx'],
    maxFileSize: '10'
  });

  // Mock assignments data
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Build a Todo App',
      description: 'Create a fully functional todo application using React',
      instructions: 'Build a todo app with add, edit, delete, and mark complete functionality. Use React hooks for state management.',
      dueDate: '2024-01-30',
      maxScore: 100,
      courseId: '1',
      isPublished: true,
      submissions: [
        {
          id: '1',
          studentId: '1',
          studentName: 'John Doe',
          submittedAt: '2024-01-28T10:30:00Z',
          fileUrl: '/submissions/todo-app-john.zip',
          status: 'submitted'
        },
        {
          id: '2',
          studentId: '2',
          studentName: 'Jane Smith',
          submittedAt: '2024-01-29T15:45:00Z',
          fileUrl: '/submissions/todo-app-jane.zip',
          status: 'graded',
          score: 95,
          feedback: 'Excellent work! Clean code and good UI design.'
        }
      ]
    }
  ]);

  const handleCreateAssignment = () => {
    console.log('Creating assignment:', assignmentData);
    // In a real app, this would save to database
    alert('Assignment created successfully!');
    onClose();
  };

  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    console.log('Grading submission:', { submissionId, score, feedback });
    // In a real app, this would update the database
    alert('Submission graded successfully!');
  };

  const getSubmissionStats = (assignment: Assignment) => {
    const total = assignment.submissions.length;
    const graded = assignment.submissions.filter(s => s.status === 'graded').length;
    const pending = total - graded;
    return { total, graded, pending };
  };

  const tabs = [
    { id: 'create', label: 'Create Assignment' },
    { id: 'manage', label: 'Manage Assignments' },
    { id: 'submissions', label: 'Review Submissions' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Assignment Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                <select
                  value={assignmentData.courseId}
                  onChange={(e) => setAssignmentData({ ...assignmentData, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="">Choose a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={assignmentData.title}
                  onChange={(e) => setAssignmentData({ ...assignmentData, title: e.target.value })}
                  placeholder="e.g., Build a Todo App"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={assignmentData.description}
                  onChange={(e) => setAssignmentData({ ...assignmentData, description: e.target.value })}
                  placeholder="Brief description of the assignment"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Instructions
                </label>
                <textarea
                  value={assignmentData.instructions}
                  onChange={(e) => setAssignmentData({ ...assignmentData, instructions: e.target.value })}
                  placeholder="Provide detailed instructions for students"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={assignmentData.dueDate}
                      onChange={(e) => setAssignmentData({ ...assignmentData, dueDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      value={assignmentData.dueTime}
                      onChange={(e) => setAssignmentData({ ...assignmentData, dueTime: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={assignmentData.maxScore}
                    onChange={(e) => setAssignmentData({ ...assignmentData, maxScore: parseInt(e.target.value) })}
                    min="1"
                    max="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed File Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {['pdf', 'doc', 'docx', 'txt', 'zip', 'jpg', 'png'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={assignmentData.fileTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssignmentData({
                              ...assignmentData,
                              fileTypes: [...assignmentData.fileTypes, type]
                            });
                          } else {
                            setAssignmentData({
                              ...assignmentData,
                              fileTypes: assignmentData.fileTypes.filter(t => t !== type)
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">.{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={assignmentData.allowLateSubmissions}
                    onChange={(e) => setAssignmentData({ ...assignmentData, allowLateSubmissions: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Allow late submissions</span>
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAssignment}
                  disabled={!assignmentData.courseId || !assignmentData.title}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Assignment
                </button>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Assignments</h3>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Assignment</span>
                </button>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment) => {
                  const stats = getSubmissionStats(assignment);
                  const course = courses.find(c => c.id === assignment.courseId);
                  
                  return (
                    <div key={assignment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assignment.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {assignment.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Course: {course?.title}</span>
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            <span>Max Score: {assignment.maxScore}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-blue-600">{stats.total} submissions</span>
                            <span className="text-green-600">{stats.graded} graded</span>
                            <span className="text-orange-600">{stats.pending} pending</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-blue-600 hover:text-blue-700 transition-colors" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-700 transition-colors" title="Edit">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Submissions</h3>
              
              {assignments.map((assignment) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">
                      {assignment.submissions.length} submissions • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {assignment.submissions.map((submission) => (
                      <div key={submission.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {submission.studentName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{submission.studentName}</h5>
                              <p className="text-sm text-gray-500">
                                Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              {submission.status === 'graded' ? (
                                <div>
                                  <div className="text-sm font-medium text-green-600">
                                    {submission.score}/{assignment.maxScore}
                                  </div>
                                  <div className="text-xs text-gray-500">Graded</div>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1 text-orange-600">
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-sm">Pending</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-blue-600 hover:text-blue-700 transition-colors" title="Download">
                                <Download className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  const score = prompt('Enter score (0-' + assignment.maxScore + '):');
                                  const feedback = prompt('Enter feedback:');
                                  if (score && feedback) {
                                    handleGradeSubmission(submission.id, parseInt(score), feedback);
                                  }
                                }}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                              >
                                {submission.status === 'graded' ? 'Re-grade' : 'Grade'}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {submission.feedback && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm text-green-800">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentManager;