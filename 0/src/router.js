import Vue from 'vue'
import Router from 'vue-router'
import transaction from './views/transaction/transaction'; // 合约交易页面
import trade from './views/transaction/trade'; // 合约交易页面
const Home = () => import('./views/home/home.vue'); // 首页
const coinList = () => import('./views/home/coinList.vue'); // 币种列表
const Layout = () => import('./views/layout/layout.vue'); // 底部导航栏
const Contract = () => import('./views/contract/contract.vue'); // 交易首页
const Notice = () => import('./views/notice/notice.vue'); // 通知首页
const webKLine = () => import('./views/webKLine/webKLine.vue'); // 网页版K线
const general = () => import('./views/transaction/general'); // 合约交易概览页面
const holdShares = () => import('./views/transaction/holdShares.vue'); // 合约交易持仓
const profitLoss = () => import('./views/transaction/profitLoss.vue'); // 合约交易持仓
const entrust = () => import('./views/transaction/entrust.vue'); // 合约交易委托
const tradeentrust = () => import('./views/transaction/tradeentrust.vue'); // 合约交易委托
const transactionOrder = () => import('./views/transaction/order.vue'); // 合约交易订单
// const trading = () =>import('./views/transaction/trading.vue') //合约交易
const tradeside = () => import('./views/transaction/tradeside') //快速交易
const transactionHistory = () => import('./views/transaction/history.vue'); // 合约交易历史记录
const transactionMain = () => import('./views/transaction/main'); // 合约交易历史记录
const success = () => import('./views/success/index.vue'); // 成功界面
const article = () => import('./views/details/article/article.vue'); // 文章页面
const quickLogin = () => import('./views/quickLogin/index.vue'); // 快速登录
const phoneLogin = () => import('./views/quickLogin/PhoneLogin.vue'); // 手机登录
const PhoneCode = () => import('./views/quickLogin/PhoneCode.vue'); // 验证码
const PhoneQucik = () => import('./views/quickLogin/PhoneQucik.vue'); // 手机快捷登录
const loginRegister = () => import('./views/quickLogin/register.vue'); // 注册页面
const registCode = () => import('./views/quickLogin/registCode.vue'); // 注册页面
const ChangePassword = () => import('./views/quickLogin/ChangePassword.vue'); // 修改密码
const findPassword = () => import('./views/quickLogin/findPassword.vue'); // 找回密码
const search = () => import('./views/quickLogin/search.vue'); // 国籍搜索
const quickTrans = () => import('./views/quickTransaction/index.vue'); // 一键购买首页
const payment = () => import('./views/payment/index.vue'); // 支付方式列表
const bindingPayment = () => import('./views/payment/bindingPayment.vue'); // 绑定或解绑支付方式
const orderRecord = () => import('./views/payment/orderRecord.vue'); // 订单记录列表
const paydetail = () => import('./views/payment/paydetail.vue'); // 订单记录列表
const orderDetail = () => import('./views/payment/orderDetail.vue'); // 订单详情
// const orderSpeed = () => import('./views/payment/orderSpeed.vue'); // 上传加速支付凭证
const protocol = () => import('./views/quickLogin/protocol.vue'); // 用户协议
const setPassWord = () => import('./views/quickLogin/setPassWord.vue'); // 设置交易密码
const quotationSearch = () => import('./views/quotation/search.vue'); // 行情币种搜索
const setting = () => import('./views/setting/setting.vue');  //设置页面
const playRoule = () => import('./views/setting/playRoule.vue');  //设置页面
const play = () => import('./views/imgshow/play.vue');  //设置页面
const playChildren = () => import('./views/imgshow/playChildren.vue');  //设置页面
const playChildrenT = () => import('./views/imgshow/playChildrenT.vue');  //设置页面
const playChildrenTh = () => import('./views/imgshow/playChildrenTh.vue');  //设置页面
const playChildrenf = () => import('./views/imgshow/playChildrenf.vue');  //设置页面
const orderManage = () => import('./views/setting/orderManage.vue');  //订单管理
const safeSetting = () => import('./views/setting/safeSetting.vue');  //安全设置
const contactService = () => import('./views/setting/contactService.vue');  //联系客服
const systemSetting = () => import('./views/setting/systemSetting.vue');  //系统设置
const community = () => import('./views/setting/community.vue');  //系统设置
const dealPassword = () => import('./views/setting/dealPassword.vue');  //交易密码
const loginPassword = () => import('./views/setting/loginPassword.vue');  //交易密码
const slider = () => import('./views/setting/slider.vue');  //交易密码
const realName = () => import('./views/setting/realName.vue');  //真实姓名
const setLoginPass = () => import('./views/setting/setLoginPass.vue');  //设置登录密码（注册流程）
const emailStatus = () => import('./views/setting/emailStatus.vue');  //邮箱状态
const phoneStatus = () => import('./views/setting/phoneStatus.vue');  //手机状态
const realNameStatus = () => import('./views/setting/realNameStatus.vue');  //真实姓名
const changePhone = () => import('./views/setting/changePhone.vue');  //更改手机号
const bindPhone = () => import('./views/setting/bindPhone.vue');  //更改手机号
const bindEmail = () => import('./views/setting/bindEmail.vue');  //绑定邮箱
const changeEmail = () => import('./views/setting/changeEmail.vue');  //更改邮箱
const invitation = () => import('./views/setting/invitation.vue');  //邀请码
const refunding = () => import('./views/setting/refunding.vue');  //返佣资金
const invitePeople = () => import('./views/setting/invitePeople.vue');  //返佣资金
const notInvitation = () => import('./views/invitation/notInvitation.vue');  //不是经济人的邀请页面
const invitCommission = () => import('./views/setting/invitCommission.vue');  //返佣记录
const invitTransfer = () => import('./views/setting/invitTransfer.vue');  //邀请划转
const invitRecord = () => import('./views/setting/invitRecord.vue');  //邀请划转记录
const invit = () => import('./views/invitation/invit.vue');  //邀请是否成为邀请人
const invitBlank = () => import('./views/setting/invitBlank.vue');  //邀请跳转空白页面
const helpCenter = () => import('./views/setting/help/helpCenter.vue');  //帮助中心
const helpDetail = () => import('./views/setting/help/helpDetail.vue');  //帮助中心，联系我们
const Assets = () => import('./views/assets/index.vue'); // 资产首页
const CurrFinaRecos = () => import('./views/assets/currFinaRecos.vue'); // 币种详情
const SearchCurr = () => import('./views/assets/searchCurr.vue'); // 搜索币种
const Recharge = () => import('./views/assets/recharge.vue'); // 转入首页
const IntoRecord = () => import('./views/assets/intoRecord.vue'); // 转入记录
const OutRecord = () => import('./views/assets/outRecord.vue'); // 转出记录
const WithdrawMoney = () => import('./views/assets/withdrawMoney.vue'); // 转出首页
const Transfer = () => import('./views/assets/transfer.vue'); // 划转首页
const TransferRecord = () => import('./views/assets/transferRecord.vue'); // 划转记录
const AddressList = () => import('./views/assets/addressList.vue'); // 钱包地址列表
const AddAddress = () => import('./views/assets/addAddress.vue'); // 添加钱包地址
const IntoRecDetail = () => import('./views/assets/intoRecDetail.vue'); // 转入订单详情
const outRecDetail = () => import('./views/assets/outRecDetail.vue'); // 转出订单详情
const appDownload = () => import('./views/appDownload/index.vue'); // 浏览器APP下载页
const uploadVoucher = () => import('./views/payment/uploadVoucher.vue'); // 上传支付凭证
const invitaUser = () => import('./views/invitaUser/invitaUser.vue'); // 邀请用户主路由
const invitaLogin = () => import('./views/invitaUser/invitaLogin.vue'); // 邀请用户登录
const invitadownload = () => import('./views/invitaUser/invitadownload.vue'); // 邀请用户下载
const invitaSign = () => import('./views/invitaUser/invitaSign.vue'); // 邀请用户注册


