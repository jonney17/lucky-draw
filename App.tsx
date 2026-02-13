
import React, { useState, useEffect, useRef } from 'react';
import { AppState, LotteryConfig, Winner, Prize } from './types';
import AdminPanel from './components/AdminPanel';
import DrawScreen from './components/DrawScreen';
import { saveAsset, getAsset } from './services/storageService';

const DEFAULT_CONFIG: LotteryConfig = {
  maxNumber: 9999,
  digitDelay: 1000,
  prizes: [
    { id: '1', name: 'Giải Đặc Biệt', count: 1, remaining: 1, rank: 1 },
    { id: '2', name: 'Giải Nhất', count: 3, remaining: 3, rank: 2 },
    { id: '3', name: 'Giải Khuyến Khích', count: 10, remaining: 10, rank: 3 },
  ],
  backgroundUrl: '/default-background.png',
  backgroundPrompt: "A beautiful and high-quality artistic background for Lunar New Year 2026 Year of the Horse (Bính Ngọ) in Vietnam. Include a majestic horse, traditional Bánh Tét, blooming Yellow Apricot (Mai) and Pink Cherry Blossoms (Đào). In the background, subtly integrate a beautiful and peaceful Catholic Church architecture. The style should be festive, warm, with red and gold color palettes, rich in Vietnamese cultural heritage. Cinematic lighting, 4k resolution, panoramic view.",
  messageMode: 'PREDEFINED',
  bgmEnabled: true,
  sfxEnabled: true,
  volume: 0.5
};

const BGM_URL_DEFAULT = "/audio/background-music.mp3";

