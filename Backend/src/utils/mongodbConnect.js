import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const connectDb = async() =>{

    try {
        const connection = await mongoose.connect(process.env.Mongo_db)
        console.log( "Connected to Mongodb Atlas using moongose",connection.connection.host)
    } catch (error) {
        console.error("Error in Connecting to mongodb Atlas",error)
    }
}