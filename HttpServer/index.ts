import http from './src/MyHttp';
const data = require('./data.json');
const fs = require('fs');
//创建服务端对象server
const server = http.createServer((req, res) => {
  console.log(req.httpMessage.url)
  //res.setHeader('Content-Type', 'application/json')
  //设置响应文本类型为html
  res.setHeader('Content-Type', 'text/html');
  //以下两行解决了端口号不同时的客户端/服务端跨域传输数据的问题
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  //如果请求行的请求方法为GET，则执行以下代码段：
  if(req.httpMessage.method==="GET"){
    //如果url为"/"或"/favicon.ico"，返回404
    if(req.httpMessage.url!=="/"&&req.httpMessage.url!=="/favicon.ico"){
      //例如http://localhost:2022/login?id=pku&psw=zyc，
      //split函数以传入的"?"为界，划分为左右两部分
      //左边为http://localhost:2022/login，右边为id=pku&psw=zyc
      const originStr = req.httpMessage.url.split("?");
      const leftStr = originStr[0].split("/");
      //operation为左边的最后一项，本例中为login，标识登录操作
      const operation = leftStr[leftStr.length-1];
      const rightStr = originStr[1].split("&");
      //以"="分割，取右侧部分，因此本例中，usr="pku"，psw="zyc"
      const usr = rightStr[0].split("=")[1];
      const psw = rightStr[1].split("=")[1];
      //如果为注册操作，则执行下列代码
      if(operation==="register"){
        //用户名或密码为空
        if(!usr||!psw){
          res.end(403,"forbidden","usr or psw empty");
        }else{
          //JS中，!!的作用：
          // 由于对null与undefined用!操作符时都会产生true的结果，
          // 所以用两个感叹号的作用就在于，
          // 如果明确设置了data[usr]的值（非 null/undefined/0""/等值），自然test就会取跟data[usr]一样的值，
          // 如果没有设置，test就会默认为false，而不是 null或undefined。
          if(!!data[usr]){
            res.end(403,"forbidden","exist"); //表示用户名已经存在
          }else{
            data[usr]=psw; //设置名为usr的键，值为psw，即从客户端传来的密码字符串
            //写入到data.json中，由于本次任务重点在于数据传输而不是数据库设计，因此使用json格式文件做数据库的下位替代
            fs.writeFileSync('data.json',JSON.stringify(data),(err: any)=>{
              if(err){
                console.log(err)
              }
            })
            res.end(200,"ok","success"); //注册成功，返回success
          }
        }
        //下面的代码负责实现登录功能，即匹配客户端传来的用户名与密码是否与服务端数据一致
      }else if(operation==="login"){
        //存在用户名，且传入的密码与服务器端记录的该用户名对应的密码相同
        if(!!data[usr]&&data[usr]===psw){
          res.end(200,"ok","login success");
        }else res.end(403,"forbidden","username or password error");
      }else if(operation==="find"){
        //如果用户名不为空
        if(!!usr){
          //下面的代码负责实现找回密码功能
          if(!!data[usr]){ //如果用户名对应的密码不为null
            res.end(200,"ok","psw "+data[usr]) //返回该用户名对应的密码到客户端
          }else res.end(403,"forbidden","wrong usr"); //查询不到用户名对应的密码，可能输入错误
        }else res.end(403,"forbidden","username empty") //输入的用户名为空

      }
    }else res.end(404,"not found","<h1 style='text-align: center'>system error</h1>"); //即客户端没有传入url，此时返回404

  }

  //如果请求行的请求方法为POST，则执行以下代码段：
  if(req.httpMessage.method==="POST"){
    //如果请求体为空，或url为localhost:2022，则返回404错误
    if(req.httpMessage.body!==""&&req.httpMessage.url!=="/"){
      //例如POST请求的url为http://localhost:2022/login
      const str = req.httpMessage.url.split("/");
      //operation为左边的最后一项，本例中为login，标识登录操作
      const operation = str[str.length-1];
      //在请求体中，用&来分割数据，例如请求体为usr=zyc&psw=8421
      const postStr = req.httpMessage.body.split("&");
      //以"="分割，取右侧部分，因此本例中，usr="pku"，psw="zyc"
      const usr = postStr[0].split("=")[1];
      const psw = postStr[1].split("=")[1];
      //如果为注册操作，则执行下列代码
      if(operation==="register"){
        //用户名或密码为空
        if(!usr||!psw){
          res.end(403,"forbidden","usr or psw empty");  //用户名或密码为空
        }else{
          if(!!data[usr]){
            res.end(403,"forbidden","exist"); //表示用户名已经存在
          }else{
            data[usr]=psw; //设置名为usr的键，值为psw，即从客户端传来的密码字符串
            //写入到data.json中，由于本次任务重点在于数据传输而不是数据库设计，因此使用json格式文件做数据库的下位替代
            fs.writeFileSync('data.json',JSON.stringify(data),(err: any)=>{
              if(err){
                console.log(err)
              }
            })
            res.end(200,"ok","success"); //注册成功，返回success
          }
        }
        //下面的代码负责实现登录功能，即匹配客户端传来的用户名与密码是否与服务端数据一致
      }else if(operation==="login"){
        //存在用户名，且传入的密码与服务器端记录的该用户名对应的密码相同
        if(!!data[usr]&&data[usr]===psw){
          res.end(200,"ok","login success");
        }else res.end(403,"forbidden","username or password error");
      }else if(operation==="find"){
        //如果用户名不为空
        if(!!usr){
          //下面的代码负责实现找回密码功能
          if(!!data[usr]){ //如果用户名对应的密码不为null
            res.end(200,"ok","psw "+data[usr]) //返回该用户名对应的密码到客户端
          }else res.end(403,"forbidden","wrong usr"); //查询不到用户名对应的密码，可能输入错误
        }else res.end(403,"forbidden","username empty") //输入的用户名为空

      }
    }else res.end(404,"not found","<h1 style='text-align: center'>system error</h1>"); //即客户端没有传入url，此时返回404
  }
  });

//监听localhost:2022，只能被本机所访问
server.listen(2022, () => {
  console.log("server is listening in 2022");
});