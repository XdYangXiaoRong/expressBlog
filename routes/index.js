var url = require('url');
var express = require('express');
var router = express.Router();
var crypto = require('crypto'),//crypto 是 Node.js 的一个核心模块，我们用它生成散列值来加密密码。
    User = require('../models/user.js'),
    Post = require('../models/post.js');

/**页面权限控制：即注册和登陆页面应该阻止已登陆的用户访问，
 * 登出及后面我们将要实现的发表页只对已登录的用户开放 */
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    console.log("未登录")
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!');
    console.log("已经登录") 
    res.redirect('back');//返回之前的页面
    console.log(9999999999999999999999999999999)
  }
  next();
}
/* GET home page. */
router.get('/', function (req, res) {
  // console.log("66666666666666666",{ 
  //   title: req.session.user,
  //   // user:req.session.user,
  //   user:'34444444444',
  //   success:req.flash('success').toString(),
  //   error:req.flash('error').toString
  // })
  console.log("凉凉")
  var query = url.parse(req.url,true).query;
  var user=null;
  if(query.seepersonalBlog){
    user = req.session.user? req.session.user.name:null;
  }
  Post.get(user, function (err, posts) {
    if (err) {
      posts = [];
    } 
    console.log("post",user)
    return res.render('index', {
      title: '主页',
      user: user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/reg', checkNotLogin);
router.get('/reg', function (req, res) {
  res.render('reg', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/reg', checkNotLogin);
router.post('/reg', function (req, res,next) {
  console.log('reg post',req.body)
  console.log('reg session',req.session)
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['passwordAgin'];
  console.log(name,password,password_re)
  //检查用户两次输入的密码是否一致
  if(password !== password_re){
    req.flash('error','两次输入的密码不一样！')
    console.log('两次输入的密码不一样！')
    // res.render('reg',{toastMessage:'两次输入的密码不一样！'});
    return res.redirect('/reg');//返回注册页
  }
  //生成密码MD5值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
    name:name,
    password:password,
    email:req.body.email
  })
  //检查用户名是否已经存在
  User.get(newUser.name,function(err,user){
    if(err){
      // req.flash("error",err);
      console.log(111,err)
      return res.redirect('/');
    }
    if(user){
      // req.flash('error','用户已经存在@！')
      console.log('用户已经存在@！',user)
      return res.redirect('/reg');//返回注册页
    }else{
      //如果不存在则新增用户
      newUser.save(function(err,user){
        if(err){
          // req.flash('error',err)
          console.log(222,err)
          return res.redirect('/reg');//返回注册页
        }
        // console.log("newUser.save",user)
        req.session.user = newUser;//用户信息存入session
        req.flash('success','注册成功')
        console.log('注册成功')
        return res.redirect('/');//注册成功后返回首页
      })
    }
  })
});

router.get('/login', checkNotLogin);
router.get('/login', function (req, res) {
  res.render('login', { 
    title: '登录',
    user:req.session.user, 
    success:req.flash('success').toString(),
    error:req.flash('error').toString()
  });
});

/**用户登录的功能 */
router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
  //生成密码的md5值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name,function(err,user){
    if(!user){
      req.flash('error','用户不存在！');
      console.log('用户不存在！')
      return res.redirect('login');//用户不存在跳转到登录页
    }
    //检查密码是否一致
    if(user.password!== password){
      req.flash('error','密码错误！');
      console.log('密码错误！')
      return res.redirect('/login');//密码错误则跳转到登录页
    }
    console.log('user',user)
    //用户名，密码都匹配后，将用户信息写入 sssion
    req.session.user = user;
    req.flash('success','登录成功！');
    console.log('登录成功！');
    return res.redirect('/');//登录成功后跳转到主页
  })
});
router.get('/post', checkLogin);
router.get('/post', function (req, res) {
  res.render('post', {
    title: '发表',
    user: req.session.user.name,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/post', checkLogin);
router.post('/post', function (req, res) {
  var currentUser = req.session.user,
      post = new Post(currentUser.name, req.body.title, req.body.post);
  post.save(function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    req.flash('success', '发布成功!');
    console.log("发布成功")
    return res.redirect('/');//发表成功跳转到主页
  });
});

router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {//登出
  req.session.user = null;
  req.flash('success','登出成功！');
  return res.redirect('/');//登出成功后跳转到主页
});

module.exports = router;
