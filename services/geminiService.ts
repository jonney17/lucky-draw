
import { GoogleGenAI } from "@google/genai";

// Danh sách câu chúc dự phòng cho năm Bính Ngọ 2026
const FALLBACK_MESSAGES = [
  "Chúc mừng bạn trúng {prize}! Con số {number} khai xuân đại cát, năm mới Bính Ngọ mã đáo thành công, vạn sự như ý!",
  "Lộc xuân gõ cửa! {prize} đã thuộc về số {number}. Chúc tân xuân Bính Ngọ tài lộc đầy nhà, gia đạo bình an!",
  "Vạn sự hanh thông với con số {number}! Chúc mừng chủ nhân giải {prize} một năm mới phát tài phát lộc!",
  "Con số {number} mang lời chúc đại thắng! Chúc mừng bạn nhận giải {prize}, năm mới sức khỏe dồi dào, vạn sự như ý!",
  "Mã đáo thành công cùng giải {prize}! Con số {number} chính là khởi đầu cho một năm 2026 rực rỡ và thành đạt!",
  "Tân niên vạn phúc! Giải {prize} gọi tên số {number}. Chúc bạn năm mới tiền tùng như nước, sự nghiệp thăng hoa!",
  "Con số may mắn {number} đã mang về giải {prize}! Chúc bạn và gia đình năm mới an khang, thịnh vượng, vạn thọ vô cương!"
];

/**
 * Lấy một câu chúc ngẫu nhiên từ danh sách dự phòng
 */
export function getRandomFallbackMessage(prizeName: string, winningNumber: string): string {
  const randomIndex = Math.floor(Math.random() * FALLBACK_MESSAGES.length);
  return FALLBACK_MESSAGES[randomIndex]
    .replace("{prize}", prizeName)
    .replace("{number}", winningNumber);
}

/**
 * Tạo lời chúc mừng người thắng cuộc bằng Gemini AI
 * Nếu lỗi (hết quota, mạng yếu...), sử dụng danh sách dự phòng
 */
export async function generateWinnerHype(prizeName: string, winningNumber: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là một người dẫn chương trình quay số trúng thưởng đêm giao thừa Tết Nguyên Đán Bính Ngọ 2026 cực kỳ hào hứng. 
      Hãy tạo một câu chúc Tết thật ý nghĩa cho người vừa trúng giải "${prizeName}" với con số ${winningNumber}. 
      Yêu cầu:
      - Phong cách lễ hội, rộn ràng, ấm áp.
      - Ngắn gọn (tối đa 2 câu).
      - Chúc mừng năm mới Bính Ngọ 2026 thành công, mã đáo thành công.`,
      config: {
        temperature: 0.9,
      }
    });

    return response.text || getRandomFallbackMessage(prizeName, winningNumber);
  } catch (error) {
    console.warn("Gemini Error (Winner Hype): Sử dụng tin nhắn dự phòng.", error);
    return getRandomFallbackMessage(prizeName, winningNumber);
  }
}

/**
 * Tạo hình nền Tết bằng Gemini AI
 */
export async function generateTetBackground(prompt: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: prompt
        }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}
