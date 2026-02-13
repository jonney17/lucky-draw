
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
}

export enum AppState {
  ADMIN = 'ADMIN',
  DRAW = 'DRAW',
  HISTORY = 'HISTORY'
}
