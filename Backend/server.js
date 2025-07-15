import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDb } from './src/utils/mongodbConnect.js'
import authRoutes from './src/routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import userRoutes from "./src/routes/userRoutes.js"
import foodRoutes from "./src/routes/foodRoutes.js"
import vendorRoutes from "./src/routes/vendorRoutes.js"
import serviceRoutes from "./src/routes/serviceRoutes.js"


dotenv.config()

const PORT = process.env.PORT || 5001

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors(
{    
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/vendor',vendorRoutes)
app.use('/api/food',foodRoutes)
app.use('/api/service',serviceRoutes)




app.listen(PORT,(()=>{
    connectDb()
    console.log(`Server running at ${PORT}`)
}))