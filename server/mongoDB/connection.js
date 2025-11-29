import mongoose from "mongoose";

const mongoDBConnect = () => {
    try {
        mongoose.connect(process.env.MONGO_DB_URL);
        console.log(`MongoDB -  Connected`)
        
    } catch (error) {
        console.log(`Error -  MongoDB Connection`)

    }
}
export default mongoDBConnect;