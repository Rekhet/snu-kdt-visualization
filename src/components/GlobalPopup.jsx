import React, { useRef, useEffect } from 'react';
import { usePopup } from '../context/PopupContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalPopup() {
  const { popupState, hidePopup } = usePopup();
  const { isOpen, content, position, anchor, overlay } = popupState;
  const containerRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        hidePopup();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, hidePopup]);

  // Calculate CSS position style based on anchor
  const getStyle = () => {
    const style = { top: position.y, left: position.x };
    
    if (anchor === 'center') {
      style.transform = 'translate(-50%, -50%)';
    } else if (anchor === 'top-left') {
      // default
    } else if (anchor === 'bottom-right') {
      style.transform = 'translate(-100%, -100%)';
    }
    
    return style;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay (Optional) */}
          {overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100]"
              onClick={hidePopup}
            />
          )}

          {/* Popup Container */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95, ...getStyle() }}
            animate={{ opacity: 1, scale: 1, ...getStyle() }}
            exit={{ opacity: 0, scale: 0.95, ...getStyle() }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{ position: 'fixed', ...getStyle() }}
            className="z-[101] bg-panel-bg border border-panel-border shadow-2xl rounded-xl overflow-hidden min-w-[300px] max-w-[90vw] max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button 
                onClick={hidePopup}
                className="absolute top-3 right-3 p-1 rounded-full text-text-muted hover:bg-surface-hover hover:text-text-main transition z-10"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Content Injection */}
            <div className="p-0">
                {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
