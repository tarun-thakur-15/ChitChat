"use client";

export default function ChatSkeleton() {
  return (
    <>
      <div
        className={`flex mb-4 justify-start
        animate-pulse`}
      >
        <div
          className={`max-w-[250px] lg:max-w-md w-full space-y-3 order-1
          `}
        >
          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm 
             
                bg-gray-300 dark:bg-gray-600 rounded-br-sm
               
            `}
          >
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-16 bg-gray-400 rounded"></div>
          </div>

          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm 
             
                bg-gray-300 dark:bg-gray-600 rounded-br-sm
               
            `}
          >
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-16 bg-gray-400 rounded"></div>
          </div>
          <div
            className={`flex items-center space-x-1 mt-1 px-2 
              justify-start
            `}
          >
            <span className="h-3 w-8 bg-gray-400 rounded"></span>
          </div>
        </div>
      </div>

      <div
        className={`flex mb-4 justify-end
        animate-pulse`}
      >
        <div
          className={`max-w-xs lg:max-w-md w-full space-y-3 order-2
          `}
        >
          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm 
                
                bg-gray-200 dark:bg-gray-500 rounded-bl-sm
            `}
          >
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-16 bg-gray-400 rounded"></div>
          </div>

          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm 
              
            bg-gray-200 dark:bg-gray-500 rounded-bl-sm
            `}
          >
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-16 bg-gray-400 rounded"></div>
          </div>
          <div
            className={`flex items-center space-x-1 mt-1 px-2 justify-end
            `}
          >
            <span className="h-3 w-8 bg-gray-400 rounded"></span>
          </div>
        </div>
      </div>

      <div
        className={`flex mb-4 justify-start
        animate-pulse`}
      >
        <div
          className={`max-w-xs lg:max-w-md w-full space-y-3 order-1
          `}
        >
          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm 
             
                bg-gray-300 dark:bg-gray-600 rounded-br-sm
               
            `}
          >
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-16 bg-gray-400 rounded"></div>
          </div>

          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm 
             
                bg-gray-300 dark:bg-gray-600 rounded-br-sm
               
            `}
          >
            <div className="h-4 w-24 bg-gray-400 rounded mb-2"></div>
            <div className="h-4 w-16 bg-gray-400 rounded"></div>
          </div>
          <div
            className={`flex items-center space-x-1 mt-1 px-2 
              justify-start
            `}
          >
            <span className="h-3 w-8 bg-gray-400 rounded"></span>
          </div>
        </div>
      </div>
    </>
  );
}
