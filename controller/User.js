    const express = require('express');
    const app = express();
    const Bycrypt = require('bcrypt');
    const User = require('../database/User');
    const WorkOut = require('../database/Workout');
    const Session = require('../database/Session');
    const RefreshToken = require('../database/RefreshToken');
    const Token = require('./RefreshToken');
    const jwt = require('jsonwebtoken');
    const nodemailer = require("nodemailer");
    const env = require('dotenv').config();
    
    
    


exports.GetUsers = async(req,res,next) =>{
    try{
        const user = await User.find({});
           return (user.length>=1)?
            res.status(200).json(user):
            (user.length==0)? 
            res.status(200).json("No user in DB"):
            (!user)?
            res.status(400).json("An error occur"):
            res.status(400).json("This is an exceptional erroz`r")
    }
    catch(err){
       res.status(400).json(err)
    }
}
exports.GetOneUser = async(req,res,next) =>{
    try{
        const {id} = req.params 
const user = User.findById(id, function(err,result){
    if(err){
        res.status(400).json(err);
    }
    if(null){ 
        res.status(400).json('No item in database')
    }
    res.status(200).json(result);
})
    }
    catch(err){
        console.log(err)
    }
}
exports.CreateUser = async(req, res, next) =>{
    const { email,password } = req.body;
    const saltRounds = 10;
        User.findOne({email:email},
            function(err,res){
                if(err){
                    
                }
            })
     const encrypt = await Bycrypt.hash(password, saltRounds, 
       async function(err, hash) {
        if(err){
            res.status(400).json("an error occur"+ err)
        }
         else{ 
            try{
        const { username,workout} = req.body 
                // const testAccount = await nodemailer.createTestAccount()
                // const Transporter = nodemailer.createTransport({
                //     host: "smtp.ethereal.email",
                //     port: 587,
                //     secure: false, // true for 465, false for other ports
                //     auth: {
                //       user: udehnanakumo@gmail.com, // generated ethereal user
                //       pass: 'jtjyrocswyzageds', // generated ethereal password
                //     },
                // })  
                // let info = await Transporter.sendMail({
                //     from: '"Fred Foo 👻" <ebinan10@gmail.com>', // sender address
                //     to: `${email}, baz@example.com `, // list of receivers
                //     subject: "Hello ✔", // Subject line
                //     text: "Hello world?", // plain text body
                //     html: "<b>Hello world?</b>", // html body 
                //   });
                //   console.log("Message sent: %s", info.messageId);
                //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  
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
                    subject: 'Account created',
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
        console.log(""+hash)
            const user = await User.create({
                email:email,
                username:username, 
                password:hash
            })
            res.status(200).json(user)
    }
    catch(err){
        res.status(400).json("an error just occur" + err)
    }           
    }
    }); 
   
}

exports.Login = async (req,res,next) =>{
        const { email, username, password} = req.body
        
        console.log("the result is coming out good")
        const user = User.findOne({email:email},
            function(err,result){
                if(err){
                    console.log(err)
                    res.status(400).json(err)
                }else{

                if(result==null){
                    res.status(400).json('Invalid user or password')
                    
                }
                
                else{
                    const {_id,email,username} = result
                    const isLogin = true
              Bycrypt.compare( password, result.password,
                  async function(err,output){
                        if(err){
                            res.status(400).json(err)
                        }else{
                           if (output) {
                            
                         
                            const {_id,email,username} = result;
                            let data = {_id,email,username};
                            const accessToken = Token.createAccessToken(data);

                            const refreshToken = Token.createRefreshToken(data);
                            const token = await RefreshToken.find()
                            let cookie =req.cookies.token 
                            if(token.length > 0){
                                res.status(200).json(accessToken)
                            }
                            else{
                                const refreshDb =   await RefreshToken.create({refreshtoken:refreshToken});
                               cookie = accessToken;
                                res.status(200).json(refreshDb);

                                next()
                            }
                             
                            
                            
                            
                            
                           }
                           else{
                            res.status(403).json('invalid email or password')
                        } 
                    }
                       
                    }
                   
                    )
                    
                
                } }
            })
}
exports.updateUserPassword = async(req, res, next) =>{
        try{
            const {id} = req.params
            const {password} = req.body
            const user = await User.findOne({_id:id});
            // console.log(user);
            Bycrypt.compare(password, user.password,
                async function(err,output){
                if(err){
                    res.status(403).json(err)
                }
                else{
                    console.log(output)
                    if(output===true){
                        const saltRounds = 10;
                       
                        Bycrypt.hash(req.body.password, saltRounds,
                            function(err,hash){
                                if(err){
                                    res.status(403).json(err)
                                }
                                else{
                            User.findOneAndUpdate({_id:id},
                       {password:hash},{ new: true,
                            runValidators: true,
                            context: 'query'},
                        function(err,data){
                            if(err){
                                res.status(403).json(err)
                            }
                            console.log(data)
                            res.status(200).json(data)
                        }
                        )
                                }
                            })
              }}}) 
                
                 
        }
        catch(err){
            res.status(403).json(err)
        }
}

exports.updateUserDetail = async(req, res, next) =>{
    try{
        const {id} = req.params
        const {password} = req.body
        
                    User.findOneAndUpdate({_id:id},
                   req.body,{ new: true,
                        runValidators: true,
                        context: 'query'},
                    function(err,data){
                        if(err){
                            res.status(403).json(err)
                        }
                        const {username,email} =data
                        console.log(data)
                        res.status(200).json({username,email})
                    }
                    )
                            }
    catch(err){
        res.status(403).json(err)
    }
}
        