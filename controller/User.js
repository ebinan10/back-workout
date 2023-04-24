    const express = require('express');
    const app = express()
    const Bycrypt = require('bcrypt');
    const User = require('../database/user')
    const WorkOut = require('../database/workout')
    const Session = require('../database/session');
    const Refreshtoken =require('./RefreshToken')
    const nodemailer = require("nodemailer");
    const crypto = require('crypto')
    
    
    


exports.GetUsers = async(req,res,next) =>{
    try{
        const user = await User.find({});
           return (user.length>=1)?
            res.status(200).json(user):
            (user.length==0)? 
            res.status(200).json("No user in DB"):
            (!user)?
            res.status(403).json("An error occur"):
            res.status(403).json("This is an exceptional erroz")
    }
    catch(err){
       res.status(403).json(err)
    }
}
exports.GetOneUser = async(req,res,next) =>{
    try{
        const {id} = req.params
const user = await User.findById(id, function(err,result){
    if(err){
        res.status(403).json(err);
    }
    else if(null){ 
        res.status(403).json('No item in database')
    }
    else if(result){
    const {email, username} = result
    const output = {email,username}
    res.status(200).json(output);
    }
}).clone() 
    } 
    catch(err){ 
        console.log(err)
    }
}
exports.CreateUser = async(req, res, next) =>{
    const { email,password } = req.body;
    const saltRounds = 10;
       const users = await User.findOne({email:email})
            
                if(users){
                  res.status(200).json('Another account is linked to this email' )
                }
                else if(res !== null){
                 
       const encrypt = await Bycrypt.hash(password, saltRounds, 
       async function(err, hash) {
        if(err){
            res.status(403).json("an error occur"+ err)
        }
         else{ 
            try{
        const { username,workout} = req.body 
               
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'udehnanakumo',
                      pass: 'jtjyrocswyzageds'
                    }
                  });
                  
                  var mailOptions = {
                    from: 'udehnanakumo@gmail.com',
                    to: `${email}`,
                    subject: 'Workout Account created',
                    text: `Your workout account has been created successfully, 
                    please follow the link below to activate your account!`
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
            const user = await User.create({
                email:email,
                username:username, 
                password:hash
            })
            res.status(200).json(user)
    }
    catch(err){
        res.status(403).json("an error just occur" + err)
    }           
    }
    }); 
  }
}



exports.Login = async (req,res,next) =>{
        const { email,  password} = req.body
        
        
         User.findOne({email:email},
            function(err,result){
                if(err){
                    console.log(err)
                    res.status(401).json("Invalid user or password")
                }else{

                if(result==null){
                    res.status(401).json('Invalid user or password')
                    
                }
                
                else{
                    // console.log(result)
                    const {_id,email,username} = result
                    // const isLogin = true
              Bycrypt.compare( password, result.password,
                  async function(err,output){
                        if(err){
                            res.status(401).json("Invalid user or password")
                        }else{try{
                           if (output==true) {
                            
                            const {...password} = result;
                            
                          const RefreshToken = Refreshtoken.createRefreshtoken(result);
                          const AccessToken = Refreshtoken.createAccesstoken(result)
                          const data ={ id: _id, email: email, isLogin: true, username: username, accessToken: AccessToken};
                                console.log(AccessToken)
                                console.log(data)
                                
                                res.cookie("token", RefreshToken, {httpOnly: true})
                                
                                  console.log("req.cookies.token",req.cookies.token);
                                  var transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    auth: {
                                      user: 'udehnanakumo',
                                      pass: 'jtjyrocswyzageds'
                                    }
                                  });
                                  
                                  var mailOptions = {
                                    from: 'no_reply@workout.com',
                                    to: `${email}`,
                                    subject: 'Workout Login Confirmation',
                                    text: `Login Notification`
                                  };
                                  
                                  transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      console.log('Email sent: ' + info.response);
                                    }
                                  });
                            res.status(200).json(data);
                                next()
                           }
                           else{
                            res.status(401).json("Invalid user or password")
                        } }catch(err){
                            console.log(err)
                        }
                    }
                       
                    }
                   
                    )
                    
                
                } }
            }).clone().exec()
}

exports.SendPasswordToken = async(req, res, next)=>{
    crypto.randomBytes(32,async(err,buffer)=>{
        if(err){
            res.status(401).json("unable to create token")
        }
        const token = buffer.toString('hex')
        const {email} = req.body
       let update = {resetToken: token,
        resetTokenExpiration: Date.now() + 3600000}
      const user = await User.findOneAndUpdate({email:email},
        update
            ,{new:true}
       )
       User.findOne({email:email},
            function(err,user){
                if(null){
                    res.status(401).json('user does not exist')
                }
                else if(err){
                    console.log('an error occured')
                }
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'udehnanakumo',
                      pass: 'jtjyrocswyzageds'
                    }
                  });
                  
                  var mailOptions = {
                    from: 'no_reply@workout.com',
                    to: `${email}`,
                    subject: 'Workout Reset Password',
                    html: `
                    <h3>Reset Password</h3>
                    <p>Please click on the link to reset <a href="http:localhost:3000/password/${token}">Password</a></p>`
                  }; 
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      res.status(200).json('Email was not sent at this time due to system error ' );
                    }
                  });
            
            })
            
       
        res.status(200).json("check your email")
    })
}

exports.updateUserPassword = async(req, res, next) =>{
        try{
            const saltRounds = 10;
            const {token} = req.params
            const {password} = req.body
          Bycrypt.hash(password, saltRounds, 
                async function(err, hash) {
                 if(err){
                     res.status(401).json("an error occur"+ err)
                 }
                 const user = await User.findOneAndUpdate({resetToken:token, resetTokenExpiration:{$gt:Date.now()}},
                 { password:hash,
                    resetToken:null,
                    resetTokenExpiration:null},
                  {new:true});
                    if(user){
                res.status(200).json('password successfully updated')
             }    
             
                })
                
            }
        catch(err){
            console.log(err);
            res.status(403).json(err)
        }
}

exports.updateUserDetail = async(req, res, next) =>{
    try{
        const {id} = req.params
        
                    User.findOneAndUpdate({_id:id},
                   req.body,{ new: true,
                        runValidators: true,
                        context: 'query'},
                    function(err,data){
                        if(err){
                            res.status(403).json(err)
                        }
                        res.status(200).json(data)
                    }
                    )
                            }
    catch(err){
        res.status(403).json(err)
    }
}
