
import React, { useState, useEffect } from 'react';

interface DigitSlotProps {
  value: string;
  isSpinning: boolean;
}

const DigitSlot: React.FC<DigitSlotProps> = ({ value, isSpinning }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let interval: any;
    if (isSpinning) {
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 10).toString());
      }, 50);
    } else {
      setDisplayValue(value);
    }
    return () => clearInterval(interval);
  }, [isSpinning, value]);

  return (
    <div className="relative w-12 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 flex items-center justify-center bg-gradient-to-b from-red-900 to-red-950 border-2 border-amber-500 rounded-lg sm:rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] overflow-hidden">
      <div className={`text-4xl sm:text-5xl md:text-6xl font-digital font-bold text-amber-400 transition-all duration-300 ${isSpinning ? 'opacity-80 scale-105 blur-[0.5px]' : 'opacity-100'}`}>
        {displayValue}
      </div>
      {/* Decorative lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-amber-400/20"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-amber-400/20"></div>
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none"></div>
    </div>
  );
};

export default DigitSlot;
