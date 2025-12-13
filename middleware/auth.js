import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    // 1. Dùng req.headers.authorization để lấy header chuẩn
    const authHeader = req.headers.authorization; 

    // 2. Kiểm tra Header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Nếu không có header hoặc không có 'Bearer ', trả lỗi.
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    try {
        // 3. Trích xuất Token (Loại bỏ 'Bearer ')
        // 'Bearer ' chiếm 7 ký tự (B, e, a, r, e, r, Khoảng trắng)
        const token = authHeader.substring(7); 
        
        // 4. Xác minh Token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Gán User ID từ Token vào req.userId để sử dụng trong các Controller khác (chuẩn nhất)
        // Lưu ý: Token của bạn dùng key 'id'
        req.userId = token_decode.id;
        
        // 6. Chuyển sang Controller tiếp theo (ví dụ: addToCart)
        next();
    } catch (error) {
        // Nếu Token hết hạn hoặc Secret Key sai
        console.log(error);
        res.json({ success: false, message: "Not Authorized Login Again" });
    }
}

export default authMiddleware;