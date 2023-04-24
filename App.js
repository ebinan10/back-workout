const express = require('express');
const app = express()
const cookieParser = require('cookie-parser')

app.use(cookieParser());
const mongoose = require('mongoose')
const env = require('dotenv').config()
const WorkOutRouter = require('./router/Workout')
const UserRouter = require('./router/User')
const RefreshToken = require('./router/RefreshToken')
const cors = require('cors')
app.use(express.json());   
app.use(cors({
    origin: true,
    credentials:true,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token']} ))
      
mongoose.connect(process.env.Uri)
.then(()=>{
    app.listen(process.env.Port, console.log(`connected to DB and localhost running on port ${process.env.Port}`))
   
}).catch((error)=>{ 
        console.log(error) 
})
    app.use('/', WorkOutRouter)
    app.use('/user', UserRouter)
    app.use('/token', RefreshToken)
    
