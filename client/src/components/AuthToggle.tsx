import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Log In', path: '/login' },
  { label: 'Sign Up', path: '/signup' },
];

export default function AuthToggle() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const activeTabPath = location.pathname;
  
  const tabsRef = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeTab = tabs.find(tab => activeTabPath.startsWith(tab.path));

    const activeElement = activeTab ? tabsRef.current.get(activeTab.path) : null;
    
    if (activeElement) {
      setUnderlineStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
      });
    }
  }, [activeTabPath]);
  
  return (
    <div className="relative flex rounded-3xl bg-pink-100 p-1 mx-auto w-full max-w-full mb-6">
      
      <span
        className="absolute top-0 bottom-0 block h-full rounded-3xl bg-bloomPink transition-all duration-300 ease-in-out"
        style={underlineStyle}
      />
      
      {/* Tab buttons */}
      {tabs.map((tab) => {
        const isActive = activeTabPath.startsWith(tab.path);
        
        return (
          <button
            key={tab.path}
            ref={el => void tabsRef.current.set(tab.path, el)}
            onClick={() => navigate(tab.path)}
            className={`
              z-10 flex-1 py-2 px-4 text-sm font-semibold 
              transition-colors duration-300 ease-in-out
              ${isActive ? 'text-bloomWhite' : 'text-bloomPink hover:text-pink-500'}
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}