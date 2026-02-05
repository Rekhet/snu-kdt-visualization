import React from 'react';

export default function Charts() {
  return (
    <div className="flex-1 w-full bg-app-bg p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-text-main sm:truncate sm:text-3xl sm:tracking-tight">
              Advanced Cancer Analytics
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Deep-dive interactive dashboards powered by Streamlit.
            </p>
          </div>
        </div>

        {/* Streamlit App 1 */}
        <div className="bg-panel-bg border border-panel-border rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-panel-border bg-brand/5 flex items-center justify-between">
                <h3 className="font-bold text-text-main">Cancer Analysis Dashboard v1</h3>
                <a 
                    href="https://kdt-cancer-analysis-app-v1.streamlit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-brand hover:underline flex items-center gap-1"
                >
                    Open in new tab
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </div>
            <iframe
                title="Cancer Analysis App v1"
                src="https://kdt-cancer-analysis-app-v1.streamlit.app/?embed=true"
                className="w-full h-[800px] border-none"
                allow="autoplay; fullscreen"
            ></iframe>
        </div>

        {/* Streamlit App 2 */}
        <div className="bg-panel-bg border border-panel-border rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-panel-border bg-brand/5 flex items-center justify-between">
                <h3 className="font-bold text-text-main">Cancer Prediction & Visualization</h3>
                <a 
                    href="https://e9hpnkw5kznaqhccxradca.streamlit.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-brand hover:underline flex items-center gap-1"
                >
                    Open in new tab
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </div>
            <iframe
                title="Cancer Analysis App v2"
                src="https://e9hpnkw5kznaqhccxradca.streamlit.app/?embed=true"
                className="w-full h-[800px] border-none"
                allow="autoplay; fullscreen"
            ></iframe>
        </div>

      </div>
    </div>
  );
}