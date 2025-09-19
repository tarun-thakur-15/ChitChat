"use client";

import React from "react";

interface ProfileProgressProps {
  hasPhoto: boolean;
  hasAbout: boolean;
}

const ProfileProgress: React.FC<ProfileProgressProps> = ({ hasPhoto, hasAbout }) => {
  let progress = 0;
  if (hasPhoto && hasAbout) {
    progress = 100;
  } else if (hasPhoto || hasAbout) {
    progress = 50;
  }

  const radius = 100;
  const stroke = 13;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg
        height={radius * 2}
        width={radius * 2}
      >
        {/* Background Circle */}
        <circle
          stroke="#e5e7eb" // gray-200
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress Circle */}
        <circle
          stroke="url(#gradient)" // gradient stroke
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-700 ease-in-out"
        />
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
            <stop offset="100%" stopColor="#8b5cf6" /> {/* purple-500 */}
          </linearGradient>
        </defs>
        {/* Label */}
        <text
          x="50%"
          y="50%"
          dy=".3em" 
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-gray-800 dark:fill-gray-100 font-semibold text-sm md:text-xl"
        >
          {progress}%
        </text>
      </svg>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
       Add a face to your profile
      </p>
    </div>
  );
};

export default ProfileProgress;
