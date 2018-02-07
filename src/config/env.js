//获取图片地址
const imgurl = 'http://cangdu.org/files/images/';
let baseUrl;

//测试环境
//let imUrl = 'http://kf.huisou.cn';
//let interUrl = 'https://hsshop.huisou.cn';
//线上环境
let imUrl = 'http://hsim.huisou.cn';
let interUrl = 'https://www.huisou.cn';

if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://cangdu.org:8003'
}else{
    baseUrl = 'http://cangdu.org:8003'
}
export {
    baseUrl,
    imgurl,
    imUrl,
    interUrl
}
