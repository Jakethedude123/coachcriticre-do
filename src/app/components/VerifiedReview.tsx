'use client';

import { FaStar, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';

interface VerifiedReviewProps {
  reviewerName: string;
  reviewerImage?: string;
  rating: number;
  date: string;
  content: string;
  verificationBadge?: {
    type: 'paid' | 'verified' | 'longTerm';
    text: string;
  };
}

export default function VerifiedReview({
  reviewerName,
  reviewerImage,
  rating,
  date,
  content,
  verificationBadge
}: VerifiedReviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {reviewerImage ? (
            <Image
              src={reviewerImage}
              alt={reviewerName}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <FaUserCircle className="h-12 w-12 text-gray-400" />
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h4 className="font-semibold text-gray-900">{reviewerName}</h4>
              {verificationBadge && (
                <div className="ml-2 flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                  <FaCheckCircle className="h-3 w-3 mr-1" />
                  <span>{verificationBadge.text}</span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
          
          <div className="flex items-center mt-1 mb-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`w-4 h-4 ${
                  index < rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">Verified Purchase</span>
          </div>
          
          <p className="text-gray-700">{content}</p>
        </div>
      </div>
    </div>
  );
} 