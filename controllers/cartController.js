import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        // 1. Kiểm tra phòng vệ
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }

        // 🚨 SỬA LỖI: Lấy cartData an toàn (Không dùng .toObject()!)
        // Lấy cartData hiện tại, nếu null/undefined thì tạo object rỗng {}.
        // Dùng {...} để đảm bảo clone ra object mới trước khi sửa đổi.
        let cartData = userData.cartData || {};
        cartData = { ...cartData }; 
        
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }

        // Cập nhật và lưu
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: cartData });

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log("LỖI addToCart:", error); 
        res.json({ success: false, message: "Error" })
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        // 1. Kiểm tra phòng vệ
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }

        // 🚨 SỬA LỖI: Lấy cartData an toàn (Không dùng .toObject()!)
        let cartData = userData.cartData || {};
        cartData = { ...cartData }; 

        if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        
        // Cập nhật và lưu
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: cartData });

        res.json({ success: true, message: "Removed From Cart" })
    } catch (error) {
        console.log("LỖI removeFromCart:", error);
        res.json({ success: false, message: "Error" })
    }
}

// fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        // 1. Kiểm tra phòng vệ
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }
        
        // 🚨 SỬA LỖI: Lấy cartData an toàn (Không dùng .toObject()!)
        // Nếu null/undefined thì trả về object rỗng {}
        let cartData = userData.cartData || {};

        res.json({ success: true, cartData: cartData });
    } catch (error) {
        console.log("LỖI getCart:", error);
        res.json({ success: false, message: "Error fetching cart" })
    }
}

export { addToCart, removeFromCart, getCart }