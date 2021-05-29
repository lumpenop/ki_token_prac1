require('dotenv').config();
const crypto = require('crypto');
const ctoken = require('../jwt');
const env = process.env;

module.exports = (req, res, next) =>{
    let {AccessToken} = req.cookies;
    if(AccessToken == undefined){
        // res.json({result:false, msg:'로그인이 필요합니다'});

        res.redirect('/?msg=로그인 필요');
    }


    let accessToken = ctoken('root');

    let tokenArr = accessToken.split('.');
    console.log(tokenArr);
    // let header = tokenArr[0];
    // let payload = tokenArr[1];

    let [header, payload, sign] = tokenArr;


    let signature = getSignature(header, payload);
    console.log(signature);
    console.log(sign);

    if(sign == signature){
        console.log('검증된 토큰')
        console.log(JSON.parse(Buffer.from(payload, 'base64').toString()));
        let {userid, exp} = JSON.parse(Buffer.from(payload, 'base64').toString()); // 2번째 인자로 현재 데이터 타입 입력
        console.log(userid);
        console.log(exp); // 생성한 시간부터 두 시간 뒤의 시간을 가지고있음
        let nexp = new Date().getTime();
        if(nexp > exp){
            // res.json({result:false, msg:'토큰 만료'})
            res.clearCookie('AccessToken')
            res.redirect('/?msg=토큰 만료');
        }
        req.userid = userid;
        next();
    }else{
        res.redirect('/?msg=부적절한 토큰입니다');
        // res.json({result:false, msg:'부적절한 토큰입니다'})
        
    }
}

function getSignature(header, payload){
    let signature = crypto.createHmac(
        'sha256',
        Buffer.from(env.salt)).update(
            header+'.'+payload
        )
        .digest('base64')
        .replace(/=/g,'')
    
        return signature;
}