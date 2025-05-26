import React from 'react';

export default function Logo() {
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer C */}
        <path
          d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50c13.8 0 25-11.2 25-25V65c0-8.3-6.7-15-15-15H50c-8.3 0-15-6.7-15-15s6.7-15 15-15h10c8.3 0 15-6.7 15-15V25C75 11.2 63.8 0 50 0z"
          fill="black"
        />
        {/* Inner C cutout */}
        <path
          d="M50 20c-16.6 0-30 13.4-30 30s13.4 30 30 30c5.5 0 10-4.5 10-10v-5c0-2.8-2.2-5-5-5H50c-5.5 0-10-4.5-10-10s4.5-10 10-10h5c2.8 0 5-2.2 5-5v-5c0-5.5-4.5-10-10-10z"
          fill="white"
        />
      </svg>
    </div>
  );
} 