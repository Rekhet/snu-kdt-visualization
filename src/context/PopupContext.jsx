import React, { createContext, useContext, useState, useCallback } from 'react';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popupState, setPopupState] = useState({
    isOpen: false,
    content: null,
    position: { x: 0, y: 0 },
    anchor: 'center', // 'center', 'top-left', etc.
    overlay: true, // Whether to show a dimming overlay
  });

  const showPopup = useCallback((content, options = {}) => {
    const { 
        x = window.innerWidth / 2, 
        y = window.innerHeight / 2, 
        anchor = 'center',
        overlay = true 
    } = options;

    setPopupState({
      isOpen: true,
      content,
      position: { x, y },
      anchor,
      overlay
    });
  }, []);

  const hidePopup = useCallback(() => {
    setPopupState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <PopupContext.Provider value={{ popupState, showPopup, hidePopup }}>
      {children}
    </PopupContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePopup = () => useContext(PopupContext);