const App: React.FC = () => {
  const [activeState, setActiveState] = useState<AppState>(AppState.DRAW);
  const [config, setConfig] = useState<LotteryConfig>(DEFAULT_CONFIG);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // Initial Data Loading
  useEffect(() => {
    const loadData = async () => {
      // 1. Load Settings from LocalStorage
      const savedSettings = localStorage.getItem('lottery_settings_2026_v4');
      const settings = savedSettings ? JSON.parse(savedSettings) : DEFAULT_CONFIG;

      // 2. Load Large Assets from IndexedDB
      const backgroundUrl = await getAsset('asset_background');
      const customBgmUrl = await getAsset('asset_bgm');
      const customWinningSfxUrl = await getAsset('asset_winsfx');

      // 3. Load Winners from LocalStorage
      const savedWinners = localStorage.getItem('lottery_winners_2026_v4');
      const loadedWinners = savedWinners ? JSON.parse(savedWinners) : [];

      // Determine background URL with proper fallback
      let finalBgUrl = backgroundUrl || settings.backgroundUrl;
      
      // If no background is set or it's an old URL, use default
      if (!finalBgUrl || finalBgUrl.includes('jina.ai')) {
        finalBgUrl = DEFAULT_CONFIG.backgroundUrl;
      }

      // Set background immediately
      document.body.style.backgroundImage = `url('${finalBgUrl}')`;

      setConfig({
        ...DEFAULT_CONFIG,
        ...settings,
        backgroundUrl: finalBgUrl,
        customBgmUrl: customBgmUrl || undefined,
        customWinningSfxUrl: customWinningSfxUrl || undefined
      });
      setWinners(loadedWinners);
      setIsLoaded(true);
    };

    loadData();
  }, []);

  // Save Config & Assets when changed
  useEffect(() => {
    if (!isLoaded) return;

    // Save lightweight settings to LocalStorage
    const { backgroundUrl, customBgmUrl, customWinningSfxUrl, ...settingsToSave } = config;
    localStorage.setItem('lottery_settings_2026_v4', JSON.stringify(settingsToSave));

    // Save heavyweight assets to IndexedDB (only if they are base64/large strings)
    const saveLargeAssets = async () => {
        if (backgroundUrl && backgroundUrl.startsWith('data:')) {
            await saveAsset('asset_background', backgroundUrl);
        }
        if (customBgmUrl && customBgmUrl.startsWith('data:')) {
            await saveAsset('asset_bgm', customBgmUrl);
        }
        if (customWinningSfxUrl && customWinningSfxUrl.startsWith('data:')) {
            await saveAsset('asset_winsfx', customWinningSfxUrl);
        }
    };
    saveLargeAssets();

    // Update body background
    if (config.backgroundUrl) {
      document.body.style.backgroundImage = `url('${config.backgroundUrl}')`;
    }
  }, [config, isLoaded]);

  // Save Winners when changed
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('lottery_winners_2026_v4', JSON.stringify(winners));
  }, [winners, isLoaded]);

  // BGM Management
  useEffect(() => {
    if (!isLoaded) return;
    
    const currentBgmUrl = config.customBgmUrl || BGM_URL_DEFAULT;
    
    if (!bgmRef.current || bgmRef.current.src !== currentBgmUrl) {
      if (bgmRef.current) bgmRef.current.pause();
      bgmRef.current = new Audio(currentBgmUrl);
      bgmRef.current.loop = true;
    }
    
    bgmRef.current.volume = config.volume;

    if (config.bgmEnabled) {
      const playBgm = () => {
        bgmRef.current?.play().catch(() => {});
      };
      playBgm();
      window.addEventListener('click', playBgm, { once: true });
    } else {
      bgmRef.current.pause();
    }

    return () => {
        bgmRef.current?.pause();
    };
  }, [config.bgmEnabled, config.volume, config.customBgmUrl, isLoaded]);

  const handleUpdateConfig = (newConfig: LotteryConfig) => {
    setConfig(newConfig);
  };

  const handleDraw = (winner: Winner, updatedPrizes: Prize[]) => {
    setWinners(prev => [winner, ...prev]);
    setConfig(prev => ({ ...prev, prizes: updatedPrizes }));
  };

  const resetLottery = () => {
    if (window.confirm("Xóa toàn bộ dữ liệu người thắng và đặt lại số lượng giải cho Tết 2026?")) {
      const resetPrizes = config.prizes.map(p => ({ ...p, remaining: p.count }));
      setConfig({ ...config, prizes: resetPrizes });
      setWinners([]);
    }
  };

  const toggleBgm = () => {
    setConfig(prev => ({ ...prev, bgmEnabled: !prev.bgmEnabled }));
  };

  if (!isLoaded) {
    return (
        <div className="h-screen flex items-center justify-center bg-red-950 text-amber-400">
            <div className="text-center">
                <i className="fas fa-horse-head text-6xl animate-bounce mb-4"></i>
                <div className="text-xl font-bold tracking-widest uppercase">Đang khởi tạo Tết 2026...</div>
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative z-10">
      {/* Navigation Header */}
      <nav className="glass-morphism sticky top-0 z-50 px-6 py-3 flex justify-between items-center border-b border-amber-500/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-400">
            <i className="fas fa-horse text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight gold-text">
            LUXEDRAW <span className="text-white opacity-80 text-sm hidden sm:inline">BÍNH NGỌ 2026</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setActiveState(AppState.DRAW)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeState === AppState.DRAW ? 'bg-amber-500 text-red-900 shadow-lg' : 'text-amber-200/60 hover:text-amber-200'}`}
            >
              <i className="fas fa-play mr-1"></i> QUAY SỐ
            </button>
            <button 
              onClick={() => setActiveState(AppState.ADMIN)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeState === AppState.ADMIN ? 'bg-amber-500 text-red-900 shadow-lg' : 'text-amber-200/60 hover:text-amber-200'}`}
            >
              <i className="fas fa-cog mr-1"></i> CẤU HÌNH
            </button>
            <button 
              onClick={() => setActiveState(AppState.HISTORY)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeState === AppState.HISTORY ? 'bg-amber-500 text-red-900 shadow-lg' : 'text-amber-200/60 hover:text-amber-200'}`}
            >
              <i className="fas fa-list mr-1"></i> LỊCH SỬ
            </button>
          </div>

          <button 
            onClick={toggleBgm}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${config.bgmEnabled ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-white/30'}`}
          >
            <i className={`fas ${config.bgmEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col py-4 px-4 sm:px-6">
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
          {activeState === AppState.ADMIN && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <AdminPanel config={config} onUpdate={handleUpdateConfig} />
              <div className="max-w-4xl mx-auto w-full pb-8">
                <button 
                  onClick={resetLottery}
                  className="w-full py-4 border-2 border-dashed border-red-500/50 text-red-200 bg-red-950/20 rounded-2xl hover:bg-red-900/40 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Đặt lại phiên quay thưởng 2026
                </button>
              </div>
            </div>
          )}

          {activeState === AppState.DRAW && (
            <div className="flex-1 flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
              <DrawScreen config={config} winners={winners} onDraw={handleDraw} />
            </div>
          )}

          {activeState === AppState.HISTORY && (
            <div className="max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
              <div className="glass-morphism p-8 rounded-3xl">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-4">
                  <i className="fas fa-trophy text-amber-400"></i>
                  Bảng Vàng Bính Ngọ 2026
                </h2>
                {winners.length === 0 ? (
                  <div className="text-center py-20 text-amber-100/30">
                    <i className="fas fa-ghost text-5xl mb-6 opacity-20"></i>
                    <p className="text-xl">Chưa có ai may mắn trúng giải. Hãy khai lộc ngay!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {winners.map(winner => (
                      <div key={winner.id} className="bg-red-900/40 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-400/50 transition-all">
                        <div className="flex items-center gap-8">
                          <div className="text-4xl sm:text-5xl font-digital font-bold text-amber-400 w-24 sm:w-32 tracking-tighter">
                            {winner.number}
                          </div>
                          <div>
                            <div className="text-lg sm:text-xl font-bold text-white">{winner.prizeName}</div>
                            <div className="text-xs text-amber-200/50 uppercase tracking-widest">
                              {new Date(winner.timestamp).toLocaleString('vi-VN')}
                            </div>
                          </div>
                        </div>
                        <div className="text-amber-100 italic text-sm md:text-right max-w-md border-l md:border-l-0 md:border-r border-amber-500/20 pl-4 md:pl-0 md:pr-4">
                          "{winner.message}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-4 text-center text-amber-100/30 text-[10px] uppercase tracking-[0.4em] flex-shrink-0 bg-black/40 backdrop-blur-md border-t border-white/5">
        &copy; {new Date().getFullYear()} LuxeDraw • Xuân Bính Ngọ - Mã Đáo Thành Công • NiKenSoft - 0939.813.969
      </footer>
    </div>
  );
};

export default App;
