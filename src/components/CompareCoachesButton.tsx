'use client';

import React from 'react';
import { FaBalanceScale } from 'react-icons/fa';

interface CompareCoachesButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export default function CompareCoachesButton({ isVisible, onClick }: CompareCoachesButtonProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <button
        onClick={onClick}
        className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold text-lg"
      >
        <FaBalanceScale size={20} />
        <span>Compare Coaches</span>
      </button>
    </div>
  );
} 