import React, { useState } from 'react';
import { Trash2, ShoppingCart, CreditCard, Tag, Clock, Users, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import PaymentModal from '../components/payment/PaymentModal';

const Cart: React.FC = () => {
  const { user } = useAuth();
  const { cart, removeFromCart, clearCart, enrollInCourse, processPayment } = useCourse();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const subtotal = cart.reduce((total, item) => total + item.course.price, 0);
  const discount = cart.reduce((total, item) => {
    if (item.course.originalPrice) {
      return total + (item.course.originalPrice - item.course.price);
    }
    return total;
  }, 0);
  const total = subtotal;

  const handleRemoveFromCart = (courseId: string) => {
    removeFromCart(courseId);
  };

  const handleSingleCourseCheckout = (course: any) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const handleBulkCheckout = () => {
    if (!user) {
      alert('Please log in to complete your purchase');
      return;
    }

    // Process each course individually
    cart.forEach(item => {
      const payment = processPayment(item.courseId, user.id, item.course.price, 'card');
      enrollInCourse(item.courseId, user.id, payment);
    });
    
    alert('Purchase successful! You are now enrolled in all courses.');
    clearCart();
  };

  const handlePaymentSuccess = (paymentId: string) => {
    if (!user || !selectedCourse) return;
    
    // Create a payment object for the single course checkout
    const payment = processPayment(selectedCourse.id, user.id, selectedCourse.price, 'card');
    enrollInCourse(selectedCourse.id, user.id, payment);
    alert('Purchase successful! You are now enrolled in the course.');
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any courses to your cart yet. 
              Browse our course catalog to find something you'd like to learn!
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {cart.length} Course{cart.length !== 1 ? 's' : ''} in Cart
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.courseId} className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {item.course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          by {item.course.instructor.name}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{item.course.totalStudents.toLocaleString()} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{item.course.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {item.course.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            ${item.course.price.toFixed(2)}
                          </div>
                          {item.course.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ${item.course.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSingleCourseCheckout(item.course)}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(item.courseId)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Revenue Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee (40%):</span>
                    <span className="font-medium">${(total * 0.4).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Instructor Earnings (60%):</span>
                    <span className="font-medium">${(total * 0.6).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {discount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      You're saving ${discount.toFixed(2)}!
                    </span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleBulkCheckout}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Checkout All</span>
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  30-Day Money-Back Guarantee
                </p>
              </div>
              
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mobile and TV access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedCourse && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Cart;