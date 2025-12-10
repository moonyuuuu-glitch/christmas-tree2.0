import React, { useState } from 'react';
import { generateLuxuryGreeting } from '../services/gemini';
import { GreetingState } from '../types';
import { Sparkles, Loader2, Send, Moon as MoonIcon } from 'lucide-react';

interface OverlayProps {
  onExplode: () => void;
  onReset: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ onExplode, onReset }) => {
  const [inputName, setInputName] = useState('');
  const [greetingState, setGreetingState] = useState<GreetingState>({
    recipient: '',
    message: '',
    isLoading: false,
    error: null,
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    onReset(); // Reset tree to normal state before thinking
    setGreetingState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const message = await generateLuxuryGreeting(inputName);
      setGreetingState({
        recipient: inputName,
        message,
        isLoading: false,
        error: null,
      });
      setInputName('');
      
      // Trigger the Christmas Firework Effect
      onExplode();
      
    } catch (err) {
      setGreetingState(prev => ({
        ...prev,
        isLoading: false,
        error: "Our concierge is currently busy. Please try again.",
      }));
    }
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12">
      
      {/* Header */}
      <header className="pointer-events-auto flex flex-col items-start animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-[1px] bg-arix-gold"></div>
          <h2 className="text-arix-gold font-display tracking-[0.2em] text-sm uppercase">Season 2025</h2>
        </div>
        <h1 className="text-4xl md:text-6xl text-white font-serif font-bold tracking-tight leading-tight">
          Merry <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-arix-gold via-white to-arix-gold">
            Christmas
          </span>
        </h1>
      </header>

      {/* Main Interaction Area */}
      <main className="flex-1 flex flex-col justify-center items-center md:items-end md:pr-10">
        
        {/* Display Greeting Card */}
        {greetingState.message && (
          <div className="pointer-events-auto max-w-md bg-black/60 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.15)] mb-8 transform transition-all duration-700 animate-slide-up text-center md:text-left relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="flex justify-center md:justify-between items-center mb-6">
               <Sparkles className="text-arix-gold w-6 h-6 animate-pulse" />
               <span className="text-xs font-display tracking-widest text-white/50">CHRISTMAS 2025</span>
            </div>
            
            <h3 className="text-white font-display text-lg mb-2 tracking-widest uppercase">
              Dear {greetingState.recipient},
            </h3>
            
            <p className="text-pink-100/90 font-serif text-xl md:text-2xl leading-relaxed italic mb-8">
              "{greetingState.message}"
            </p>
            
            <div className="flex flex-col items-center md:items-end border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-arix-gold mb-1">
                  <span className="font-serif italic text-lg">Moon</span>
                  <MoonIcon className="w-4 h-4" />
                </div>
                <span className="text-white/40 text-[10px] font-display tracking-[0.2em] uppercase">Curator • 2025</span>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="pointer-events-auto w-full max-w-sm">
           <form onSubmit={handleGenerate} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-arix-gold to-emerald-600 opacity-50 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200 rounded-lg"></div>
            <div className="relative bg-black/90 flex items-center p-1 rounded-lg">
              <input 
                type="text" 
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter Your Name..."
                className="bg-transparent text-white placeholder-white/30 px-4 py-3 w-full font-serif focus:outline-none focus:ring-0 text-lg rounded-l-lg"
                disabled={greetingState.isLoading}
              />
              <button 
                type="submit"
                disabled={greetingState.isLoading || !inputName.trim()}
                className="bg-white/10 hover:bg-white/20 text-arix-gold p-3 transition-colors duration-300 rounded-r-lg"
              >
                {greetingState.isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            {greetingState.error && <p className="absolute text-red-400 text-xs mt-2 font-display tracking-wider">{greetingState.error}</p>}
           </form>
           <p className="mt-3 text-white/30 text-xs text-center font-display tracking-[0.1em] uppercase">
             Powered by Gemini AI • Moon 2025
           </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="flex justify-between items-end text-white/40 text-xs font-display tracking-widest pointer-events-auto">
        <div>Est. 2025</div>
        <div className="flex gap-4">
           <span className="hover:text-arix-gold cursor-pointer transition-colors">SOUND ON</span>
           <span className="hover:text-arix-gold cursor-pointer transition-colors">FULLSCREEN</span>
        </div>
      </footer>
    </div>
  );
};