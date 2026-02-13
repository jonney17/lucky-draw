
export interface Prize {
  id: string;
  name: string;
  count: number;
  remaining: number;
  rank: number; // 1 for 1st prize, 2 for 2nd, etc.
}

export interface Winner {
  id: string;
  number: string;
  prizeName: string;
  timestamp: number;
  message?: string;
}

export type MessageMode = 'AI' | 'PREDEFINED';

export interface LotteryConfig {
  maxNumber: number;
  digitDelay: number; // Thời gian dãn cách dừng giữa các chữ số (ms)
  prizes: Prize[];
  backgroundUrl?: string; // Lưu URL hình nền AI
  backgroundPrompt?: string; // Lưu câu lệnh tạo hình nền
  messageMode: MessageMode; // Chế độ tạo lời chúc: AI hoặc Danh sách mẫu
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  volume: number;
  customBgmUrl?: string; // Nhạc nền tùy chỉnh (base64)
  customWinningSfxUrl?: string; // Hiệu ứng thắng cuộc tùy chỉnh (base64)
}

export enum AppState {
  ADMIN = 'ADMIN',
  DRAW = 'DRAW',
  HISTORY = 'HISTORY'
}
