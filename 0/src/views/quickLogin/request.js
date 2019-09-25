import Vue from 'vue';
const vue = new Vue();

/* 
获取手机验证码
参数{
    mobile: "15111111111"
    moblepre: "+86"
    time: 1565837201354
	picCode:图形验证码
	type:1注册 2 用户存在
}
*/
export const getCodePhone = (data) => {
    return vue.$axios({
        url: '/user/login/sendMessage',
        method: 'post',
        data,
        withCredentials: false
    })
}

// 手机快捷登录
export const logoReauestSpeedy = (data) => {
    return vue.$axios({
        url: '/user/login/loginByPhone',
        method: 'post',
        data,
        withCredentials: false
    })
}

// 新 发送验证码
export const sendCodeMess = (data) => {
    return vue.$axios({
        url: '/user/login/setPwdMsg?userId='+data,
        method: 'get',
        withCredentials: false
    })
}

// 新 设置密码 修改
export const settingPass = (data) => {
    return vue.$axios({
        url: '/user/updLoginPwd',
        method: 'post',
        data,
        withCredentials: false
    })
}

/* 
通过邮箱注册
接口地址："/user/login/registerByEmail"
参数：
{
	emailCode:邮箱验证码
	email:邮箱
	invit：邀请码
}
*/
export const emailRegister = (data) => {
    return vue.$axios({
        url: '/user/login/registerByEmail',
        method: 'post',
        data,
        withCredentials: false
    })
}
export const registerByPhone = (data) => {
    return vue.$axios({
        url: '/user/login/registerByPhone',
        method: 'post',
        data,
        withCredentials: false
    })
}

// 邮箱注册
export const sendEmailPic = (data) => {
    return vue.$axios({
        url: '/user/login/sendEmailPic',
        method: 'post',
        data,
        withCredentials: false
    })
}

/* 
通过密码登录
接口地址："/user/login/loginByEmail"
参数：
{
	mobile：手机号
	password：密码
	type： 1通过手机号登陆 2通过邮箱登陆 1通过手机号登陆 2通过邮箱登陆
}
001 时间过期 002 密码未设置 003 密码错误  用户不存在
*/
export const passwordLogoNew = (data) => {
    return vue.$axios({
        url: '/user/login/loginByEmail',
        method: 'post',
        data,
        withCredentials: false
    })
}
// 发送验证码 邮箱
// type 0 密码登录  1 注册 2忘记密码
export const sendVerifyCode = (data) => {
    return vue.$axios({
        url: '/user/login/sendEmailPic',
        method: 'post',
        data,
        withCredentials: false
    })
}
// 发送验证码 手机
export const sendMessagePicAjax = (data) => {
    return vue.$axios({
        url: '/user/login/sendMessagePic',
        method: 'post',
        data,
        withCredentials: false
    })
}
// 忘记密码修改密码
export const remmberPassEndAjax = (data) => {
    return vue.$axios({
        url: '/user/login/forgetPass',
        method: 'post',
        data,
        withCredentials: false
    })
}