import React from "react";

export default function Footer() {
  return (
    <footer className="w-full h-10 bg-panel-bg border-t border-panel-border flex items-center justify-between px-6 z-50 text-xs text-text-muted relative transition-colors duration-200">
      <div>
        &copy; {new Date().getFullYear()} SNUKDT Project. All rights reserved.
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          System Operational
        </span>
        <a href="#" className="hover:text-text-main">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-text-main">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
