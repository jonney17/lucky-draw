
import React, { useState } from 'react';
import { LotteryConfig, Prize } from '../types';
import { generateTetBackground } from '../services/geminiService';

interface AdminPanelProps {
  config: LotteryConfig;
  onUpdate: (newConfig: LotteryConfig) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdate }) => {
  const [maxNum, setMaxNum] = useState(config.maxNumber);
  const [digitDelay, setDigitDelay] = useState(config.digitDelay || 1000);
  const [prizes, setPrizes] = useState<Prize[]>(config.prizes);
  const [bgPrompt, setBgPrompt] = useState(config.backgroundPrompt || "");
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);

  const handleAddPrize = () => {
    const newPrize: Prize = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Giải thưởng mới`,
      count: 1,
      remaining: 1,
      rank: prizes.length + 1
    };
    setPrizes([...prizes, newPrize]);
  };

  const handleUpdatePrize = (id: string, field: keyof Prize, value: string | number) => {
    const updated = prizes.map(p => {
      if (p.id === id) {
        const newVal = field === 'count' ? Number(value) : value;
        return { ...p, [field]: newVal, remaining: field === 'count' ? Number(value) : p.remaining };
      }
      return p;
    });
    setPrizes(updated);
  };

  const handleRemovePrize = (id: string) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  const handleSave = () => {
    onUpdate({ ...config, maxNumber: maxNum, digitDelay, prizes, backgroundPrompt: bgPrompt });
    alert("Lưu cấu hình thành công!");
  };

  const handleCreateAIBackground = async () => {
    if (!bgPrompt.trim()) {
        alert("Vui lòng nhập câu lệnh tạo hình nền.");
        return;
    }
    setIsGeneratingBg(true);
    try {
      const newUrl = await generateTetBackground(bgPrompt);
      if (newUrl) {
        onUpdate({ ...config, backgroundUrl: newUrl, maxNumber: maxNum, digitDelay, prizes, backgroundPrompt: bgPrompt });
        alert("Đã tạo hình nền AI Tết Bính Ngọ thành công!");
      } else {
        alert("Không thể tạo hình nền. Vui lòng thử lại sau.");
      }
    } catch (e) {
      alert("Lỗi hệ thống khi tạo hình nền.");
    } finally {
      setIsGeneratingBg(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Background Generator Section */}
      <div className="glass-morphism p-8 rounded-3xl border-2 border-amber-400/30">
        <div className="flex flex-col gap-6">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <i className="fas fa-magic text-amber-400"></i>
              Giao diện AI Tết Bính Ngọ
            </h3>
            <p className="text-amber-100/60 text-sm leading-relaxed mb-4">
              Tùy chỉnh câu lệnh bên dưới để tạo hình nền độc bản chứa hình ảnh Con Ngựa, Bánh Tét, Hoa Mai, Hoa Đào và Nhà Thờ Công Giáo.
            </p>
            
            <div className="mb-4">
                <label className="block text-[10px] font-black text-amber-300 mb-2 uppercase tracking-[0.2em]">Câu lệnh (Prompt) AI</label>
                <textarea 
                    value={bgPrompt}
                    onChange={(e) => setBgPrompt(e.target.value)}
                    className="w-full h-32 bg-black/40 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-100 focus:outline-none focus:border-amber-400 transition-all resize-none"
                    placeholder="Mô tả hình nền bạn muốn tạo..."
                />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-2">
                {config.backgroundUrl && (
                <div className="w-48 h-20 rounded-xl overflow-hidden border border-white/10 relative group">
                    <img src={config.backgroundUrl} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[8px] uppercase font-bold tracking-[0.2em] bg-black/60 px-2 py-0.5 rounded-full">Hiện tại</span>
                    </div>
                </div>
                )}
            </div>
            
            <button 
                onClick={handleCreateAIBackground}
                disabled={isGeneratingBg}
                className={`px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
                isGeneratingBg 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-red-800 text-white hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-amber-400/50'
                }`}
            >
                {isGeneratingBg ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i> Đang vẽ hình nền...</>
                ) : (
                <><i className="fas fa-paint-brush mr-2"></i> Tạo hình nền AI 2026</>
                )}
            </button>
          </div>
        </div>
      </div>

      <div className="glass-morphism p-8 rounded-3xl">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <i className="fas fa-cog text-amber-400"></i>
          Thông số kỹ thuật 2026
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-3 uppercase tracking-[0.2em]">Dải số trúng thưởng</label>
            <input 
              type="number" 
              value={maxNum}
              onChange={(e) => setMaxNum(Number(e.target.value))}
              className="w-full bg-red-950/40 border border-amber-500/30 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            <p className="text-[10px] text-amber-500/50 mt-2 italic">Ví dụ: 9999 = dãy 4 chữ số.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-300 mb-3 uppercase tracking-[0.2em]">Hồi hộp giữa các số (giây)</label>
            <input 
              type="number" 
              step="0.5"
              min="0.5"
              value={digitDelay / 1000}
              onChange={(e) => setDigitDelay(Number(e.target.value) * 1000)}
              className="w-full bg-red-950/40 border border-amber-500/30 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
            <p className="text-[10px] text-amber-500/50 mt-2 italic">Thời gian chờ dừng hàng đơn vị, chục, trăm...</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-xl font-bold uppercase tracking-wider">Cơ cấu Giải thưởng 2026</h3>
            <button 
              onClick={handleAddPrize}
              className="px-5 py-2 bg-red-800 hover:bg-red-700 border border-amber-500/30 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2"
            >
              <i className="fas fa-plus"></i> Thêm giải mới
            </button>
          </div>

          <div className="grid gap-4">
            {prizes.map((prize) => (
              <div key={prize.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-red-950/30 border border-amber-500/10 rounded-2xl items-center hover:border-amber-500/30 transition-all">
                <input 
                  type="text" 
                  value={prize.name}
                  onChange={(e) => handleUpdatePrize(prize.id, 'name', e.target.value)}
                  placeholder="Tên giải thưởng"
                  className="bg-black/40 border border-amber-500/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-all"
                />
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-amber-300/40 uppercase font-black">Số Lượng</span>
                  <input 
                    type="number" 
                    value={prize.count}
                    onChange={(e) => handleUpdatePrize(prize.id, 'count', e.target.value)}
                    className="w-full bg-black/40 border border-amber-500/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-amber-300/40 uppercase font-black">Thứ Tự</span>
                  <input 
                    type="number" 
                    value={prize.rank}
                    onChange={(e) => handleUpdatePrize(prize.id, 'rank', e.target.value)}
                    className="w-full bg-black/40 border border-amber-500/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex justify-end">
                   <button 
                    onClick={() => handleRemovePrize(prize.id)}
                    className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-red-950 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:brightness-110 active:scale-95 transition-all"
          >
            Xác nhận thiết lập 2026
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
