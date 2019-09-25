import Vue from 'vue'
import * as qiniu from 'qiniu-js'

const vue = new Vue();

// 获取上传图片token
const getToken = () => {
    return vue.$axios({
        url: '/user/uploadToken',
        method: 'get',
    })
}

//上传图片到七牛云
export const uploadQiniu = (file) => {
    let config = {
        useCdnDomain: true,
    };
    let putExtra = {
        fname: "",
        params: {},
        mimeType: null
    }
    return getToken()
    .then( res => {
        if(res.status === 200) return res.data.data
    }).then( token => {
        return qiniu.upload(file, null, token, putExtra, config)
    })
}
