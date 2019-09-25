import Vue from 'vue';
const vue = new Vue();

// 普通邀请注册
export const registByCode_api = (data) => {
    return vue.$axios({
        url: '/user/login/registByCode',
        method: 'post',
        data,
    })
}
// 有图形验证码的短信
export const sendMobileCode = (data) => {
    let dateTime = +new Date();
    return vue.$axios({
        url: `user/login/sendMessage?time=${dateTime}`,
        method: 'post',
        data,
    })
}
// 登录
export const loginByPhone = (data) => {
    return vue.$axios({
        url: "/user/login/loginByPhone",
        method: 'post',
        data,
    })
}