const jwt = require('jsonwebtoken');
const env = require('dotenv');
const RefreshToken = require('../database/RefreshToken');
const User = require('../database/User');
let token

exports.createAccessToken = (user) =>{
    return  jwt.sign(user, process.env.Secret_Key,{ expiresIn: '1m' })
      
  }

  exports.createRefreshToken = (user) =>{
    return jwt.sign(user.email, process.env.Secret_Key)
   }

const createRefreshToken = (user) =>{
        return jwt.sign(user.id, process.env.Secret_Key)
       }
    


const createAccessToken = (user) =>{
         return  jwt.sign(user, process.env.Secret_Key,{ expiresIn: '1m' })
           
       }

 const CheckToken = async(token) =>{
    try{
        console.log(token)
        const decod = jwt.decode(token)
                if(decod.exp < Date.now){
                console.log(token)
            if(token){
                jwt.verify(token, process.env.Secret_Key,
                    function(err,data){
                        if(err){
                              console.log('error occured')
                        }else{
                            return;
                        }  
                    })
            }
            else{
                let refresh = await RefreshToken.find();
        refresh = refresh[0];
        const decode = refresh.refreshtoken
        const decod = jwt.decode(decode)
        const user = User.find({email:decod})
        const {_id,email,username} = user
        const data = {_id, email, username}
         token = createAccessToken(data); 
         jwt.verify(token, process.env.Secret_Key,
            function(err,data){
                if(err){
                    console.log('error occured')
                }else{
                    return;
                }
            })   
        }}else{
                let refresh = await RefreshToken.find();
        refresh = refresh[0];
        const decode = refresh.refreshtoken
        const decod = jwt.decode(decode)
        const user = User.find({email:decod})
        const {_id,email,username} = user
        const data = {_id, email, username}
         token = createAccessToken(data); 
         jwt.verify(token, process.env.Secret_Key,
            function(err,data){
                if(err){
                    console.log('error occured')
                }else{
                    return;
                }
        })
    }}
        catch(err){
                console.log(err)
        }
    
    }

const VerifyToken = async(req, res, next) =>{
    try{
            const token = req.cookies.token
        if(token){
            jwt.verify(token, process.env.Secret_Key,
                function(err,user){
                    if (err){
                    res.status(403).json(err)
                    }
                    else{
                        req.user = user;
                        console.log(req.user)
                        next()
                    }
                })
        }
        else{
            // res.status(401).json('you are not authenticated');
           token = await RefreshToken.find()
                if(token){
                }
        }
    }
    catch(err){
            console.log(err)
    }
 
}

exports.Refreshtoken = async( req, res, next )=>{
    try{
            // const token = req.cookies.token;
            let refresh = await RefreshToken.find();
            
            refresh = refresh[0]
            // console.log(refresh);
            const decode = refresh.refreshtoken;
    
    if(decode ){
        let refresh = await RefreshToken.find();
        refresh = refresh[0];
        const decod = jwt.decode(decode)
        const user = User.find({email:decod})
        const {_id,email,username} = user
        const data = {_id, email, username}
         req.cookies.token = createAccessToken(data);
        CheckToken(req.cookies.token)
        next();
        
    }
    else{
        res.status(403).json('please log in ')
    }
    }
    catch(err){
        console.log(err)
    }
}