
# 🐎 LuxeDraw AI - Xuân Bính Ngọ 2026 • NiKenSoft - 0939.813.969

Hệ thống quay số trúng thưởng đẳng cấp tích hợp trí tuệ nhân tạo Gemini để tạo lời chúc và hình nền nghệ thuật.

## 🚀 Hướng dẫn Deploy (Vercel / Netlify)

1. **Đẩy code lên GitHub:** Sử dụng tính năng Sync GitHub của editor.
2. **Kết nối Hosting:**
   - Truy cập [Vercel](https://vercel.com) hoặc [Netlify](https://netlify.com).
   - Chọn Import từ GitHub repository này.
3. **Cấu hình API Key (QUAN TRỌNG):**
   - Trong phần **Environment Variables** của dự án trên hosting, thêm biến:
     - Key: `API_KEY`
     - Value: `Mã API Key Gemini của bạn` (Lấy tại [Google AI Studio](https://aistudio.google.com/app/apikey)).
4. **Deploy:** Nhấn nút Deploy. Ứng dụng sẽ tự động được build và cung cấp link truy cập công khai.

## 🛠 Tính năng
- Quay số ngẫu nhiên không trùng lặp.
- Tự động tạo câu chúc Tết ý nghĩa theo năm Bính Ngọ bằng Gemini AI.
- Tạo hình nền nghệ thuật (Ngựa, Bánh Tét, Nhà Thờ...) độc bản bằng Gemini AI.
- Quản lý cơ cấu giải thưởng linh hoạt.
- Lưu trữ dữ liệu người thắng vào LocalStorage.

## 📝 Lưu ý
- Ứng dụng chạy hoàn toàn ở phía Client.
- Đảm bảo API Key của bạn đã được kích hoạt model `gemini-3-flash-preview` và `gemini-2.5-flash-image`.

Chúc bạn một năm mới Bính Ngọ 2026 **Mã Đáo Thành Công!**
