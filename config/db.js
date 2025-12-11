import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://lucasthanhdat_db_user:cunganhsang123@cluster0.sxwe9xw.mongodb.net/fastfood').then(()=>console.log("DB Connected"));
}