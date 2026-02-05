import React from 'react';
import { useNavigate } from 'react-router-dom';

const LabsIndex = () => {
  const navigate = useNavigate();

  const themes = [
    {
      id: 'modern',
      title: 'Modern Clinical',
      path: '/labs/modern',
      desc: 'Highly professional, clean teal and amber palette.',
      colors: ['bg-[#2dd4bf]', 'bg-[#f59e0b]']
    },
    {
      id: 'biotech',
      title: 'Bio-Tech Lab',
      path: '/labs/biotech',
      desc: 'Futuristic high-tech aesthetic with slate and electric lime.',
      colors: ['bg-[#6366f1]', 'bg-[#84cc16]']
    },
    {
      id: 'deep',
      title: 'Deep Analytics',
      path: '/labs/deep',
      desc: 'Elegant and sophisticated porcelain and deep plum palette.',
      colors: ['bg-[#e2e8f0]', 'bg-[#701a75]']
    }
  ];

  return (
    <div className="flex-1 w-full bg-app-bg p-8 transition-colors duration-200 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-b border-panel-border pb-8">
          <h1 className="text-4xl font-bold text-text-main mb-2">Design Labs</h1>
          <p className="text-text-muted">Exploring advanced color palettes for the storytelling sequence.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <div 
              key={theme.id}
              className="bg-panel-bg border border-panel-border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group flex flex-col"
            >
              <div className="h-40 bg-surface-hover flex items-center justify-center gap-4 relative overflow-hidden">
                 <div className={`w-12 h-12 rounded-full ${theme.colors[0]} shadow-lg transition-transform group-hover:scale-110`}></div>
                 <div className={`w-12 h-12 rounded-full ${theme.colors[1]} shadow-lg transition-transform group-hover:scale-110 group-hover:-translate-y-2`}></div>
                 
                 {/* Visual Pattern */}
                 <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-text-main mb-2">{theme.title}</h2>
                <p className="text-sm text-text-muted mb-6 flex-1">{theme.desc}</p>
                <button 
                  onClick={() => navigate(theme.path)}
                  className="w-full py-3 bg-brand hover:bg-brand-dark text-text-inverse rounded-xl font-bold transition-colors"
                >
                  View Sample
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 text-center text-xs text-text-muted italic">
            Select a palette to see it applied to a sample "Front-Matter" (Intro) section.
        </footer>
      </div>
    </div>
  );
};

export default LabsIndex;
