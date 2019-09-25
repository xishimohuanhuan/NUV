import Vue from 'vue'
import * as qiniu from 'qiniu-js'

const vue = new Vue();

const config = {
    useCdnDomain: true,
};
const putExtra = {
    fname: "",
    params: {},
    mimeType: null
}

// 获取上传图片token
const getToken = () => {
    return vue.$axios({
        url: '/user/uploadToken',
        method: 'get',
    })
}

//上传图片到七牛云
export const uploadQiniu = (file) => {
    return getToken()
    .then( res => {
        if(res.status === 200) return res.data.data
    }).then( token => {
        return qiniu.upload(file, null, token, putExtra, config)
    })
}

// 获取上传视频token
export const getVideoToken = () => {
    return vue.$axios({
        url: '/user/uploadToken/new',
        method: 'get',
        withCredentials: false
    })
}
//上传视频到七牛云
export const uploadQiniuVideo = (file) => {
    return getVideoToken()
    .then( res => {
        if(res.status === 200) return res.data.data
    }).then( token => {
        return qiniu.upload(file, null, token, putExtra, config)
    })
}