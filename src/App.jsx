import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import OrganDetail from "./pages/OrganDetail";
import Charts from "./pages/Charts";
import LabsIndex from "./pages/labs/LabsIndex";
import ModernClinical from "./pages/labs/ModernClinical";
import BioTechLab from "./pages/labs/BioTechLab";
import DeepAnalytics from "./pages/labs/DeepAnalytics";
import { PopupProvider } from "./context/PopupContext";
import GlobalPopup from "./components/GlobalPopup";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Initialize from localStorage (default to true if not found)
  const [showWireframe, setShowWireframe] = useState(() => {
    const saved = localStorage.getItem("showWireframe");
    return saved !== "false"; // 'true' or null (default) returns true
  });

  // Persist to localStorage
  React.useEffect(() => {
    localStorage.setItem("showWireframe", showWireframe);
  }, [showWireframe]);

  // Handler for clicking the model via Search or interaction
  const handlePartSelect = (id) => {
    // Single click selects and resets zoom to normal fit
    if (id !== selectedId) {
      setSelectedId(id);
      setZoomLevel(1);
    }
  };

  // Handler for resetting
  const handleReset = () => {
    setSelectedId(null);
    setZoomLevel(1);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <PopupProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen w-full bg-app-bg text-text-main transition-colors duration-200">
          {/* Header */}
          <div className="sticky top-0 z-[100]">
            <Header onSearchSelect={handlePartSelect} />
          </div>

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  selectedId={selectedId}
                  onSelect={handlePartSelect}
                  resetTrigger={resetTrigger}
                  onReset={handleReset}
                  zoomLevel={zoomLevel}
                  setZoomLevel={setZoomLevel}
                  showWireframe={showWireframe}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings
                  showWireframe={showWireframe}
                  setShowWireframe={setShowWireframe}
                />
              }
            />
            <Route path="/organ/:organId" element={<OrganDetail />} />
            <Route path="/charts" element={<Charts />} />

            {/* Design Labs */}
            <Route path="/labs" element={<LabsIndex />} />
            <Route path="/labs/modern" element={<ModernClinical />} />
            <Route path="/labs/biotech" element={<BioTechLab />} />
            <Route path="/labs/deep" element={<DeepAnalytics />} />
          </Routes>

          {/* Footer */}
          <Footer />

          {/* Global Popup Layer */}
          <GlobalPopup />
        </div>
      </Router>
    </PopupProvider>
  );
}
