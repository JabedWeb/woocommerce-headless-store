import React from 'react'

const SkeletonLoader = () => {
    return (
      <div className=" container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md animate-pulse">
            <div className="flex items-center mb-2">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="ml-4">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  };

export default SkeletonLoader