import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Settings({ showWireframe, setShowWireframe }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-6">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Settings</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Manage your visualization preferences and application settings.</p>
            </div>
            <button 
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
            
            {/* Visual Preferences */}
            <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Visual Preferences</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Customize how the 3D model is rendered.</p>
                </div>
                <div className="px-4 py-5 sm:p-6 space-y-6">
                    
                    {/* Theme Selector */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Interface Theme</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Select your preferred appearance.</span>
                        </div>
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                            {['light', 'dark', 'system'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                        theme === t 
                                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* Toggle: Wireframe */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 dark:text-white" id="wireframe-label">Show Interaction Mesh</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Display the red wireframe indicating clickable areas on the model.</span>
                        </div>
                        <button 
                            type="button" 
                            className={`${showWireframe ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`} 
                            role="switch" 
                            aria-checked={showWireframe}
                            onClick={() => setShowWireframe(!showWireframe)}
                        >
                            <span aria-hidden="true" className={`${showWireframe ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                        </button>
                    </div>

                </div>
            </div>

            {/* Application Info */}
            <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">About</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-2">
                        <p><strong>Version:</strong> 0.1.0 Beta</p>
                        <p><strong>Engine:</strong> React Three Fiber (Three.js)</p>
                        <p className="mt-4">
                            This application visualizes human anatomy with a focus on disease localization. 
                            Models are simplified representations.
                        </p>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
