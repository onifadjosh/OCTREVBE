const express = require('express')
const app = express()
const mongoose = require('mongoose') 
const cors= require("cors")
app.use(cors())
const dotenv = require('dotenv')
dotenv.config()
app.use(express.json({limit:"50mb"}))

mongoose.connect(process.env.DATABASE_URI)
.then(()=>{
    console.log('database connected successfully')
})
.catch((err)=>{
    console.log('Error connecting to DB', err)
})


const UserRouter = require("./routes/user.routes")
const ProductRouter = require("./routes/product.routes")
app.use('/api/v1', UserRouter)
app.use('/api/v1', ProductRouter)




app.listen(process.env.PORT, (err)=>{
    if(err){
        console.log('cannot start server at this moment')
    }else{
        console.log('server started successfully')
    }
})