// File: auth.js (Bản sửa lỗi cuối cùng)
import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    // LƯU Ý: Đây là biến cũ mà code Web App của bạn phụ thuộc vào
    let { token } = req.headers; 

    // 1. CÓ KHẢ NĂNG HEADER 'token' BỊ NULL HOẶC UNDEFINED KHI DÙNG ANDROID.
    // Chúng ta kiểm tra Header chuẩn của Android/JWT là 'Authorization'.
    const authHeader = req.headers.authorization;

    // 2. Nếu biến 'token' cũ bị NULL VÀ Header 'Authorization' tồn tại (từ Android)
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        // Trích xuất Token (Loại bỏ 'Bearer ' chiếm 7 ký tự)
        token = authHeader.substring(7); 
    }

    // 3. Nếu không có Token nào (Cũ hay Mới)
    if (!token) {
        // Trả về lỗi mà Web App mong đợi
        return res.json({ success: false, message: "Not Authorized Login Again" })
    }

    // 4. Bắt đầu xử lý Token (Token đã được đảm bảo là chuỗi JWT thô)
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // Giữ nguyên logic cũ của bạn (gán userId vào body)
        req.body.userId = token_decode.id;
        
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export default authMiddleware;