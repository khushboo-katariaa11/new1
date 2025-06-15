import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Video, Link, Copy, CheckCircle } from 'lucide-react';
import { Course } from '../../types';

interface LiveMeetingSchedulerProps {
  courses: Course[];
  selectedCourse: string | null;
  onClose: () => void;
}

const LiveMeetingScheduler: React.FC<LiveMeetingSchedulerProps> = ({ 
  courses, 
  selectedCourse, 
  onClose 
}) => {
  const [meetingData, setMeetingData] = useState({
    courseId: selectedCourse || '',
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    maxAttendees: '50',
    isRecorded: true,
    sendReminder: true
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSchedule = async () => {
    setIsScheduling(true);
    
    try {
      // Simulate Google Meet integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock Google Meet link
      const mockMeetLink = `https://meet.google.com/abc-defg-hij`;
      setMeetingLink(mockMeetLink);
      setIsScheduled(true);
      
      // In a real app, this would:
      // 1. Create Google Meet link via API
      // 2. Send calendar invites to enrolled students
      // 3. Store meeting details in database
      // 4. Send email notifications
      
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert('Meeting link copied to clipboard!');
  };

  const selectedCourseData = courses.find(c => c.id === meetingData.courseId);

  if (isScheduled) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Meeting Scheduled!</h2>
            <p className="text-gray-600 mb-6">Your live class has been scheduled successfully.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Meeting Details</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Course:</span>
                  <span className="font-medium">{selectedCourseData?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span className="font-medium">{meetingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">{meetingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{meetingData.duration} minutes</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Google Meet Link</span>
                </div>
                <button
                  onClick={copyMeetingLink}
                  className="p-1 text-blue-600 hover:text-blue-700"
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-blue-700 mt-2 font-mono break-all">{meetingLink}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={copyMeetingLink}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy Meeting Link
              </button>
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Schedule Live Class</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select
              value={meetingData.courseId}
              onChange={(e) => setMeetingData({ ...meetingData, courseId: e.target.value })}
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
              Class Title
            </label>
            <input
              type="text"
              value={meetingData.title}
              onChange={(e) => setMeetingData({ ...meetingData, title: e.target.value })}
              placeholder="e.g., React Hooks Deep Dive"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={meetingData.description}
              onChange={(e) => setMeetingData({ ...meetingData, description: e.target.value })}
              placeholder="What will you cover in this live class?"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={meetingData.date}
                  onChange={(e) => setMeetingData({ ...meetingData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="time"
                  value={meetingData.time}
                  onChange={(e) => setMeetingData({ ...meetingData, time: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                value={meetingData.duration}
                onChange={(e) => setMeetingData({ ...meetingData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attendees
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={meetingData.maxAttendees}
                  onChange={(e) => setMeetingData({ ...meetingData, maxAttendees: e.target.value })}
                  min="1"
                  max="100"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={meetingData.isRecorded}
                onChange={(e) => setMeetingData({ ...meetingData, isRecorded: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Record this session</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={meetingData.sendReminder}
                onChange={(e) => setMeetingData({ ...meetingData, sendReminder: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Send reminder emails to students</span>
            </label>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Google Meet link will be generated automatically</li>
              <li>• Calendar invites will be sent to all enrolled students</li>
              <li>• Students will receive email notifications</li>
              <li>• Recording will be available after the session (if enabled)</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSchedule}
              disabled={isScheduling || !meetingData.courseId || !meetingData.title || !meetingData.date || !meetingData.time}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isScheduling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  <span>Schedule Live Class</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiveMeetingScheduler;