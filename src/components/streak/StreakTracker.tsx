import React from 'react';
import { Flame, Target, Trophy, Star, Calendar, TrendingUp } from 'lucide-react';
import { Streak, Achievement } from '../../types';

interface StreakTrackerProps {
  streak: Streak;
  onClaimReward?: (achievementId: string) => void;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ streak, onClaimReward }) => {
  const getStreakColor = (days: number) => {
    if (days >= 30) return 'text-purple-600 bg-purple-100';
    if (days >= 14) return 'text-orange-600 bg-orange-100';
    if (days >= 7) return 'text-red-600 bg-red-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getStreakEmoji = (days: number) => {
    if (days >= 30) return '🔥';
    if (days >= 14) return '⚡';
    if (days >= 7) return '🌟';
    return '💫';
  };

  const getLevelProgress = () => {
    const pointsForNextLevel = (streak.level + 1) * 500;
    const pointsInCurrentLevel = streak.totalPoints - (streak.level * 500);
    return (pointsInCurrentLevel / 500) * 100;
  };

  const getAchievementIcon = (icon: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '🎯': <Target className="h-6 w-6" />,
      '🔥': <Flame className="h-6 w-6" />,
      '🏆': <Trophy className="h-6 w-6" />,
      '⭐': <Star className="h-6 w-6" />,
      '📅': <Calendar className="h-6 w-6" />,
      '📈': <TrendingUp className="h-6 w-6" />
    };
    return iconMap[icon] || <Star className="h-6 w-6" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Learning Streak</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStreakColor(streak.currentStreak)}`}>
          <span className="text-2xl">{getStreakEmoji(streak.currentStreak)}</span>
          <span className="font-bold">{streak.currentStreak} days</span>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{streak.currentStreak}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{streak.longestStreak}</div>
          <div className="text-sm text-gray-600">Longest Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{streak.totalPoints.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{streak.level}</div>
          <div className="text-sm text-gray-600">Level</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Level {streak.level}</span>
          <span className="text-sm text-gray-500">
            {streak.totalPoints % 500}/500 XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getLevelProgress()}%` }}
          ></div>
        </div>
      </div>

      {/* Streak Calendar */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">This Week</h4>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const isToday = date.toDateString() === new Date().toDateString();
            const hasActivity = i >= 7 - streak.currentStreak; // Simplified logic
            
            return (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                  hasActivity
                    ? 'bg-green-500 text-white'
                    : isToday
                    ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Achievements</h4>
        <div className="space-y-3">
          {streak.achievements.slice(0, 3).map((achievement) => (
            <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="text-yellow-500">
                {getAchievementIcon(achievement.icon)}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{achievement.title}</h5>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-600">+{achievement.points} XP</div>
                <div className="text-xs text-gray-500">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h5 className="font-medium text-blue-800 mb-2">💡 Streak Tips</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Complete at least one lesson daily to maintain your streak</li>
          <li>• Set a daily learning reminder to stay consistent</li>
          <li>• Even 10 minutes of learning counts towards your streak</li>
          <li>• Longer streaks unlock special achievements and rewards</li>
        </ul>
      </div>
    </div>
  );
};

export default StreakTracker;