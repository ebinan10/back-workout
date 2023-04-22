const express = require('express');
const app = express()
const mongoose = require('mongoose')
const env = require('dotenv').config()
const WorkOutRouter = require('./router/Workout')
const UserRouter = require('./router/User')
const RefreshToken = require('./router/RefreshToken')
const cors = require('cors')
const cookieParser = require('cookie-parser')




    

app.use(express.json());
app.use(cors({origin:true,credentials: true} ))
app.use(cookieParser());  

mongoose.connect(process.env.Url) 
.then(()=>{
    app.listen(process.env.Port, console.log('connected to DB and localhost running on port 4000'))
    app.use('/', WorkOutRouter)
    app.use('/user', UserRouter)
    app.use('/token', RefreshToken)
   
   
    
    
    
        
        
}).catch((error)=>{
        console.log(error) 
})
