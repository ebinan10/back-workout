const jwt = require('jsonwebtoken');
const env = require('dotenv');
const User = require('../database/User')


exports.createRefreshtoken  = (user) =>{
    const token = jwt.sign({id:user._id,username:user.username}, process.env.Secret_Key,{expiresIn:60*60})
    return token;
} 

  exports.createAccesstoken =(user)=>{
       const token =   jwt.sign({id:user._id,username:user.username}, process.env.Secret_Key,{expiresIn:60*5})
    return token; 
}
 
exports.VerifyAccessToken =(req, res, next)=>{ 
    
    const Bearer = req.headers.authorization;
    const token = Bearer?.split(' ')[1];
   
    if (typeof Bearer !== undefined){
       jwt.verify(token, process.env.Secret_Key,
        function(err,decoded) {
            if(err){
               
                res.status(401).json('You are not authenticated')
                }
                else{
                req.userid =decoded.id
                next();   
                
        }
             
            }
       ) 
        
    }
    else{
        res.status(401).json("you are not authenticaticated")
    }
}
exports.createNewAccesstoken = async (req, res, next) =>{
    const refreshToken = req.cookies.token;
    console.log(refreshToken)
    const decod =  jwt.decode(refreshToken, process.env.Secret_Key);
    let user
    let username,_id, email
    if(decod){ 
        const {id} = decod
        _id = id
        user = await User.findById(id) 
    username =user.username
    email = user.email
    const isLogin = true;
    if(refreshToken === undefined || refreshToken === null){

        res.status(401).json('you have to login in again')
        return;
    } 
    else{
    jwt.verify(refreshToken, process.env.Secret_Key,
       async function(err, decode) {
            if( err?.message ==="jwt expired")
                {     
                    res.status(401).json("jwt expired")
                }  
               else {
                    const newAccessToken = jwt.sign({id:decod.id,username:decod.username}, process.env.Secret_Key,{expiresIn:60})
                    res.status(200).json( {newAccessToken,username,_id,isLogin, email} )
                    next();
                } }   
            )
    }
    }else{
        res.status(401).json('this is an error')
    } 
   
}
  
  
exports.Logout = (req, res, next) =>{
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json('you are logout')
    
        }
        
    
   
