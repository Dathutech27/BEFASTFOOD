import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }

        // 🚨 SỬA LỖI SAO CHÉP CUỐI CÙNG (Cách an toàn nhất)
        // Lấy cartData. Nếu null/undefined, dùng object rỗng {}.
        // Object.assign({}, ...) tạo một bản sao mới hoàn toàn.
        let cartData = Object.assign({}, userData.cartData || {}); 
        
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: cartData });

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        // CẦN XEM LOG NÀY NẾU VẪN LỖI
        console.log("LỖI addToCart (Final Check):", error); 
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