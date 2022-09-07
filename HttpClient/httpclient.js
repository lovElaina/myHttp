import inquirer from 'inquirer';
import axios from "axios";
console.log('欢迎使用注册登录系统————客户端');

const questions = [
    {
        type: 'list',
        name: 'options',
        message: '您想要做什么?',
        choices: ['登录', '注册', '找回密码'],
    },
    {
        type: 'input',
        name: 'username',
        message: '请输入用户名?',
        when(answers) {
            return answers.options !== '找回密码';
        },
    },
    {
        type: 'input',
        name: 'password',
        message: '请输入密码?',
        when(answers) {
            return answers.options !== "找回密码";
        },
    },
    {
        type: 'input',
        name: 'findname',
        message: '请输入想找回密码的用户名?',
        when(answers) {
            return answers.options === '找回密码';
        },
    },
    {
        type: 'list',
        name: 'method',
        message: '请选择请求方式?',
        choices: ['GET', 'POST'],
    }
];

inquirer.prompt(questions).then((answers) => {
    console.log('\n您提交的信息:');
    console.log(JSON.stringify(answers, null, '  '))

    //以发送GET请求的方式进行用户登录
    if(answers.options==="登录"&&answers.method==="GET"){
        axios.get('http://localhost:2022/login',{
            params:{
                usr:answers.username,
                psw:answers.password
            }
        }).then((res)=>{
            //console.log(res)
            if(res.data==="login success"){
                console.log("登录成功！")
            }
        }).catch(err=>{
            if(err.response.data==="username or password error"){
                console.log("登录失败，用户名或密码错误！")
            }
        })
    }

    //以发送POST请求的方式进行用户登录
    if(answers.options==="登录"&&answers.method==="POST"){
        axios.post('http://localhost:2022/login',`usr=${answers.username}&psw=${answers.password}`).then((res)=>{
            if(res.data==="login success"){
                console.log("登录成功！")
            }
        }).catch(err=>{
            if(err.response.data==="username or password error"){
                console.log("登录失败，用户名或密码错误！")
            }
        })
    }

    //以发送GET请求的方式进行用户注册
    if(answers.options==="注册"&&answers.method==="GET"){
        axios.get('http://localhost:2022/register',{
            params:{
                usr:answers.username,
                psw:answers.password
            }
        }).then((res)=>{
            if(res.data==="success"){
                console.log("注册成功！")
            }
        }).catch(err=>{
            if(err.response.data==="usr or psw empty"){
                console.log("注册失败，用户名或密码不能为空！")
            }
            if(err.response.data==="exist"){
                console.log("注册失败，用户名已被注册！")
            }
        })
    }

    //以发送POST请求的方式进行用户注册
    if(answers.options==="注册"&&answers.method==="POST"){
        axios.post('http://localhost:2022/register',`usr=${answers.username}&psw=${answers.password}`).then((res)=>{
            if(res.data==="success"){
                console.log("注册成功！")
            }
            if(res.data==="exist"){
                console.log("注册失败，用户名已被注册！")
            }
        }).catch(err=>{
            if(err.response.data==="usr or psw empty"){
                console.log("注册失败，用户名或密码不能为空！")
            }
            if(err.response.data==="exist"){
                console.log("注册失败，用户名已被注册！")
            }
        })
    }

    //以发送GET请求的方式找回密码
    if(answers.options==="找回密码"&&answers.method==="GET"){
        axios.get('http://localhost:2022/find',{
            params:{
                usr:answers.findname,
                psw:'null'
            }
        }).then((res)=>{
                var arr = res.data.split(" ")[1];
                console.log("查询成功，该用户名对应密码为: "+arr)
        }).catch(err=>{
            if(err.response.data==="wrong usr"){
                console.log("查询失败，该用户名暂未注册!")
            }
            if(err.response.data==="username empty"){
                console.log("查询失败,输入的用户名为空！")
            }
        })
    }

    //以发送POST请求的方式找回密码
    if(answers.options==="找回密码"&&answers.method==="POST"){
        axios.post('http://localhost:2022/find',`usr=${answers.findname}&psw=null`).then((res)=>{
                var arr = res.data.split(" ")[1];
                console.log("查询成功，该用户名对应密码为: "+arr)
        }).catch(err=>{
            if(err.response.data==="wrong usr"){
                console.log("查询失败，该用户名暂未注册!")
            }
            if(err.response.data==="username empty"){
                console.log("查询失败,输入的用户名为空！")
            }
        })
    }
});

