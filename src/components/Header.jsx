import React, { useState } from 'react';
import { bodyPartsData } from '../data/bodyParts';
import { useNavigate } from 'react-router-dom';

export default function Header({ onSearchSelect }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const filtered = bodyPartsData.filter(p => 
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 relative shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
        <div>
           <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">MED<span className="text-blue-600">VIZ</span></h1>
           <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Human Atlas</p>
        </div>
      </div>

      {/* Navigation (Visual only) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
        <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700">Explore</button>
        <a href="#" className="hover:text-gray-900 transition">Conditions</a>
        <a href="#" className="hover:text-gray-900 transition">About</a>
        <a href="#" className="hover:text-gray-900 transition">Contact</a>
      </nav>

      <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative group w-64 md:w-80">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search organ (e.g. Heart)..." 
                  className="w-full bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click
                />
            </div>
            
            {/* Dropdown Results */}
            {(isFocused || query) && query && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto shadow-xl ring-1 ring-black/5">
                    {filtered.length > 0 ? (
                        <>
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">Results</div>
                            {filtered.map(part => (
                            <button 
                                key={part.id}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-sm transition border-b border-gray-100 last:border-0 flex justify-between items-center group"
                                onClick={() => {
                                    onSearchSelect(part.id); 
                                    setQuery('');
                                    setIsFocused(false);
                                    navigate('/'); // Ensure we are on home
                                }}
                            >
                                <span className="font-medium">{part.label}</span>
                                <span className="text-xs text-gray-400 group-hover:text-blue-500 capitalize">{part.type}</span>
                            </button>
                            ))}
                        </>
                    ) : (
                        <div className="px-4 py-6 text-center text-gray-500 text-sm">
                            No matches found for "{query}"
                        </div>
                    )}
                </div>
            )}
          </div>

          {/* Settings Button */}
          <button 
            onClick={() => navigate('/settings')}
            className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100"
            title="Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
      </div>
    </header>
  );
}
