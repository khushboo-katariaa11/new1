import React, { useState } from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, AlertCircle, CheckCircle, X, Eye, BarChart3, PieChart, Calendar, Download, Filter, Search, Bell, Settings, Shield, CreditCard, Ban as Bank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockAdminStats, mockCourses, mockPayments, mockPayouts } from '../utils/mockData';
import { useCourse } from '../context/CourseContext';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const { approveCourse, rejectCourse } = useCourse();
  
  const stats = mockAdminStats;
  const pendingCourses = mockCourses.filter(course => !course.isApproved && !course.rejectionReason);
  const recentPayments = mockPayments.slice(0, 10);
  const pendingPayouts = mockPayouts.filter(payout => payout.status === 'pending');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const handleApproveCourse = (courseId: string) => {
    approveCourse(courseId);
    alert('Course approved successfully! It is now live on the platform.');
  };

  const handleRejectCourse = (courseId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      rejectCourse(courseId, reason);
      alert('Course rejected. The instructor has been notified.');
    }
  };

  const processPayouts = () => {
    console.log('Processing pending payouts...');
    alert('All pending payouts have been processed successfully!');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses', label: 'Course Management' },
    { id: 'users', label: 'User Management' },
    { id: 'payments', label: 'Payments & Banking' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span>Admin Dashboard</span>
            </h1>
            <p className="text-gray-600 mt-2">Manage platform operations and monitor performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalCourses)}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8% this month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.platformRevenue)}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +15% this month
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{pendingCourses.length}</p>
                <p className="text-sm text-orange-600 mt-1">Requires attention</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600" />
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
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Pending Approvals */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Pending Approvals ({pendingCourses.length})
                  </h4>
                  <div className="space-y-3">
                    {pendingCourses.map((course) => (
                      <div key={course.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start space-x-4">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div>
                                <h5 className="font-medium text-gray-900">{course.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">by {course.instructor.name}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {course.category} • {course.level} • {formatCurrency(course.price)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {course.totalLessons} lessons • {course.duration}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => console.log('View course:', course.id)}
                              className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
                              title="View Course"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApproveCourse(course.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectCourse(course.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All Courses */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">All Courses</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockCourses.map((course) => (
                          <tr key={course.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img src={course.thumbnail} alt={course.title} className="w-10 h-10 rounded object-cover mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                  <div className="text-sm text-gray-500">{course.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.instructor.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(course.totalStudents)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(course.revenue || 0)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                course.isApproved && course.isPublished
                                  ? 'bg-green-100 text-green-800' 
                                  : course.rejectionReason
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {course.isApproved && course.isPublished ? 'Live' : 
                                 course.rejectionReason ? 'Rejected' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                              {!course.isApproved && !course.rejectionReason && (
                                <>
                                  <button 
                                    onClick={() => handleApproveCourse(course.id)}
                                    className="text-green-600 hover:text-green-900 mr-3"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleRejectCourse(course.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +15% this month
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Platform Revenue (40%)</h3>
                    <p className="text-3xl font-bold text-blue-900">{formatCurrency(stats.platformRevenue)}</p>
                    <p className="text-sm text-blue-600 mt-1">Our share</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-800 mb-2">Instructor Payouts (60%)</h3>
                    <p className="text-3xl font-bold text-purple-900">{formatCurrency(stats.instructorPayouts)}</p>
                    <p className="text-sm text-purple-600 mt-1">Paid to instructors</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Pending Payouts</h3>
                    <p className="text-3xl font-bold text-orange-900">{formatCurrency(pendingPayouts.reduce((sum, p) => sum + p.amount, 0))}</p>
                    <p className="text-sm text-orange-600 mt-1">{pendingPayouts.length} pending</p>
                  </div>
                </div>

                {/* Revenue Split Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-3">Revenue Split Model (60/40)</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">How it works:</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Instructors earn 60% of each course sale</li>
                        <li>• Platform takes 40% for hosting, payment processing, and services</li>
                        <li>• Automatic revenue split on each transaction</li>
                        <li>• Weekly payouts to instructors</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-blue-800 mb-2">Example Transaction:</h5>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div className="flex justify-between">
                          <span>Course Sale:</span>
                          <span>$100.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Platform Fee (40%):</span>
                          <span>$40.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Instructor Earnings (60%):</span>
                          <span>$60.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Payouts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Pending Payouts ({pendingPayouts.length})</h4>
                    <button
                      onClick={processPayouts}
                      disabled={pendingPayouts.length === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Process All Payouts
                    </button>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pendingPayouts.map((payout) => (
                          <tr key={payout.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Instructor #{payout.instructorId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(payout.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              <div className="flex items-center">
                                {payout.paymentMethod === 'stripe' && <CreditCard className="h-4 w-4 mr-2 text-blue-500" />}
                                {payout.paymentMethod === 'bank' && <Bank className="h-4 w-4 mr-2 text-green-500" />}
                                {payout.paymentMethod}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(payout.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                              <button className="text-red-600 hover:text-red-900">Reject</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Recent Transactions</h4>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Fee</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor Share</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentPayments.map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {payment.transactionId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              User #{payment.userId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Course #{payment.courseId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              {formatCurrency(payment.platformFee)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                              {formatCurrency(payment.instructorEarnings)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Keep other existing tabs... */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Revenue Chart */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="h-64 flex items-end space-x-2">
                      {stats.monthlyRevenue.map((revenue, index) => (
                        <div
                          key={index}
                          className="bg-blue-500 rounded-t flex-1 min-h-[20px] hover:bg-blue-600 transition-colors"
                          style={{ height: `${(revenue / Math.max(...stats.monthlyRevenue)) * 100}%` }}
                          title={formatCurrency(revenue)}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Jan</span>
                      <span>Dec</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Top Categories */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
                    <div className="space-y-3">
                      {stats.topCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{category.category}</h4>
                            <p className="text-sm text-gray-600">{category.courseCount} courses • {formatNumber(category.students)} students</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(category.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Instructors */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Instructors</h3>
                    <div className="space-y-3">
                      {stats.topInstructors.map((instructor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{instructor.instructorName}</h4>
                            <p className="text-sm text-gray-600">{instructor.courseCount} courses • {formatNumber(instructor.totalStudents)} students</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(instructor.totalRevenue)}</p>
                            <p className="text-sm text-yellow-600">★ {instructor.rating}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Keep other existing tabs... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;