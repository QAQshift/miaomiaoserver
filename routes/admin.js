var express = require('express');
var adminController=require('../controllers/admin.js');
var router = express.Router();

router.use((req,res,next)=>{
  if(req.session.username && req.session.isAdmin){
    next()
  }else{
    res.send({
      msg:'没有管理权限',
      status:-1
    })
  }
})
/* GET users listing. */
router.get('/', adminController.index);
router.get('/usersList',adminController.usersList)
router.post('/updateFreeze',adminController.updateFreeze)
router.post('/userDelete',adminController.userDelete)
module.exports = router;