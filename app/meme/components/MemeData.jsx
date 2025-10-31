'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const MemeData = ({ code, title, startDate, endDate, category, darkMode }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/meme/detail/${code}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      <div
        className={`shadow-md rounded-lg p-4 flex flex-col items-center text-center
    hover:scale-105 transition-transform duration-200
    ${
      darkMode
        ? 'bg-gray-800 text-white border border-gray-500'
        : 'bg-white text-black border border-gray-500'
    }`}
      >
        <div className="relative w-40 h-40 mb-2">
          <img
            src="/assets/유골함2.png"
            alt={title}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="font-GowunBatangBold my-1">{title}</div>
        <div className="font-GowunBatang text-sm">
          {startDate} ~ {endDate}
        </div>
        <img
          src={`/assets/badge/${category}.svg`}
          alt="카테고리"
          className="mt-2 w-26 h-6"
        />
      </div>
    </div>
  );
};

export default MemeData;
