import cookieParser from "cookie-parser";
import express from "express";
import errorMiddleware from "./middleware/ErrorMiddleware.js"
import cors from "cors"
const app = express();

app.use(express.json())
const corsOptions = {
    origin:'http://localhost:5173',
    method:'POST , GET , PUT , DELETE , PATCH',
    credential:true
}
app.use(cors(corsOptions))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())

import productRouter from "./routes/productRouter.js"
import userRouter from './routes/userRouter.js'
import orderRouter from "./routes/orderRouter.js"
app.use("/api/v1/product",productRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/order",orderRouter)


// error middleware
app.use(errorMiddleware);
export default app;