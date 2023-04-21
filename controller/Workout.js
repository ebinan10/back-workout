const WorkOut = require('../database/Workout')
const User = require('../database/User');
const { rawListeners } = require('../database/Workout');
const jwt = require('jsonwebtoken')
const env = require('dotenv')
const mongoose = require('mongoose')
   
exports.GetWorkOut = async(req,res,next) => {
    try {
    const workout = await WorkOut.find({});
    res.status(200).json(workout)
     
    } 
    catch(err){
        console.log(err)
    }
}

exports.GetEachWorkOut = async(req,res,next) => {
    try {
        const {id} = req.params
        console.log(id);
    const workout = await WorkOut.findById({_id:id}).clone()
        .exec(
        function (err, docs) {
            if (err || null){
                console.log("ann error or a null value return");
            }
            else{
                res.status(200).json(docs)
                req.session.workout = docs
            } 
        }
        );             
    
    
    }
    catch(err){
        console.log(err) 
    } 
}

// exports.CreateWorkOut = async (req,res,next) => { 
//      const {title,reps,load,userId} = req.body
     
//      try{
       
//       await WorkOut.findOne({title:title},
//       async function(err, tiTle){
//         if(err){
//             // res.status(400).json(err)
//         }
//      else if(tiTle)
//       {
//         console.log(tiTle)
//         res.status(400).json("The title already exist")
//     }
//     else{
//      const workOut = await WorkOut.create({title:title,reps:reps,
//         load:load,userId:userId})
//      res.status(200).json(workOut)
//      console.log(workOut) 
//         const user = await User.findOne({_id:userId},
//             function(err,result){
//                 if(err)
//                     {
//                         // res.status(400).json(err)
//                     }            
//                     else{
//                         // res.status(200).json(result)
                        
//                     }
//                 }
//             );
//         console.log(workOut._id)
//         console.log(user[0].workout)
//         const update = [...[workOut._id]]
//         await User.findByIdAndUpdate({id:userId},
//         {workout:update}, {new:true}
//         ) 
//     }}) 
//     } 
//     catch(err){
//         res.status(404).json(err)
//     }
    
// }


exports.CreateWorkOut = async (req,res,next) => { 
    const {title,reps,load, userId } = req.body
     console.log(userId) 
    try{
      
     await WorkOut.findOne({title:title})
     .exec(async function(err,respond){
            if (err){
                res.status(400).json(err);
            }
            else{
               let user = await User.findOne({id:userId})
                if(!respond){
                   const workout = await WorkOut.create({title:title,reps:reps,load:load,userId:userId})
                  
                        res.status(200).json(workout)

                }else{ 
                    res.status(400).json('Title already exist')
                }
            }
     })

   } 
   catch(err){
       res.status(404).json(err)
   }
   
}

exports.DeleteWorkOut = async (req, res, next)=>{
    try{
        const {id} = req.params
  const workOut = await WorkOut.deleteOne({_id:id})
    res.status(200).json("deleted")
      console.log(workOut)
      
    }
    catch(err){
        res.status(403).json(err)
    }

}

exports.UpdateWorkOut = async (req,res,next) => { 
    try{
        const {id} = req.params
        console.log(id)
        const workout = await WorkOut.find({id:id}).exec(async function(err, result){
            if(err){
                res.status(400).json(err)
            }
            else{
                if(result !== null){
                
                const workOut = await WorkOut.findByIdAndUpdate( id, 
                    req.body,{ new: true,
                     runValidators: true,
                     context: 'query'} 
               ) 
               if(workOut==null){
                res.status(400).json("workout does not exist")
               }else{
                res.status(200).json(workOut);
               }
            console.log(workOut);
             }
             else{
                res.status(400).json("workout does not exist")
             }
            
            }
            })
        
                
             }  
       
  
    catch(err){
        res.status(400).json(err)
    }
     
}

// exports.UpdateWorkOut = async (req,res,next) => { 
//     try{
//         const {id} = req.params
//                 console.log(id)
//                 const workOut = await WorkOut.findByIdAndUpdate( id, 
//            req.body,{ new: true,
//             runValidators: true,
//             context: 'query'}
//       )
//           res.status(200).json(workOut);
//             console.log(workOut);
            
//              }  
       
  
//     catch(err){
//         res.status(400).json(err)
//     }
     
// }
exports.GetUserWorkOut = async (req,res,next) =>{
    try{ 
    const id = req.params;
    
     await WorkOut.find({userId:mongoose.Types.ObjectId(id)})
     .exec(
      function(err,respond){

                        if(err){
                            console.log(err)
        res.status(400).json("an error may have occur or norespond")
                        }
                        else{
                            
                            res.status(200).json(respond)
                            
                        }
    })
        
}
catch(err){
            res.status(400).json(err)
}
}