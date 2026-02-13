
import React, { useState, useEffect } from 'react';
import { LotteryConfig, Prize, Winner } from '../types';
import DigitSlot from './DigitSlot';
import { generateWinnerHype, getRandomFallbackMessage } from '../services/geminiService';

interface DrawScreenProps {
  config: LotteryConfig;
  winners: Winner[];
  onDraw: (winner: Winner, updatedPrizes: Prize[]) => void;
}

const DrawScreen: React.FC<DrawScreenProps> = ({ config, winners, onDraw }) => {
  const [spinningStates, setSpinningStates] = useState<boolean[]>([]);
  const [selectedPrizeId, setSelectedPrizeId] = useState<string | null>(null);
  const [currentNumber, setCurrentNumber] = useState("");
  const [winningMessage, setWinningMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const digitCount = config.maxNumber.toString().length;
  const isAnySpinning = spinningStates.some(s => s === true);

  useEffect(() => {
    if (currentNumber.length !== digitCount) {
      const initialNum = "0".repeat(digitCount);
      setCurrentNumber(initialNum);
      setSpinningStates(new Array(digitCount).fill(false));
    }
    
    if (config.prizes.length > 0 && !selectedPrizeId) {
      const firstAvailable = config.prizes.find(p => p.remaining > 0);
      if (firstAvailable) setSelectedPrizeId(firstAvailable.id);
    }
  }, [digitCount, config.prizes, selectedPrizeId]);

  const startDraw = async () => {
    if (!selectedPrizeId) {
      alert("Vui lòng chọn giải thưởng để bắt đầu!");
      return;
    }

    const prize = config.prizes.find(p => p.id === selectedPrizeId);
    if (!prize || prize.remaining <= 0) {
      alert("Giải thưởng này đã hết số lượng!");
      return;
    }

    setWinningMessage(null);
    setShowCelebration(false);
    setSpinningStates(new Array(digitCount).fill(true));

    let winningNum = "";
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 100) {
      const rand = Math.floor(Math.random() * (config.maxNumber + 1));
      winningNum = rand.toString().padStart(digitCount, '0');
      if (!winners.some(w => w.number === winningNum)) {
        isUnique = true;
      }
      attempts++;
    }

    setCurrentNumber(winningNum);
    
    // Determine the hype promise based on config
    let hypePromise: Promise<string>;
    if (config.messageMode === 'AI') {
      hypePromise = generateWinnerHype(prize.name, winningNum);
    } else {
      // Return immediately if using predefined
      hypePromise = Promise.resolve(getRandomFallbackMessage(prize.name, winningNum));
    }

    const initialDelay = 1500; 
    const gap = config.digitDelay || 1000; 

    for (let i = 0; i < digitCount; i++) {
      setTimeout(() => {
        setSpinningStates(prev => {
          const next = [...prev];
          next[digitCount - 1 - i] = false;
          return next;
        });

        if (i === digitCount - 1) {
          finishDraw(prize, winningNum, hypePromise);
        }
      }, initialDelay + (i * gap));
    }
  };

  const finishDraw = async (prize: Prize, winningNum: string, hypePromise: Promise<string>) => {
    setShowCelebration(true);
    const hype = await hypePromise;
    setWinningMessage(hype);

    const updatedPrizes = config.prizes.map(p => 
      p.id === selectedPrizeId ? { ...p, remaining: p.remaining - 1 } : p
    );

    const newWinner: Winner = {
      id: Math.random().toString(36).substr(2, 9),
      number: winningNum,
      prizeName: prize.name,
      timestamp: Date.now(),
      message: hype
    };

    onDraw(newWinner, updatedPrizes);
  };

  const selectedPrize = config.prizes.find(p => p.id === selectedPrizeId);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full h-full py-4">
      {/* Modal Chúc Mừng Tết Bính Ngọ */}
      {showCelebration && selectedPrize && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-red-950/90 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setShowCelebration(false)}
          ></div>
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(80)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  bottom: `-20px`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  backgroundColor: ['#fbbf24', '#f59e0b', '#dc2626', '#ffffff', '#ef4444', '#ffd700'][Math.floor(Math.random() * 6)],
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  animationDuration: `${Math.random() * 4 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>

          <div className="relative glass-morphism p-8 sm:p-12 rounded-[4rem] max-w-2xl w-full border-4 border-amber-400 shadow-[0_0_120px_rgba(251,191,36,0.6)] animate-celebrate text-center overflow-y-auto max-h-[95vh]">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 scale-75 sm:scale-100">
               <div className="relative">
                  <div className="absolute inset-0 bg-amber-400 blur-3xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-600 to-amber-600 p-8 rounded-full shadow-2xl border-4 border-amber-400">
                    <i className="fas fa-horse text-5xl text-white"></i>
                  </div>
               </div>
            </div>

            <div className="mt-12">
              <h2 className="text-xl font-bold text-amber-300 tracking-[0.5em] uppercase mb-4">TÂN NIÊN VẠN PHÚC</h2>
              <h1 className="text-2xl md:text-4xl font-black mb-8 gold-text uppercase leading-tight drop-shadow-lg whitespace-nowrap pt-10 pb-10 max-w-full">{selectedPrize.name}</h1>
              
              <div className="bg-gradient-to-b from-red-950/90 to-black/80 rounded-[3rem] p-8 sm:p-12 mb-10 border-2 border-amber-500/40 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]">
                <div className="text-xs text-amber-200/60 uppercase tracking-[0.6em] mb-4 font-black">Con Số Đại Cát</div>
                <div className="text-7xl md:text-[9rem] font-digital font-bold tracking-tighter text-white drop-shadow-[0_0_40px_rgba(251,191,36,1)] leading-none">
                  {currentNumber}
                </div>
              </div>

              {winningMessage ? (
                <div className="mb-10 px-4 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="relative group">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-red-700 rounded-l-lg border-y-2 border-l-2 border-amber-500/30 z-0"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-red-700 rounded-r-lg border-y-2 border-r-2 border-amber-500/30 z-0"></div>
                    
                    <div className="relative z-10 bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-2 border-amber-400/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
                      <div className="text-amber-100 text-lg sm:text-2xl font-medium leading-relaxed italic">
                        <span className="text-4xl text-amber-400 font-serif mr-2 leading-none inline-block align-top">“</span>
                        {winningMessage}
                        <span className="text-4xl text-amber-400 font-serif ml-2 leading-none inline-block align-bottom">”</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-10 px-4">
                  <div className="h-32 flex items-center justify-center gap-4 text-amber-500/40 italic text-xl">
                    <i className="fas fa-magic animate-spin"></i>
                    Đang nhận lộc xuân...
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowCelebration(false)}
                className="px-16 py-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600 text-red-950 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] hover:brightness-110 transition-all hover:scale-105 shadow-[0_15px_40px_rgba(0,0,0,0.5)] border-2 border-red-900/20"
              >
                TẠ NHẬN LỘC XUÂN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prize Selection Chips */}
      <div className="w-full flex flex-wrap justify-center gap-3 sm:gap-6 flex-shrink-0 px-4">
        {[...config.prizes].sort((a,b) => a.rank - b.rank).map((p) => (
          <button
            key={p.id}
            disabled={isAnySpinning}
            onClick={() => setSelectedPrizeId(p.id)}
            className={`px-6 py-4 rounded-2xl transition-all border-2 text-center min-w-[150px] sm:min-w-[180px] ${
              selectedPrizeId === p.id 
                ? 'bg-red-600/50 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] scale-110 z-10' 
                : 'bg-black/50 border-white/10 hover:border-amber-400/40 opacity-70'
            } ${p.remaining === 0 ? 'grayscale cursor-not-allowed opacity-30' : ''}`}
          >
            <div className="text-[10px] text-amber-300 font-black mb-1.5 uppercase tracking-widest">
              LỘC CÒN {p.remaining} / {p.count}
            </div>
            <div className="text-base sm:text-lg font-black text-white whitespace-nowrap drop-shadow-md">{p.name}</div>
          </button>
        ))}
      </div>

      {/* Main Draw Unit */}
      <div className="relative group w-full max-w-3xl flex-shrink flex items-center justify-center px-4">
        <div className={`absolute -inset-8 bg-red-600/30 rounded-[4rem] blur-3xl transition-all duration-1000 ${isAnySpinning ? 'opacity-100 animate-pulse' : 'opacity-20'}`}></div>
        <div className="glass-morphism p-8 sm:p-16 rounded-[3rem] relative flex flex-col items-center border-2 border-amber-500/30 shadow-[0_0_80px_rgba(0,0,0,0.6)] w-full">
          
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-1.5 bg-red-900/60 rounded-full border-2 border-amber-500/30 mb-4 shadow-lg">
               <span className="text-amber-300 text-[11px] font-black uppercase tracking-[0.3em]">Hội Xuân Bính Ngọ 2026</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white gold-text uppercase truncate max-w-full px-4 tracking-tighter pt-10 pb-10">
              {selectedPrize?.name || "CHỌN GIẢI THƯỞNG"}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-12 sm:mb-16 scale-90 sm:scale-100">
            {currentNumber.split('').map((digit, idx) => (
              <DigitSlot 
                key={idx} 
                value={digit} 
                isSpinning={spinningStates[idx] || false} 
              />
            ))}
          </div>

          <button
            onClick={startDraw}
            disabled={isAnySpinning || (selectedPrize?.remaining ?? 0) <= 0}
            className={`tet-button group relative w-full sm:w-auto px-16 py-6 sm:px-24 sm:py-7 rounded-2xl text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] overflow-hidden transition-all transform active:scale-95 shadow-2xl ${
              isAnySpinning 
                ? 'bg-slate-900 border-slate-700 cursor-not-allowed text-slate-500 shadow-none' 
                : 'text-white border-2 border-amber-400'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              {isAnySpinning ? (
                <>
                  <i className="fas fa-spinner fa-spin text-xl"></i>
                  <span className="whitespace-nowrap">ĐANG KHAI LỘC...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-horse-head text-amber-400 animate-bounce"></i>
                  <span className="whitespace-nowrap">MÃ ĐÁO THÀNH CÔNG</span>
                </>
              )}
            </span>
            {!isAnySpinning && (
              <div className="absolute inset-0 shimmer opacity-50"></div>
            )}
          </button>
        </div>
      </div>

      {/* Recent Winners Summary - Compact */}
      <div className="w-full max-w-2xl mt-4 hidden sm:block">
        <h4 className="text-amber-200/40 text-[11px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-6">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/20"></span>
          DANH SÁCH KHAI LỘC
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/20"></span>
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {winners.slice(0, 2).map(w => (
            <div key={w.id} className="bg-red-950/40 border-2 border-amber-500/10 rounded-2xl p-5 flex items-center justify-between backdrop-blur-xl hover:border-amber-500/40 transition-all">
              <div className="text-3xl font-digital font-bold text-amber-400 tracking-tighter">{w.number}</div>
              <div className="text-right">
                <div className="text-xs font-black text-white truncate max-w-[120px] uppercase">{w.prizeName}</div>
                <div className="text-[10px] text-amber-200/40 font-bold">{new Date(w.timestamp).toLocaleTimeString('vi-VN')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawScreen;
