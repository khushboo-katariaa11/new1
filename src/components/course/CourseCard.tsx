import React from 'react';
import { Clock, Users, Star, ShoppingCart, CheckCircle } from 'lucide-react';
import { Course } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';

interface CourseCardProps {
  course: Course;
  onCourseClick: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onCourseClick }) => {
  const { user } = useAuth();
  const { addToCart, cart, isEnrolled } = useCourse();
  
  const isInCart = cart.some(item => item.courseId === course.id);
  const isUserEnrolled = user ? isEnrolled(course.id, user.id) : false;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInCart && !isUserEnrolled) {
      addToCart(course);
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const discountPercentage = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100"
      onClick={() => onCourseClick(course.id)}
    >
      {/* Course Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            {discountPercentage}% OFF
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
          {course.level}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        {/* Category */}
        <div className="text-sm text-blue-600 font-medium mb-2">
          {course.category}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        {/* Short Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.shortDescription}
        </p>

        {/* Instructor */}
        <div className="flex items-center mb-3">
          {course.instructor.avatar && (
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-6 h-6 rounded-full mr-2 object-cover"
            />
          )}
          <span className="text-sm text-gray-700 font-medium">
            {course.instructor.name}
          </span>
        </div>

        {/* Rating and Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-gray-900">{course.rating}</span>
            <span>({course.totalRatings.toLocaleString()})</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.totalStudents.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              ${formatPrice(course.price)}
            </span>
            {course.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${formatPrice(course.originalPrice)}
              </span>
            )}
          </div>

          {isUserEnrolled ? (
            <div className="flex items-center text-green-600 font-medium">
              <CheckCircle className="h-5 w-5 mr-1" />
              Enrolled
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all ${
                isInCart
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
              +{course.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;