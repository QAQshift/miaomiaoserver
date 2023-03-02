var { Email,Head } = require('../untils/config.js')
var UserModel = require('../models/users.js')
var {createVerify} =require('../untils/base.js')
var fs = require('fs')
var url =require('url')


var login = async (req, res, next) => {
  var { username, password,verifyImg } = req.body
  if(verifyImg!==req.session.verifyImg){
    res.send({
      msg:'验证码错误',
      status:-3
    })
    return
  }

  var result = await UserModel.findLogin({
    username,
    password
  })

  if (result) {
    req.session.username=username
    req.session.isAdmin=result.isAdmin
    req.session.userHead =result.userHead
    if(result.isFreeze){
      res.send({
        msg: '账号已经冻结',
        status: -2
      })
    }else{
      res.send({
        msg: '登录成功',
        status: 0
      })
    }
    
  } else {
    res.send({
      msg: '登录失败',
      status: -1
    })
  }
};

var register = async (req, res, next) => {
  var { username, password, email, verify } = req.body
  console.log(req.session.verify)
  console.log(req.session.email)
  if (email !== req.session.email || verify !== req.session.verify) {
    res.send({
      msg: "验证码错误",
      status: -1,
      email: email,
      verify: verify
    })
    return
  }

  if((Email.time-req.session.time)/1000>60){
    res.send({
      msg:'验证码已过期',
      status:-3
    })
    return
  }

  var result = await UserModel.save({
    username,
    password,
    email
  })

  if (result) {
    res.send({
      msg: '注册成功',
      status: 0
    })
  } else {
    res.send({
      msg: '注册失败',
      status: -2
    })
  }
};

var verify = async (req, res, next) => {
  var email = req.query.email;
  var verify = Email.verify;

  req.session.verify = verify
  req.session.email = email
  req.session.time =Email.time
  // console.log('verify')
  // console.log(verify)
  // console.log('req.session.verify:'+req.session.verify)
  // console.log('req.session.email:'+req.session.email)

  var mailOptions = {
    from: '喵喵 <1836388557@qq.com>', // sender address
    to: email, // list of receivers
    subject: "喵喵邮箱验证码", // Subject line
    text: "验证码：" + verify, // plain text body
  }

  Email.transporter.sendMail(mailOptions, err => {
    if (err) {
      res.send({
        msg: '验证码发送失败',
        status: -1
      })
      console.log(err)
    } else {
      res.send({
        msg: '验证码发送成功',
        status: 0
      })
    }
  })


};

var logout = async (req, res, next) => {
  req.session.username=''
  res.send({
    msg:'退出成功',
    status:0
  })
};

var getUser = async (req, res, next) => {
  if(req.session.username){
    res.send({
      msg:'获取用户信息成功',
      status:0,
      data:{
        username:req.session.username,
        isAdmin:req.session.isAdmin,
        userHead:req.session.userHead
      }
    })
  }else{
    res.send({
      msg:'获取用户信息失败',
      status:-1
    })
  }
};

var findPassword = async (req, res, next) => {
  var {email,password,verify}=req.body
  // console.log('findPassword')
  // console.log('req.session.verify:'+req.session.verify)
  // console.log('req.session.email:'+req.session.email)
  if(email === req.session.email && verify === req.session.verify){
    if((Email.time-req.session.time)/1000>60){
      res.send({
        msg:'验证码已过期',
        status:-3
      })
      return
    }
    var result=await UserModel.updatePassword(email,password)
    if(result){
      res.send({
        msg:'密码修改成功',
        status:0
      })
    }else{
      res.send({
        msg:'修改密码失败',
        status:-1
      })
    }
  }else{
    res.send({
      msg:'验证码错误',
      status:-2
    })
  }
};

var verifyImg =async (req,res,next)=>{
  var result =await createVerify(req,res)
  if(result){
    res.send(result)
  }
}

var uploadUserHead =async (req,res,next)=>{
  //  console.log(req.file)
  //  console.log(req.session.username)
  await fs.rename('public/uploads/'+req.file.filename,'public/uploads/'+req.session.username+'.jpg',function(){
  })
  var result =await UserModel.updateUserHead(req.session.username,url.resolve(Head.baseUrl,req.session.username)+".jpg")
  if(result){
    res.send({
      msg:"头像修改成功",
      status:0,
      data:{
        userHead:url.resolve(Head.baseUrl,req.session.username)+".jpg"
      }
    })
  }else{
    res.send({
      msg:"头像修改失败",
      status:-1
    })
  }
}
module.exports = {
  login,
  register,
  verify,
  logout,
  getUser,
  findPassword,
  verifyImg,
  uploadUserHead
}