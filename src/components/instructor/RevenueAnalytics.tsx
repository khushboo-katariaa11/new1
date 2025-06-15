import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, BarChart3, PieChart } from 'lucide-react';
import { InstructorStats, Payment, Course } from '../../types';

interface RevenueAnalyticsProps {
  stats: InstructorStats;
  payments: Payment[];
  courses: Course[];
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ stats, payments, courses }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getRevenueByTimeRange = () => {
    const now = new Date();
    const ranges = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };
    
    const days = ranges[timeRange as keyof typeof ranges];
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return payments.filter(payment => 
      new Date(payment.createdAt) >= startDate
    ).reduce((total, payment) => total + payment.instructorEarnings, 0);
  };

  const getTopPerformingCourses = () => {
    return courses
      .map(course => ({
        ...course,
        revenue: payments
          .filter(p => p.courseId === course.id)
          .reduce((total, p) => total + p.instructorEarnings, 0),
        enrollments: payments.filter(p => p.courseId === course.id).length
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getMonthlyTrends = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate.getMonth() === date.getMonth() && 
               paymentDate.getFullYear() === date.getFullYear();
      });
      
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthPayments.reduce((total, p) => total + p.instructorEarnings, 0),
        enrollments: monthPayments.length
      });
    }
    
    return months;
  };

  const monthlyData = getMonthlyTrends();
  const topCourses = getTopPerformingCourses();
  const currentRevenue = getRevenueByTimeRange();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">+15% from last period</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Period</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentRevenue)}</p>
              <p className="text-sm text-blue-600 mt-1">{timeRange.replace('d', ' days').replace('y', ' year')}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg per Course</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalRevenue / stats.totalCourses)}
              </p>
              <p className="text-sm text-purple-600 mt-1">Per course revenue</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">+23%</p>
              <p className="text-sm text-green-600 mt-1">Month over month</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-medium text-gray-900">Revenue Trends</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedMetric('revenue')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedMetric === 'revenue'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setSelectedMetric('enrollments')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedMetric === 'enrollments'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Enrollments
            </button>
          </div>
        </div>
        
        <div className="h-64 flex items-end space-x-2">
          {monthlyData.map((month, index) => {
            const value = selectedMetric === 'revenue' ? month.revenue : month.enrollments;
            const maxValue = Math.max(...monthlyData.map(m => 
              selectedMetric === 'revenue' ? m.revenue : m.enrollments
            ));
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-blue-500 rounded-t w-full min-h-[4px] hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={selectedMetric === 'revenue' ? formatCurrency(value) : `${value} enrollments`}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{month.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Performing Courses */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Top Performing Courses</h4>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 text-sm">{course.title}</h5>
                    <p className="text-xs text-gray-500">{course.enrollments} enrollments</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{formatCurrency(course.revenue)}</div>
                  <div className="text-xs text-gray-500">
                    {((course.revenue / stats.totalRevenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Course Sales</p>
                <p className="text-sm text-green-600">Direct course purchases</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-900">{formatCurrency(stats.totalRevenue * 0.85)}</div>
                <div className="text-sm text-green-600">85%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Subscription Revenue</p>
                <p className="text-sm text-blue-600">Monthly subscriptions</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-900">{formatCurrency(stats.totalRevenue * 0.10)}</div>
                <div className="text-sm text-blue-600">10%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-purple-800">Other Revenue</p>
                <p className="text-sm text-purple-600">Coaching, consulting</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-purple-900">{formatCurrency(stats.totalRevenue * 0.05)}</div>
                <div className="text-sm text-purple-600">5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Recent Transactions</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Share</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.slice(0, 10).map((payment) => {
                const course = courses.find(c => c.id === payment.courseId);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course?.title || 'Unknown Course'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Student #{payment.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(payment.instructorEarnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;