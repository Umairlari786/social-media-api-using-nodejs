const express=require("express");
const app= express();
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const helmet =require("helmet");
const morgan = require("morgan");
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postsRoute=require("./routes/posts");


dotenv.config();
// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postsRoute);
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("connected to database:");
});




app.listen("5500",()=>{
    console.log("backend is runing :");
})