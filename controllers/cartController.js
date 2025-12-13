import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        // 🚨 Sửa 1: Kiểm tra phòng vệ cho User
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }

        // 🚨 Sửa 2: Lấy dữ liệu giỏ hàng dưới dạng JS object thuần túy
        // Sử dụng .toObject() để tránh lỗi Mongoose khi sửa đổi
        // Đảm bảo tạo object rỗng nếu cartData chưa được khởi tạo (null/undefined)
        let cartData = userData.cartData ? userData.cartData.toObject() : {};
        
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
        console.log("LỖI addToCart:", error); // Log lỗi chi tiết
        res.json({ success: false, message: "Error" })
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }

        let cartData = userData.cartData ? userData.cartData.toObject() : {};

        if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        
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
        
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }
        
        // Trả về cartData dưới dạng object thuần túy để Android deserialize
        let cartData = userData.cartData ? userData.cartData.toObject() : {};

        res.json({ success: true, cartData: cartData });
    } catch (error) {
        console.log("LỖI getCart:", error);
        res.json({ success: false, message: "Error fetching cart" })
    }
}

export { addToCart, removeFromCart, getCart } // Đảm bảo export đúng