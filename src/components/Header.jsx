import React, { useState } from 'react';
import { bodyPartsData } from '../data/bodyParts';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ onSearchSelect }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const filtered = bodyPartsData.filter(p => 
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full h-16 bg-panel-bg border-b border-panel-border flex items-center justify-between px-6 z-50 relative shadow-sm transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-text-inverse font-bold">S</div>
        <div>
           <h1 className="text-xl font-bold tracking-tight text-text-main leading-none">SNU<span className="text-brand">KDT</span></h1>
           <p className="text-[10px] text-text-muted font-medium tracking-wider uppercase">Cancer Visualization</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button 
          onClick={() => navigate('/')} 
          className={`${isActive('/') ? 'text-brand' : 'text-text-muted hover:text-text-main'} transition-colors`}
        >
          Explore
        </button>
        <button 
          onClick={() => navigate('/charts')} 
          className={`${isActive('/charts') ? 'text-brand' : 'text-text-muted hover:text-text-main'} transition-colors`}
        >
          Charts
        </button>
      </nav>

      <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative group w-64 md:w-80">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search organ (e.g. Heart)..." 
                  className="w-full bg-input-bg border-none rounded-full pl-10 pr-4 py-2 text-sm text-text-main focus:ring-2 focus:ring-brand focus:bg-panel-bg transition-colors placeholder:text-text-muted"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click
                />
            </div>
            
            {/* Dropdown Results */}
            {(isFocused || query) && query && (
                <div className="absolute top-full mt-2 left-0 w-full bg-panel-bg border border-panel-border rounded-xl overflow-hidden max-h-80 overflow-y-auto shadow-xl ring-1 ring-black/5 z-50">
                    {filtered.length > 0 ? (
                        <>
                            <div className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-hover">Results</div>
                            {filtered.map(part => (
                            <button 
                                key={part.id}
                                className="w-full text-left px-4 py-3 hover:bg-surface-hover text-text-main hover:text-brand text-sm transition border-b border-panel-border last:border-0 flex justify-between items-center group"
                                onClick={() => {
                                    onSearchSelect(part.id); 
                                    setQuery('');
                                    setIsFocused(false);
                                    navigate('/'); // Ensure we are on home
                                }}
                            >
                                <span className="font-medium">{part.label}</span>
                                <span className="text-xs text-text-muted group-hover:text-brand capitalize">{part.type}</span>
                            </button>
                            ))}
                        </>
                    ) : (
                        <div className="px-4 py-6 text-center text-text-muted text-sm">
                            No matches found for "{query}"
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* Settings Button */}
          <button 
            onClick={() => navigate('/settings')}
            className="text-text-muted hover:text-text-main transition p-2 rounded-full hover:bg-surface-hover"
            title="Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
      </div>
    </header>
  );
}
