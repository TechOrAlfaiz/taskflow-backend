const dns = require("node:dns");
dns.setServers(['8.8.8.8', '1.1.1.1']);

require("dotenv").config();

const app = require("./src/app");
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try{
        if(!process.env.MONGODB_URI?.trim()){
            throw new Error("MONGODB_URI is required");
        }

        if(!process.env.JWT_SECRET?.trim()){
            throw new Error("JWT_SECRET is required");
        }

        await connectDB();

        app.listen(PORT , () => {
        console.log(`Server is running on port ${PORT}`);
        });
    }catch(error){
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();

