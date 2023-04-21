const Session = require('../database/Session')

exports.session = async(req, res, next) =>{
       try{ 
          const id = req.session._id;
          
        const session =  req.session
        
        res.status(200).json(session);
       } 
       catch(err){
          console.log(err)
            res.status(400).json(err);
}}

exports.destroySession = async(req, res, next) =>{
        try{
          // req.session.cookie.expires = new Date().setTime();
            if(req.session){
              req.session.destroy((err)=>{
              if(err){
                next(err)
              }
              else{
                req.session = null
                console.log("logout successful");
              return res.status(200).json('your session is ended, login to access the system')
            }})}
        
        }
        catch(err){

        }
}