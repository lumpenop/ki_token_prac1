require('dotenv').config();
const crypto = require('crypto');
const env = process.env;

// JWT 토큰 생성 -> header.payload.signature
function createToken(userid){
    let header = {
        'tpy':'JWT',
        'alg':'HS256',
    }
    let exp = new Date().getTime() + ((60*60*2) *1000) // 1970.01.01 -> 0, // 1970.01.01 1초 -> 1000
                                // 현재시간 + 2시간
    let payload = {
        userid,
        exp,
    }
    const encodingHeader = Buffer.from(JSON.stringify(header))
                                            .toString('base64')
                                            .replace(/=/g,'');
    const encodingPayload = Buffer.from(JSON.stringify(payload))
                                            .toString('base64')
                                            .replace(/=/g,'');    
    const signature = crypto.createHmac(
        'sha256',
        Buffer.from(env.salt)).update(
            encodingHeader+'.'+encodingPayload
        )
        .digest('base64')
        .replace(/=/g,'')  
    let jwt =  `${encodingHeader}.${encodingPayload}.${signature}`;

    return jwt;                                 
}

let token = createToken('root');

module.exports = createToken;