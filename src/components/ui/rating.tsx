import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: number;
}

const Rating: React.FC<RatingProps> = ({ value, maxValue = 5, size = 20 }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;

  const stars = Array.from({ length: maxValue }, (_, index) => (
    <div key={index} className="flex">
      {index < fullStars && (
        <Star size={size} className="text-yellow-400" />
      )}
      {index === fullStars && hasHalfStar && (
        <Star size={size} className="text-yellow-400 mr-0.5 fill-current" />
      )}
      {index > fullStars && (
        <Star size={size} className="text-gray-400" />
      )}
    </div>
  ));

  return <div className="flex items-center">{stars}</div>;
};

export { Rating };