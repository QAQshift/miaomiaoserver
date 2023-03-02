var captcha=require('trek-captcha')
var createVerify = (req,res,next)=>{
  return captcha().then(info=>{
    req.session.verifyImg=info.token
    return info.buffer
  }).catch(()=>{
    return false
  }) 
}
module.exports={
  createVerify
}