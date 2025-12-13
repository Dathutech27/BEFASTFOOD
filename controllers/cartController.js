import userModel from "../models/userModel.js"

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }

        // 🚨 SỬA: Dùng cú pháp spread (...) an toàn và hiện đại
        let cartData = { ...(userData.cartData || {}) };
        
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
        
        if (!userData) {
            return res.json({ success: false, message: "User not found." });
        }
        
        // 🚨 SỬA: Dùng cú pháp spread (...) an toàn và hiện đại
        let cartData = { ...(userData.cartData || {}) };

        if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: cartData });

        res.json({ success: true, message: "Removed From Cart" })
    } catch (error) {
        console.log("LỖI removeFromCart (Final Check):", error);
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
        
        let cartData = userData.cartData || {};

        res.json({ success: true, cartData: cartData });
    } catch (error) {
        console.log("LỖI getCart (Final Check):", error);
        res.json({ success: false, message: "Error fetching cart" })
    }
}

export { addToCart, removeFromCart, getCart }