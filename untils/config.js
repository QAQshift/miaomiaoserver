var mongoose = require('mongoose')
var nodemailer = require('nodemailer')

var Mongoose = {
  url: 'mongodb://localhost:27017/miaomiao',
  connect() {
    mongoose.connect(this.url, {
      useNewUrlParser: true, useUnifiedTopology:
        true, useUnifiedTopology: true
    }).then(res => {
      console.log("数据库链接成功")
    }).catch(err => {
      console.log("数据库链接失败")
    })
  }
}

var Email = {
  config: {
    host: "smtp.qq.com",
    port: 587,
    auth: {
      user: '1836388557@qq.com', // generated ethereal user
      pass: 'etmyyakqhrlhccab', // generated ethereal password
    },
  },
  get transporter(){
    return nodemailer.createTransport(this.config)
  },
  get verify(){
    return Math.random().toString().substring(2,6)
  },
  get time(){
    return Date.now()
  }

}

var Head ={
  baseUrl:'http://localhost:3000/uploads/'
}
module.exports = {
  Mongoose,
  Email,
  Head
}