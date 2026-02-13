
import { GoogleGenAI } from "@google/genai";

// Function to generate a creative hype message for the winner using Gemini 3 Flash
export async function generateWinnerHype(prizeName: string, winningNumber: string): Promise<string> {
  // FIX: Always use process.env.API_KEY directly for initialization as per SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    // Access .text property directly as it is a getter, not a method
    return response.text || `Chúc mừng năm Bính Ngọ! Con số ${winningNumber} mang lại đại cát đại lợi, mã đáo thành công với giải ${prizeName}!`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Chúc mừng năm mới Bính Ngọ! Con số ${winningNumber} đã mang tài lộc về nhà. Chúc bạn vạn sự như ý!`;
  }
}

// Function to generate a custom Lunar New Year background using Gemini 2.5 Flash Image
export async function generateTetBackground(prompt: string): Promise<string | null> {
  // FIX: Always use process.env.API_KEY directly for initialization as per SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

    // Safely iterate through candidates and parts using optional chaining
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
