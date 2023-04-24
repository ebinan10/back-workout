const WorkOut = require('../database/workout')
const User = require('../database/user');
const jwt = require('jsonwebtoken')
const env = require('dotenv')
const mongoose = require('mongoose')
   
exports.GetWorkOut = async(req,res,next) => {
    try {
    const workout = await WorkOut.find({});
    res.status(200).json(workout)
    } 
    catch(err){
        res.status(401).json('an error occured' + err)
    }
}

exports.GetEachWorkOut = async(req,res,next) => {
    try {
        const {id} = req.params
    const workout = await WorkOut.findById({_id:id}).clone()
        .exec(
        function (err, docs) {
            if (err || null){
                res.status(400).json("an error occured" + err)
            }
            else{
                console.log(docs);
                res.status(200).json(docs)
            } 
        }
        );             
    
    
    }
    catch(err){
        res.status(400).json("an error occured" + err)
    } 
}


exports.CreateWorkOut = async (req,res,next) => { 
    const {title,reps,load, userId } = req.body
     console.log(userId) 
    try{
      
     await WorkOut.findOne({title:title})
     .exec(async function(err,respond){
            if (err){
                res.status(403).json(err);
            }
            else{
               let user = await User.findOne({id:userId})
                if(!respond){
                   const workout = await WorkOut.create({title:title,reps:reps,load:load,userId:userId})
                  
                        res.status(200).json(workout)

                }else{ 
                    res.status(403).json('Title already exist')
                }
            }
     })

   } 
   catch(err){
       res.status(403).json(err)
   }
   
}

exports.DeleteWorkOut = async (req, res, next)=>{
    try{
        const {id} = req.params
  const workOut = await WorkOut.deleteOne({_id:id})
    res.status(200).json("deleted")
      
    }
    catch(err){
        res.status(403).json(err)
    }

}

exports.UpdateWorkOut = async (req,res,next) => { 
    try{
        const {id} = req.params
        const workout = await WorkOut.find({id:id}).exec(async function(err, result){
            if(err){
                res.status(403).json(err)
            }
            else{
                if(result !== null){
                
                const workOut = await WorkOut.findByIdAndUpdate( id, 
                    req.body,{ new: true,
                     runValidators: true,
                     context: 'query'} 
               ) 
               if(workOut==null){
                res.status(403).json("workout does not exist")
               }else{
                res.status(200).json(workOut);
               }
            console.log(workOut);
             }
             else{
                res.status(403).json("workout does not exist")
             }
            
            }
            })
        
                
             }  
       
  
    catch(err){
        res.status(403).json(err)
    }
     
}


exports.GetUserWorkOut = async (req,res,next) =>{
    try{ 
    const id = req.params;
    
     await WorkOut.find({userId:mongoose.Types.ObjectId(id)})
     .exec(
      function(err,respond){

                        if(err){
        res.status(403).json("an error may have occur or norespond")
                        }
                        else{
                            
                            res.status(200).json(respond)
                            
                        }
    })
        
}
catch(err){
            res.status(403).json(err)
}
}