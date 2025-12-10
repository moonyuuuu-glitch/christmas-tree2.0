import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';

function App() {
  const [isExploding, setIsExploding] = useState(false);

  // Trigger explosion animation
  const handleExplode = () => {
    setIsExploding(false);
    // Small timeout to ensure reset if triggered rapidly
    requestAnimationFrame(() => setIsExploding(true));
  };

  // Reset explosion when starting new interaction (optional, passed to overlay)
  const handleReset = () => {
    setIsExploding(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene Layer */}
      <Scene isExploding={isExploding} />
      
      {/* UI Overlay Layer */}
      <Overlay onExplode={handleExplode} onReset={handleReset} />
      
      {/* Decorative Border Vignette (CSS Overlay) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-20"></div>
    </div>
  );
}

export default App;