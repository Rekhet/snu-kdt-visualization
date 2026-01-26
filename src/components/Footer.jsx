import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full h-10 bg-white border-t border-gray-200 flex items-center justify-between px-6 z-50 text-xs text-gray-500 relative">
      <div>
        &copy; {new Date().getFullYear()} MEDVIZ Project. All rights reserved.
      </div>
      <div className="flex items-center gap-4">
         <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            System Operational
         </span>
         <a href="#" className="hover:text-gray-900">Privacy Policy</a>
         <a href="#" className="hover:text-gray-900">Terms of Service</a>
      </div>
    </footer>
  );
}
