import Vue from 'vue';
const vue = new Vue();
// 获取邀请码，号码
export const getInvitationNum = (data) => {
    return vue.$axios({
        url: `/user/invit/getInvitCode?userId=${data}`,
        method: 'get',
    })
}
// 邀请，成为邀请人
export const getinvitPeople = (data) => {
    return vue.$axios({
        url: '/user/invit/setUserExt',
        method: 'post',
        params: data
    })
}
//获取邀请人的详细信息
export const getInvitationinfo = (data, coin) => {
    return vue.$axios({
        url: `/user/invit/getExtUser?userId=${data}&coin=${coin}`,
        method: 'get',
    })
}

//获取海报
export const getInvitPoster = (data) => {
    return vue.$axios({
        url: `/user/invit/getPoster`,
        method: 'get',
        params: data
    })
}
//获取团队总人数
export const inviteTeamCount = () => {
    return vue.$axios({
        url: `/wi/invite/team/children-count`,
        method: 'get',
        baseURL: vue.$interfaceTransfer,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        withCredentials: false
    })
}

// 新邀请列表
export const inviteList = (data) => {
    return vue.$axios({
        url: `/wi/invite/team/list`,
        method: 'get',
        params:data,
        baseURL: vue.$interfaceTransfer,
        headers: { 'PHPSESSID': sessionStorage.getItem('sessionId') },
        withCredentials: false
    })
}