import React from 'react';
import { useNavigate } from 'react-router-dom';

const LabsIndex = () => {
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = React.useState('default');

  const themes = [
    {
      id: 'modern',
      title: 'Modern Clinical',
      path: '/labs/modern',
      desc: 'Highly professional, clean teal and amber palette.',
      colors: ['bg-[#2dd4bf]', 'bg-[#f59e0b]'],
      vars: { brand: '#2dd4bf', accent: '#f59e0b' }
    },
    {
      id: 'biotech',
      title: 'Bio-Tech Lab',
      path: '/labs/biotech',
      desc: 'Futuristic high-tech aesthetic with slate and electric lime.',
      colors: ['bg-[#6366f1]', 'bg-[#84cc16]'],
      vars: { brand: '#6366f1', accent: '#84cc16' }
    },
    {
      id: 'deep',
      title: 'Deep Analytics',
      path: '/labs/deep',
      desc: 'Elegant and sophisticated porcelain and deep plum palette.',
      colors: ['bg-[#e2e8f0]', 'bg-[#701a75]'],
      vars: { brand: '#701a75', accent: '#e2e8f0' }
    }
  ];

  const handleApply = (themeId) => {
    setActiveTheme(themeId);
    // In a real implementation, this would update ThemeContext or CSS variables globally.
    // For now we simulate the 'Selection' state.
    console.log(`Applied ${themeId} theme`);
  };

  return (
    <div className="flex-1 w-full bg-app-bg p-8 transition-colors duration-200 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-b border-panel-border pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-text-main mb-2">Design Labs</h1>
            <p className="text-text-muted">Exploring advanced color palettes for the storytelling sequence.</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest block mb-1">Active Preview</span>
            <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-xs font-bold border border-brand/20 uppercase">
                {activeTheme === 'default' ? 'Standard Crimson' : activeTheme}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <div 
              key={theme.id}
              className={`bg-panel-bg border rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group flex flex-col ${activeTheme === theme.id ? 'ring-2 ring-brand border-transparent' : 'border-panel-border'}`}
            >
              <div className="h-40 bg-surface-hover flex items-center justify-center gap-4 relative overflow-hidden">
                 <div className={`w-12 h-12 rounded-full ${theme.colors[0]} shadow-lg transition-transform group-hover:scale-110`}></div>
                 <div className={`w-12 h-12 rounded-full ${theme.colors[1]} shadow-lg transition-transform group-hover:scale-110 group-hover:-translate-y-2`}></div>
                 
                 {activeTheme === theme.id && (
                    <div className="absolute top-3 right-3 bg-brand text-text-inverse p-1 rounded-full shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                 )}

                 {/* Visual Pattern */}
                 <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-text-main mb-2">{theme.title}</h2>
                <p className="text-sm text-text-muted mb-6 flex-1">{theme.desc}</p>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate(theme.path)}
                        className="flex-1 py-3 bg-input-bg hover:bg-surface-hover text-text-main rounded-xl font-bold transition-colors text-sm"
                    >
                        Preview
                    </button>
                    <button 
                        onClick={() => handleApply(theme.id)}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all text-sm ${activeTheme === theme.id ? 'bg-brand text-text-inverse' : 'bg-brand/10 text-brand hover:bg-brand hover:text-text-inverse'}`}
                    >
                        {activeTheme === theme.id ? 'Selected' : 'Select'}
                    </button>
                </div>
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