Vue.use(Router)
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/layout',
      name: 'layout',
      component: Layout,
      redirect: { name: 'home' },
      children: [
        {
          path: '/paydetail',
          name: 'paydetail',
          component: paydetail,
        },
        {
          path: '/quickLogin',
          name: 'quickLogin',
          component: quickLogin,
          meta: {
            keepAlive: true
          },
        },
        {
          path: '/protocol',
          name: 'protocol',
          component: protocol,
           meta: {
            keepAlive: true
          },
        },
        {
          path: '/setPassWord',
          name: 'setPassWord',
          component: setPassWord,
           meta: {
            keepAlive: false
          },
        },
        {
          path: '/search',
          name: 'search',
          component: search,
           meta: {
            keepAlive: true
          },
        },
        {
          path: '/findPassword',
          name: 'findPassword',
          component: findPassword,
           meta: {
            keepAlive: false
          },
        },
        {
          path: '/loginRegister',
          name: 'loginRegister',
          component: loginRegister,
          meta: {
            keepAlive: true
          },
        },
        {
          path: '/registCode/:type',
          name: 'registCode',
          component: registCode,
          meta: {
            keepAlive: false
          },
        },
        {
          path: '/ChangePassword/:type',
          name: 'ChangePassword',
          component: ChangePassword,
          meta: {
            keepAlive: false
          },
        },
        {
          path: '/phoneLogin',
          name: 'phoneLogin',
          component: phoneLogin,
          meta: {
            keepAlive: false
          },
        },
        {
          path: '/PhoneCode/:type',
          name: 'PhoneCode',
          component: PhoneCode,
          meta: {
            keepAlive: false
          },
        },
        {
          path: '/PhoneQucik/:type',
          name: 'PhoneQucik',
          component: PhoneQucik,
          meta: {
            keepAlive: false
          },
        },
        {
          path: '/success',
          name: 'success',
          component: success

        },
        {
          path: '/home',
          name: 'home',
          meta: {
              keepAlive: true
          },
          component: Home
        },{
          path: '/coinList/:type',
          name: 'coinList',
          component: coinList
        },{
          path: '/appDownload',
          name: 'appDownload',
          component: appDownload
        },{
          path: '/contract',
          name: 'contract',
          meta: {
              keepAlive: true
          },
          component: Contract
        },{
          path: '/notice',
          name: 'notice',
          component: Notice,
           meta: {
            keepAlive: false
          },
        },{
          path: '/webKLine',
          name: 'webKLine',
          component: webKLine,
           meta: {
            keepAlive: true
          },
        },{
          path: '/trade/:icon',
          name: 'trade',
          component: trade,
          meta: {
            keepAlive: false
          },
          children: [
            {
              path: 'foo',
              name: 'tradefoo',
              redirect: {name: 'tradebuy'}
            },
            {
              path: 'tradesell',
              name: 'tradesell',
              component: tradeside,
            },
            {
              path: 'tradebuy',
              name: 'tradebuy',
              component: tradeside,
            },
            {
              path: 'tradeentrust',
              name: 'tradeentrust',
              component: tradeentrust,
            },
            {
              path: 'history',
              name: 'tradeHistory',
              component: transactionHistory,
            },
            {
              path: 'order',
              name: 'tradeOrder',
              component: transactionOrder,
            },
          ]
        },{
          path: '/transaction/:icon',
          name: 'transaction',
          component: transaction,
          meta: {
            keepAlive: false
          },
          children: [
            {
              path: 'foo',
              name: 'transactionfoo',
              redirect: {name: 'main'}
            },
            {
              path: 'Contract',
              name: 'Contract',
              component: Contract,
            },
            {
              path: 'general',
              name: 'general',
              component: general,
            },
            {
              path: 'holdShares',
              name: 'holdShares',
              component: holdShares,
            },
            {
              path: 'profitLoss',
              name: 'profitLoss',
              component: profitLoss,
            },
            {
              path: 'entrust',
              name: 'entrust',
              component: entrust,
            },
            {
              path: 'order',
              name: 'transactionOrder',
              component: transactionOrder,
            },
            {
              path: 'main',
              name: 'main',
              component: transactionMain,
            },
            {
              path: 'history',
              name: 'transactionHistory',
              component: transactionHistory,
            }
          ]
        },{
          path: '/detail/article/:id',
          name: 'article',
          component: article,
           meta: {
            keepAlive: true
          },
        },{
          path: '/quickTrans/:way',
          name: 'quickTrans',
          component: quickTrans,
        },{
          path: '/payment',
          name: 'payment',
          component: payment
        },{
          path: '/binding/:way',
          name: 'bindingPayment',
          component: bindingPayment
        },{
          path: '/orderRecord',
          name: 'orderRecord',
          component: orderRecord,
        },{
          path: '/orderDetail/:orderId',
          name: 'orderDetail',
          component: orderDetail
        // },{
        //   path: '/orderSpeed/:Id/:cion',
        //   name: 'orderSpeed',
        //   component: orderSpeed
        },{
          path: '/uploadVoucher/:key/:coin/:payway',
          name: 'uploadVoucher',
          component: uploadVoucher
        },{
          path: '/quotation/search',
          name: 'quotationSearch',
          component: quotationSearch
        },{
          path: '/assets',
          name: 'assets',
          component: Assets
        },{
          path: '/assets/:type/currFinaRecos/:curr',
          name: 'currFinaRecos',
          component: CurrFinaRecos
        },{
          path: '/assets/searchCurr/:path/:coin',
          name: 'searchCurr',
          component: SearchCurr
        },{
          path: '/assets/recharge/:key',
          name: 'recharge',
          component: Recharge
        },{
          path: '/assets/intoRecord/:key',
          name: 'intoRecord',
          component: IntoRecord
        },{
          path: '/assets/outRecord/:key',
          name: 'outRecord',
          component: OutRecord
        },{
          path: '/assets/outRecDetail',
          name: 'outRecDetail',
          component: outRecDetail
        },{
          path: '/assets/withdrawMoney/:key',
          name: 'withdrawMoney',
          component: WithdrawMoney
        },{
          path: '/assets/transfer/:key',
          name: 'transfer',
          component: Transfer
        },{
          path: '/assets/transferRecord/:key',
          name: 'transferRecord',
          component: TransferRecord
        },{
          path: '/assets/addressList/:key',
          name: 'addressList',
          component: AddressList
        },{
          path: '/assets/addAddress/:key',
          name: 'addAddress',
          component: AddAddress
        },{
          path: '/assets/intoRecDetail',
          name: 'intoRecDetail',
          component: IntoRecDetail
        },{
          path: '/setting',
          name: 'setting',
          component: setting,
          redirect: { name: 'safeSetting' },
          children: [
            {
              path: 'safeSetting',
              name: 'safeSetting',
              component: safeSetting,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.safeSetting'
              },
            },
            {
              path: 'dealpassword',
              name: 'dealpassword',
              component: dealPassword,
              meta: {
                keepAlive: false,
                title: 'setting.safeSetting.dealPassword'
              },
            },
            {
              path: 'slider',
              name: 'slider',
              component: slider,
              meta: {
                keepAlive: false,
                title: 'setting.safeSetting.dealPassword'
              },
            },
            {
              path: 'loginPassword',
              name: 'loginPassword',
              component: loginPassword,
              meta: {
                keepAlive: false,
                title: '登录密码'
              },
            },
            {
              path: 'realname',
              name: 'realname',
              component: realName,
              meta: {
                keepAlive: false,
                title: 'setting.safeSetting.realName'
              },
            },
            {
              path: 'setLoginPass/:code',
              name: 'setLoginPass',
              component: setLoginPass,
              meta: {
                keepAlive: false,
                title: 'register.settingPassLogo'
              },
            },
            {
              path: 'emailStatus',
              name: 'emailStatus',
              component: emailStatus,
              meta: {
                keepAlive: false,
                title: 'setting.email.bindEmail'
              },
            },
            {
              path: 'phoneStatus',
              name: 'phoneStatus',
              component: phoneStatus,
              meta: {
                keepAlive: false,
                title: 'setting.tel.bindPhone'
              },
            },
            {
              path: 'realNameStatus',
              name: 'realNameStatus',
              component: realNameStatus,
              meta: {
                keepAlive: false,
                title: 'setting.safeSetting.realName'
              },
            },
            {
              path: 'changephone',
              name: 'changephone',
              component: changePhone,
              meta: {
                keepAlive: false,
                title: 'setting.tel.changeTel'
              },
            },
            {
              path: 'bindPhone',
              name: 'bindPhone',
              component: bindPhone,
              meta: {
                keepAlive: false,
                title: 'setting.tel.bindPhone'
              },
            },
            {
              path: 'bindemail',
              name: 'bindemail',
              component: bindEmail,
              meta: {
                keepAlive: false,
                title: 'setting.email.bindEmail'
              },
            },
            {
              path: 'changeemail',
              name: 'changeemail',
              component: changeEmail,
              meta: {
                keepAlive: false,
                title: 'setting.email.changeEmail'
              },
            },
            {
              path: 'invitation',
              name: 'invitation',
              component: invitation,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.invitation'
              },
            },
            // {
            //   path: 'notInvitation',
            //   name: 'notInvitation',
            //   component: notInvitation,
            //   meta: {
            //     keepAlive: false,
            //     title: 'userDrawer.menu.invitation'
            //   },
            // },
            {
              path: 'refunding',
              name: 'refunding',
              component: refunding,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.refunding'
              },
            },
            {
              path: 'invitePeople',
              name: 'invitePeople',
              component: invitePeople,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.invitePeople'
              },
            },
            {
              path: 'invitCommission',
              name: 'invitCommission',
              component: invitCommission,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.invitCommission'
              },
            },
            {
              path: 'invitTransfer',
              name: 'invitTransfer',
              component: invitTransfer,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.invitTransfer'
              },
            },
            {
              path: 'invitRecord',
              name: 'invitRecord',
              component: invitRecord,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.invitRecord'
              },
            },
            {
              path: 'helpCenter',
              name: 'helpCenter',
              component: helpCenter,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.helpCenter'
              },
            },
            {
              path: 'contactService',
              name: 'contactService',
              component: contactService,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.contactService'
              },
            },
            {
              path: 'orderManage',
              name: 'orderManage',
              component: orderManage,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.orderManage'
              },
            },
            {
              path: 'systemSetting',
              name: 'systemSetting',
              component: systemSetting,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.systemSetting'
              },
            },
            {
              path: 'community',
              name: 'community',
              component: community,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.community'
              },
            },
            {
              path: 'playRoule',
              name: 'playRoule',
              component: playRoule,
              meta: {
                keepAlive: false,
                title: 'userDrawer.menu.playRoule'
              },
            },
          ]
        },
        {
          path: '/helpDetail/:key',
          name: 'helpDetail',
          component: helpDetail,
          meta: {
            keepAlive: false,
            title: ''
          },
        },
        {
          path: '/notInvitation',
          name: 'notInvitation',
          component: notInvitation,
          meta: {
            keepAlive: false,
            title: ''
          },
        },
        {
          path: '/invit',
          name: 'invit',
          component: invit,
          meta: {
            keepAlive: false,
            title: ''
          },
        },
        {
          path: '/invitBlank',
          name: 'invitBlank',
          component: invitBlank,
          meta: {
            keepAlive: false,
            title: ''
          },
        },
        {
          path: '/play',
          name: 'play',
          component: play,
          meta: {
            keepAlive: false,
            title: ''
          },
          children:[
            {
              path: 'playChildren',
              name: 'playChildren',
              component: playChildren,
              meta: {
                keepAlive: false,
                title: ''
              },
            },
            {
              path: 'playChildrenT',
              name: 'playChildrenT',
              component: playChildrenT,
              meta: {
                keepAlive: false,
                title: ''
              },
            },
            {
              path: 'playChildrenTh/:key',
              name: 'playChildrenTh',
              component: playChildrenTh,
              meta: {
                keepAlive: false,
                title: ''
              },
            },
            {
              path: 'playChildrenf',
              name: 'playChildrenf',
              component: playChildrenf,
              meta: {
                keepAlive: false,
                title: ''
              },
            },
          ]
        },
        {
          path: '/invitaUser',
          name: 'invitaUser',
          component: invitaUser,
          children:[
            {
              path: 'invitaLogin',
              name: 'invitaLogin',
              component: invitaLogin,
            },
            {
              path: 'invitadownload',
              name: 'invitadownload',
              component: invitadownload,
            },
            {
              path: 'invitaSign',
              name: 'invitaSign',
              component: invitaSign,
            },
          ]
        },
      ]
    },
    {
      path: "/login/index",
      redirect: { name: 'user' }
    },
    {
      path:"**",
      redirect: { name: 'home' }
    }
  ]
})